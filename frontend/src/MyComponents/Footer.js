import React, { useState } from 'react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const version = "1.9.7"; // Get this from package.json
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus(null), 3000);
    } catch (error) {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus(null), 3000);
    }
  };

  const handleLinkClick = (e, type) => {
    e.preventDefault();
    switch (type) {
      case 'documentation':
        window.open('/docs', '_blank');
        break;
      case 'api':
        window.open('/api-docs', '_blank');
        break;
      case 'support':
        window.open('/support', '_blank');
        break;
      case 'status':
        window.open('/system-status', '_blank');
        break;
      case 'privacy':
        window.open('/privacy-policy', '_blank');
        break;
      case 'terms':
        window.open('/terms', '_blank');
        break;
      case 'contact':
        window.location.href = 'mailto:support@hardwaremonitor.com';
        break;
      default:
        break;
    }
  };

  return (
    <footer className="footer">
      <div className="container py-4">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="footer-section">
              <h5 className="footer-title">
                <i className="bi bi-pc-display me-2"></i>
                Hardware Monitor
              </h5>
              <p className="text-muted">
                Real-time system monitoring and diagnostics for optimal performance.
              </p>
              <div className="social-links mt-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
                  <i className="bi bi-github"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <div className="footer-section">
              <h5 className="footer-title">Product</h5>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'features')}>Features</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'documentation')}>Documentation</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'releases')}>Release Notes</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'pricing')}>Pricing</a></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <div className="footer-section">
              <h5 className="footer-title">Support</h5>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'help')}>Help Center</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'api')}>API Reference</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'community')}>Community</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick(e, 'status')}>Status</a></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="footer-section">
              <h5 className="footer-title">Stay Updated</h5>
              <p className="text-muted mb-3">Subscribe to our newsletter for updates and tips.</p>
              <form onSubmit={handleSubscribe} className="subscribe-form">
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email for newsletter"
                  />
                  <button 
                    className={`btn btn-primary ${subscribeStatus === 'loading' ? 'disabled' : ''}`} 
                    type="submit"
                  >
                    {subscribeStatus === 'loading' ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : 'Subscribe'}
                  </button>
                </div>
                {subscribeStatus === 'success' && (
                  <div className="text-success mt-2 small">
                    <i className="bi bi-check-circle me-1"></i>
                    Successfully subscribed!
                  </div>
                )}
                {subscribeStatus === 'error' && (
                  <div className="text-danger mt-2 small">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    Failed to subscribe. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom pt-4 border-top">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-muted">
                © {currentYear} Hardware Monitor. All rights reserved.
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end justify-content-center align-items-center">
                <span className="text-muted me-3">Version {version}</span>
                <div className="footer-bottom-links">
                  <a href="#" className="text-muted me-3" onClick={(e) => handleLinkClick(e, 'privacy')}>Privacy</a>
                  <a href="#" className="text-muted me-3" onClick={(e) => handleLinkClick(e, 'terms')}>Terms</a>
                  <a href="#" className="text-muted" onClick={(e) => handleLinkClick(e, 'contact')}>Contact</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
