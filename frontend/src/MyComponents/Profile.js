import React, { useState } from 'react';

export function Profile() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
    notifications: true,
    theme: 'light'
  });

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12">
          <h4 className="mb-4">
            <i className="bi bi-person me-2"></i>
            Profile Settings
          </h4>
        </div>

        {/* Profile Info */}
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <div className="mb-3">
                <div className="avatar-placeholder rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px'}}>
                  <i className="bi bi-person-fill fs-1"></i>
                </div>
                <h5 className="mb-1">{profile.name}</h5>
                <p className="text-muted mb-0">{profile.role}</p>
              </div>
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-camera me-2"></i>
                Change Photo
              </button>
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Profile Information</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.role}
                    readOnly
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Security</h5>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-primary me-2">
                <i className="bi bi-key me-2"></i>
                Change Password
              </button>
              <button className="btn btn-outline-primary">
                <i className="bi bi-shield-lock me-2"></i>
                Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 