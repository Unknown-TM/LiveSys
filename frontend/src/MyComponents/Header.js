import React, { useState } from "react";
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import './Header.css';

export default function Header({ brandName = "Navbar", links = [], currentPage, onNavigate }) {
  const { toggleTheme, theme } = useTheme();
  const { settings } = useSettings() || { settings: {} };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (e, path) => {
    e.preventDefault();
    onNavigate(path);
    setIsMenuOpen(false);
  };

  const userMenu = [
    { 
      label: "Profile",
      icon: "person",
      path: 'profile'
    },
    { 
      label: "Settings",
      icon: "gear",
      path: 'settings'
    },
    { 
      label: "Help",
      icon: "question-circle",
      path: 'help'
    }
  ];

  // Mock notifications for demo
  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'CPU usage above 80%',
      time: '2 mins ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'System update available',
      time: '10 mins ago'
    },
    {
      id: 3,
      type: 'danger',
      message: 'Disk space critically low',
      time: '1 hour ago'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return 'exclamation-triangle';
      case 'danger': return 'exclamation-circle';
      case 'info': return 'info-circle';
      default: return 'bell';
    }
  };

  return (
    <header className="header-container">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a 
            className="navbar-brand d-flex align-items-center" 
            href="#"
            onClick={(e) => handleNavigation(e, 'home')}
          >
            <i className="bi bi-pc-display me-2"></i>
            {brandName}
          </a>

          <button 
            className="navbar-toggler" 
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {links.map((link, index) => (
                <li className="nav-item" key={index}>
                  <a 
                    className={`nav-link ${currentPage === link.label.toLowerCase() ? 'active' : ''}`}
                    href="#"
                    onClick={(e) => handleNavigation(e, link.label.toLowerCase())}
                  >
                    <i className={`bi bi-${link.icon} me-2`}></i>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center">
              {/* Theme Toggle */}
              <button 
                className="btn btn-link text-light me-3"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'}`}></i>
              </button>

              {/* Updated Notifications Dropdown */}
              <div className="dropdown me-3">
                <button 
                  className="btn btn-link text-light position-relative"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-bell"></i>
                  {notifications.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <div className="dropdown-menu dropdown-menu-end notification-menu">
                  <h6 className="dropdown-header d-flex justify-content-between align-items-center">
                    Notifications
                    <span className="badge bg-primary rounded-pill">{notifications.length}</span>
                  </h6>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map(notification => (
                        <a 
                          key={notification.id}
                          className="dropdown-item notification-item" 
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          <div className="d-flex align-items-center">
                            <i className={`bi bi-${getNotificationIcon(notification.type)} text-${notification.type} me-2`}></i>
                            <div className="flex-grow-1">
                              <p className="mb-0">{notification.message}</p>
                              <small className="text-muted">{notification.time}</small>
                            </div>
                          </div>
                        </a>
                      ))}
                      <div className="dropdown-divider"></div>
                    </>
                  ) : (
                    <div className="dropdown-item text-center text-muted">
                      No new notifications
                    </div>
                  )}
                  <a 
                    className="dropdown-item text-center text-primary" 
                    href="#"
                    onClick={(e) => handleNavigation(e, 'notifications')}
                  >
                    View All Notifications
                  </a>
                </div>
              </div>

              {/* Updated User Menu Dropdown */}
              <div className="dropdown">
                <button 
                  className="btn btn-link text-light d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="user-avatar me-2">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="d-none d-lg-block">
                    <div className="user-name">Admin</div>
                    <small className="user-role text-light-50">Administrator</small>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end user-menu">
                  <li className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-3">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div>
                        <div className="user-name">Admin</div>
                        <small className="user-role text-muted">Administrator</small>
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider"/></li>
                  {userMenu.map((item, index) => (
                    <li key={index}>
                      <a 
                        className="dropdown-item" 
                        href="#"
                        onClick={(e) => handleNavigation(e, item.path)}
                      >
                        <i className={`bi bi-${item.icon} me-2`}></i>
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li><hr className="dropdown-divider"/></li>
                  <li>
                    <a 
                      className="dropdown-item text-danger" 
                      href="#"
                      onClick={(e) => handleNavigation(e, 'logout')}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}