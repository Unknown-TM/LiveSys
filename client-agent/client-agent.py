import psutil
import platform
import socket
import requests
import time
import datetime
import os
import sys
import uuid
import json
import subprocess

SERVER_URL = "http://192.168.29.133:5000/update-hardware"
COMPUTER_NAME = socket.gethostname()

def get_gpu_info():
    try:
        if platform.system() == "Windows":
            import wmi
            w = wmi.WMI()
            gpu_info = w.Win32_VideoController()[0]
            return {
                "name": gpu_info.Name,
                "memory": gpu_info.AdapterRAM if hasattr(gpu_info, 'AdapterRAM') else "Unknown"
            }
        else:
            # For Linux systems with nvidia-smi
            try:
                output = subprocess.check_output(["nvidia-smi", "--query-gpu=name,memory.total,memory.used", "--format=csv,noheader"]).decode()
                name, total, used = output.strip().split(",")
                return {
                    "name": name.strip(),
                    "memory": f"{used.strip()}/{total.strip()}"
                }
            except:
                return {"name": "Integrated Graphics", "memory": "Unknown"}
    except:
        return {"name": "Unknown", "memory": "Unknown"}

def get_network_info():
    network_info = {}
    for interface, stats in psutil.net_if_stats().items():
        if stats.isup:
            addrs = psutil.net_if_addrs().get(interface, [])
            ipv4 = next((addr.address for addr in addrs if addr.family == socket.AF_INET), None)
            ipv6 = next((addr.address for addr in addrs if addr.family == socket.AF_INET6), None)
            network_info[interface] = {
                "speed": stats.speed,
                "ipv4": ipv4,
                "ipv6": ipv6,
                "bytes_sent": psutil.net_io_counters(pernic=True)[interface].bytes_sent,
                "bytes_recv": psutil.net_io_counters(pernic=True)[interface].bytes_recv
            }
    return network_info

def get_hardware_details():
    boot_time = datetime.datetime.fromtimestamp(psutil.boot_time())
    uptime = datetime.datetime.now() - boot_time
    
    # Get CPU temperature if available
    cpu_temp = None
    if hasattr(psutil, "sensors_temperatures"):
        temps = psutil.sensors_temperatures()
        if temps:
            cpu_temp = next((temp.current for sensor in temps.values() 
                           for temp in sensor if "cpu" in sensor.lower()), None)

    # Get disk partitions with detailed information
    disk_info = []
    for partition in psutil.disk_partitions():
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            disk_info.append({
                "device": partition.device,
                "mountpoint": partition.mountpoint,
                "fstype": partition.fstype,
                "total": usage.total,
                "used": usage.used,
                "free": usage.free,
                "percent": usage.percent
            })
        except:
            continue

    # Get detailed memory information
    memory = psutil.virtual_memory()
    swap = psutil.swap_memory()

    return {
        "system_info": {
            "computer_name": socket.gethostname(),
            "os": f"{platform.system()} {platform.release()}",
            "os_version": platform.version(),
            "architecture": platform.machine(),
            "processor": platform.processor(),
            "machine_id": str(uuid.getnode()),
            "boot_time": boot_time.isoformat(),
            "uptime": str(uptime).split('.')[0]
        },
        "cpu": {
            "physical_cores": psutil.cpu_count(logical=False),
            "total_cores": psutil.cpu_count(logical=True),
            "max_frequency": psutil.cpu_freq().max if psutil.cpu_freq() else None,
            "current_frequency": psutil.cpu_freq().current if psutil.cpu_freq() else None,
            "cpu_usage_per_core": psutil.cpu_percent(percpu=True),
            "total_cpu_usage": psutil.cpu_percent(),
            "temperature": cpu_temp
        },
        "memory": {
            "total": memory.total,
            "available": memory.available,
            "used": memory.used,
            "percentage": memory.percent,
            "swap_total": swap.total,
            "swap_used": swap.used,
            "swap_free": swap.free,
            "swap_percent": swap.percent
        },
        "disk": {
            "partitions": disk_info,
            "total_read": psutil.disk_io_counters().read_bytes,
            "total_write": psutil.disk_io_counters().write_bytes
        },
        "network": get_network_info(),
        "gpu": get_gpu_info(),
        "processes": {
            "total": len(psutil.pids()),
            "running": len([p for p in psutil.process_iter(['status']) 
                          if p.info['status'] == 'running']),
            "top_cpu": [
                {
                    "pid": p.pid,
                    "name": p.name(),
                    "cpu_percent": p.cpu_percent(),
                    "memory_percent": p.memory_percent(),
                    "status": p.status()
                }
                for p in sorted(
                    psutil.process_iter(['name', 'cpu_percent', 'memory_percent', 'status']),
                    key=lambda p: p.cpu_percent(),
                    reverse=True
                )[:5]
            ]
        },
        "usb_devices": [device.device for device in psutil.disk_partitions() 
                       if "removable" in device.opts or "usb" in device.opts.lower()],
        "timestamp": datetime.datetime.now().isoformat()
    }

def sync_with_server():
    while True:
        try:
            data = get_hardware_details()
            response = requests.post(SERVER_URL, json=data)
            print(f"Synced: {response.status_code}")
            print(f"System Info: {json.dumps(data['system_info'], indent=2)}")
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(5)  # Sync every 5 seconds

if __name__ == "__main__":
    print(f"Starting monitoring for {socket.gethostname()}")
    print(f"Sending data to {SERVER_URL}")
    sync_with_server()
