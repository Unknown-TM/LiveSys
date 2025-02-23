import React, { useState, useEffect } from 'react';
import { SystemChart } from './Charts/SystemChart';
import './Reports.css';

export function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedSystem, setSelectedSystem] = useState(null);

  // Mock data for development
  const mockData = {
    '24h': Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
      cpuUsage: 30 + Math.random() * 50,
      ramUsage: 40 + Math.random() * 40,
      diskUsage: 50 + Math.random() * 30
    })),
    '7d': Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
      cpuUsage: 30 + Math.random() * 50,
      ramUsage: 40 + Math.random() * 40,
      diskUsage: 50 + Math.random() * 30
    })),
    '30d': Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 86400000).toISOString(),
      cpuUsage: 30 + Math.random() * 50,
      ramUsage: 40 + Math.random() * 40,
      diskUsage: 50 + Math.random() * 30
    }))
  };

  useEffect(() => {
    fetchReports();
  }, [timeRange, selectedSystem]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // For development, use mock data
      // In production, uncomment the fetch call
      /*
      const response = await fetch(`http://localhost:5001/reports?timeRange=${timeRange}&system=${selectedSystem || ''}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReports(data);
      */

      // Using mock data for now
      setTimeout(() => {
        setReports(mockData[timeRange]);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button 
            className="btn btn-outline-danger btn-sm float-end"
            onClick={fetchReports}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>System Reports</h2>
            <div className="btn-group">
              <button 
                className={`btn btn-outline-primary ${timeRange === '24h' ? 'active' : ''}`}
                onClick={() => setTimeRange('24h')}
              >
                24 Hours
              </button>
              <button 
                className={`btn btn-outline-primary ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => setTimeRange('7d')}
              >
                7 Days
              </button>
              <button 
                className={`btn btn-outline-primary ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => setTimeRange('30d')}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="col-12 mb-4">
              <div className="card report-card">
                <div className="card-body">
                  <h5 className="card-title mb-4">CPU Usage Over Time</h5>
                  <div className="chart-wrapper">
                    <SystemChart data={reports} type="CPU" height={300} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mb-4">
              <div className="card report-card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Memory Usage Over Time</h5>
                  <div className="chart-wrapper">
                    <SystemChart data={reports} type="RAM" height={300} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card report-card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Disk Usage Over Time</h5>
                  <div className="chart-wrapper">
                    <SystemChart data={reports} type="Disk" height={300} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 