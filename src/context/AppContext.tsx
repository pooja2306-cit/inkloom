import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ReviewRecord, 
  BrandGuideline, 
  ApprovedFact, 
  TerminologyRule, 
  BrandAsset, 
  ActivityItem, 
  ToastMessage,
  ReviewStatus
} from '../types';
import { 
  INITIAL_REVIEWS, 
  INITIAL_GUIDELINES, 
  INITIAL_APPROVED_FACTS, 
  INITIAL_TERMINOLOGY, 
  INITIAL_ASSETS, 
  INITIAL_ACTIVITY, 
  INITIAL_SETTINGS,
  INITIAL_USER
} from '../data/initialData';

interface AppContextType {
  // State
  user: typeof INITIAL_USER;
  reviews: ReviewRecord[];
  guidelines: BrandGuideline[];
  facts: ApprovedFact[];
  terminology: TerminologyRule[];
  assets: BrandAsset[];
  activity: ActivityItem[];
  settings: typeof INITIAL_SETTINGS;
  toasts: ToastMessage[];

  // Toast actions
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Review Actions
  addReview: (newReview: ReviewRecord) => void;
  updateReviewContent: (id: string, updatedContent: string) => void;
  applyFindingFix: (reviewId: string, findingId: string) => void;
  updateFindingSuggestion: (reviewId: string, findingId: string, newSuggestion: string) => void;
  dismissFinding: (reviewId: string, findingId: string, reason: string) => void;
  updateReviewStatus: (
    reviewId: string, 
    newStatus: ReviewStatus, 
    notes?: string,
    reviewerName?: string
  ) => void;
  getReviewById: (id: string) => ReviewRecord | undefined;

  // Knowledge Hub Actions
  addGuideline: (guideline: Omit<BrandGuideline, 'id' | 'lastUpdated'>) => void;
  updateGuideline: (id: string, updated: Partial<BrandGuideline>) => void;
  deleteGuideline: (id: string) => void;

  addFact: (fact: Omit<ApprovedFact, 'id' | 'lastUpdated'>) => void;
  updateFact: (id: string, updated: Partial<ApprovedFact>) => void;
  deleteFact: (id: string) => void;

  addTerminologyRule: (rule: Omit<TerminologyRule, 'id'>) => void;
  updateTerminologyRule: (id: string, updated: Partial<TerminologyRule>) => void;
  deleteTerminologyRule: (id: string) => void;

  // Settings Actions
  updateSettings: (newSettings: Partial<typeof INITIAL_SETTINGS>) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  REVIEWS: 'inkloom_reviews_v1',
  GUIDELINES: 'inkloom_guidelines_v1',
  FACTS: 'inkloom_facts_v1',
  TERMINOLOGY: 'inkloom_terminology_v1',
  ASSETS: 'inkloom_assets_v1',
  ACTIVITY: 'inkloom_activity_v1',
  SETTINGS: 'inkloom_settings_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState(INITIAL_USER);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage or initialize
  const [reviews, setReviews] = useState<ReviewRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [guidelines, setGuidelines] = useState<BrandGuideline[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUIDELINES);
      return saved ? JSON.parse(saved) : INITIAL_GUIDELINES;
    } catch {
      return INITIAL_GUIDELINES;
    }
  });

  const [facts, setFacts] = useState<ApprovedFact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FACTS);
      return saved ? JSON.parse(saved) : INITIAL_APPROVED_FACTS;
    } catch {
      return INITIAL_APPROVED_FACTS;
    }
  });

  const [terminology, setTerminology] = useState<TerminologyRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TERMINOLOGY);
      return saved ? JSON.parse(saved) : INITIAL_TERMINOLOGY;
    } catch {
      return INITIAL_TERMINOLOGY;
    }
  });

  const [assets, setAssets] = useState<BrandAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
      return saved ? JSON.parse(saved) : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  });

  const [activity, setActivity] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
    } catch {
      return INITIAL_ACTIVITY;
    }
  });

  const [settings, setSettings] = useState<typeof INITIAL_SETTINGS>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GUIDELINES, JSON.stringify(guidelines));
  }, [guidelines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(facts));
  }, [facts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TERMINOLOGY, JSON.stringify(terminology));
  }, [terminology]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
  }, [activity]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Toast actions
  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to append activity
  const logActivity = (action: string, targetTitle: string, targetId: string, type: ActivityItem['type']) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      actor: user.name,
      action,
      targetTitle,
      targetId,
      timestamp: 'Just now',
      type
    };
    setActivity((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  // Review Actions
  const addReview = (newReview: ReviewRecord) => {
    setReviews((prev) => [newReview, ...prev]);
    logActivity('Submitted for compliance analysis', newReview.title, newReview.id, 'review_created');
    addToast('Review Created', `"${newReview.title}" has been saved and analyzed.`, 'success');
  };

  const updateReviewContent = (id: string, updatedContent: string) => {
    setReviews((prev) =>
      prev.map((rev) => {
        if (rev.id === id) {
          return {
            ...rev,
            content: updatedContent,
            revision: rev.revision + 1,
          };
        }
        return rev;
      })
    );
    addToast('Changes Saved', 'Content draft updated successfully.', 'info');
  };

  const applyFindingFix = (reviewId: string, findingId: string) => {
    setReviews((prev) =>
      prev.map((rev) => {
        if (rev.id !== reviewId) return rev;
        const finding = rev.findings.find((f) => f.id === findingId);
        if (!finding) return rev;

        // Replace affected text in content
        let newContent = rev.content;
        const target = finding.affectedText;
        if (newContent.includes(target)) {
          newContent = newContent.replace(target, finding.suggestedCorrection);
        } else {
          // Case insensitive replacement
          const regex = new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          newContent = newContent.replace(regex, finding.suggestedCorrection);
        }

        const updatedFindings = rev.findings.map((f) =>
          f.id === findingId ? { ...f, status: 'applied' as const } : f
        );

        // Recalculate compliance score
        const activeCount = updatedFindings.filter((f) => f.status === 'active').length;
        const newScore = Math.min(100, Math.max(50, 100 - activeCount * 12));

        return {
          ...rev,
          content: newContent,
          findings: updatedFindings,
          complianceScore: newScore,
          revision: rev.revision + 1,
        };
      })
    );

    const review = reviews.find((r) => r.id === reviewId);
    if (review) {
      logActivity('Applied suggested correction on', review.title, review.id, 'finding_fixed');
    }
    addToast('Fix Applied', 'Text replaced with approved brand correction.', 'success');
  };

  const updateFindingSuggestion = (reviewId: string, findingId: string, newSuggestion: string) => {
    setReviews((prev) =>
      prev.map((rev) => {
        if (rev.id !== reviewId) return rev;
        return {
          ...rev,
          findings: rev.findings.map((f) =>
            f.id === findingId ? { ...f, suggestedCorrection: newSuggestion } : f
          ),
        };
      })
    );
    addToast('Suggestion Updated', 'Custom replacement string saved.', 'info');
  };

  const dismissFinding = (reviewId: string, findingId: string, reason: string) => {
    setReviews((prev) =>
      prev.map((rev) => {
        if (rev.id !== reviewId) return rev;
        const updatedFindings = rev.findings.map((f) =>
          f.id === findingId
            ? { ...f, status: 'dismissed' as const, dismissalReason: reason }
            : f
        );
        const activeCount = updatedFindings.filter((f) => f.status === 'active').length;
        const newScore = Math.min(100, Math.max(60, 100 - activeCount * 10));

        return {
          ...rev,
          findings: updatedFindings,
          complianceScore: newScore,
        };
      })
    );
    addToast('Finding Dismissed', `Marked as non-blocking: ${reason}`, 'warning');
  };

  const updateReviewStatus = (
    reviewId: string,
    newStatus: ReviewStatus,
    notes?: string,
    reviewerName: string = user.name
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setReviews((prev) =>
      prev.map((rev) => {
        if (rev.id !== reviewId) return rev;
        return {
          ...rev,
          status: newStatus,
          decisionNotes: notes || rev.decisionNotes,
          decisionDate: now,
          assignedReviewer: {
            ...rev.assignedReviewer,
            name: reviewerName
          }
        };
      })
    );

    const review = reviews.find((r) => r.id === reviewId);
    const title = review?.title || reviewId;

    let actType: ActivityItem['type'] = 'approved';
    if (newStatus === 'Approved') actType = 'approved';
    else if (newStatus === 'Rejected') actType = 'rejected';
    else if (newStatus === 'Changes Requested') actType = 'changes_requested';

    logActivity(`Status set to ${newStatus} for`, title, reviewId, actType);
    addToast(`Status: ${newStatus}`, `Review record ${reviewId} marked as ${newStatus}.`, 'info');
  };

  const getReviewById = (id: string) => {
    return reviews.find((r) => r.id === id);
  };

  // Knowledge Hub Actions
  const addGuideline = (data: Omit<BrandGuideline, 'id' | 'lastUpdated'>) => {
    const newGuideline: BrandGuideline = {
      ...data,
      id: `bg-${Date.now().toString().slice(-4)}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setGuidelines((prev) => [newGuideline, ...prev]);
    logActivity('Created new brand guideline', newGuideline.title, newGuideline.id, 'guideline_updated');
    addToast('Guideline Created', newGuideline.title, 'success');
  };

  const updateGuideline = (id: string, updated: Partial<BrandGuideline>) => {
    setGuidelines((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated, lastUpdated: new Date().toISOString().split('T')[0] } : g))
    );
    addToast('Guideline Updated', 'Brand guideline changes saved.', 'info');
  };

  const deleteGuideline = (id: string) => {
    setGuidelines((prev) => prev.filter((g) => g.id !== id));
    addToast('Guideline Removed', 'Guideline deleted from Brand Hub.', 'warning');
  };

  const addFact = (data: Omit<ApprovedFact, 'id' | 'lastUpdated'>) => {
    const newFact: ApprovedFact = {
      ...data,
      id: `fact-${Date.now().toString().slice(-4)}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setFacts((prev) => [newFact, ...prev]);
    logActivity('Added approved product claim', newFact.productName, newFact.id, 'guideline_updated');
    addToast('Approved Fact Added', newFact.productName, 'success');
  };

  const updateFact = (id: string, updated: Partial<ApprovedFact>) => {
    setFacts((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated, lastUpdated: new Date().toISOString().split('T')[0] } : f))
    );
    addToast('Fact Updated', 'Approved claim updated.', 'info');
  };

  const deleteFact = (id: string) => {
    setFacts((prev) => prev.filter((f) => f.id !== id));
    addToast('Fact Removed', 'Fact deleted from repository.', 'warning');
  };

  const addTerminologyRule = (data: Omit<TerminologyRule, 'id'>) => {
    const newRule: TerminologyRule = {
      ...data,
      id: `term-${Date.now().toString().slice(-4)}`
    };
    setTerminology((prev) => [newRule, ...prev]);
    logActivity('Added terminology rule', newRule.term, newRule.id, 'guideline_updated');
    addToast('Terminology Rule Added', `Rule for "${newRule.term}" created.`, 'success');
  };

  const updateTerminologyRule = (id: string, updated: Partial<TerminologyRule>) => {
    setTerminology((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
    addToast('Rule Updated', 'Terminology rule modified.', 'info');
  };

  const deleteTerminologyRule = (id: string) => {
    setTerminology((prev) => prev.filter((r) => r.id !== id));
    addToast('Rule Removed', 'Terminology rule deleted.', 'warning');
  };

  // Settings Actions
  const updateSettings = (newSettings: Partial<typeof INITIAL_SETTINGS>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast('Settings Saved', 'Preferences have been saved to local browser storage.', 'success');
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.GUIDELINES);
    localStorage.removeItem(STORAGE_KEYS.FACTS);
    localStorage.removeItem(STORAGE_KEYS.TERMINOLOGY);
    localStorage.removeItem(STORAGE_KEYS.ASSETS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    setReviews(INITIAL_REVIEWS);
    setGuidelines(INITIAL_GUIDELINES);
    setFacts(INITIAL_APPROVED_FACTS);
    setTerminology(INITIAL_TERMINOLOGY);
    setAssets(INITIAL_ASSETS);
    setActivity(INITIAL_ACTIVITY);
    setSettings(INITIAL_SETTINGS);

    addToast('Demo Data Reset', 'All records restored to original NexaWear seed data.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        reviews,
        guidelines,
        facts,
        terminology,
        assets,
        activity,
        settings,
        toasts,
        addToast,
        removeToast,
        addReview,
        updateReviewContent,
        applyFindingFix,
        updateFindingSuggestion,
        dismissFinding,
        updateReviewStatus,
        getReviewById,
        addGuideline,
        updateGuideline,
        deleteGuideline,
        addFact,
        updateFact,
        deleteFact,
        addTerminologyRule,
        updateTerminologyRule,
        deleteTerminologyRule,
        updateSettings,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
