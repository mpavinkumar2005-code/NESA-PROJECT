import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Analytical logs to represent microclimate history
const historicalTrends = [
  { date: 'Jul 12', avgTemp: 24.2, avgHum: 65, totalRain: 0.0, energyKwh: 12.8 },
  { date: 'Jul 13', avgTemp: 25.8, avgHum: 61, totalRain: 0.0, energyKwh: 14.1 },
  { date: 'Jul 14', avgTemp: 26.1, avgHum: 58, totalRain: 1.2, energyKwh: 15.6 },
  { date: 'Jul 15', avgTemp: 23.4, avgHum: 72, totalRain: 4.8, energyKwh: 10.2 },
  { date: 'Jul 16', avgTemp: 24.9, avgHum: 68, totalRain: 0.5, energyKwh: 11.5 },
  { date: 'Jul 17', avgTemp: 26.5, avgHum: 60, totalRain: 0.0, energyKwh: 13.9 },
  { date: 'Jul 18', avgTemp: 26.8, avgHum: 62, totalRain: 0.0, energyKwh: 14.8 },
];

export default function ReportsView() {
  const [selectedMetric, setSelectedMetric] = useState<'temp' | 'humidity' | 'rainfall' | 'energy'>('temp');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    // Generate actual CSV content
    const headers = ['Date', 'Avg Temp (°C)', 'Avg Humidity (%)', 'Total Rain (mm)', 'Energy Consumed (kWh)'];
    const rows = historicalTrends.map(t => [t.date, t.avgTemp, t.avgHum, t.totalRain, t.energyKwh]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'agricultural_climate_report_2026.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerFeedback('CSV downloaded successfully.');
  };

  const handleDownloadPDF = () => {
    // Simulated high-fidelity PDF export file download
    const dummyPDFContent = `%PDF-1.4\n%...\n1 0 obj\n<< /Title (Agricultural Climate Report 2026) /Author (NESA AI) >>\nendobj\n...`;
    const blob = new Blob([dummyPDFContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'agricultural_climate_report_2026.pdf');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerFeedback('PDF generated and downloaded successfully.');
  };

  const triggerFeedback = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'humidity': return historicalTrends.map(t => ({ name: t.date, value: t.avgHum }));
      case 'rainfall': return historicalTrends.map(t => ({ name: t.date, value: t.totalRain }));
      case 'energy': return historicalTrends.map(t => ({ name: t.date, value: t.energyKwh }));
      case 'temp':
      default: return historicalTrends.map(t => ({ name: t.date, value: t.avgTemp }));
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'humidity': return 'Air Humidity (%)';
      case 'rainfall': return 'Rainfall Vol (mm)';
      case 'energy': return 'Grids Load (kWh)';
      case 'temp':
      default: return 'Mean Air Temp (°C)';
    }
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'humidity': return '#3b82f6';
      case 'rainfall': return '#06b6d4';
      case 'energy': return '#8b5cf6';
      case 'temp':
      default: return '#f59e0b';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Agricultural Historical Analytics</h2>
          <p className="text-sm text-slate-400 mt-1">Generate growth charts, energy reviews, and download verified data exports</p>
        </div>

        {/* Action downloads */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="download-csv-btn"
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-bold text-slate-200 border border-slate-700/60 rounded-xl transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-bold text-slate-200 border border-slate-700/60 rounded-xl transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-rose-400" /> Print PDF
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div id="download-alert-success" className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-400 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 animate-bounce" /> {downloadSuccess}
        </div>
      )}

      {/* Main Grid: Selector tabs and main chart */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Metric selection sidebar card */}
        <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-5 backdrop-blur-xl h-fit space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block px-2 mb-3">Select Analytics Mode</span>
          
          {(['temp', 'humidity', 'rainfall', 'energy'] as const).map((m) => (
            <button
              id={`report-metric-${m}-btn`}
              key={m}
              onClick={() => setSelectedMetric(m)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedMetric === m 
                  ? 'bg-slate-850 text-cyan-400 border border-slate-700/60 shadow-inner' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {m} Trends
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </button>
          ))}
        </div>

        {/* Large Bar Chart analysis panel */}
        <div className="lg:col-span-3 rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Analytical Microclimate Timeline (7 Days)
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMetricData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" name={getMetricLabel()} fill={getMetricColor()} radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Structured History Logs Table */}
      <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 overflow-hidden backdrop-blur-xl shadow-xl shadow-slate-950/10">
        <div className="p-5 border-b border-slate-800/40 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Weekly Climate Telemetry Database Logs
          </h3>
          <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Record: 7 Entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/30 text-slate-400 font-bold uppercase border-b border-slate-850 tracking-wider">
                <th className="p-4">Log Date</th>
                <th className="p-4 text-center">Avg Temp (°C)</th>
                <th className="p-4 text-center">Avg Humidity (%)</th>
                <th className="p-4 text-center">Total Rain (mm)</th>
                <th className="p-4 text-center">Grid Energy (kWh)</th>
                <th className="p-4 text-right">System Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {historicalTrends.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/10 transition-colors">
                  <td className="p-4 font-bold text-white">{log.date}, 2026</td>
                  <td className="p-4 text-center font-semibold font-mono">{log.avgTemp.toFixed(1)}°C</td>
                  <td className="p-4 text-center font-semibold font-mono">{log.avgHum}%</td>
                  <td className="p-4 text-center font-semibold font-mono">{log.totalRain.toFixed(1)} mm</td>
                  <td className="p-4 text-center font-semibold font-mono">{log.energyKwh.toFixed(1)} kWh</td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                      Pass
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
