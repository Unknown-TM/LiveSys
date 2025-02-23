import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function DiagnosticsPage() {
  const { computerName } = useParams();
  const navigate = useNavigate();
  const [diagnosticData, setDiagnosticData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    runDiagnostics();
  }, [computerName]);

  const runDiagnostics = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:5001/diagnose/${computerName}`);
      setDiagnosticData(response.data);
      setError(null);
    } catch (error) {
      setError(`Failed to run diagnostics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="mt-3">Running Diagnostics...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-pc-display me-2"></i>
          {computerName} - Diagnostics
        </h2>
        <div>
          <button 
            className="btn btn-secondary me-2"
            onClick={() => navigate('/dashboard')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </button>
          <button 
            className="btn btn-primary"
            onClick={runDiagnostics}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* CPU Section */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-cpu me-2"></i>
                CPU Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <h6>Physical Cores</h6>
                    <h3>{diagnosticData.cpu_details.physical_cores}</h3>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <h6>Total Cores</h6>
                    <h3>{diagnosticData.cpu_details.total_cores}</h3>
                  </div>
                </div>
                <div className="col-12">
                  <div className="border rounded p-3">
                    <h6>Core Usage</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {diagnosticData.cpu_details.per_core_usage.map((usage, idx) => (
                        <div key={idx} className="text-center">
                          <div className="progress" style={{width: '60px', height: '60px'}}>
                            <div 
                              className="progress-bar bg-primary"
                              style={{width: usage}}
                            ></div>
                          </div>
                          <small>Core {idx}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memory Section */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-memory me-2"></i>
                Memory Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {Object.entries(diagnosticData.memory_details).map(([key, value]) => (
                  <div key={key} className="col-6">
                    <div className="border rounded p-3">
                      <h6>{key.charAt(0).toUpperCase() + key.slice(1)}</h6>
                      <h3>{value}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Processes Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-list-task me-2"></i>
                Process Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="border rounded p-3 mb-3">
                    <h6>Total Processes</h6>
                    <h3>{diagnosticData.processes.total}</h3>
                  </div>
                  <div className="border rounded p-3">
                    <h6>Running Processes</h6>
                    <h3>{diagnosticData.processes.running}</h3>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Process Name</th>
                          <th>CPU Usage</th>
                          <th>Memory Usage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosticData.processes.top_cpu.map((process, idx) => (
                          <tr key={idx}>
                            <td>{process.name}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="progress flex-grow-1 me-2" style={{height: '6px'}}>
                                  <div 
                                    className="progress-bar"
                                    style={{width: `${process.cpu_percent}%`}}
                                  ></div>
                                </div>
                                <span>{process.cpu_percent.toFixed(1)}%</span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="progress flex-grow-1 me-2" style={{height: '6px'}}>
                                  <div 
                                    className="progress-bar"
                                    style={{width: `${process.memory_percent}%`}}
                                  ></div>
                                </div>
                                <span>{process.memory_percent.toFixed(1)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 