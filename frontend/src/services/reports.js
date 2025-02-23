export class ReportGenerator {
  static generateCSV(data) {
    const headers = ['Computer', 'CPU', 'RAM', 'Disk', 'Time'];
    const rows = data.map(item => [
      item.computer,
      item.cpuUsage,
      item.ramUsage,
      item.diskUsage,
      item.lastupdate
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  static downloadReport(data, format = 'csv') {
    const content = this.generateCSV(data);
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hardware-report-${new Date().toISOString()}.csv`;
    a.click();
  }
} 