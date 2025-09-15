HARDWARE MONITOR
===============
Created by UnknowTM

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

ARCHITECTURE
-----------
- Frontend: React.js with Bootstrap
- Backend: FastAPI with SQLite
- Client: Python with psutil

API ENDPOINTS
------------
GET  /health          - Service health check
GET  /get-hardware    - Retrieve hardware metrics
POST /update-hardware - Update hardware data
GET  /add-test-data  - Add sample data (testing only)

FOLDER STRUCTURE
---------------
/frontend           - React web interface
  /public          - Static assets
  /src             - Source code
    /MyComponents  - React components
/backend           - FastAPI server
  main.py          - Server implementation
  requirements.txt - Python dependencies
/client-agent      - Monitoring client
  requirements.txt - Client dependencies

TROUBLESHOOTING
--------------
1. No Data Showing:
   - Verify backend is running (http://localhost:5001/health)
   - Check client agent is running
   - Confirm database exists and has permissions

2. Connection Issues:
   - Verify correct ports (3000 for frontend, 5001 for backend)
   - Check CORS settings in backend
   - Ensure firewall allows connections

3. Database Issues:
   - Check SQLite file permissions
   - Verify table schema matches expected format

DEVELOPMENT
----------
1. Running Tests:
   Frontend: npm test
   Backend: pytest

2. Building for Production:
   Frontend: npm run build
   Backend: Use gunicorn for deployment

SECURITY NOTES
-------------
- Default configuration allows all CORS origins
- No authentication implemented
- Intended for internal network use only

CONTRIBUTING
-----------
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

VERSION INFO
-----------
Current Version: 1.9.7
Last Updated: 22/8/25
License: [LICENSE](LICENSE)

CONTACT
-------
For support or issues:
- Create an issue in the repository
- Contact: UnknowTM

ACKNOWLEDGMENTS
--------------
- React.js
- FastAPI
- Bootstrap
- Python psutil library

This project is maintained and supported by the IT monitoring team.

DISCLAIMER
--------------
This project is provided *as is*, without warranty of any kind. Use at your own risk.  
Hardware monitoring may behave differently depending on your system’s configuration, drivers, or permissions.  
This application does not transmit personal data, but users are responsible for how they deploy and use it.
