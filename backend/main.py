from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
import os
import platform
import psutil
from typing import List, Optional, Dict
import subprocess




app = FastAPI()
DB_FILE = "hardware.db"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SystemInfo(BaseModel):
    computer_name: str
    os: str
    os_version: str
    architecture: str
    processor: str
    machine_id: str
    boot_time: str
    uptime: str

class CpuInfo(BaseModel):
    physical_cores: int
    total_cores: int
    max_frequency: Optional[float]
    current_frequency: Optional[float]
    cpu_usage_per_core: List[float]
    total_cpu_usage: float
    temperature: Optional[float]

class MemoryInfo(BaseModel):
    total: int
    available: int
    used: int
    percentage: float
    swap_total: int
    swap_used: int
    swap_free: int
    swap_percent: float

class DiskPartition(BaseModel):
    device: str
    mountpoint: str
    fstype: str
    total: int
    used: int
    free: int
    percent: float

class DiskInfo(BaseModel):
    partitions: List[DiskPartition]
    total_read: int
    total_write: int

class NetworkInterface(BaseModel):
    speed: int
    ipv4: Optional[str]
    ipv6: Optional[str]
    bytes_sent: int
    bytes_recv: int

class GpuInfo(BaseModel):
    name: str
    memory: str

class ProcessInfo(BaseModel):
    pid: int
    name: str
    cpu_percent: float
    memory_percent: float
    status: str

class ProcessesInfo(BaseModel):
    total: int
    running: int
    top_cpu: List[ProcessInfo]

class HardwareData(BaseModel):
    system_info: SystemInfo
    cpu: CpuInfo
    memory: MemoryInfo
    disk: DiskInfo
    network: Dict[str, NetworkInterface]
    gpu: GpuInfo
    processes: ProcessesInfo
    usb_devices: List[str]
    timestamp: str

# Initialize DB
def init_db():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Drop table if exists to start fresh (remove this in production)
        cursor.execute("DROP TABLE IF EXISTS hardware_metrics")
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hardware_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                computer_name TEXT,
                cpu REAL,
                ram REAL,
                disk REAL,
                usb_devices TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Add some initial test data
        cursor.execute("""
            INSERT INTO hardware_metrics (computer_name, cpu, ram, disk, usb_devices)
            VALUES 
                ('Test PC 1', 45.5, 60.0, 75.2, 'USB Device 1,USB Device 2'),
                ('Test PC 2', 85.5, 70.0, 55.2, 'USB Device 3,USB Device 4')
        """)
        
        conn.commit()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()

@app.post("/update-hardware")
def update_hardware(data: HardwareData):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO hardware_metrics (computer_name, cpu, ram, disk, usb_devices)
        VALUES (?, ?, ?, ?, ?)
    ''', (data.computer_name, data.cpu, data.ram, data.disk, ",".join(data.usb_devices)))
    conn.commit()
    conn.close()
    return {"message": "Hardware data updated"}

@app.get("/get-hardware")
async def get_hardware():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # First, let's ensure we have some test data
        cursor.execute("""
            INSERT INTO hardware_metrics (computer_name, cpu, ram, disk, usb_devices)
            VALUES (?, ?, ?, ?, ?)
        """, ("Test PC", 45.5, 60.0, 75.2, "USB Device 1,USB Device 2"))
        conn.commit()
        
        # Now fetch the data
        cursor.execute("""
            SELECT computer_name, cpu, ram, disk, usb_devices, timestamp 
            FROM hardware_metrics 
            ORDER BY timestamp DESC
            LIMIT 20
        """)
        rows = cursor.fetchall()
        print(f"Fetched rows: {rows}")  # Debug log
        
        result = [
            {
                "computer": row[0],
                "cpuUsage": round(row[1], 1),
                "ramUsage": round(row[2], 1),
                "diskUsage": round(row[3], 1),
                "usbDevices": row[4].split(",") if row[4] else [],
                "lastupdate": row[5]
            }
            for row in rows
        ]
        print(f"Returning result: {result}")  # Debug log
        return result
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []
    finally:
        conn.close()

# Add a health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add this for testing
@app.get("/add-test-data")
async def add_test_data():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO hardware_metrics (computer_name, cpu, ram, disk, usb_devices)
        VALUES (?, ?, ?, ?, ?)
    """, ("Test PC", 45.5, 60.0, 75.2, "USB Device 1, USB Device 2"))
    conn.commit()
    conn.close()
    return {"message": "Test data added"}

@app.post("/shutdown/{computer_name}")
async def shutdown_computer(computer_name: str):
    try:
        # Check if the request is for the current computer
        if computer_name == platform.node():
            if platform.system() == "Windows":
                os.system("shutdown /s /t 1")
            else:
                os.system("shutdown -h now")
            return {"message": f"Shutdown initiated for {computer_name}"}
        else:
            # For remote computers, you'll need to implement remote shutdown logic
            # This could involve SSH, WMI for Windows, or other remote management protocols
            raise HTTPException(status_code=400, detail="Remote shutdown not implemented")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/diagnose/{computer_name}")
async def diagnose_computer(computer_name: str):
    try:
        # Check if the request is for the current computer
        if computer_name == platform.node():
            diagnostics = {
                "cpu_details": {
                    "physical_cores": psutil.cpu_count(logical=False),
                    "total_cores": psutil.cpu_count(logical=True),
                    "max_frequency": f"{psutil.cpu_freq().max:.1f}MHz",
                    "current_frequency": f"{psutil.cpu_freq().current:.1f}MHz",
                    "per_core_usage": [f"{x}%" for x in psutil.cpu_percent(percpu=True)],
                },
                "memory_details": {
                    "total": f"{psutil.virtual_memory().total / (1024**3):.1f}GB",
                    "available": f"{psutil.virtual_memory().available / (1024**3):.1f}GB",
                    "used": f"{psutil.virtual_memory().used / (1024**3):.1f}GB",
                    "cached": f"{psutil.virtual_memory().cached / (1024**3):.1f}GB",
                },
                "disk_details": [
                    {
                        "device": partition.device,
                        "mountpoint": partition.mountpoint,
                        "filesystem_type": partition.fstype,
                        "total": f"{psutil.disk_usage(partition.mountpoint).total / (1024**3):.1f}GB",
                        "used": f"{psutil.disk_usage(partition.mountpoint).used / (1024**3):.1f}GB",
                        "free": f"{psutil.disk_usage(partition.mountpoint).free / (1024**3):.1f}GB",
                    }
                    for partition in psutil.disk_partitions()
                ],
                "network": {
                    "interfaces": list(psutil.net_if_stats().keys()),
                    "connections": len(psutil.net_connections()),
                },
                "processes": {
                    "total": len(psutil.pids()),
                    "running": len([p for p in psutil.process_iter(['status']) if p.info['status'] == 'running']),
                    "top_cpu": [
                        {
                            "name": p.name(),
                            "cpu_percent": p.cpu_percent(),
                            "memory_percent": p.memory_percent(),
                        }
                        for p in sorted(psutil.process_iter(['name', 'cpu_percent', 'memory_percent']), 
                                      key=lambda p: p.cpu_percent(), reverse=True)[:5]
                    ],
                },
                "timestamp": datetime.now().isoformat()
            }
            return diagnostics
        else:
            raise HTTPException(status_code=400, detail="Remote diagnostics not implemented")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add system update endpoint
@app.post("/system/update/{computer_name}")
async def update_system(computer_name: str):
    try:
        if platform.system() == "Windows":
            subprocess.run(["wuauclt", "/detectnow"])
        else:
            subprocess.run(["apt-get", "update"])
        return {"message": "Update check initiated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add historical data endpoint
@app.get("/hardware/history/{computer_name}")
async def get_hardware_history(computer_name: str, hours: int = 24):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM hardware_metrics 
            WHERE computer_name = ? 
            AND timestamp >= datetime('now', '-' || ? || ' hours')
            ORDER BY timestamp DESC
        """, (computer_name, hours))
        return cursor.fetchall()
    finally:
        conn.close()

# Initialize the database on start
init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5001)
