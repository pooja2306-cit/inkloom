import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { runSimulatedAnalysis } from '../utils/analyzer';
import { ContentType, ReviewRecord } from '../types';
import { 
  UploadCloud, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  FileUp, 
  X, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';

export const SubmitContent: React.FC = () => {
  const navigate = useNavigate();
  const { user, guidelines, terminology, facts, addReview } = useApp();

  // Form fields
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<ContentType>('Social Media Post');
  const [channel, setChannel] = useState('Instagram');
  const [content, setContent] = useState('');
  const [selectedGuidelineId, setSelectedGuidelineId] = useState(guidelines[0]?.id || 'bg-01');
  const [assignedReviewerName, setAssignedReviewerName] = useState('Pooja Ravi');
  
  // File upload state
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Validation & Progress State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    'Scanning vocabulary against prohibited terminology directory...',
    'Cross-referencing product claims with verified lab certifications...',
    'Auditing brand tone, hyperbole, and confidence metrics...',
    'Checking digital contrast & accessibility specifications...'
  ];

  // Quick fill sample templates for easy hackathon demo
  const loadRiskyTemplate = () => {
    setTitle('Spring Launch Instagram Teaser — Pace Shorts');
    setContentType('Social Media Post');
    setChannel('Instagram');
    setContent('Meet the new Pace Line! The miracle fabric provides guaranteed results on your morning run. Our brand new shorts are 100% eco-friendly and zero carbon, making them the absolute cheapest on the market for ethical athletes. Click the link in bio to shop now!');
    setErrors({});
  };

  const loadCompliantTemplate = () => {
    setTitle('AeroKnit Circular Collection Newsletter');
    setContentType('Marketing Email');
    setChannel('Email / Klaviyo');
    setContent('Designed for everyday comfort, our new AeroKnit™ Fleece delivers breathable warmth with zero compromises. Made with 70% recycled fabric certified under GRS standards, each garment supports cleaner textile cycles while feeling soft against your skin from dawn to dusk.');
    setErrors({});
  };

  // Handle file drop
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setAttachedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'application/pdf'
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'application/pdf'
      });
    }
  };

  // Submit and analyze
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Content title is required';
    if (!content.trim()) newErrors.content = 'Content copy is required for brand analysis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // Start simulated analysis animation
    setIsAnalyzing(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 450);

    setTimeout(() => {
      clearInterval(stepInterval);

      // Run analyzer
      const result = runSimulatedAnalysis(content, {
        contentType,
        channel,
        hasFile: !!attachedFile,
        fileName: attachedFile?.name,
        activeTerminology: terminology,
        activeFacts: facts,
        activeGuidelines: guidelines
      });

      const newReviewRecord: ReviewRecord = {
        id: `REV-${Math.floor(1050 + Math.random() * 900)}`,
        title,
        contentType,
        channel,
        content,
        creator: {
          name: user.name,
          avatar: user.avatar,
          email: user.email
        },
        assignedReviewer: {
          name: assignedReviewerName,
          avatar: assignedReviewerName === 'Pooja Ravi' 
            ? user.avatar 
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          email: `${assignedReviewerName.toLowerCase().replace(' ', '.')}@nexawear.internal`
        },
        submittedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        complianceScore: result.score,
        status: 'Pending Approval',
        riskLevel: result.riskLevel,
        findings: result.findings,
        revision: 1,
        guidelineId: selectedGuidelineId,
        attachedFile: attachedFile || undefined
      };

      addReview(newReviewRecord);
      setIsAnalyzing(false);
      navigate(`/reviews/${newReviewRecord.id}`);
    }, 2000);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Submit Marketing Content
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Analyze campaign copy, marketing emails, and creatives against NexaWear brand standards before publication.
          </p>
        </div>

        {/* Quick Demo Pre-fill Templates */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadRiskyTemplate}
            className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
          >
            Load Sample Flagged Copy
          </button>
          <button
            type="button"
            onClick={loadCompliantTemplate}
            className="px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
          >
            Load Clean Copy
          </button>
        </div>
      </div>

      {/* Analysis In-Progress Overlay Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#7866E8]/10 text-[#7866E8] flex items-center justify-center animate-pulse">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900">
                Running BrandGuard Governance Audit
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Evaluating against NexaWear Brand Guidelines v2.4
              </p>
            </div>

            <div className="space-y-3 text-left">
              {analysisSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  {idx < analysisStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : idx === analysisStep ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#7866E8] border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
                  )}
                  <span
                    className={
                      idx <= analysisStep ? 'text-stone-800 font-medium' : 'text-stone-400'
                    }
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-stone-400 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
              Deterministic rule checking powered by local JavaScript brand governance engine.
            </div>
          </div>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          {/* Content Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Campaign / Content Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Autumn Pace Collection Launch Instagram Teaser"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8]"
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Type & Channel Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Content Format <span className="text-rose-500">*</span>
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8]"
              >
                <option value="Social Media Post">Social Media Post</option>
                <option value="Marketing Email">Marketing Email</option>
                <option value="Product Page">Product Page</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Blog Article">Blog Article</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Distribution Channel <span className="text-rose-500">*</span>
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8]"
              >
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email / Klaviyo">Email / Klaviyo</option>
                <option value="Website / E-commerce">Website / E-commerce</option>
                <option value="Print / Ads">Print / Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>
          </div>

          {/* Content Body Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Marketing Copy / Text <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-stone-400 font-mono tabular-nums">
                {wordCount} words · {charCount} chars
              </span>
            </div>
            <textarea
              rows={8}
              placeholder="Paste or write the draft copy here for brand verification..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8] resize-y leading-relaxed"
            />
            {errors.content && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.content}</span>
              </p>
            )}
          </div>

          {/* Drag & Drop File Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Creative Asset / Document (Optional)
            </label>

            {!attachedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-[#7866E8] bg-[#7866E8]/5'
                    : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-stone-700">
                  Drag & drop campaign creatives or PDF documents here
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Supports JPG, PNG, WEBP, or PDF
                </p>
                <label className="mt-3 inline-block">
                  <span className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-xs font-medium text-stone-700 cursor-pointer shadow-2xs">
                    Browse files
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <FileUp className="w-5 h-5 text-[#7866E8] shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-medium text-stone-900 truncate">
                      {attachedFile.name}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono tabular-nums">
                      {attachedFile.size} · {attachedFile.type}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                  aria-label="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-[11px] text-stone-500 mt-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>
                Demo mode: File metadata is checked for digital accessibility; visual inspections use simulated verification parameters.
              </span>
            </p>
          </div>

          {/* Governance Rules & Reviewer Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Brand Guideline Version
              </label>
              <select
                value={selectedGuidelineId}
                onChange={(e) => setSelectedGuidelineId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
              >
                {guidelines.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Assigned Brand Reviewer
              </label>
              <select
                value={assignedReviewerName}
                onChange={(e) => setAssignedReviewerName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
              >
                <option value="Pooja Ravi">Pooja Ravi (Lead Brand Governance)</option>
                <option value="Marcus Vance">Marcus Vance (VP Operations)</option>
                <option value="Elena Rostova">Elena Rostova (Senior Content Strategist)</option>
                <option value="Dr. Liam Thorne">Dr. Liam Thorne (Sustainability Lead)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/reviews')}
            className="px-5 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7866E8] hover:bg-[#6855d9] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyse Content</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
