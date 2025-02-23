import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Chart, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';
import { SystemChart } from './Charts/SystemChart';
import { SystemSummary } from './SystemSummary';
import { useSettings } from '../contexts/SettingsContext';
import { NotificationService } from '../services/notifications';
import { SystemHealth } from './SystemHealth';

export default function Dashboard() {
  const [hardwareData, setHardwareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [timeRange, setTimeRange] = useState('1h'); // 1h, 24h, 7d
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [alertThresholds, setAlertThresholds] = useState({
    cpu: 80,
    ram: 85,
    disk: 90
  });
  const { settings } = useSettings();
  const [stats, setStats] = useState({
    totalSystems: 0,
    activeSystems: 0,
    activeAlerts: 0,
    systemUptime: '0'
  });

  const getStatusColor = (value) => {
    if (value >= 80) return 'danger';
    if (value >= 60) return 'warning';
    return 'success';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) return (num/1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num/1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num/1000).toFixed(1) + 'K';
    return num;
  };

  const getMetricColor = (value) => {
    if (value >= 90) return 'danger';
    if (value >= 70) return 'warning';
    if (value >= 50) return 'info';
    return 'success';
  };

  const formatUptime = (uptime) => {
    if (!uptime) return 'N/A';
    const parts = uptime.split(':');
    const hours = parseInt(parts[0]);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h ${parts[1]}m`;
  };

  const fetchHardwareData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Attempting to fetch data...");
      const response = await axios.get("http://localhost:5001/get-hardware");
      console.log("Response received:", response.data);
      setHardwareData(response.data);
    } catch (error) {
      console.error("Error details:", error);
      setError(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await axios.get("http://localhost:5001/health");
        console.log("Backend is healthy");
        fetchHardwareData();
      } catch (error) {
        console.error("Backend health check failed:", error);
        setError("Cannot connect to backend server. Please ensure it's running.");
      }
    };

    checkBackendHealth();
    intervalRef.current = setInterval(fetchHardwareData, settings.alerts.refreshInterval * 1000);
    return () => clearInterval(intervalRef.current);
  }, [fetchHardwareData, settings.alerts.refreshInterval]);

  useEffect(() => {
    if (settings.alerts.notifications) {
      hardwareData.forEach(system => {
        if (system.cpuUsage > settings.alerts.cpu) {
          NotificationService.showNotification(
            'High CPU Usage Alert',
            { body: `${system.computer} CPU usage at ${system.cpuUsage}%` }
          );
        }
        // Similar checks for RAM and disk
      });
    }
  }, [hardwareData, settings]);

  const shutdownComputer = async (computerName) => {
    try {
      await axios.post(`http://localhost:5001/shutdown/${computerName}`);
      setError(null);
      // Show success message
      alert(`Shutdown command sent to ${computerName}`);
    } catch (error) {
      setError(`Failed to shutdown ${computerName}: ${error.message}`);
    }
  };

  const runDiagnostics = async (computerName) => {
    try {
      setRunningDiagnostics(true);
      const response = await axios.post(`http://localhost:5001/diagnose/${computerName}`);
      setDiagnosticData(response.data);
      setError(null);
    } catch (error) {
      setError(`Failed to run diagnostics: ${error.message}`);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  const checkAlerts = (data) => {
    const alerts = [];
    if (data.cpuUsage > alertThresholds.cpu) {
      alerts.push(`High CPU Usage (${data.cpuUsage}%) on ${data.computer}`);
    }
    if (data.ramUsage > alertThresholds.ram) {
      alerts.push(`High RAM Usage (${data.ramUsage}%) on ${data.computer}`);
    }
    if (data.diskUsage > alertThresholds.disk) {
      alerts.push(`High Disk Usage (${data.diskUsage}%) on ${data.computer}`);
    }
    return alerts;
  };

  useEffect(() => {
    // Mock data for demonstration
    const mockStats = {
      totalSystems: 12,
      activeSystems: 10,
      activeAlerts: 3,
      systemUptime: '99.9%'
    };

    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);

    /* Uncomment for real API integration
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5001/system-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    */
  }, []);

  const statCards = [
    {
      title: 'Total Systems',
      value: stats.totalSystems,
      icon: 'pc-display',
      color: 'primary'
    },
    {
      title: 'Active Systems',
      value: stats.activeSystems,
      icon: 'hdd-rack',
      color: 'success'
    },
    {
      title: 'Active Alerts',
      value: stats.activeAlerts,
      icon: 'exclamation-triangle',
      color: 'warning'
    },
    {
      title: 'System Uptime',
      value: stats.systemUptime,
      icon: 'clock-history',
      color: 'info'
    }
  ];

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Stats Cards */}
        {statCards.map((stat, index) => (
          <div key={index} className="col-md-6 col-lg-3">
            <div className={`card stat-card border-${stat.color}`}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className={`stat-icon bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    <i className={`bi bi-${stat.icon}`}></i>
                  </div>
                  <h6 className="card-title mb-0 ms-3">{stat.title}</h6>
                </div>
                <div className="stat-value">
                  {loading ? (
                    <div className="placeholder-glow">
                      <span className="placeholder col-6"></span>
                    </div>
                  ) : (
                    <h3 className="mb-0">{stat.value}</h3>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* System Health Chart */}
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">System Health Overview</h5>
              <SystemHealth />
            </div>
          </div>
        </div>

        {/* System Summary */}
        <div className="col-12">
          <SystemSummary data={hardwareData} />
        </div>

        {/* Charts Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">System Performance</h5>
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${timeRange === '1h' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeRange('1h')}
                  >
                    1H
                  </button>
                  <button 
                    className={`btn btn-sm ${timeRange === '24h' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeRange('24h')}
                  >
                    24H
                  </button>
                  <button 
                    className={`btn btn-sm ${timeRange === '7d' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeRange('7d')}
                  >
                    7D
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-4">
                  <SystemChart data={hardwareData} type="CPU" />
                </div>
                <div className="col-md-4">
                  <SystemChart data={hardwareData} type="RAM" />
                </div>
                <div className="col-md-4">
                  <SystemChart data={hardwareData} type="Disk" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-speedometer2 me-2"></i>
                    System Metrics
                  </h5>
                  {loading && (
                    <div className="spinner-border spinner-border-sm ms-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {/* Time Range Selector */}
                  <select 
                    className="form-select form-select-sm" 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={fetchHardwareData}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close ms-auto" 
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Computer</th>
                      <th>CPU Usage</th>
                      <th>RAM Usage</th>
                      <th>Disk Usage</th>
                      <th>USB Devices</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hardwareData.length > 0 ? (
                      hardwareData.map((item, index) => (
                        <tr 
                          key={index}
                          onClick={() => setSelectedComputer(item)}
                          className={`align-middle ${selectedComputer?.computer === item.computer ? 'table-active' : ''}`}
                        >
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <i className="bi bi-pc-display fs-4 text-primary"></i>
                              </div>
                              <div>
                                <h6 className="mb-0">{item.computer}</h6>
                                <small className="text-muted">
                                  {item.os || 'Unknown OS'}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <div className="d-flex align-items-center mb-1">
                                <div className="custom-progress flex-grow-1 me-2">
                                  <div 
                                    className={`progress-bar bg-${getMetricColor(item.cpuUsage)}`}
                                    style={{width: `${item.cpuUsage}%`}}
                                  ></div>
                                </div>
                                <span className={`badge bg-${getMetricColor(item.cpuUsage)}`}>
                                  {item.cpuUsage}%
                                </span>
                              </div>
                              <small className="text-muted">
                                {item.cpuUsage > 80 ? 'High Load' : item.cpuUsage > 50 ? 'Moderate' : 'Normal'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <div className="d-flex align-items-center mb-1">
                                <div className="custom-progress flex-grow-1 me-2">
                                  <div 
                                    className={`progress-bar bg-${getMetricColor(item.ramUsage)}`}
                                    style={{width: `${item.ramUsage}%`}}
                                  ></div>
                                </div>
                                <span className={`badge bg-${getMetricColor(item.ramUsage)}`}>
                                  {item.ramUsage}%
                                </span>
                              </div>
                              <small className="text-muted">
                                {item.ramUsage > 80 ? 'High Load' : item.ramUsage > 50 ? 'Moderate' : 'Normal'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <div className="d-flex align-items-center mb-1">
                                <div className="custom-progress flex-grow-1 me-2">
                                  <div 
                                    className={`progress-bar bg-${getMetricColor(item.diskUsage)}`}
                                    style={{width: `${item.diskUsage}%`}}
                                  ></div>
                                </div>
                                <span className={`badge bg-${getMetricColor(item.diskUsage)}`}>
                                  {item.diskUsage}%
                                </span>
                              </div>
                              <small className="text-muted">
                                {item.diskUsage > 80 ? 'High Load' : item.diskUsage > 50 ? 'Moderate' : 'Normal'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {Array.isArray(item.usbDevices) ? 
                                item.usbDevices.map((device, idx) => (
                                  <span key={idx} className="badge bg-secondary">
                                    <i className="bi bi-usb-symbol me-1"></i>
                                    {device}
                                  </span>
                                )) : 
                                <span className="badge bg-secondary">
                                  <i className="bi bi-usb-symbol me-1"></i>
                                  {item.usbDevices}
                                </span>
                              }
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {formatTimestamp(item.lastupdate)}
                            </small>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="text-muted">
                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                            <h5>No Data Available</h5>
                            <p className="mb-0">Try refreshing or check your connection</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination if needed */}
            {hardwareData.length > 10 && (
              <div className="card-footer bg-white">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end mb-0">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex="-1">Previous</a>
                    </li>
                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                      <a className="page-link" href="#">Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {selectedComputer && (
          <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center">
                    <i className="bi bi-pc-display me-2"></i>
                    {selectedComputer.computer}
                    <span className="badge bg-success ms-2">Online</span>
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => {
                      setSelectedComputer(null);
                      setDiagnosticData(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-4">
                    {/* System Info */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">System Information</h6>
                          <div className="row">
                            <div className="col-md-6">
                              <p className="mb-1">
                                <strong>Last Updated:</strong> {formatTimestamp(selectedComputer.lastupdate)}
                              </p>
                              <p className="mb-1">
                                <strong>IP Address:</strong> {selectedComputer.ipAddress || 'N/A'}
                              </p>
                              <p className="mb-1">
                                <strong>Operating System:</strong> {selectedComputer.os || 'N/A'}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1">
                                <strong>Uptime:</strong> {formatUptime(selectedComputer.uptime)}
                              </p>
                              <p className="mb-1">
                                <strong>Total Memory:</strong> {selectedComputer.totalMemory || 'N/A'}
                              </p>
                              <p className="mb-1">
                                <strong>Total Disk:</strong> {selectedComputer.totalDisk || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Usage Metrics */}
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body text-center">
                          <h6 className="card-title">CPU Usage</h6>
                          <div className="display-4 mb-2">{selectedComputer.cpuUsage}%</div>
                          <div className="progress">
                            <div 
                              className={`progress-bar bg-${getStatusColor(selectedComputer.cpuUsage)}`}
                              style={{width: `${selectedComputer.cpuUsage}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body text-center">
                          <h6 className="card-title">RAM Usage</h6>
                          <div className="display-4 mb-2">{selectedComputer.ramUsage}%</div>
                          <div className="progress">
                            <div 
                              className={`progress-bar bg-${getStatusColor(selectedComputer.ramUsage)}`}
                              style={{width: `${selectedComputer.ramUsage}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body text-center">
                          <h6 className="card-title">Disk Usage</h6>
                          <div className="display-4 mb-2">{selectedComputer.diskUsage}%</div>
                          <div className="progress">
                            <div 
                              className={`progress-bar bg-${getStatusColor(selectedComputer.diskUsage)}`}
                              style={{width: `${selectedComputer.diskUsage}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* USB Devices */}
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Connected USB Devices</h6>
                          <div className="d-flex flex-wrap gap-2">
                            {Array.isArray(selectedComputer.usbDevices) ? 
                              selectedComputer.usbDevices.map((device, idx) => (
                                <span key={idx} className="badge bg-secondary">
                                  <i className="bi bi-usb-symbol me-1"></i>
                                  {device}
                                </span>
                              )) : 
                              <p className="text-muted mb-0">No USB devices connected</p>
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {diagnosticData && (
                      <div className="col-12 mt-4">
                        <div className="card">
                          <div className="card-header">
                            <h6 className="mb-0">
                              <i className="bi bi-activity me-2"></i>
                              Diagnostic Results
                            </h6>
                          </div>
                          <div className="card-body">
                            <div className="row g-4">
                              {/* CPU Details */}
                              <div className="col-md-6">
                                <h6 className="border-bottom pb-2">CPU Information</h6>
                                <p className="mb-1"><strong>Physical Cores:</strong> {diagnosticData.cpu_details.physical_cores}</p>
                                <p className="mb-1"><strong>Total Cores:</strong> {diagnosticData.cpu_details.total_cores}</p>
                                <p className="mb-1"><strong>Max Frequency:</strong> {diagnosticData.cpu_details.max_frequency}</p>
                                <p className="mb-1"><strong>Current Frequency:</strong> {diagnosticData.cpu_details.current_frequency}</p>
                                <div className="mt-2">
                                  <strong>Per Core Usage:</strong>
                                  <div className="d-flex flex-wrap gap-2 mt-1">
                                    {diagnosticData.cpu_details.per_core_usage.map((usage, idx) => (
                                      <span key={idx} className="badge bg-info">Core {idx}: {usage}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Memory Details */}
                              <div className="col-md-6">
                                <h6 className="border-bottom pb-2">Memory Information</h6>
                                <p className="mb-1"><strong>Total:</strong> {diagnosticData.memory_details.total}</p>
                                <p className="mb-1"><strong>Available:</strong> {diagnosticData.memory_details.available}</p>
                                <p className="mb-1"><strong>Used:</strong> {diagnosticData.memory_details.used}</p>
                                <p className="mb-1"><strong>Cached:</strong> {diagnosticData.memory_details.cached}</p>
                              </div>

                              {/* Process Information */}
                              <div className="col-12">
                                <h6 className="border-bottom pb-2">Process Information</h6>
                                <div className="row">
                                  <div className="col-md-4">
                                    <p className="mb-1"><strong>Total Processes:</strong> {diagnosticData.processes.total}</p>
                                    <p className="mb-1"><strong>Running Processes:</strong> {diagnosticData.processes.running}</p>
                                  </div>
                                  <div className="col-md-8">
                                    <strong>Top CPU Consuming Processes:</strong>
                                    <div className="table-responsive mt-2">
                                      <table className="table table-sm">
                                        <thead>
                                          <tr>
                                            <th>Process</th>
                                            <th>CPU %</th>
                                            <th>Memory %</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {diagnosticData.processes.top_cpu.map((process, idx) => (
                                            <tr key={idx}>
                                              <td>{process.name}</td>
                                              <td>{process.cpu_percent.toFixed(1)}%</td>
                                              <td>{process.memory_percent.toFixed(1)}%</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Network Information */}
                              <div className="col-12">
                                <h6 className="border-bottom pb-2">Network Information</h6>
                                <p className="mb-1"><strong>Active Interfaces:</strong> {diagnosticData.network.interfaces.join(', ')}</p>
                                <p className="mb-1"><strong>Active Connections:</strong> {diagnosticData.network.connections}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setSelectedComputer(null);
                      setDiagnosticData(null);
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => runDiagnostics(selectedComputer.computer)}
                    disabled={runningDiagnostics}
                  >
                    {runningDiagnostics ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Running Diagnostics...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-activity me-2"></i>
                        Run Diagnostics
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to shutdown ${selectedComputer.computer}?`)) {
                        shutdownComputer(selectedComputer.computer);
                      }
                    }}
                  >
                    <i className="bi bi-power me-2"></i>
                    Shutdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button 
          className={`btn btn-primary rounded-circle position-fixed ${loading ? 'loading' : ''}`}
          style={{bottom: '2rem', right: '2rem', width: '3.5rem', height: '3.5rem'}}
          onClick={fetchHardwareData}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </div>
    </div>
  );
}
