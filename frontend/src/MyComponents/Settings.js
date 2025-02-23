import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { NotificationService } from '../services/notifications';

export function Settings() {
  const { theme } = useTheme();
  const { settings, setSettings } = useSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (settings.alerts.notifications) {
        await NotificationService.requestPermission();
      }
      
      setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Header */}
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-gear me-2"></i>
            System Settings
          </h4>
          {saveMessage && (
            <div className={`alert alert-${saveMessage.type} py-2 px-3 mb-0`} role="alert">
              {saveMessage.text}
            </div>
          )}
        </div>

        {/* Alert Settings */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Alert Thresholds</h5>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSettings(prev => ({
                  ...prev,
                  alerts: {
                    cpu: 80,
                    ram: 85,
                    disk: 90,
                    notifications: true,
                    emailAlerts: false,
                    refreshInterval: 5
                  }
                }))}
              >
                Reset to Default
              </button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">CPU Alert Threshold (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.alerts.cpu}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      alerts: { ...prev.alerts, cpu: Number(e.target.value) }
                    }))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">RAM Alert Threshold (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.alerts.ram}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      alerts: { ...prev.alerts, ram: Number(e.target.value) }
                    }))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Disk Alert Threshold (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.alerts.disk}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      alerts: { ...prev.alerts, disk: Number(e.target.value) }
                    }))}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.alerts.notifications}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      alerts: { ...prev.alerts, notifications: e.target.checked }
                    }))}
                  />
                  <label className="form-check-label">Enable Desktop Notifications</label>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.alerts.emailAlerts}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      alerts: { ...prev.alerts, emailAlerts: e.target.checked }
                    }))}
                  />
                  <label className="form-check-label">Enable Email Alerts</label>
                </div>
                <div className="mb-3">
                  <label className="form-label">Refresh Interval (seconds)</label>
                  <select 
                    className="form-select"
                    value={settings.alerts.refreshInterval}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      alerts: { ...prev.alerts, refreshInterval: Number(e.target.value) }
                    }))}
                  >
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Display Settings</h5>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.display.showGrid}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    display: { ...prev.display, showGrid: e.target.checked }
                  }))}
                />
                <label className="form-check-label">Show Grid Lines in Charts</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.display.compactView}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    display: { ...prev.display, compactView: e.target.checked }
                  }))}
                />
                <label className="form-check-label">Use Compact View</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.display.chartAnimation}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    display: { ...prev.display, chartAnimation: e.target.checked }
                  }))}
                />
                <label className="form-check-label">Enable Chart Animations</label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Security Settings</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={settings.security.autoLock}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, autoLock: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label">Auto-lock Dashboard</label>
                  </div>
                  {settings.security.autoLock && (
                    <div className="mb-3">
                      <label className="form-label">Lock After (minutes)</label>
                      <select 
                        className="form-select"
                        value={settings.security.lockTimeout}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, lockTimeout: Number(e.target.value) }
                        }))}
                      >
                        <option value="5">5 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-primary me-2"
                    onClick={() => {/* Implement password change */}}
                  >
                    <i className="bi bi-key me-2"></i>
                    Change Password
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => {/* Implement 2FA setup */}}
                  >
                    <i className="bi bi-shield-lock me-2"></i>
                    Setup Two-Factor Auth
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="col-12">
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i>
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 