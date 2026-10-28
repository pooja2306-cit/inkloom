import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { 
  CheckSquare, 
  Clock, 
  FileEdit, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ReviewRecord, ReviewStatus } from '../types';

export const ApprovalQueue: React.FC = () => {
  const navigate = useNavigate();
  const { reviews, user, updateReviewStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ReviewStatus>('All');

  // Action Dialogs State
  const [actionTarget, setActionTarget] = useState<ReviewRecord | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [changesDialogOpen, setChangesDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const [actionComment, setActionComment] = useState('');

  // Summary counts
  const awaitingCount = reviews.filter((r) => r.status === 'Pending Approval').length;
  const changesCount = reviews.filter((r) => r.status === 'Changes Requested').length;
  const approvedCount = reviews.filter((r) => r.status === 'Approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'Rejected').length;

  // Filtered list
  const filteredList = reviews.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Action Handlers
  const handleApprove = () => {
    if (!actionTarget) return;
    updateReviewStatus(actionTarget.id, 'Approved', 'Approved by brand governance lead for production publishing.');
    setActionTarget(null);
  };

  const handleRequestChanges = () => {
    if (!actionTarget || !actionComment.trim()) return;
    updateReviewStatus(actionTarget.id, 'Changes Requested', actionComment.trim());
    setActionTarget(null);
    setActionComment('');
  };

  const handleReject = () => {
    if (!actionTarget || !actionComment.trim()) return;
    updateReviewStatus(actionTarget.id, 'Rejected', actionComment.trim());
    setActionTarget(null);
    setActionComment('');
  };

  const renderStatus = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved':
        return <span className="text-emerald-700 font-semibold text-xs">Approved</span>;
      case 'Changes Requested':
        return <span className="text-amber-700 font-semibold text-xs">Changes Requested</span>;
      case 'Rejected':
        return <span className="text-rose-700 font-semibold text-xs">Rejected</span>;
      case 'Pending Approval':
        return <span className="text-indigo-700 font-semibold text-xs">Awaiting Review</span>;
      default:
        return <span className="text-stone-600 font-medium text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header & Governance Doctrine */}
      <div className="space-y-3 pb-2 border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Human Approval Queue
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Final sign-off portal. Review automated findings, request revisions, and issue formal brand publication clearances.
            </p>
          </div>
        </div>

        {/* Mandatory Governance Doctrine Notice */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Human Governance Policy:</strong> Content is never automatically approved, regardless of high algorithmic compliance scores. A certified reviewer must manually inspect creative context before releasing content.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Awaiting Review */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Pending Approval' ? 'All' : 'Pending Approval')}
          className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            statusFilter === 'Pending Approval' ? 'border-[#7866E8] ring-2 ring-[#7866E8]/20' : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Awaiting Review
            </span>
            <div className="p-2 bg-indigo-50 rounded-xl text-[#7866E8]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {awaitingCount}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Needs human verification</div>
          </div>
        </div>

        {/* Card 2: Changes Requested */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Changes Requested' ? 'All' : 'Changes Requested')}
          className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            statusFilter === 'Changes Requested' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Changes Requested
            </span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {changesCount}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Returned to author with notes</div>
          </div>
        </div>

        {/* Card 3: Approved */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Approved' ? 'All' : 'Approved')}
          className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            statusFilter === 'Approved' ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Approved
            </span>
            <div className="p-2 bg-teal-50 rounded-xl text-[#25A99A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {approvedCount}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Cleared for publication</div>
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Rejected' ? 'All' : 'Rejected')}
          className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all shadow-xs ${
            statusFilter === 'Rejected' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Rejected
            </span>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
              {rejectedCount}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Violated critical standards</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search queue records by title, creator, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-stone-500">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 text-xs focus:outline-none"
          >
            <option value="All">All Queue Items</option>
            <option value="Pending Approval">Awaiting Review</option>
            <option value="Changes Requested">Changes Requested</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Approval Queue Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Content Record</th>
                <th className="py-3 px-3">Creator</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 px-3">Risk Assessment</th>
                <th className="py-3 px-3">Assigned Reviewer</th>
                <th className="py-3 px-3 text-right">Score</th>
                <th className="py-3 px-3 text-right">Status</th>
                <th className="py-3 px-4 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredList.map((rev) => (
                <tr key={rev.id} className="hover:bg-stone-50/80 transition-colors">
                  {/* Content Record */}
                  <td
                    className="py-3.5 px-4 max-w-[220px] cursor-pointer"
                    onClick={() => navigate(`/reviews/${rev.id}`)}
                  >
                    <div className="font-semibold text-stone-900 hover:text-[#7866E8] truncate">
                      {rev.title}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono">{rev.id}</span>
                      <span>·</span>
                      <span>{rev.channel}</span>
                    </div>
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
                  <td className="py-3.5 px-3 text-stone-500 font-mono text-[11px] tabular-nums">
                    {rev.submittedDate}
                  </td>

                  {/* Risk Level */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`font-semibold ${
                        rev.riskLevel === 'Critical'
                          ? 'text-rose-700'
                          : rev.riskLevel === 'High'
                          ? 'text-amber-700'
                          : 'text-stone-700'
                      }`}
                    >
                      {rev.riskLevel}
                    </span>
                  </td>

                  {/* Assigned Reviewer */}
                  <td className="py-3.5 px-3 text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={rev.assignedReviewer.avatar}
                        alt={rev.assignedReviewer.name}
                        referrerPolicy="no-referrer"
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                      />
                      <span className="truncate">{rev.assignedReviewer.name}</span>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-3.5 px-3 text-right font-mono font-semibold tabular-nums">
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
                  <td className="py-3.5 px-3 text-right">
                    {renderStatus(rev.status)}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/reviews/${rev.id}`)}
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Inspect in Editor"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {rev.status !== 'Approved' && (
                        <button
                          onClick={() => {
                            setActionTarget(rev);
                            setApproveDialogOpen(true);
                          }}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1"
                          title="Approve for publication"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}

                      {rev.status !== 'Changes Requested' && (
                        <button
                          onClick={() => {
                            setActionTarget(rev);
                            setActionComment('Please replace unverified athletic claims and include required brand tagline.');
                            setChangesDialogOpen(true);
                          }}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-[11px] font-semibold transition-colors"
                          title="Request modifications"
                        >
                          Revise
                        </button>
                      )}

                      {rev.status !== 'Rejected' && (
                        <button
                          onClick={() => {
                            setActionTarget(rev);
                            setActionComment('Rejected due to severe non-compliance with brand advertising integrity guidelines.');
                            setRejectDialogOpen(true);
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Reject content"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog 1: Approve */}
      <ConfirmDialog
        isOpen={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleApprove}
        title="Formally Approve Content?"
        description={`Are you sure you want to approve "${actionTarget?.title}"? This clears the content for marketing release and records your signature in the audit log.`}
        confirmLabel="Confirm Approval"
        variant="primary"
      />

      {/* Dialog 2: Request Changes (requires comment) */}
      <ConfirmDialog
        isOpen={changesDialogOpen}
        onClose={() => setChangesDialogOpen(false)}
        onConfirm={handleRequestChanges}
        title="Request Revisions from Creator"
        description={`Provide mandatory feedback explaining the required changes for "${actionTarget?.title}".`}
        confirmLabel="Send Change Request"
        variant="warning"
        inputPrompt={{
          label: 'Required Revisions Comment',
          placeholder: 'Specify what phrases to replace, facts to ground, or tone adjustments required...',
          value: actionComment,
          onChange: setActionComment,
          required: true
        }}
      />

      {/* Dialog 3: Reject (requires reason) */}
      <ConfirmDialog
        isOpen={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleReject}
        title="Reject Content Submission"
        description={`State the governing policy reason for rejecting "${actionTarget?.title}". This permanently flags this version.`}
        confirmLabel="Confirm Rejection"
        variant="danger"
        inputPrompt={{
          label: 'Rejection Reason',
          placeholder: 'Cite the violated brand guideline or legal compliance standard...',
          value: actionComment,
          onChange: setActionComment,
          required: true
        }}
      />
    </div>
  );
};
