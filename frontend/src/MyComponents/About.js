import React from 'react';

export default function About() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Application Info */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <i className="bi bi-info-circle me-2"></i>
                About Hardware Monitor
              </h2>
              <p className="lead">
                A real-time system monitoring application that helps you track and manage computer hardware performance across your network.
              </p>
              <hr />
              <div className="row g-4">
                <div className="col-md-6">
                  <h5>Features</h5>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check2-circle text-success me-2"></i>Real-time hardware monitoring</li>
                    <li><i className="bi bi-check2-circle text-success me-2"></i>Multi-system support</li>
                    <li><i className="bi bi-check2-circle text-success me-2"></i>Detailed diagnostics</li>
                    <li><i className="bi bi-check2-circle text-success me-2"></i>Remote shutdown capability</li>
                    <li><i className="bi bi-check2-circle text-success me-2"></i>USB device detection</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5>Technologies Used</h5>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-primary">React.js</span>
                    <span className="badge bg-success">FastAPI</span>
                    <span className="badge bg-info">Python</span>
                    <span className="badge bg-warning text-dark">SQLite</span>
                    <span className="badge bg-danger">Bootstrap</span>
                    <span className="badge bg-secondary">psutil</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="card-title mb-4">
                <i className="bi bi-pc me-2"></i>
                System Requirements
              </h4>
              <div className="list-group">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Python</h6>
                    <small className="text-muted">3.8 or higher</small>
                  </div>
                  <small className="text-muted">Required for backend and client agent</small>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Node.js</h6>
                    <small className="text-muted">14.x or higher</small>
                  </div>
                  <small className="text-muted">Required for frontend development</small>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">SQLite</h6>
                    <small className="text-muted">3.x</small>
                  </div>
                  <small className="text-muted">Required for data storage</small>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Modern Web Browser</h6>
                    <small className="text-muted">Latest version</small>
                  </div>
                  <small className="text-muted">Chrome, Firefox, Safari, or Edge</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h4 className="card-title mb-4">
                <i className="bi bi-code-slash me-2"></i>
                Version Information
              </h4>
              <div className="table-responsive">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <th scope="row">Application Version</th>
                      <td>1.9.7</td>
                    </tr>
                    <tr>
                      <th scope="row">Last Updated</th>
                      <td>{new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th scope="row">License</th>
                      <td>MIT</td>
                    </tr>
                    <tr>
                      <th scope="row">Author</th>
                      <td>UnknowTM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-4">
                <i className="bi bi-question-circle me-2"></i>
                Support
              </h4>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="bi bi-envelope-fill fs-1 text-primary mb-3"></i>
                    <h5>Email Support</h5>
                    <p className="mb-0">support@example.com</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="bi bi-github fs-1 text-dark mb-3"></i>
                    <h5>GitHub Issues</h5>
                    <p className="mb-0">Report bugs and request features</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="bi bi-book-fill fs-1 text-success mb-3"></i>
                    <h5>Documentation</h5>
                    <p className="mb-0">View user guides and API docs</p>
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