import os
from datetime import datetime

def update_requirements():
    """Update backend and client-agent requirements"""
    
    # Backend requirements
    backend_reqs = """# FastAPI and dependencies
fastapi>=0.68.0
uvicorn>=0.15.0
pydantic>=1.8.0

# Database
sqlite3

# CORS middleware
python-multipart>=0.0.5

# System monitoring
psutil>=5.8.0

# HTTP client for testing
requests>=2.26.0

# Date and time handling
python-dateutil>=2.8.2

# Development tools
pytest>=6.2.5  # for testing
black>=21.7b0  # for code formatting
flake8>=3.9.0  # for linting

# Production
gunicorn>=20.1.0  # for production deployment
"""

    # Client agent requirements
    client_reqs = """# System monitoring
psutil>=5.8.0

# HTTP client
requests>=2.26.0

# Date and time handling
python-dateutil>=2.8.2
"""

    with open('backend/requirements.txt', 'w') as f:
        f.write(backend_reqs)
    
    with open('client-agent/requirements.txt', 'w') as f:
        f.write(client_reqs)

def update_readme():
    """Update the main README.txt"""
    
    readme_content = """HARDWARE MONITOR
===============

A real-time system monitoring application that tracks hardware performance across multiple computers.

DESCRIPTION
----------
This application provides real-time monitoring of computer hardware metrics including CPU, RAM, 
disk usage, and connected USB devices. It features a modern web interface with visual indicators 
and automatic updates.

SYSTEM REQUIREMENTS
-----------------
- Python 3.8 or higher
- Node.js 14 or higher
- Modern web browser
- SQLite3

INSTALLATION
-----------

1. Frontend Setup:
   -------------
   cd frontend
   npm install
   npm start
   
   The web interface will be available at: http://localhost:3000

2. Backend Setup:
   ------------
   cd backend
   pip install -r requirements.txt
   python main.py
   
   The API server will run at: http://localhost:5001

3. Client Agent Setup:
   ----------------
   cd client-agent
   pip install -r requirements.txt
   python client-agent.py

FEATURES
--------
- Real-time hardware monitoring
- Visual status indicators
- Automatic data refresh (5-second intervals)
- USB device detection
- Responsive web interface
- Cross-platform compatibility
- System diagnostics
- Remote shutdown capability

ARCHITECTURE
-----------
- Frontend: React.js with Bootstrap
- Backend: FastAPI with SQLite
- Client: Python with psutil

Last Updated: {}
Version: 1.0.0
""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    with open('README.txt', 'w') as f:
        f.write(readme_content)

def update_savepoint():
    """Update the SAVEPOINT.txt file"""
    
    savepoint_content = """HARDWARE MONITOR PROJECT SAVEPOINT
================================

CURRENT PROJECT STATE
-------------------
Real-time hardware monitoring system with React frontend and FastAPI backend.

KEY COMPONENTS
-------------

Frontend (Port 3000):
- Modern UI with Bootstrap and Bootstrap Icons
- Real-time data updates every 5 seconds
- Visual indicators for hardware status
- Responsive design
- Modal-based detailed view
- Diagnostic capabilities

Backend (Port 5001):
- FastAPI server with SQLite database
- CORS enabled
- Health check endpoint
- Test data generation
- Diagnostic endpoints
- Shutdown capability

Client Agent:
- System monitoring with psutil
- Periodic data reporting to backend
- Hardware metrics collection

ACTIVE FILES
-----------

Frontend:
1. Dashboard.js - Main monitoring interface
2. Header.js - Navigation and search
3. Footer.js - Copyright and version info
4. index.html - Bootstrap integration

Backend:
1. main.py - FastAPI application
2. requirements.txt - Python dependencies

Client Agent:
1. client-agent.py - Monitoring script
2. requirements.txt - Dependencies

CURRENT FEATURES
---------------
- Real-time hardware monitoring
- CPU, RAM, and Disk usage tracking
- USB device detection
- Automatic data refresh
- Visual status indicators
- Responsive design
- System diagnostics
- Remote shutdown
- Health monitoring

Last Updated: {}
Version: 1.0.0
""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    with open('SAVEPOINT.txt', 'w') as f:
        f.write(savepoint_content)

def main():
    """Main function to update all documentation"""
    try:
        update_requirements()
        print("✓ Requirements updated")
        
        update_readme()
        print("✓ README.txt updated")
        
        update_savepoint()
        print("✓ SAVEPOINT.txt updated")
        
        print("\nAll documentation successfully updated!")
        print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        print(f"Error updating documentation: {e}")

if __name__ == "__main__":
    main() 