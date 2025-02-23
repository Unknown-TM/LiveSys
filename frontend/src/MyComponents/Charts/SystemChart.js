import React from 'react';
import { Line } from 'react-chartjs-2';
import { useSettings } from '../../contexts/SettingsContext';

export function SystemChart({ data, type, height = 200 }) {
  const { settings } = useSettings();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: settings.display.chartAnimation,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: settings.display.showGrid
        }
      },
      x: {
        grid: {
          display: settings.display.showGrid
        }
      }
    }
  };

  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: `${type} Usage`,
      data: data.map(d => d[`${type.toLowerCase()}Usage`]),
      fill: true,
      borderColor: type === 'CPU' ? '#0d6efd' : 
                  type === 'RAM' ? '#198754' : '#dc3545',
      backgroundColor: type === 'CPU' ? 'rgba(13, 110, 253, 0.1)' : 
                      type === 'RAM' ? 'rgba(25, 135, 84, 0.1)' : 'rgba(220, 53, 69, 0.1)',
      tension: 0.4
    }]
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
} 