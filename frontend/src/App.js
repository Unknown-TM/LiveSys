import React, { useState, useEffect } from 'react';
import Header from "./MyComponents/Header";
import Dashboard from "./MyComponents/Dashboard";
import About from "./MyComponents/About";
import Footer from "./MyComponents/Footer";
import ErrorBoundary from './MyComponents/ErrorBoundary';
import { LoadingScreen } from './MyComponents/LoadingScreen';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './styles/animations.css';
import './styles/themes.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Settings } from './MyComponents/Settings';
import { Help } from './MyComponents/Help';
import { Profile } from './MyComponents/Profile';
import { Home } from './MyComponents/Home';
import { NotificationService } from './services/notifications';
import { Reports } from './MyComponents/Reports';
import { Diagnostics } from './MyComponents/Diagnostics';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check backend health
        await fetch('http://localhost:5001/health');
        // Initialize notifications
        await NotificationService.requestPermission();
        setError(null);
      } catch (err) {
        setError('Failed to connect to server. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useKeyboardShortcuts([
    { key: 'd', ctrl: true, action: () => setCurrentPage('dashboard') },
    { key: 'a', ctrl: true, action: () => setCurrentPage('about') },
    { key: 'r', ctrl: true, action: () => window.location.reload() },
  ]);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <Reports />;
      case 'diagnostics':
        return <Diagnostics />;
      case 'about':
        return <About />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  const links = [
    { 
      label: "Home",
      href: "#",
      icon: "house",
      onClick: () => setCurrentPage('home')
    },
    { 
      label: "Dashboard",
      href: "#",
      icon: "speedometer2",
      onClick: () => setCurrentPage('dashboard')
    },
    { 
      label: "Reports",
      href: "#",
      icon: "graph-up",
      onClick: () => setCurrentPage('reports')
    },
    { 
      label: "Diagnostics",
      href: "#",
      icon: "tools",
      onClick: () => setCurrentPage('diagnostics')
    },
    { 
      label: "About",
      href: "#",
      icon: "info-circle",
      onClick: () => setCurrentPage('about')
    },
  ];

  return (
    <SettingsProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <div className="app-wrapper">
            <Header
              brandName="Hardware Monitor"
              links={links}
              currentPage={currentPage}
              onNavigate={setCurrentPage}
            />
            <main className="main-content">
              {renderPage()}
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </SettingsProvider>
  );
}
