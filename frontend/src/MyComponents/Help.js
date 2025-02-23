import React from 'react';

export function Help() {
  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12">
          <h4 className="mb-4">
            <i className="bi bi-question-circle me-2"></i>
            Help Center
          </h4>
        </div>

        {/* Quick Start Guide */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Start Guide</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <h6>1. Dashboard Overview</h6>
                  <p className="mb-0 text-muted">View real-time system metrics and status for all connected computers.</p>
                </div>
                <div className="list-group-item">
                  <h6>2. System Details</h6>
                  <p className="mb-0 text-muted">Click on any computer to view detailed diagnostics and perform actions.</p>
                </div>
                <div className="list-group-item">
                  <h6>3. Alerts</h6>
                  <p className="mb-0 text-muted">Configure alert thresholds in settings to receive notifications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Keyboard Shortcuts</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td><kbd>Ctrl</kbd> + <kbd>D</kbd></td>
                      <td>Go to Dashboard</td>
                    </tr>
                    <tr>
                      <td><kbd>Ctrl</kbd> + <kbd>A</kbd></td>
                      <td>Go to About</td>
                    </tr>
                    <tr>
                      <td><kbd>Ctrl</kbd> + <kbd>R</kbd></td>
                      <td>Refresh Data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Frequently Asked Questions</h5>
            </div>
            <div className="card-body">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How do I add a new computer to monitor?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show">
                    <div className="accordion-body">
                      Install and run the client agent on the computer you want to monitor. The system will automatically detect and add it to the dashboard.
                    </div>
                  </div>
                </div>
                {/* Add more FAQ items as needed */}
              </div>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h5>Need More Help?</h5>
              <p className="mb-3">Contact our support team or check the documentation</p>
              <div className="d-flex justify-content-center gap-3">
                <a href="mailto:support@example.com" className="btn btn-primary">
                  <i className="bi bi-envelope me-2"></i>
                  Contact Support
                </a>
                <a href="#" className="btn btn-outline-primary">
                  <i className="bi bi-book me-2"></i>
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 