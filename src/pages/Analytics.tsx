import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { ContentType } from '../types';

export const Analytics: React.FC = () => {
  const { reviews } = useApp();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [formatFilter, setFormatFilter] = useState<'All' | ContentType>('All');

  // Filter reviews based on format filter
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (formatFilter === 'All') return true;
      return r.contentType === formatFilter;
    });
  }, [reviews, formatFilter]);

  // Dynamic stats derived from current state
  const avgScore = filteredReviews.length > 0
    ? Math.round(filteredReviews.reduce((sum, r) => sum + r.complianceScore, 0) / filteredReviews.length)
    : 87;

  const approvedCount = filteredReviews.filter((r) => r.status === 'Approved').length;
  const changesCount = filteredReviews.filter((r) => r.status === 'Changes Requested').length;
  const rejectedCount = filteredReviews.filter((r) => r.status === 'Rejected').length;
  const pendingCount = filteredReviews.filter((r) => r.status === 'Pending Approval').length;

  const totalEvaluated = approvedCount + changesCount + rejectedCount || 1;
  const approvalRate = Math.round((approvedCount / totalEvaluated) * 100);

  // Time-series review volume data (with slight variation by dateRange)
  const timeSeriesData = useMemo(() => {
    if (dateRange === '7d') {
      return [
        { period: 'Day 1', total: 14, passed: 11, flagged: 3 },
        { period: 'Day 2', total: 18, passed: 15, flagged: 3 },
        { period: 'Day 3', total: 22, passed: 17, flagged: 5 },
        { period: 'Day 4', total: 19, passed: 16, flagged: 3 },
        { period: 'Day 5', total: 28, passed: 24, flagged: 4 },
        { period: 'Day 6', total: 12, passed: 11, flagged: 1 },
        { period: 'Day 7', total: 15, passed: 14, flagged: 1 },
      ];
    }
    if (dateRange === '90d') {
      return [
        { period: 'Aug W1', total: 64, passed: 51, flagged: 13 },
        { period: 'Aug W3', total: 72, passed: 60, flagged: 12 },
        { period: 'Sep W1', total: 85, passed: 71, flagged: 14 },
        { period: 'Sep W3', total: 94, passed: 80, flagged: 14 },
        { period: 'Oct W1', total: 108, passed: 95, flagged: 13 },
        { period: 'Oct W3', total: 128, passed: 114, flagged: 14 },
      ];
    }
    // Default 30d
    return [
      { period: 'Week 1', total: 28, passed: 22, flagged: 6 },
      { period: 'Week 2', total: 35, passed: 29, flagged: 6 },
      { period: 'Week 3', total: 42, passed: 36, flagged: 6 },
      { period: 'Week 4', total: 38, passed: 33, flagged: 5 },
    ];
  }, [dateRange]);

  // Severity Distribution Data
  const allFindings = filteredReviews.flatMap((r) => r.findings);
  const severityCounts = {
    Critical: allFindings.filter((f) => f.severity === 'Critical').length || 4,
    High: allFindings.filter((f) => f.severity === 'High').length || 7,
    Medium: allFindings.filter((f) => f.severity === 'Medium').length || 6,
    Low: allFindings.filter((f) => f.severity === 'Low').length || 3,
  };

  const severityChartData = [
    { name: 'Critical', count: severityCounts.Critical, fill: '#E05252' },
    { name: 'High', count: severityCounts.High, fill: '#F59E0B' },
    { name: 'Medium', count: severityCounts.Medium, fill: '#7866E8' },
    { name: 'Low', count: severityCounts.Low, fill: '#25A99A' },
  ];

  // Issue Categories Data
  const categoryCounts: Record<string, number> = {};
  allFindings.forEach((f) => {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryCounts).length > 0
    ? Object.entries(categoryCounts).map(([category, count]) => ({ category, count }))
    : [
        { category: 'Prohibited Terminology', count: 8 },
        { category: 'Unsupported Claim', count: 5 },
        { category: 'Brand Tone & Voice', count: 6 },
        { category: 'Missing Required Term', count: 4 },
        { category: 'Visual & Accessibility', count: 2 },
      ];

  // Approval status pie chart
  const statusChartData = [
    { name: 'Approved', value: approvedCount || 4, color: '#25A99A' },
    { name: 'Pending Review', value: pendingCount || 2, color: '#7866E8' },
    { name: 'Changes Requested', value: changesCount || 2, color: '#F59E0B' },
    { name: 'Rejected', value: rejectedCount || 1, color: '#E05252' },
  ];

  // Most frequently detected violations
  const topViolations = [
    { rule: 'Guaranteed athletic outcome claims', category: 'Legal & Compliance', hits: 14, avgResolution: '1.2h' },
    { rule: 'Unsubstantiated recycled % claims', category: 'Unsupported Claim', hits: 9, avgResolution: '2.4h' },
    { rule: 'High-pressure urgency ("Act fast / hurry")', category: 'Brand Voice', hits: 8, avgResolution: '0.8h' },
    { rule: 'Missing mandatory "Everyday comfort" tagline', category: 'Brand Asset', hits: 7, avgResolution: '0.5h' },
    { rule: 'Omission of trademark ™ on AeroKnit™', category: 'Trademark Compliance', hits: 6, avgResolution: '0.3h' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Governance & Compliance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track policy violation trends, turnaround velocity, and brand guideline alignment.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Format selector */}
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
          >
            <option value="All">All Formats</option>
            <option value="Social Media Post">Social Media Post</option>
            <option value="Marketing Email">Marketing Email</option>
            <option value="Product Page">Product Page</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Blog Article">Blog Article</option>
          </select>

          {/* Time range toggle */}
          <div className="flex items-center p-1 bg-stone-200/60 rounded-lg">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                dateRange === '7d' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                dateRange === '30d' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setDateRange('90d')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                dateRange === '90d' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              90D
            </button>
          </div>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="p-3 bg-stone-100/80 border border-stone-200 rounded-xl flex items-start gap-2.5 text-xs text-stone-600">
        <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
        <p>
          <strong>Simulated Demo Analytics:</strong> Visualizations dynamically recalculate when content is submitted, resolved, or approved in this browser session.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Average Compliance Score
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {avgScore}%
            </span>
            <span className="text-xs text-teal-700 font-semibold font-mono">
              +4.2% pts
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Above target threshold of 85%</div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Approval Clearance Rate
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {approvalRate}%
            </span>
            <span className="text-xs text-stone-500">
              ({approvedCount} approved)
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Based on certified human reviews</div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Avg Turnaround Duration
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              3.4h
            </span>
            <span className="text-xs text-emerald-700 font-semibold font-mono">
              -1.1h faster
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">From submission to clearance</div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Total Scans Executed
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              128
            </span>
            <span className="text-xs text-indigo-700 font-semibold font-mono">
              {filteredReviews.length} active
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Multi-channel campaigns</div>
        </div>
      </div>

      {/* Row 1 Charts: Reviews Over Time & Approval Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Time Series Area/Line Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                Content Reviews Over Time
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Total submissions evaluated vs. compliant pieces
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#7866E8]" />
                <span className="text-stone-600">Total Scanned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#25A99A]" />
                <span className="text-stone-600">Passed Initial Check</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17212B',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="total" stroke="#7866E8" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="passed" stroke="#25A99A" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Approval vs Rejection Status (1 col) */}
        <div className="p-5 sm:p-6 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              Approval vs Rejection Status
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Current queue outcome distribution
            </p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusChartData.map((entry, idx) => (
                    <Cell key={`status-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17212B',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
            {statusChartData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.name}</span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-stone-800">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Issues by Category & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Category Bar Chart */}
        <div className="p-5 sm:p-6 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <h3 className="text-sm font-semibold text-stone-900 mb-1">
            Violations by Policy Category
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Prevalence of findings across active marketing copy
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f1ee" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" width={130} tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17212B',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#7866E8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="p-5 sm:p-6 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <h3 className="text-sm font-semibold text-stone-900 mb-1">
            Severity Distribution
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Risk weighting of all identified flags
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17212B',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {severityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Most Frequently Detected Violations Table */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
        <h3 className="text-sm font-semibold text-stone-900 mb-1">
          Most Frequently Detected Brand Violations
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Historical log of recurring phrase and claim mismatches
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-200 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="pb-3 pl-1">Violation Description</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Detections</th>
                <th className="pb-3 text-right pr-1">Avg Fix Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {topViolations.map((v, i) => (
                <tr key={i} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 pl-1 font-medium text-stone-900">
                    {v.rule}
                  </td>
                  <td className="py-3 text-stone-500">
                    {v.category}
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums font-semibold text-stone-800">
                    {v.hits} instances
                  </td>
                  <td className="py-3 text-right pr-1 font-mono tabular-nums text-teal-700">
                    {v.avgResolution}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
