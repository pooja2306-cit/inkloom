import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  FileText, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { ReviewStatus, ContentType } from '../types';

export const ReviewsList: React.FC = () => {
  const navigate = useNavigate();
  const { reviews } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        const matchesSearch =
          rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rev.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rev.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All' || rev.status === statusFilter;
        const matchesType = contentTypeFilter === 'All' || rev.contentType === contentTypeFilter;
        const matchesRisk = riskFilter === 'All' || rev.riskLevel === riskFilter;

        return matchesSearch && matchesStatus && matchesType && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return sortOrder === 'desc'
            ? b.complianceScore - a.complianceScore
            : a.complianceScore - b.complianceScore;
        }
        if (sortBy === 'title') {
          return sortOrder === 'desc'
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        }
        // Default: date
        return sortOrder === 'desc'
          ? new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
          : new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
      });
  }, [reviews, searchQuery, statusFilter, contentTypeFilter, riskFilter, sortBy, sortOrder]);

  const renderStatus = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="text-emerald-700 font-medium">Approved</span>;
      case 'Changes Requested':
        return <span className="text-amber-700 font-medium">Changes Requested</span>;
      case 'Rejected':
        return <span className="text-rose-700 font-medium">Rejected</span>;
      case 'Pending Approval':
        return <span className="text-indigo-700 font-medium">Pending Approval</span>;
      default:
        return <span className="text-stone-600 font-medium">{status}</span>;
    }
  };

  const renderRisk = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return <span className="text-rose-700 font-semibold">Critical Risk</span>;
      case 'High':
        return <span className="text-amber-700 font-medium">High Risk</span>;
      case 'Medium':
        return <span className="text-stone-700 font-medium">Medium</span>;
      default:
        return <span className="text-teal-700 font-medium">Low Risk</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Content Reviews
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse, inspect, and track brand compliance across all submitted marketing content.
          </p>
        </div>

        <Link
          to="/submit"
          className="flex items-center gap-2 px-4 py-2 bg-[#7866E8] hover:bg-[#6855d9] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Content</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, ID, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8]"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Changes Requested">Changes Requested</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Content Type Filter */}
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
            >
              <option value="All">All Formats</option>
              <option value="Social Media Post">Social Media Post</option>
              <option value="Marketing Email">Marketing Email</option>
              <option value="Product Page">Product Page</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Blog Article">Blog Article</option>
            </select>

            {/* Risk Level Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-700 text-xs transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'desc' ? 'Newest / Highest' : 'Oldest / Lowest'}</span>
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div>
            Showing <strong className="text-stone-900 font-mono tabular-nums">{filteredReviews.length}</strong> of{' '}
            <strong className="text-stone-900 font-mono tabular-nums">{reviews.length}</strong> total records
          </div>
          {(statusFilter !== 'All' || contentTypeFilter !== 'All' || riskFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setContentTypeFilter('All');
                setRiskFilter('All');
                setSearchQuery('');
              }}
              className="text-[#7866E8] hover:underline font-medium text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-800">No content reviews match your filters</h3>
            <p className="text-xs text-stone-500 mt-1">Try clearing search terms or status criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/70 border-b border-stone-200 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Record & Title</th>
                  <th className="py-3 px-3">Format / Channel</th>
                  <th className="py-3 px-3">Creator</th>
                  <th className="py-3 px-3">Submitted</th>
                  <th className="py-3 px-3">Risk Assessment</th>
                  <th className="py-3 px-3 text-right">Compliance</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredReviews.map((rev) => (
                  <tr
                    key={rev.id}
                    onClick={() => navigate(`/reviews/${rev.id}`)}
                    className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Title & ID */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="font-semibold text-stone-900 group-hover:text-[#7866E8] transition-colors truncate">
                        {rev.title}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-2">
                        <span className="font-mono">{rev.id}</span>
                        <span>·</span>
                        <span>Rev {rev.revision}</span>
                        {rev.findings.length > 0 && (
                          <>
                            <span>·</span>
                            <span>{rev.findings.filter(f => f.status === 'active').length} active flags</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Format / Channel */}
                    <td className="py-3.5 px-3 text-stone-600">
                      <div>{rev.contentType}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{rev.channel}</div>
                    </td>

                    {/* Creator */}
                    <td className="py-3.5 px-3 text-stone-600">
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

                    {/* Submitted Date */}
                    <td className="py-3.5 px-3 text-stone-500 tabular-nums font-mono text-[11px]">
                      {rev.submittedDate}
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-3">
                      {renderRisk(rev.riskLevel)}
                    </td>

                    {/* Compliance Score */}
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-sm">
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

                    {/* Status */}
                    <td className="py-3.5 px-4 text-right">
                      {renderStatus(rev.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
