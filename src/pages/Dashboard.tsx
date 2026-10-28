import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  FileCheck2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowUpRight, 
  Plus, 
  CheckSquare, 
  BarChart3, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, reviews, activity } = useApp();

  // Metrics computation derived from data
  const totalReviewsCount = 120 + reviews.length; // Realistic baseline plus active reviews
  const pendingApprovalsCount = reviews.filter(
    (r) => r.status === 'Pending Approval' || r.status === 'Changes Requested'
  ).length;

  const allActiveFindings = reviews.flatMap((r) => r.findings.filter((f) => f.status === 'active'));
  const criticalIssuesCount = allActiveFindings.filter((f) => f.severity === 'Critical' || f.severity === 'High').length;
  
  const avgComplianceScore = reviews.length > 0
    ? Math.round(reviews.reduce((acc, r) => acc + r.complianceScore, 0) / reviews.length)
    : 87;

  // Chart 1: Weekly Activity Data
  const weeklyData = [
    { day: 'Mon', reviews: 18, passed: 15, flagged: 3 },
    { day: 'Tue', reviews: 24, passed: 20, flagged: 4 },
    { day: 'Wed', reviews: 21, passed: 17, flagged: 4 },
    { day: 'Thu', reviews: 29, passed: 25, flagged: 4 },
    { day: 'Fri', reviews: 34, passed: 28, flagged: 6 },
    { day: 'Sat', reviews: 14, passed: 13, flagged: 1 },
    { day: 'Sun', reviews: 12, passed: 11, flagged: 1 },
  ];

  // Chart 2: Issues by category from state
  const categoryCounts: Record<string, number> = {};
  allActiveFindings.forEach((f) => {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Fallback category data if all fixed
  const displayCategoryData = categoryData.length > 0 ? categoryData : [
    { name: 'Prohibited Terminology', value: 5 },
    { name: 'Unsupported Claim', value: 3 },
    { name: 'Brand Tone & Voice', value: 4 },
    { name: 'Missing Required Term', value: 3 },
  ];

  const CATEGORY_COLORS = ['#7866E8', '#25A99A', '#F59E0B', '#E05252', '#64748B'];

  // High severity reviews for "Needs Attention" panel
  const needsAttentionList = reviews
    .filter((r) => r.findings.some((f) => f.status === 'active' && (f.severity === 'Critical' || f.severity === 'High')))
    .slice(0, 3);

  // Status badge styling helper (clean text + subtle tint, zero heavy pill)
  const renderStatus = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="text-emerald-700 font-medium text-xs">Approved</span>;
      case 'Changes Requested':
        return <span className="text-amber-700 font-medium text-xs">Changes Requested</span>;
      case 'Rejected':
        return <span className="text-rose-700 font-medium text-xs">Rejected</span>;
      case 'Pending Approval':
        return <span className="text-indigo-700 font-medium text-xs">Pending Approval</span>;
      default:
        return <span className="text-stone-600 font-medium text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Good morning, {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Keep every piece of content on-brand before it goes live. Review automated findings, enforce guidelines, and manage approvals.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/submit"
            className="flex items-center gap-2 px-4 py-2 bg-[#7866E8] hover:bg-[#6855d9] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Review New Content</span>
          </Link>
          <Link
            to="/approvals"
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <CheckSquare className="w-4 h-4 text-stone-500" />
            <span>Approval Queue</span>
          </Link>
          <Link
            to="/analytics"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4 text-stone-500" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Reviews */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Content Reviews
            </span>
            <div className="p-2 bg-stone-50 rounded-xl text-stone-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {totalReviewsCount}
            </div>
            <div className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 font-medium">+14%</span>
              <span>·</span>
              <span>vs last week</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Approvals */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="p-2 bg-indigo-50 rounded-xl text-[#7866E8]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {pendingApprovalsCount}
            </div>
            <div className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <span>Human verification queue</span>
              <span>·</span>
              <Link to="/approvals" className="text-[#7866E8] font-medium hover:underline">
                Review
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3: Critical Issues */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Critical Issues Flagged
            </span>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {criticalIssuesCount}
            </div>
            <div className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <span className="text-rose-600 font-medium">Requires action</span>
              <span>·</span>
              <span>Prioritize fixes</span>
            </div>
          </div>
        </div>

        {/* Card 4: Brand Compliance Score */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Brand Compliance Score
            </span>
            <div className="p-2 bg-teal-50 rounded-xl text-[#25A99A]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {avgComplianceScore}%
            </div>
            <div className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <span className="text-teal-700 font-medium">Healthy</span>
              <span>·</span>
              <span>Benchmark target 85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section: Weekly Activity & Issues by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Content Review Activity (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">
                Weekly Content Review Activity
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Total reviews submitted vs. fully compliant pieces
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#7866E8]" />
                <span className="text-stone-600">Total Scans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#25A99A]" />
                <span className="text-stone-600">Passed</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7866E8" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#7866E8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25A99A" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#25A99A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
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
                <Area type="monotone" dataKey="reviews" name="Total Scans" stroke="#7866E8" strokeWidth={2} fillOpacity={1} fill="url(#colorReviews)" />
                <Area type="monotone" dataKey="passed" name="Approved" stroke="#25A99A" strokeWidth={2} fillOpacity={1} fill="url(#colorPassed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issues by Category Donut Chart (1 col) */}
        <div className="p-5 sm:p-6 bg-white border border-stone-200 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">
              Issues by Category
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Breakdown of current policy violations
            </p>
          </div>

          <div className="h-52 w-full my-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {displayCategoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-stone-900 font-mono tabular-nums">
                {displayCategoryData.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                Total
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
            {displayCategoryData.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-stone-600">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-mono tabular-nums text-stone-800 font-medium">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Reviews & Needs Attention + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reviews Table (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">
                Recent Content Reviews
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Latest submissions across marketing channels
              </p>
            </div>
            <Link
              to="/reviews"
              className="text-xs font-semibold text-[#7866E8] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-1">Content Title</th>
                  <th className="pb-3 hidden sm:table-cell">Creator</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Compliance</th>
                  <th className="pb-3 text-right pr-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reviews.slice(0, 5).map((rev) => (
                  <tr
                    key={rev.id}
                    onClick={() => navigate(`/reviews/${rev.id}`)}
                    className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 pl-1 max-w-[200px] truncate">
                      <div className="font-medium text-stone-900 group-hover:text-[#7866E8] transition-colors truncate">
                        {rev.title}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1.5">
                        <span>{rev.id}</span>
                        <span>·</span>
                        <span>{rev.channel}</span>
                      </div>
                    </td>
                    <td className="py-3.5 hidden sm:table-cell text-stone-600">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.creator.avatar}
                          alt={rev.creator.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="truncate">{rev.creator.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-stone-500 tabular-nums">
                      {rev.submittedDate.split(' ')[0]}
                    </td>
                    <td className="py-3.5 text-right font-mono tabular-nums font-semibold">
                      <span
                        className={
                          rev.complianceScore >= 85
                            ? 'text-teal-700'
                            : rev.complianceScore >= 70
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }
                      >
                        {rev.complianceScore}%
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-1">
                      {renderStatus(rev.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Needs Attention & Activity Feed (1 col) */}
        <div className="space-y-6">
          {/* Needs Attention Panel */}
          <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-semibold text-stone-900">
                Needs Attention
              </h2>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              High-severity findings flagged in active campaigns:
            </p>

            <div className="space-y-3">
              {needsAttentionList.length > 0 ? (
                needsAttentionList.map((item) => {
                  const criticalCount = item.findings.filter((f) => f.severity === 'Critical' && f.status === 'active').length;
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/reviews/${item.id}`)}
                      className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <ArrowUpRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      </div>
                      <div className="text-[11px] text-stone-600 mt-1 flex items-center gap-2">
                        <span className="text-rose-700 font-medium font-mono tabular-nums">
                          {criticalCount > 0 ? `${criticalCount} Critical` : `${item.findings.length} Flagged`}
                        </span>
                        <span>·</span>
                        <span>{item.channel}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-stone-400 text-xs">
                  No pending critical items require immediate attention.
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-xs">
            <h2 className="text-sm font-semibold text-stone-900 mb-1">
              Governance Activity Feed
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Audit log of brand decisions & revisions
            </p>

            <div className="space-y-3">
              {activity.slice(0, 5).map((act) => (
                <div key={act.id} className="text-xs flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-stone-700 leading-snug">
                      <strong className="text-stone-900 font-medium">{act.actor}</strong>{' '}
                      {act.action}{' '}
                      <span className="font-medium text-stone-900 truncate">
                        "{act.targetTitle}"
                      </span>
                    </p>
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
