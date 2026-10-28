export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type ReviewStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Changes Requested' | 'Rejected';

export type ContentType = 
  | 'Social Media Post'
  | 'Marketing Email'
  | 'Product Page'
  | 'Advertisement'
  | 'Blog Article';

export type FindingCategory = 
  | 'Prohibited Terminology'
  | 'Unsupported Claim'
  | 'Brand Tone & Voice'
  | 'Missing Required Term'
  | 'Visual & Accessibility';

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: Severity;
  affectedText: string;
  startIndex?: number;
  endIndex?: number;
  explanation: string;
  supportingEvidence: string;
  ruleReferenceId?: string;
  confidence: number; // percentage (e.g. 94)
  suggestedCorrection: string;
  status: 'active' | 'applied' | 'dismissed';
  dismissalReason?: string;
}

export interface ReviewRecord {
  id: string;
  title: string;
  contentType: ContentType;
  channel: string;
  content: string;
  creator: {
    name: string;
    avatar: string;
    email: string;
  };
  assignedReviewer: {
    name: string;
    avatar: string;
    email: string;
  };
  submittedDate: string; // ISO date or readable date
  complianceScore: number; // 0 - 100
  status: ReviewStatus;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  findings: Finding[];
  revision: number;
  guidelineId: string;
  attachedFile?: {
    name: string;
    size: string;
    type: string;
  };
  decisionNotes?: string;
  decisionDate?: string;
}

export interface BrandGuideline {
  id: string;
  title: string;
  category: 'Voice & Tone' | 'Writing Style' | 'Colour Palette' | 'Typography' | 'Logo Usage';
  summary: string;
  rules: string[];
  lastUpdated: string;
}

export interface ApprovedFact {
  id: string;
  productName: string;
  approvedDescription: string;
  verifiedClaim: string;
  supportingSource: string;
  verifiedBy: string;
  lastUpdated: string;
}

export interface TerminologyRule {
  id: string;
  type: 'required' | 'prohibited';
  term: string;
  preferredAlternative?: string;
  reason: string;
  severity: Severity;
  category: string;
}

export interface BrandAsset {
  id: string;
  title: string;
  type: 'Logo' | 'Colour Swatch' | 'Typography' | 'Campaign Asset';
  description: string;
  previewUrl?: string;
  meta: Record<string, string>;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  targetTitle: string;
  targetId: string;
  timestamp: string;
  type: 'review_created' | 'finding_fixed' | 'approved' | 'rejected' | 'changes_requested' | 'guideline_updated';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
