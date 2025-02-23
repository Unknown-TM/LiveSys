import { Line } from 'react-chartjs-2';

export function UsageChart({ data, type }) {
  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [{
      label: `${type} Usage`,
      data: data.map(d => d[`${type.toLowerCase()}Usage`]),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return <Line data={chartData} />;
} 