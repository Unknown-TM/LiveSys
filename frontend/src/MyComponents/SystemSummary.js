import React from 'react';

export function SystemSummary({ data }) {
  const totalSystems = data.length;
  const onlineSystems = data.filter(sys => sys.status === 'online').length;
  const averageCpu = data.reduce((acc, sys) => acc + sys.cpuUsage, 0) / totalSystems;
  const averageRam = data.reduce((acc, sys) => acc + sys.ramUsage, 0) / totalSystems;

  return (
    <div className="row g-3">
      <div className="col-md-3">
        <div className="card border-0 bg-primary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="card-title mb-0">Systems</h6>
                <small className="opacity-75">Total Connected</small>
              </div>
              <div className="fs-4">
                <i className="bi bi-pc-display"></i>
              </div>
            </div>
            <div className="mt-3">
              <h2 className="mb-0">{totalSystems}</h2>
              <small className="opacity-75">{onlineSystems} Online</small>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 bg-success text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="card-title mb-0">Average CPU</h6>
                <small className="opacity-75">All Systems</small>
              </div>
              <div className="fs-4">
                <i className="bi bi-cpu"></i>
              </div>
            </div>
            <div className="mt-3">
              <h2 className="mb-0">{averageCpu.toFixed(1)}%</h2>
              <div className="progress mt-2" style={{height: '4px'}}>
                <div 
                  className="progress-bar bg-white" 
                  style={{width: `${averageCpu}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 bg-info text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="card-title mb-0">Average RAM</h6>
                <small className="opacity-75">All Systems</small>
              </div>
              <div className="fs-4">
                <i className="bi bi-memory"></i>
              </div>
            </div>
            <div className="mt-3">
              <h2 className="mb-0">{averageRam.toFixed(1)}%</h2>
              <div className="progress mt-2" style={{height: '4px'}}>
                <div 
                  className="progress-bar bg-white" 
                  style={{width: `${averageRam}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 bg-warning text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="card-title mb-0">Alerts</h6>
                <small className="opacity-75">Last 24 Hours</small>
              </div>
              <div className="fs-4">
                <i className="bi bi-bell"></i>
              </div>
            </div>
            <div className="mt-3">
              <h2 className="mb-0">
                {data.filter(sys => 
                  sys.cpuUsage > 80 || 
                  sys.ramUsage > 80 || 
                  sys.diskUsage > 80
                ).length}
              </h2>
              <small className="opacity-75">Active Alerts</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 