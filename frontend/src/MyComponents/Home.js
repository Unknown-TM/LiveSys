import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { SystemHealth } from './SystemHealth';
import '../styles/Home.css';

export function Home({ onNavigate }) {
  const { settings } = useSettings() || { settings: {} };
  const [systemStats, setSystemStats] = useState({
    totalSystems: 0,
    activeSystems: 0,
    alerts: 0,
    uptime: '0%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    // Fetch system statistics
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/system-stats');
        const data = await response.json();
        setSystemStats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load system statistics');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch health data
    const fetchHealthData = async () => {
      try {
        const response = await fetch('http://localhost:5001/system-health');
        const data = await response.json();
        setHealthData(data);
      } catch (err) {
        console.error('Error fetching health data:', err);
      }
    };

    fetchHealthData();
    const interval = setInterval(fetchHealthData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { 
      title: 'System Overview', 
      icon: 'speedometer2',
      color: 'primary',
      description: 'View real-time metrics of all systems',
      action: 'dashboard'
    },
    { 
      title: 'Run Diagnostics', 
      icon: 'activity',
      color: 'success',
      description: 'Perform system health checks',
      action: 'diagnostics'
    },
    { 
      title: 'View Reports', 
      icon: 'graph-up',
      color: 'info',
      description: 'Access historical performance data',
      action: 'reports'
    },
    { 
      title: 'System Settings', 
      icon: 'gear',
      color: 'warning',
      description: 'Configure monitoring parameters',
      action: 'settings'
    }
  ];

  const recentActivity = [
    {
      type: 'alert',
      icon: 'bell',
      color: 'danger',
      title: 'High CPU Usage Alert',
      description: 'Server-01 reported CPU usage above 90%',
      time: '5 minutes ago'
    },
    {
      type: 'info',
      icon: 'info-circle',
      color: 'info',
      title: 'System Update Available',
      description: 'New version 2.1.0 is available for installation',
      time: '1 hour ago'
    },
    {
      type: 'success',
      icon: 'check-circle',
      color: 'success',
      title: 'Backup Completed',
      description: 'Weekly system backup completed successfully',
      time: '2 hours ago'
    },
    {
      type: 'warning',
      icon: 'exclamation-triangle',
      color: 'warning',
      title: 'Low Disk Space',
      description: 'Server-02 is running low on disk space (85% used)',
      time: '3 hours ago'
    }
  ];

  // Add error display
  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Welcome Section */}
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="mb-3">Welcome to Hardware Monitor</h2>
                  <p className="lead mb-0">
                    Monitor and manage your systems in real-time with comprehensive analytics and diagnostics.
                  </p>
                </div>
                <div className="col-md-4 text-center">
                  <i className="bi bi-pc-display display-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats with loading state */}
        <div className="col-12">
          <div className="row g-3">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="col-md-3">
                  <div className="card border-0 bg-success text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="mb-0">Total Systems</h6>
                          <h2 className="mb-0">{systemStats.totalSystems}</h2>
                        </div>
                        <i className="bi bi-pc-display fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 bg-info text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="mb-0">Active Systems</h6>
                          <h2 className="mb-0">{systemStats.activeSystems}</h2>
                        </div>
                        <i className="bi bi-lightning fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 bg-warning text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="mb-0">Active Alerts</h6>
                          <h2 className="mb-0">{systemStats.alerts}</h2>
                        </div>
                        <i className="bi bi-bell fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 bg-danger text-white">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="mb-0">System Uptime</h6>
                          <h2 className="mb-0">{systemStats.uptime}</h2>
                        </div>
                        <i className="bi bi-clock-history fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-12">
          <h4 className="mb-3">Quick Actions</h4>
          <div className="row g-3">
            {quickActions.map((action, index) => (
              <div key={index} className="col-md-3">
                <div className={`card h-100 border-${action.color} hover-lift`}>
                  <div className="card-body text-center">
                    <div className={`text-${action.color} mb-3`}>
                      <i className={`bi bi-${action.icon} display-4`}></i>
                    </div>
                    <h5 className="card-title">{action.title}</h5>
                    <p className="card-text text-muted">{action.description}</p>
                    <button 
                      className={`btn btn-${action.color}`}
                      onClick={() => onNavigate(action.action)}
                    >
                      Launch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="timeline">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="timeline-item">
                    <div className={`timeline-icon bg-${activity.color}`}>
                      <i className={`bi bi-${activity.icon}`}></i>
                    </div>
                    <div className="timeline-content">
                      <h6>{activity.title}</h6>
                      <p className="text-muted mb-0">{activity.description}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">System Health Overview</h5>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-primary active">24h</button>
                <button className="btn btn-outline-primary">7d</button>
                <button className="btn btn-outline-primary">30d</button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <SystemHealth data={healthData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 