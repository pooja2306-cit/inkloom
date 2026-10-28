import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { 
  Building2, 
  User, 
  Bell, 
  Sliders, 
  ShieldCheck, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, settings, updateSettings, resetAllDemoData } = useApp();

  // Local settings form state
  const [formData, setFormData] = useState({
    workspaceName: settings.workspaceName,
    workspaceDescription: settings.workspaceDescription,
    defaultReviewer: settings.defaultReviewer,
    strictnessMode: settings.strictnessMode,
    emailNotifications: settings.emailNotifications,
    weeklyDigest: settings.weeklyDigest,
    complianceScoreThreshold: settings.complianceScoreThreshold,
  });

  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Configure governance policy parameters, reviewer assignments, and demo data states.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#7866E8] hover:bg-[#6855d9] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Workspace Profile */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Building2 className="w-4 h-4 text-[#7866E8]" />
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Workspace Profile
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={formData.workspaceName}
                onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Workspace Purpose & Brand Scope
              </label>
              <textarea
                rows={2}
                value={formData.workspaceDescription}
                onChange={(e) => setFormData({ ...formData, workspaceDescription: e.target.value })}
                className="w-full p-3 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: User Profile */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <User className="w-4 h-4 text-[#25A99A]" />
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Governance Lead Profile
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#7866E8]/30 shadow-xs"
            />
            <div>
              <h4 className="text-sm font-bold text-stone-900">{user.name}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{user.role}</p>
              <p className="text-xs text-stone-400 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Review & Governance Engine Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Sliders className="w-4 h-4 text-stone-700" />
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Governance Engine Calibration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Policy Strictness Mode
              </label>
              <select
                value={formData.strictnessMode}
                onChange={(e) => setFormData({ ...formData, strictnessMode: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
              >
                <option value="Strict">Strict (Block on any unverified claim or tone deviation)</option>
                <option value="Balanced">Balanced (Standard compliance with warning advisory)</option>
                <option value="Lenient">Lenient (Block only legal warranty violations)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Minimum Clearance Score (%)
              </label>
              <input
                type="number"
                min={50}
                max={99}
                value={formData.complianceScoreThreshold}
                onChange={(e) => setFormData({ ...formData, complianceScoreThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Notification Preferences */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Bell className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Governance Alerts & Notifications
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50/60 border border-stone-100 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-stone-900 block">
                  Real-time Email Alerts for Critical Violations
                </span>
                <span className="text-[11px] text-stone-500">
                  Notify assigned lead immediately when a critical legal claim is flagged.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-[#7866E8] focus:ring-[#7866E8]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50/60 border border-stone-100 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-stone-900 block">
                  Weekly Brand Health Digest
                </span>
                <span className="text-[11px] text-stone-500">
                  Summary email covering weekly review turnaround and frequent policy triggers.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.weeklyDigest}
                onChange={(e) => setFormData({ ...formData, weeklyDigest: e.target.checked })}
                className="w-4 h-4 rounded text-[#7866E8] focus:ring-[#7866E8]"
              />
            </label>
          </div>
        </div>

        {/* Section 5: Demo Data Management */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Demo Data & Storage Management
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/40 border border-rose-100">
            <div>
              <h4 className="text-xs font-bold text-stone-900">
                Reset All Local Storage Demo Records
              </h4>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Restores original sample reviews, guidelines, approved facts, and activity log to seed state.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResetDialogOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Dialog: Reset Demo Data */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={resetAllDemoData}
        title="Reset All Demo Data?"
        description="This will clear your local edits, custom findings, and added guidelines, restoring the original NexaWear BrandGuard demonstration dataset."
        confirmLabel="Reset Everything"
        variant="danger"
      />
    </div>
  );
};
