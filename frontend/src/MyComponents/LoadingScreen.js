import React from 'react';

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-muted">Loading Hardware Monitor...</h5>
      </div>
    </div>
  );
} 