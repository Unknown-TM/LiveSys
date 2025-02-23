import psutil
import socket
import requests
import time

SERVER_URL = "http://localhost:5001/update-hardware"
COMPUTER_NAME = socket.gethostname()

def get_hardware_details():
    return {
        "computer_name": COMPUTER_NAME,
        "cpu": psutil.cpu_percent(),
        "ram": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage('/').percent,
        "usb_devices": [device.device for device in psutil.disk_partitions()]
    }

def sync_with_server():
    while True:
        try:
            data = get_hardware_details()
            response = requests.post(SERVER_URL, json=data)
            print(f"Synced: {response.status_code}")
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(5)  # Sync every 5 seconds

sync_with_server()
