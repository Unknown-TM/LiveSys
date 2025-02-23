import React, { useState } from 'react';
import './Diagnostics.css';

export function Diagnostics() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedTests, setSelectedTests] = useState({
    cpu: true,
    memory: true,
    disk: true,
    network: true
  });

  // Mock diagnostic results
  const mockResults = {
    cpu: {
      status: "CPU performance is within normal parameters",
      score: 85,
      details: {
        usage: "32%",
        temperature: "45°C",
        frequency: "3.6 GHz",
        processes: 124
      }
    },
    memory: {
      status: "Memory usage is optimal",
      score: 92,
      details: {
        used: "8.2 GB",
        available: "15.8 GB",
        cached: "3.4 GB",
        swapUsage: "0.5 GB"
      }
    },
    disk: {
      status: "Disk health check passed with warnings",
      score: 75,
      details: {
        readSpeed: "520 MB/s",
        writeSpeed: "480 MB/s",
        freeSpace: "234 GB",
        health: "Good"
      }
    },
    network: {
      status: "Network connectivity is stable",
      score: 88,
      details: {
        download: "125 Mbps",
        upload: "25 Mbps",
        latency: "15ms",
        packetLoss: "0.1%"
      }
    }
  };

  const runDiagnostics = async () => {
    try {
      setRunning(true);
      setResults(null);
      
      // Simulate API call with mock data
      setTimeout(() => {
        setResults(mockResults);
        setRunning(false);
      }, 2000);

      /* Uncomment for real API integration
      const response = await fetch('http://localhost:5001/run-diagnostics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedTests)
      });
      
      const data = await response.json();
      setResults(data);
      */
    } catch (error) {
      console.error('Error running diagnostics:', error);
    } finally {
      setRunning(false);
    }
  };

  const getStatusColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>System Diagnostics</h2>
              <p className="text-muted mb-0">Run comprehensive system tests and analyze performance.</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={runDiagnostics}
              disabled={running || !Object.values(selectedTests).some(v => v)}
            >
              {running ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Running Tests...
                </>
              ) : 'Run All Tests'}
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Test Configuration</h5>
              <div className="test-options">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="cpuTest"
                    checked={selectedTests.cpu}
                    onChange={(e) => setSelectedTests({...selectedTests, cpu: e.target.checked})}
                  />
                  <label className="form-check-label" htmlFor="cpuTest">
                    <i className="bi bi-cpu me-2"></i>
                    CPU Performance Test
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="memoryTest"
                    checked={selectedTests.memory}
                    onChange={(e) => setSelectedTests({...selectedTests, memory: e.target.checked})}
                  />
                  <label className="form-check-label" htmlFor="memoryTest">
                    <i className="bi bi-memory me-2"></i>
                    Memory Analysis
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="diskTest"
                    checked={selectedTests.disk}
                    onChange={(e) => setSelectedTests({...selectedTests, disk: e.target.checked})}
                  />
                  <label className="form-check-label" htmlFor="diskTest">
                    <i className="bi bi-hdd me-2"></i>
                    Disk Health Check
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="networkTest"
                    checked={selectedTests.network}
                    onChange={(e) => setSelectedTests({...selectedTests, network: e.target.checked})}
                  />
                  <label className="form-check-label" htmlFor="networkTest">
                    <i className="bi bi-ethernet me-2"></i>
                    Network Performance
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {results ? (
            <div className="row g-4">
              {Object.entries(results).map(([key, data]) => (
                selectedTests[key] && (
                  <div key={key} className="col-12">
                    <div className="card diagnostic-card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="card-title mb-1">{key.toUpperCase()} Diagnostics</h5>
                            <p className="text-muted mb-0">{data.status}</p>
                          </div>
                          <div className="score-badge bg-light">
                            <div className={`score text-${getStatusColor(data.score)}`}>
                              {data.score}%
                            </div>
                          </div>
                        </div>
                        <div className="progress mb-3" style={{height: '8px'}}>
                          <div 
                            className={`progress-bar bg-${getStatusColor(data.score)}`}
                            style={{width: `${data.score}%`}}
                          ></div>
                        </div>
                        <div className="details-grid">
                          {Object.entries(data.details).map(([label, value]) => (
                            <div key={label} className="detail-item">
                              <span className="detail-label">{label}</span>
                              <span className="detail-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-clipboard-data display-1 text-muted mb-3"></i>
                <h5>No Diagnostic Results</h5>
                <p className="text-muted mb-0">Select tests from the left panel and click "Run Tests" to begin system analysis.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 