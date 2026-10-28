import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { 
  ArrowLeft, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  Edit3, 
  XCircle, 
  BookOpen, 
  AlertTriangle, 
  Save, 
  Send, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  History,
  ExternalLink
} from 'lucide-react';
import { Finding, Severity } from '../types';

export const ReviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    reviews, 
    guidelines, 
    facts, 
    updateReviewContent, 
    applyFindingFix, 
    updateFindingSuggestion, 
    dismissFinding, 
    updateReviewStatus,
    addToast 
  } = useApp();

  const review = reviews.find((r) => r.id === id);

  // Local editor content
  const [editableContent, setEditableContent] = useState('');
  const [activeFindingFocusId, setActiveFindingFocusId] = useState<string | null>(null);

  // Modals state
  const [editSuggestionModal, setEditSuggestionModal] = useState<{
    isOpen: boolean;
    findingId: string;
    originalText: string;
    currentSuggestion: string;
  }>({
    isOpen: false,
    findingId: '',
    originalText: '',
    currentSuggestion: ''
  });

  const [dismissModal, setDismissModal] = useState<{
    isOpen: boolean;
    findingId: string;
    reason: string;
  }>({
    isOpen: false,
    findingId: '',
    reason: 'Approved by legal team for this regional campaign'
  });

  const [evidenceModal, setEvidenceModal] = useState<{
    isOpen: boolean;
    title: string;
    category: string;
    details: string;
    source: string;
    verifiedBy?: string;
  }>({
    isOpen: false,
    title: '',
    category: '',
    details: '',
    source: '',
  });

  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);

  // Synchronize local content with review record
  useEffect(() => {
    if (review) {
      setEditableContent(review.content);
    }
  }, [review]);

  if (!review) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
        <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-stone-900">Review Record Not Found</h2>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          The requested review record "{id}" does not exist in local data.
        </p>
        <Link
          to="/reviews"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7866E8] text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reviews</span>
        </Link>
      </div>
    );
  }

  // Active findings vs applied/dismissed
  const activeFindings = review.findings.filter((f) => f.status === 'active');
  const resolvedFindings = review.findings.filter((f) => f.status !== 'active');

  const severityCounts = {
    Critical: review.findings.filter((f) => f.severity === 'Critical' && f.status === 'active').length,
    High: review.findings.filter((f) => f.severity === 'High' && f.status === 'active').length,
    Medium: review.findings.filter((f) => f.severity === 'Medium' && f.status === 'active').length,
    Low: review.findings.filter((f) => f.severity === 'Low' && f.status === 'active').length,
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    updateReviewContent(review.id, editableContent);
  };

  // Handle Submit for Approval
  const handleConfirmSubmit = () => {
    updateReviewContent(review.id, editableContent);
    updateReviewStatus(review.id, 'Pending Approval', 'Submitted with revisions applied.');
    addToast('Submitted for Approval', `"${review.title}" is queued for human review.`, 'success');
  };

  // Handle Open Evidence Modal
  const handleOpenEvidence = (finding: Finding) => {
    // Try to locate linked guideline or fact
    const matchedFact = facts.find((f) => f.id === finding.ruleReferenceId || finding.supportingEvidence.includes(f.id));
    const matchedGuideline = guidelines.find((g) => g.id === finding.ruleReferenceId || finding.supportingEvidence.includes(g.id));

    if (matchedFact) {
      setEvidenceModal({
        isOpen: true,
        title: matchedFact.productName,
        category: 'Approved Product Claim & Lab Certification',
        details: matchedFact.verifiedClaim,
        source: matchedFact.supportingSource,
        verifiedBy: matchedFact.verifiedBy
      });
    } else if (matchedGuideline) {
      setEvidenceModal({
        isOpen: true,
        title: matchedGuideline.title,
        category: `Brand Guideline (${matchedGuideline.category})`,
        details: matchedGuideline.summary,
        source: `NexaWear Brand Manual · ${matchedGuideline.rules.join(' ')}`,
        verifiedBy: 'Brand Governance Council'
      });
    } else {
      setEvidenceModal({
        isOpen: true,
        title: `${finding.category} Standard`,
        category: 'Official Brand Governance Rule',
        details: finding.explanation,
        source: finding.supportingEvidence,
        verifiedBy: 'NexaWear Compliance Directorate'
      });
    }
  };

  // Function to render highlighted content preview
  const renderHighlightedContent = () => {
    let result = editableContent;
    if (!result) return null;

    // Build array of active findings with matches in content
    const highlights: { text: string; severity: Severity; id: string }[] = [];
    activeFindings.forEach((f) => {
      if (result.toLowerCase().includes(f.affectedText.toLowerCase())) {
        highlights.push({
          text: f.affectedText,
          severity: f.severity,
          id: f.id,
        });
      }
    });

    if (highlights.length === 0) {
      return (
        <div className="p-4 bg-stone-50/50 rounded-xl border border-stone-200 text-stone-800 text-sm leading-relaxed whitespace-pre-wrap">
          {editableContent}
        </div>
      );
    }

    // Split and highlight
    // Create regex matching any of the highlight strings
    const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);
    const escapedTerms = sortedHighlights.map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escapedTerms})`, 'gi');

    const parts = result.split(regex);

    return (
      <div className="p-4 bg-stone-50/50 rounded-xl border border-stone-200 text-stone-800 text-sm leading-relaxed whitespace-pre-wrap">
        {parts.map((part, i) => {
          const match = highlights.find((h) => h.text.toLowerCase() === part.toLowerCase());
          if (match) {
            const isFocused = activeFindingFocusId === match.id;
            const bgClass =
              match.severity === 'Critical'
                ? 'bg-rose-100 text-rose-900 border-b-2 border-rose-500'
                : match.severity === 'High'
                ? 'bg-amber-100 text-amber-900 border-b-2 border-amber-500'
                : 'bg-indigo-100 text-indigo-900 border-b-2 border-[#7866E8]';

            return (
              <mark
                key={i}
                onClick={() => {
                  setActiveFindingFocusId(match.id);
                  const el = document.getElementById(`finding-${match.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`cursor-pointer px-1 py-0.5 rounded-sm font-medium transition-all ${bgClass} ${
                  isFocused ? 'ring-2 ring-[#7866E8] ring-offset-1' : ''
                }`}
                title={`Click to view ${match.severity} finding`}
              >
                {part}
              </mark>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'Critical':
        return <span className="text-rose-700 font-semibold text-xs">Critical</span>;
      case 'High':
        return <span className="text-amber-700 font-semibold text-xs">High</span>;
      case 'Medium':
        return <span className="text-indigo-700 font-semibold text-xs">Medium</span>;
      default:
        return <span className="text-teal-700 font-semibold text-xs">Low</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/reviews')}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Back to Reviews"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-400 font-semibold">
                {review.id}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">
                Revision <strong className="font-mono">{review.revision}</strong>
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-500">{review.channel}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-0.5">
              {review.title}
            </h1>
          </div>
        </div>

        {/* Global Review Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-4 h-4 text-stone-500" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => setSubmitConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#7866E8] hover:bg-[#6855d9] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit for Approval</span>
          </button>
        </div>
      </div>

      {/* Compliance Score Bar & Advisory Notice */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Score & Health Indicator */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-center min-w-[80px]">
              <span className="block text-2xl font-extrabold tracking-tight font-mono tabular-nums text-stone-900">
                {review.complianceScore}%
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                Score
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">
                  {review.complianceScore >= 85 ? 'Compliance Verified' : 'Compliance Action Required'}
                </h3>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs font-medium text-stone-600">
                  Status: <strong>{review.status}</strong>
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {activeFindings.length === 0
                  ? 'All automated brand rules have been satisfied.'
                  : `${activeFindings.length} issues flagged against brand voice and legal claims.`}
              </p>
            </div>
          </div>

          {/* Severity Breakdown Counts */}
          <div className="flex items-center gap-3 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100 self-start md:self-auto">
            <div className="flex items-center gap-1.5 px-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-stone-600">Critical:</span>
              <span className="font-mono font-semibold tabular-nums text-stone-900">{severityCounts.Critical}</span>
            </div>
            <div className="w-px h-4 bg-stone-200" />
            <div className="flex items-center gap-1.5 px-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-stone-600">High:</span>
              <span className="font-mono font-semibold tabular-nums text-stone-900">{severityCounts.High}</span>
            </div>
            <div className="w-px h-4 bg-stone-200" />
            <div className="flex items-center gap-1.5 px-2">
              <span className="w-2 h-2 rounded-full bg-[#7866E8]" />
              <span className="text-stone-600">Medium:</span>
              <span className="font-mono font-semibold tabular-nums text-stone-900">{severityCounts.Medium}</span>
            </div>
          </div>
        </div>

        {/* Clear Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-xs text-indigo-900">
          <Info className="w-4 h-4 text-[#7866E8] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Explainable Governance Note:</strong> Automated findings are rule-based recommendations for human review, not final publishing decisions. Every suggestion can be refined, accepted, or dismissed with business justification.
          </p>
        </div>
      </div>

      {/* Two-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Content Editor & Visual Highlighting (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-500" />
                <h3 className="text-sm font-bold text-stone-900">
                  Content Editor & Passage Highlights
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono tabular-nums">
                {editableContent.length} chars · {editableContent.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Interactive Highlight Passage Preview */}
            <div>
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Passage Visual Inspection</span>
                <span className="text-stone-400 font-normal">Click marked text to focus finding</span>
              </div>
              {renderHighlightedContent()}
            </div>

            {/* Editable Content Textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Direct Content Editor
              </label>
              <textarea
                rows={9}
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full p-4 text-sm bg-stone-50/40 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8] leading-relaxed resize-y font-normal"
                placeholder="Content copy..."
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span>Created by:</span>
                <strong className="text-stone-800">{review.creator.name}</strong>
              </div>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="text-[#7866E8] hover:underline font-semibold"
              >
                Update Draft Copy
              </button>
            </div>
          </div>

          {/* Attached Creative Asset / File Card (if present) */}
          {review.attachedFile && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-3">
                Attached Creative Asset
              </h4>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#7866E8]" />
                  <div>
                    <p className="text-xs font-semibold text-stone-900">{review.attachedFile.name}</p>
                    <p className="text-[11px] text-stone-500 font-mono tabular-nums">
                      {review.attachedFile.size} · {review.attachedFile.type}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Contrast Verified
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Findings Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>Detected Findings</span>
              <span className="text-xs font-mono tabular-nums text-stone-500">
                ({activeFindings.length} active)
              </span>
            </h3>
            {resolvedFindings.length > 0 && (
              <span className="text-xs text-stone-400">
                {resolvedFindings.length} resolved
              </span>
            )}
          </div>

          {/* Active Findings List */}
          {activeFindings.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-emerald-200 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-stone-900">Zero Active Violations</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                All identified terminology, claims, and tone issues have been resolved. This draft is ready for approval.
              </p>
              <button
                onClick={() => setSubmitConfirmOpen(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Send to Approval Queue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeFindings.map((finding) => {
                const isFocused = activeFindingFocusId === finding.id;

                const borderAccent =
                  finding.severity === 'Critical'
                    ? 'border-rose-200 hover:border-rose-300'
                    : finding.severity === 'High'
                    ? 'border-amber-200 hover:border-amber-300'
                    : 'border-stone-200 hover:border-[#7866E8]/40';

                return (
                  <div
                    key={finding.id}
                    id={`finding-${finding.id}`}
                    className={`bg-white p-5 rounded-2xl border ${borderAccent} shadow-xs transition-all ${
                      isFocused ? 'ring-2 ring-[#7866E8] shadow-md' : ''
                    }`}
                  >
                    {/* Header: Category & Severity */}
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-stone-100">
                      <div>
                        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                          {finding.category}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {getSeverityBadge(finding.severity)}
                          <span className="text-stone-300">·</span>
                          <span className="text-[11px] text-stone-400 font-mono tabular-nums">
                            {finding.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenEvidence(finding)}
                        className="text-[11px] font-semibold text-[#7866E8] hover:underline flex items-center gap-1 shrink-0"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Evidence</span>
                      </button>
                    </div>

                    {/* Affected Text */}
                    <div className="my-3 p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">
                        Flagged Text
                      </span>
                      <p className="text-xs font-mono text-stone-900 font-medium">
                        "{finding.affectedText}"
                      </p>
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-stone-600 leading-relaxed mb-3">
                      {finding.explanation}
                    </p>

                    {/* Suggested Correction Box */}
                    <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100/80 mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider">
                          Suggested Approved Phrasing
                        </span>
                        <button
                          onClick={() =>
                            setEditSuggestionModal({
                              isOpen: true,
                              findingId: finding.id,
                              originalText: finding.affectedText,
                              currentSuggestion: finding.suggestedCorrection
                            })
                          }
                          className="text-[11px] text-[#7866E8] hover:underline flex items-center gap-1 font-medium"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-teal-950 font-mono">
                        "{finding.suggestedCorrection}"
                      </p>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() =>
                          setDismissModal({
                            isOpen: true,
                            findingId: finding.id,
                            reason: 'Context exception verified by marketing team'
                          })
                        }
                        className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Dismiss</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => applyFindingFix(review.id, finding.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7866E8] hover:bg-[#6855d9] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply Fix</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Resolved Findings Accordion / Section */}
          {resolvedFindings.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                Resolved in Current Revision ({resolvedFindings.length})
              </span>
              {resolvedFindings.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-600"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {f.status === 'applied' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                    <span className="line-through truncate">"{f.affectedText}"</span>
                  </div>
                  <span className="text-[11px] font-medium text-stone-500 uppercase tabular-nums">
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Edit Suggestion Modal */}
      <Modal
        isOpen={editSuggestionModal.isOpen}
        onClose={() => setEditSuggestionModal((prev) => ({ ...prev, isOpen: false }))}
        title="Customise Suggested Correction"
        subtitle={`Adjust replacement text for "${editSuggestionModal.originalText}"`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Correction String
            </label>
            <input
              type="text"
              value={editSuggestionModal.currentSuggestion}
              onChange={(e) =>
                setEditSuggestionModal((prev) => ({
                  ...prev,
                  currentSuggestion: e.target.value
                }))
              }
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              onClick={() => setEditSuggestionModal((prev) => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                updateFindingSuggestion(
                  review.id,
                  editSuggestionModal.findingId,
                  editSuggestionModal.currentSuggestion
                );
                setEditSuggestionModal((prev) => ({ ...prev, isOpen: false }));
              }}
              className="px-4 py-2 text-xs font-semibold bg-[#7866E8] hover:bg-[#6855d9] text-white rounded-lg shadow-2xs"
            >
              Save Suggestion
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal 2: Dismiss Finding Modal with Reason */}
      <Modal
        isOpen={dismissModal.isOpen}
        onClose={() => setDismissModal((prev) => ({ ...prev, isOpen: false }))}
        title="Dismiss Brand Policy Finding"
        subtitle="Provide an explanation for the audit trail before bypassing this rule."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Reason for Dismissal <span className="text-rose-500">*</span>
            </label>
            <select
              value={dismissModal.reason}
              onChange={(e) => setDismissModal((prev) => ({ ...prev, reason: e.target.value }))}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7866E8] mb-2"
            >
              <option value="Approved by legal team for this regional campaign">
                Approved by legal team for this regional campaign
              </option>
              <option value="Contextual creative quote from external partner">
                Contextual creative quote from external partner
              </option>
              <option value="False positive based on semantic context">
                False positive based on semantic context
              </option>
              <option value="Temporary launch variance authorized by VP">
                Temporary launch variance authorized by VP
              </option>
            </select>
            <textarea
              rows={2}
              value={dismissModal.reason}
              onChange={(e) => setDismissModal((prev) => ({ ...prev, reason: e.target.value }))}
              className="w-full p-2.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 resize-none"
              placeholder="Or write custom justification..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              onClick={() => setDismissModal((prev) => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                dismissFinding(review.id, dismissModal.findingId, dismissModal.reason);
                setDismissModal((prev) => ({ ...prev, isOpen: false }));
              }}
              className="px-4 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-2xs"
            >
              Confirm Dismissal
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal 3: View Evidence Modal */}
      <Modal
        isOpen={evidenceModal.isOpen}
        onClose={() => setEvidenceModal((prev) => ({ ...prev, isOpen: false }))}
        title={evidenceModal.title}
        subtitle={evidenceModal.category}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
              Governing Brand Requirement
            </span>
            <p className="text-xs text-stone-800 leading-relaxed font-medium">
              {evidenceModal.details}
            </p>
          </div>

          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-teal-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#25A99A]" />
              <span>Verified Supporting Evidence</span>
            </div>
            <p className="text-teal-800 font-mono text-[11px]">
              {evidenceModal.source}
            </p>
            {evidenceModal.verifiedBy && (
              <p className="text-[10px] text-teal-700">
                Authorized signatory: {evidenceModal.verifiedBy}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-3 border-t border-stone-100">
            <button
              onClick={() => setEvidenceModal((prev) => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg"
            >
              Close Evidence Inspector
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog: Submit for Approval */}
      <ConfirmDialog
        isOpen={submitConfirmOpen}
        onClose={() => setSubmitConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit Content for Human Approval?"
        description={`This will send "${review.title}" with current score of ${review.complianceScore}% to the BrandGuard Approval Queue.`}
        confirmLabel="Submit to Queue"
        variant="primary"
      />
    </div>
  );
};
