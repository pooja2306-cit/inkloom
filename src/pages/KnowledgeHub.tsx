import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { 
  BookMarked, 
  FileCheck2, 
  BookOpen, 
  Palette, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Type,
  Image as ImageIcon
} from 'lucide-react';
import { BrandGuideline, ApprovedFact, TerminologyRule } from '../types';

export const KnowledgeHub: React.FC = () => {
  const { 
    guidelines, 
    addGuideline, 
    updateGuideline, 
    deleteGuideline,
    facts, 
    addFact, 
    updateFact, 
    deleteFact,
    terminology, 
    addTerminologyRule, 
    updateTerminologyRule, 
    deleteTerminologyRule,
    assets,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'guidelines' | 'facts' | 'terminology' | 'assets'>('guidelines');

  // Guideline Modal State
  const [guidelineModal, setGuidelineModal] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    id?: string;
    title: string;
    category: BrandGuideline['category'];
    summary: string;
    rulesText: string;
  }>({
    isOpen: false,
    isEditing: false,
    title: '',
    category: 'Voice & Tone',
    summary: '',
    rulesText: '',
  });

  // Fact Modal State
  const [factModal, setFactModal] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    id?: string;
    productName: string;
    approvedDescription: string;
    verifiedClaim: string;
    supportingSource: string;
    verifiedBy: string;
  }>({
    isOpen: false,
    isEditing: false,
    productName: '',
    approvedDescription: '',
    verifiedClaim: '',
    supportingSource: '',
    verifiedBy: 'Dr. Liam Thorne, Sustainability Lead',
  });

  // Terminology Modal State
  const [termModal, setTermModal] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    id?: string;
    type: 'required' | 'prohibited';
    term: string;
    preferredAlternative: string;
    category: string;
    severity: TerminologyRule['severity'];
    reason: string;
  }>({
    isOpen: false,
    isEditing: false,
    type: 'prohibited',
    term: '',
    preferredAlternative: '',
    category: 'Legal & Compliance',
    severity: 'High',
    reason: '',
  });

  // Delete Confirm Dialog State
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'guideline' | 'fact' | 'terminology';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'guideline',
    id: '',
    title: '',
  });

  // Color Swatch copy state
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    addToast('Copied to Clipboard', `Hex color code ${hex} copied.`, 'info');
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Guideline Save
  const handleSaveGuideline = (e: React.FormEvent) => {
    e.preventDefault();
    const rules = guidelineModal.rulesText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    if (guidelineModal.isEditing && guidelineModal.id) {
      updateGuideline(guidelineModal.id, {
        title: guidelineModal.title,
        category: guidelineModal.category,
        summary: guidelineModal.summary,
        rules: rules.length > 0 ? rules : ['Standard compliance rule applies.']
      });
    } else {
      addGuideline({
        title: guidelineModal.title,
        category: guidelineModal.category,
        summary: guidelineModal.summary,
        rules: rules.length > 0 ? rules : ['Standard compliance rule applies.']
      });
    }
    setGuidelineModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Fact Save
  const handleSaveFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (factModal.isEditing && factModal.id) {
      updateFact(factModal.id, {
        productName: factModal.productName,
        approvedDescription: factModal.approvedDescription,
        verifiedClaim: factModal.verifiedClaim,
        supportingSource: factModal.supportingSource,
        verifiedBy: factModal.verifiedBy
      });
    } else {
      addFact({
        productName: factModal.productName,
        approvedDescription: factModal.approvedDescription,
        verifiedClaim: factModal.verifiedClaim,
        supportingSource: factModal.supportingSource,
        verifiedBy: factModal.verifiedBy
      });
    }
    setFactModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Terminology Save
  const handleSaveTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (termModal.isEditing && termModal.id) {
      updateTerminologyRule(termModal.id, {
        type: termModal.type,
        term: termModal.term,
        preferredAlternative: termModal.preferredAlternative || undefined,
        category: termModal.category,
        severity: termModal.severity,
        reason: termModal.reason
      });
    } else {
      addTerminologyRule({
        type: termModal.type,
        term: termModal.term,
        preferredAlternative: termModal.preferredAlternative || undefined,
        category: termModal.category,
        severity: termModal.severity,
        reason: termModal.reason
      });
    }
    setTermModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (deleteDialog.type === 'guideline') {
      deleteGuideline(deleteDialog.id);
    } else if (deleteDialog.type === 'fact') {
      deleteFact(deleteDialog.id);
    } else if (deleteDialog.type === 'terminology') {
      deleteTerminologyRule(deleteDialog.id);
    }
    setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Brand Knowledge Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Maintain the single source of truth for NexaWear brand standards, lab-verified claims, and terminology.
          </p>
        </div>

        {/* Tab-specific primary action */}
        {activeTab === 'guidelines' && (
          <button
            onClick={() =>
              setGuidelineModal({
                isOpen: true,
                isEditing: false,
                title: '',
                category: 'Voice & Tone',
                summary: '',
                rulesText: ''
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#7866E8] hover:bg-[#6855d9] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guideline</span>
          </button>
        )}
        {activeTab === 'facts' && (
          <button
            onClick={() =>
              setFactModal({
                isOpen: true,
                isEditing: false,
                productName: '',
                approvedDescription: '',
                verifiedClaim: '',
                supportingSource: '',
                verifiedBy: 'Dr. Liam Thorne, Sustainability Lead'
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25A99A] hover:bg-[#1f8c7f] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Approved Fact</span>
          </button>
        )}
        {activeTab === 'terminology' && (
          <button
            onClick={() =>
              setTermModal({
                isOpen: true,
                isEditing: false,
                type: 'prohibited',
                term: '',
                preferredAlternative: '',
                category: 'Legal & Compliance',
                severity: 'High',
                reason: ''
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Term Rule</span>
          </button>
        )}
      </div>

      {/* Segmented Tab Controls (Strict anti-pill / functional tab buttons) */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-xl max-w-fit">
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'guidelines'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#7866E8]" />
          <span>Brand Guidelines ({guidelines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('facts')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'facts'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#25A99A]" />
          <span>Approved Facts ({facts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('terminology')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'terminology'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-stone-700" />
          <span>Terminology ({terminology.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'assets'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-indigo-500" />
          <span>Brand Assets</span>
        </button>
      </div>

      {/* TAB 1: Brand Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidelines.map((g) => (
            <div
              key={g.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[11px] font-semibold text-[#7866E8] uppercase tracking-wider block">
                      {g.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                      {g.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setGuidelineModal({
                          isOpen: true,
                          isEditing: true,
                          id: g.id,
                          title: g.title,
                          category: g.category,
                          summary: g.summary,
                          rulesText: g.rules.join('\n')
                        })
                      }
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                      aria-label="Edit guideline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          type: 'guideline',
                          id: g.id,
                          title: g.title
                        })
                      }
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                      aria-label="Delete guideline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-600 my-3 leading-relaxed">
                  {g.summary}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                    Enforced Directives
                  </span>
                  {g.rules.map((rule, idx) => (
                    <div key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                      <span className="text-stone-400 font-mono text-[11px] mt-0.5">0{idx + 1}.</span>
                      <span className="leading-snug">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span className="font-mono">{g.id}</span>
                <span>Updated: {g.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Approved Facts */}
      {activeTab === 'facts' && (
        <div className="space-y-4">
          <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100 text-xs text-teal-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#25A99A] shrink-0" />
            <div>
              <strong className="block font-semibold">Evidence-Based Fact Grounding:</strong>
              Every commercial claim made in marketing must match a verified entry in this repository. Claims not grounded in this table trigger automatic governance alerts during content analysis.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Product / Initiative</th>
                    <th className="py-3 px-3">Approved Description</th>
                    <th className="py-3 px-3">Verified Claim</th>
                    <th className="py-3 px-3">Supporting Source</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {facts.map((fact) => (
                    <tr key={fact.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-stone-900 max-w-[200px]">
                        <div>{fact.productName}</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">{fact.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-stone-600 max-w-[260px] leading-relaxed">
                        {fact.approvedDescription}
                      </td>
                      <td className="py-3.5 px-3 text-emerald-800 font-medium max-w-[260px] leading-relaxed">
                        {fact.verifiedClaim}
                      </td>
                      <td className="py-3.5 px-3 text-stone-500 font-mono text-[11px] max-w-[220px]">
                        <div>{fact.supportingSource}</div>
                        <div className="text-[10px] text-stone-400 font-sans mt-0.5">{fact.verifiedBy}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              setFactModal({
                                isOpen: true,
                                isEditing: true,
                                id: fact.id,
                                productName: fact.productName,
                                approvedDescription: fact.approvedDescription,
                                verifiedClaim: fact.verifiedClaim,
                                supportingSource: fact.supportingSource,
                                verifiedBy: fact.verifiedBy
                              })
                            }
                            className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                            aria-label="Edit fact"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                type: 'fact',
                                id: fact.id,
                                title: fact.productName
                              })
                            }
                            className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                            aria-label="Delete fact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Terminology */}
      {activeTab === 'terminology' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Phrases Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#25A99A]" />
                  <span>Required Phrases & Marks</span>
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {terminology.filter((t) => t.type === 'required').length} rules
                </span>
              </div>

              {terminology
                .filter((t) => t.type === 'required')
                .map((term) => (
                  <div
                    key={term.id}
                    className="p-4 bg-white rounded-2xl border border-teal-200/80 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-stone-900 font-mono">
                          "{term.term}"
                        </span>
                        <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                          {term.category} · {term.severity}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setTermModal({
                              isOpen: true,
                              isEditing: true,
                              id: term.id,
                              type: term.type,
                              term: term.term,
                              preferredAlternative: term.preferredAlternative || '',
                              category: term.category,
                              severity: term.severity,
                              reason: term.reason
                            })
                          }
                          className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              isOpen: true,
                              type: 'terminology',
                              id: term.id,
                              title: term.term
                            })
                          }
                          className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {term.reason}
                    </p>
                  </div>
                ))}
            </div>

            {/* Prohibited Terms Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Prohibited Terms & Replacements</span>
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {terminology.filter((t) => t.type === 'prohibited').length} rules
                </span>
              </div>

              {terminology
                .filter((t) => t.type === 'prohibited')
                .map((term) => (
                  <div
                    key={term.id}
                    className="p-4 bg-white rounded-2xl border border-rose-200/80 shadow-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-rose-950 font-mono line-through">
                          "{term.term}"
                        </span>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {term.category} · <span className="text-rose-700 font-semibold">{term.severity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setTermModal({
                              isOpen: true,
                              isEditing: true,
                              id: term.id,
                              type: term.type,
                              term: term.term,
                              preferredAlternative: term.preferredAlternative || '',
                              category: term.category,
                              severity: term.severity,
                              reason: term.reason
                            })
                          }
                          className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              isOpen: true,
                              type: 'terminology',
                              id: term.id,
                              title: term.term
                            })
                          }
                          className="p-1 text-stone-400 hover:text-rose-600 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {term.preferredAlternative && (
                      <div className="p-2 bg-stone-50 rounded-lg text-xs font-mono text-stone-800">
                        <span className="text-stone-400 font-sans text-[10px] block uppercase font-semibold">
                          Preferred Alternative:
                        </span>
                        "{term.preferredAlternative}"
                      </div>
                    )}

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {term.reason}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Brand Assets */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          {/* Color Swatches Grid */}
          <div>
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
              Core Brand Palette
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {assets
                .filter((a) => a.type === 'Colour Swatch')
                .map((swatch) => (
                  <div
                    key={swatch.id}
                    className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className="h-24 rounded-xl border border-black/10 shadow-inner mb-3 flex items-end p-2.5"
                        style={{ backgroundColor: swatch.meta.hex }}
                      >
                        <span className="text-[11px] font-mono text-white font-semibold drop-shadow-sm">
                          {swatch.meta.role}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900">{swatch.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                        {swatch.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-stone-800">
                        {swatch.meta.hex}
                      </span>
                      <button
                        onClick={() => handleCopyHex(swatch.meta.hex)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedHex === swatch.meta.hex ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedHex === swatch.meta.hex ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Typography Specifications */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#7866E8]" />
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Approved Typography System
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-stone-50/60 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Primary Brand Face (Display & Body)
                </span>
                <p className="text-xl font-bold text-stone-900 tracking-tight">
                  Plus Jakarta Sans
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Used across digital campaign headers, marketing body copy, and UI controls. Clean neo-grotesque clarity with balanced human geometry.
                </p>
                <div className="pt-2 text-xs text-stone-500 font-medium">
                  Weights: Regular (400), SemiBold (600), Bold (700)
                </div>
              </div>

              <div className="p-4 bg-stone-50/60 rounded-xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Data & Telemetry Face
                </span>
                <p className="text-xl font-bold text-stone-900 font-mono tracking-tight">
                  JetBrains Mono
                </p>
                <p className="text-xs text-stone-600 leading-relaxed font-mono">
                  Enforces tabular numerals, audit timestamps, certification IDs, and material percentages without vertical layout jitter.
                </p>
                <div className="pt-2 text-xs text-stone-500 font-mono">
                  GRS-77291-B · 70% RECYCLED · 2026-10-28
                </div>
              </div>
            </div>
          </div>

          {/* Approved Visual Assets & Campaign Imagery */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#25A99A]" />
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Verified Campaign Creative Assets
                </h3>
              </div>
              <span className="text-xs text-stone-400">
                Certified high-contrast compositions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-4/3 bg-stone-100 shadow-xs">
                <img
                  src="/src/assets/images/nexawear_campaign_asset_1793190738958.jpg"
                  alt="NexaWear Autumn Sustainability Collection Flatlay"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                  Official Flatlay Reference
                </div>
                <h4 className="text-base font-bold text-stone-900">
                  NexaWear Autumn Sustainability Collection Preview
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Verified flatlay showcasing AeroKnit recycled fabric textures, natural earth pigments, and reusable packaging. Approved for global digital ad distribution, social teasers, and lookbooks.
                </p>
                <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span>Aspect Ratio:</span>
                    <strong className="font-mono">4:3</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Accessibility Contrast:</span>
                    <strong className="text-emerald-700">Verified &gt; 4.5:1</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alt Text Status:</span>
                    <strong className="text-stone-800">Standard Provided</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Brand Guideline */}
      <Modal
        isOpen={guidelineModal.isOpen}
        onClose={() => setGuidelineModal((prev) => ({ ...prev, isOpen: false }))}
        title={guidelineModal.isEditing ? 'Edit Brand Guideline' : 'Create New Brand Guideline'}
        subtitle="Define governance directives enforced by automated scanners."
      >
        <form onSubmit={handleSaveGuideline} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Guideline Title
            </label>
            <input
              type="text"
              required
              value={guidelineModal.title}
              onChange={(e) => setGuidelineModal((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Regional Environmental Claim Guidelines"
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Category
            </label>
            <select
              value={guidelineModal.category}
              onChange={(e) =>
                setGuidelineModal((prev) => ({
                  ...prev,
                  category: e.target.value as BrandGuideline['category']
                }))
              }
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
            >
              <option value="Voice & Tone">Voice & Tone</option>
              <option value="Writing Style">Writing Style</option>
              <option value="Colour Palette">Colour Palette</option>
              <option value="Typography">Typography</option>
              <option value="Logo Usage">Logo Usage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Summary Description
            </label>
            <textarea
              rows={3}
              required
              value={guidelineModal.summary}
              onChange={(e) => setGuidelineModal((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="Explain the overarching purpose of this guideline..."
              className="w-full p-2.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Enforced Directives (One rule per line)
            </label>
            <textarea
              rows={4}
              value={guidelineModal.rulesText}
              onChange={(e) => setGuidelineModal((prev) => ({ ...prev, rulesText: e.target.value }))}
              placeholder="Rule 1: Always include...\nRule 2: Avoid using..."
              className="w-full p-2.5 text-xs font-mono border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7866E8]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setGuidelineModal((prev) => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#7866E8] hover:bg-[#6855d9] text-white rounded-lg"
            >
              Save Guideline
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Approved Fact */}
      <Modal
        isOpen={factModal.isOpen}
        onClose={() => setFactModal((prev) => ({ ...prev, isOpen: false }))}
        title={factModal.isEditing ? 'Edit Approved Fact' : 'Add Approved Product Fact'}
        subtitle="Establish verified claims supported by laboratory evidence."
      >
        <form onSubmit={handleSaveFact} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product / Initiative Name
            </label>
            <input
              type="text"
              required
              value={factModal.productName}
              onChange={(e) => setFactModal((prev) => ({ ...prev, productName: e.target.value }))}
              placeholder="e.g., NexaWear Thermal Pro Knit"
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#25A99A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Approved Description
            </label>
            <textarea
              rows={2}
              required
              value={factModal.approvedDescription}
              onChange={(e) => setFactModal((prev) => ({ ...prev, approvedDescription: e.target.value }))}
              placeholder="Approved marketing description..."
              className="w-full p-2.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#25A99A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Verified Claim
            </label>
            <input
              type="text"
              required
              value={factModal.verifiedClaim}
              onChange={(e) => setFactModal((prev) => ({ ...prev, verifiedClaim: e.target.value }))}
              placeholder="e.g., 85% certified merino wool from non-mulesed sources."
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#25A99A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Supporting Lab Source / Audit
              </label>
              <input
                type="text"
                required
                value={factModal.supportingSource}
                onChange={(e) => setFactModal((prev) => ({ ...prev, supportingSource: e.target.value }))}
                placeholder="Certification #..."
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#25A99A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Verified By
              </label>
              <input
                type="text"
                required
                value={factModal.verifiedBy}
                onChange={(e) => setFactModal((prev) => ({ ...prev, verifiedBy: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#25A99A]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setFactModal((prev) => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#25A99A] hover:bg-[#1f8c7f] text-white rounded-lg"
            >
              Save Fact
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Terminology Rule */}
      <Modal
        isOpen={termModal.isOpen}
        onClose={() => setTermModal((prev) => ({ ...prev, isOpen: false }))}
        title={termModal.isEditing ? 'Edit Terminology Rule' : 'Create Terminology Rule'}
        subtitle="Configure dictionary terms to require or prohibit across all marketing text."
      >
        <form onSubmit={handleSaveTerm} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Rule Policy Type
              </label>
              <select
                value={termModal.type}
                onChange={(e) =>
                  setTermModal((prev) => ({
                    ...prev,
                    type: e.target.value as 'required' | 'prohibited'
                  }))
                }
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-800"
              >
                <option value="prohibited">Prohibited Term</option>
                <option value="required">Required Phrase</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Violation Severity
              </label>
              <select
                value={termModal.severity}
                onChange={(e) =>
                  setTermModal((prev) => ({
                    ...prev,
                    severity: e.target.value as TerminologyRule['severity']
                  }))
                }
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-800"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Target Term or Phrase
            </label>
            <input
              type="text"
              required
              value={termModal.term}
              onChange={(e) => setTermModal((prev) => ({ ...prev, term: e.target.value }))}
              placeholder="e.g., Guaranteed results"
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
          </div>

          {termModal.type === 'prohibited' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preferred Approved Alternative
              </label>
              <input
                type="text"
                value={termModal.preferredAlternative}
                onChange={(e) => setTermModal((prev) => ({ ...prev, preferredAlternative: e.target.value }))}
                placeholder="e.g., Engineered for dependable performance"
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-800"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={termModal.category}
              onChange={(e) => setTermModal((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Legal & Compliance, Brand Voice"
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Governance Reason
            </label>
            <textarea
              rows={3}
              required
              value={termModal.reason}
              onChange={(e) => setTermModal((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Explain why this term is governed..."
              className="w-full p-2.5 text-xs border border-stone-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setTermModal((prev) => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg"
            >
              Save Rule
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteDialog.type}?`}
        description={`Are you sure you want to delete "${deleteDialog.title}" from the Brand Knowledge Hub? This cannot be undone.`}
        confirmLabel="Delete Item"
        variant="danger"
      />
    </div>
  );
};
