import React, { Suspense, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EmptyState = () => (
  <div className="d-flex justify-content-center align-items-center h-100">
    <div className="text-muted text-center">
      <i className="bi bi-graph-up display-4 d-block mb-3"></i>
      <p>No data available</p>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="d-flex justify-content-center align-items-center h-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading chart...</span>
    </div>
  </div>
);

export function SystemHealth({ data = [] }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;

    return {
      labels: data.map(d => {
        try {
          return new Date(d.timestamp).toLocaleTimeString();
        } catch {
          return '';
        }
      }),
      datasets: [
        {
          label: 'CPU Usage',
          data: data.map(d => Number(d?.cpuUsage) || 0),
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Memory Usage',
          data: data.map(d => Number(d?.ramUsage) || 0),
          borderColor: '#198754',
          backgroundColor: 'rgba(25, 135, 84, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Disk Usage',
          data: data.map(d => Number(d?.diskUsage) || 0),
          borderColor: '#dc3545',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: value => `${value}%`,
          font: { size: 12 }
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 12 }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="chart-container" style={{ position: 'relative', height: '300px', padding: '20px' }}>
      {!chartData ? (
        <EmptyState />
      ) : (
        <Suspense fallback={<LoadingState />}>
          <Line data={chartData} options={options} />
        </Suspense>
      )}
    </div>
  );
} 