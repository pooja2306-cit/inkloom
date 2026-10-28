import { 
  ReviewRecord, 
  BrandGuideline, 
  ApprovedFact, 
  TerminologyRule, 
  BrandAsset, 
  ActivityItem 
} from '../types';

export const INITIAL_USER = {
  name: 'Pooja Ravi',
  role: 'Lead Brand Governance Manager',
  email: 'poojaravi.email@gmail.com',
  workspace: 'AetherGrid Workspace',
  avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
};

export const INITIAL_GUIDELINES: BrandGuideline[] = [
  {
    id: 'bg-01',
    title: 'Brand Voice & Tone Standards',
    category: 'Voice & Tone',
    summary: 'NexaWear speaks with a voice that is friendly, clear, confident, and grounded. We never exaggerate, use aggressive scarcity tactics, or make unverified athletic claims.',
    rules: [
      'Friendly and approachable: write as a knowledgeable peer, avoiding aloof corporate jargon.',
      'Clear and direct: lead with the human benefit before technical fabric specifications.',
      'Confident without exaggeration: prohibit hyperbolic adjectives like "miracle", "revolutionary game-changer", or "unbeatable".',
      'Honest sustainability: only state sustainability metrics verified by our lifecycle assessment documentation.'
    ],
    lastUpdated: '2026-10-22'
  },
  {
    id: 'bg-02',
    title: 'Editorial Writing & Terminology Style',
    category: 'Writing Style',
    summary: 'Guidelines for product naming, taglines, active voice, and international English conventions.',
    rules: [
      'Use sentence case for all subheadings and marketing email subjects.',
      'Include the primary brand tagline "Designed for everyday comfort" in customer-facing activewear campaigns.',
      'Never use high-pressure urgency words like "ACT NOW", "Hurry before gone", or "Guaranteed results".',
      'Capitalize proprietary material names: "AeroKnit™", "FlexDry™", and "EcoShield™".'
    ],
    lastUpdated: '2026-10-18'
  },
  {
    id: 'bg-03',
    title: 'Digital Accessibility & Colour Contrast',
    category: 'Colour Palette',
    summary: 'Design and copy guidelines to ensure all digital communications satisfy WCAG 2.2 AA standards.',
    rules: [
      'Text overlaying campaign imagery must maintain at least 4.5:1 contrast against the darkest background point.',
      'All uploaded social and email product imagery must specify concise descriptive alt-text.',
      'Do not rely solely on color to indicate garment sizing availability or discounts.',
      'Primary UI accent is Nexa Violet (#7866E8) and Forest Teal (#25A99A).'
    ],
    lastUpdated: '2026-10-15'
  },
  {
    id: 'bg-04',
    title: 'Logo & Visual Asset Integrity',
    category: 'Logo Usage',
    summary: 'Placement rules, clear-space minimums, and prohibited alterations for the NexaWear logo mark.',
    rules: [
      'Maintain minimum clear space equal to the height of the "N" letterform around the logomark.',
      'Never recolor the logo in non-palette tints or place directly over busy photographic patterns without a scrim.',
      'Minimum digital logo reproduction width is 120px for web headers and 64px for mobile banners.'
    ],
    lastUpdated: '2026-09-30'
  }
];

export const INITIAL_APPROVED_FACTS: ApprovedFact[] = [
  {
    id: 'fact-01',
    productName: 'NexaWear AeroKnit Runner Set',
    approvedDescription: 'Lightweight everyday activewear crafted with moisture-wicking circular knit structure designed for breathable mobility.',
    verifiedClaim: 'Made with 70% recycled fabric (post-consumer PET certified under Global Recycled Standard GRS-2026).',
    supportingSource: 'Intertek Material Certification #GRS-77291-B',
    verifiedBy: 'Dr. Liam Thorne, Sustainability Lead',
    lastUpdated: '2026-10-12'
  },
  {
    id: 'fact-02',
    productName: 'NexaWear CloudPillow Hoodie',
    approvedDescription: 'Relaxed-fit fleece pullover featuring brushed interior warmth and double-stitched reinforced seams.',
    verifiedClaim: '100% organic cotton fleece with zero added synthetic chemical softeners.',
    supportingSource: 'OEKO-TEX Standard 100 Class II Verification #2026-CH-994',
    verifiedBy: 'Sarah Al-Mansoor, QA Director',
    lastUpdated: '2026-10-05'
  },
  {
    id: 'fact-03',
    productName: 'NexaWear Pace Flex Shorts',
    approvedDescription: 'Four-way stretch running shorts with integrated liner and hidden water-resistant phone pocket.',
    verifiedClaim: 'Durable water-repellent coating is 100% PFAS-free and fluorochemical-free.',
    supportingSource: 'Bluesign Environmental Compliance Dossier #BS-44021',
    verifiedBy: 'Dr. Liam Thorne, Sustainability Lead',
    lastUpdated: '2026-09-28'
  },
  {
    id: 'fact-04',
    productName: 'General Manufacturing Fact',
    approvedDescription: 'NexaWear closed-loop water recycling operations in tier-1 knitting partner facilities.',
    verifiedClaim: 'Reduces freshwater consumption by 42% compared to conventional reactive dyeing processes.',
    supportingSource: 'Water Stewardship Third-Party Audit 2026-Q2',
    verifiedBy: 'Marcus Vance, VP Operations',
    lastUpdated: '2026-10-01'
  }
];

export const INITIAL_TERMINOLOGY: TerminologyRule[] = [
  {
    id: 'term-01',
    type: 'required',
    term: 'Designed for everyday comfort',
    category: 'Brand Tagline',
    severity: 'Medium',
    reason: 'Core brand promise establishing approachable lifestyle positioning rather than hyper-competitive elite athletic messaging.'
  },
  {
    id: 'term-02',
    type: 'prohibited',
    term: 'Guaranteed results',
    preferredAlternative: 'Engineered for dependable performance',
    category: 'Legal & Compliance',
    severity: 'Critical',
    reason: 'Creates unsubstantiated legal warranty liabilities under consumer advertising protection standards.'
  },
  {
    id: 'term-03',
    type: 'prohibited',
    term: 'Cheapest on the market',
    preferredAlternative: 'Exceptional direct-to-consumer value',
    category: 'Brand Voice',
    severity: 'High',
    reason: 'Cheapens brand perception and conflicts with premium craftsmanship positioning.'
  },
  {
    id: 'term-04',
    type: 'prohibited',
    term: 'Miracle fabric',
    preferredAlternative: 'Technical performance knit',
    category: 'Tone & Exaggeration',
    severity: 'High',
    reason: 'Exaggerated hyperbole violates our honest, evidence-based communication charter.'
  },
  {
    id: 'term-05',
    type: 'required',
    term: 'AeroKnit™',
    category: 'Trademark Compliance',
    severity: 'Medium',
    reason: 'Proprietary fabric innovation must include the trademark symbol on first mention in marketing body copy.'
  },
  {
    id: 'term-06',
    type: 'prohibited',
    term: '100% eco-friendly and zero carbon',
    preferredAlternative: 'Made with 70% recycled fabric and low-impact dyeing',
    category: 'Greenwashing Prevention',
    severity: 'Critical',
    reason: 'Absolute carbon-neutral claims trigger regulatory fines unless accompanied by full verified offset certificates.'
  }
];

export const INITIAL_ASSETS: BrandAsset[] = [
  {
    id: 'asset-01',
    title: 'Primary Wordmark & Logomark',
    type: 'Logo',
    description: 'Master vector logo mark for light backgrounds. Clear-space margin minimum 24px.',
    meta: { format: 'SVG, EPS', clearSpace: '24px', version: '2026.1' }
  },
  {
    id: 'asset-02',
    title: 'Nexa Violet (Primary Brand Accent)',
    type: 'Colour Swatch',
    description: 'Primary digital interface and CTA highlight color. WCAG AA compliant on off-white.',
    meta: { hex: '#7866E8', rgb: '120, 102, 232', role: 'Primary Accent' }
  },
  {
    id: 'asset-03',
    title: 'Forest Teal (Secondary Accent)',
    type: 'Colour Swatch',
    description: 'Sustainability callouts, verified badge outlines, and secondary metrics.',
    meta: { hex: '#25A99A', rgb: '37, 169, 154', role: 'Secondary Accent' }
  },
  {
    id: 'asset-04',
    title: 'Deep Navy (Sidebar & High-Contrast Canvas)',
    type: 'Colour Swatch',
    description: 'High-contrast structural framing, sidebar, and primary heading emphasis.',
    meta: { hex: '#17212B', rgb: '23, 33, 43', role: 'Deep Neutral' }
  },
  {
    id: 'asset-05',
    title: 'NexaWear Autumn Sustainability Collection Preview',
    type: 'Campaign Asset',
    description: 'Approved flatlay composition showcasing natural dyes, organic cotton, and recycled garments.',
    previewUrl: '/src/assets/images/nexawear_campaign_asset_1793190738958.jpg',
    meta: { aspect: '4:3', usage: 'Catalog, Social & Email', license: 'Global Internal Rights' }
  }
];

export const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'REV-1042',
    title: 'Instagram Launch Teaser — Autumn Pace Collection',
    contentType: 'Social Media Post',
    channel: 'Instagram',
    content: `Meet the new Pace Line! The miracle fabric provides guaranteed results on your morning run. Our brand new shorts are 100% eco-friendly and zero carbon, making them the absolute cheapest on the market for ethical athletes. Click the link in bio to shop now!`,
    creator: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      email: 'elena.rostova@nexawear.internal'
    },
    assignedReviewer: {
      name: 'Pooja Ravi',
      avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
      email: 'poojaravi.email@gmail.com'
    },
    submittedDate: '2026-10-27 16:45',
    complianceScore: 58,
    status: 'Changes Requested',
    riskLevel: 'Critical',
    revision: 2,
    guidelineId: 'bg-01',
    decisionNotes: 'Critical legal and greenwashing terms flagged. Please replace absolute carbon claims with the approved 70% recycled fact and remove guaranteed results.',
    decisionDate: '2026-10-27 18:10',
    findings: [
      {
        id: 'fnd-101',
        category: 'Prohibited Terminology',
        severity: 'Critical',
        affectedText: 'guaranteed results',
        explanation: 'Creating promissory outcome warranties triggers statutory advertising risk under consumer protection rules.',
        supportingEvidence: 'Legal Rule #term-02: Prohibited phrasing without verifiable clinical validation.',
        ruleReferenceId: 'term-02',
        confidence: 99,
        suggestedCorrection: 'engineered for dependable performance',
        status: 'active'
      },
      {
        id: 'fnd-102',
        category: 'Unsupported Claim',
        severity: 'Critical',
        affectedText: '100% eco-friendly and zero carbon',
        explanation: 'Absolute environmental neutrality claims violate green claims directives without complete life-cycle certification.',
        supportingEvidence: 'Approved Fact #fact-01: Approved claim is "Made with 70% recycled fabric".',
        ruleReferenceId: 'fact-01',
        confidence: 96,
        suggestedCorrection: 'Made with 70% recycled fabric',
        status: 'active'
      },
      {
        id: 'fnd-103',
        category: 'Brand Tone & Voice',
        severity: 'High',
        affectedText: 'miracle fabric',
        explanation: 'Hyperbolic language conflicts with NexaWear\'s honest, grounded engineering tone guideline.',
        supportingEvidence: 'Voice & Tone Standard: Prohibit hyperbolic adjectives like "miracle" or "revolutionary".',
        ruleReferenceId: 'bg-01',
        confidence: 92,
        suggestedCorrection: 'breathable technical knit',
        status: 'active'
      },
      {
        id: 'fnd-104',
        category: 'Prohibited Terminology',
        severity: 'High',
        affectedText: 'cheapest on the market',
        explanation: 'Language that degrades brand equity and conflicts with our premium craftsmanship tier.',
        supportingEvidence: 'Terminology Guide #term-03: Use "exceptional direct-to-consumer value".',
        ruleReferenceId: 'term-03',
        confidence: 94,
        suggestedCorrection: 'exceptional direct-to-consumer value',
        status: 'active'
      },
      {
        id: 'fnd-105',
        category: 'Missing Required Term',
        severity: 'Medium',
        affectedText: 'Pace Line',
        explanation: 'Customer-facing activewear launch copy must include our core brand commitment tagline.',
        supportingEvidence: 'Rule #term-01: Must include "Designed for everyday comfort" in campaign copy.',
        ruleReferenceId: 'term-01',
        confidence: 90,
        suggestedCorrection: 'Pace Line — Designed for everyday comfort',
        status: 'active'
      }
    ]
  },
  {
    id: 'REV-1043',
    title: 'Newsletter — Introducing Circular AeroKnit Fleece',
    contentType: 'Marketing Email',
    channel: 'Email / Klaviyo',
    content: `Designed for everyday comfort, our new AeroKnit™ Fleece delivers breathable warmth with zero compromises. Made with 70% recycled fabric certified under GRS standards, each garment supports cleaner textile cycles while feeling soft against your skin from dawn to dusk. Discover the new collection today.`,
    creator: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      email: 'marcus.vance@nexawear.internal'
    },
    assignedReviewer: {
      name: 'Pooja Ravi',
      avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
      email: 'poojaravi.email@gmail.com'
    },
    submittedDate: '2026-10-28 04:15',
    complianceScore: 98,
    status: 'Approved',
    riskLevel: 'Low',
    revision: 1,
    guidelineId: 'bg-01',
    decisionNotes: 'Flawless alignment with approved claims and required tagline.',
    decisionDate: '2026-10-28 05:00',
    findings: []
  },
  {
    id: 'REV-1044',
    title: 'Product Landing Page — CloudPillow Relaxed Hoodie',
    contentType: 'Product Page',
    channel: 'Website / E-commerce',
    content: `The CloudPillow Hoodie wraps you in cloud-soft comfort. Engineered with 100% organic cotton fleece with zero added synthetic chemical softeners, it is tailored for post-workout recovery or relaxed weekend walks. Double-stitched seams ensure enduring shape retention wash after wash. Designed for everyday comfort.`,
    creator: {
      name: 'Liam Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      email: 'liam.chen@nexawear.internal'
    },
    assignedReviewer: {
      name: 'Pooja Ravi',
      avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
      email: 'poojaravi.email@gmail.com'
    },
    submittedDate: '2026-10-27 11:20',
    complianceScore: 95,
    status: 'Approved',
    riskLevel: 'Low',
    revision: 1,
    guidelineId: 'bg-02',
    decisionNotes: 'Accurate fabric composition and approved care instructions.',
    decisionDate: '2026-10-27 14:30',
    findings: []
  },
  {
    id: 'REV-1045',
    title: 'Google Search Ad Copy — Performance Leggings Q4',
    contentType: 'Advertisement',
    channel: 'Google Ads',
    content: `NexaWear Activewear. Guaranteed results in every workout session. Buy now for cheapest prices online. Act fast before stock runs out!`,
    creator: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      email: 'elena.rostova@nexawear.internal'
    },
    assignedReviewer: {
      name: 'Pooja Ravi',
      avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
      email: 'poojaravi.email@gmail.com'
    },
    submittedDate: '2026-10-26 19:40',
    complianceScore: 42,
    status: 'Rejected',
    riskLevel: 'Critical',
    revision: 1,
    guidelineId: 'bg-01',
    decisionNotes: 'Multiple severe brand violations: prohibited urgency phrasing, guaranteed results, and discount claims not suitable for premium positioning.',
    decisionDate: '2026-10-27 09:15',
    findings: [
      {
        id: 'fnd-201',
        category: 'Prohibited Terminology',
        severity: 'Critical',
        affectedText: 'Guaranteed results',
        explanation: 'Creating unverified athletic efficacy claims violates advertising standards.',
        supportingEvidence: 'Terminology Rule #term-02',
        confidence: 99,
        suggestedCorrection: 'Engineered for all-day resilience',
        status: 'active'
      },
      {
        id: 'fnd-202',
        category: 'Brand Tone & Voice',
        severity: 'High',
        affectedText: 'Act fast before stock runs out!',
        explanation: 'Aggressive artificial scarcity violates brand guideline on calm, peer-to-peer communication.',
        supportingEvidence: 'Voice & Tone Guidelines Section 1.2: Ban high-pressure urgency.',
        confidence: 95,
        suggestedCorrection: 'Explore our latest arrivals online',
        status: 'active'
      },
      {
        id: 'fnd-203',
        category: 'Prohibited Terminology',
        severity: 'High',
        affectedText: 'cheapest prices online',
        explanation: 'Damages brand perception and violates terminology rule #term-03.',
        supportingEvidence: 'Brand Terminology Rule #term-03',
        confidence: 97,
        suggestedCorrection: 'direct-to-consumer value',
        status: 'active'
      }
    ]
  },
  {
    id: 'REV-1046',
    title: 'LinkedIn Thought Leadership — Sustainable Dyeing Tech',
    contentType: 'Blog Article',
    channel: 'LinkedIn',
    content: `How NexaWear rethinks water consumption in modern apparel. Through our closed-loop water recycling operations in tier-1 knitting partner facilities, we achieve a verified 42% reduction in freshwater consumption compared to conventional reactive dyeing processes. Designed for everyday comfort and lasting stewardship.`,
    creator: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      email: 'marcus.vance@nexawear.internal'
    },
    assignedReviewer: {
      name: 'Pooja Ravi',
      avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
      email: 'poojaravi.email@gmail.com'
    },
    submittedDate: '2026-10-28 01:10',
    complianceScore: 92,
    status: 'Pending Approval',
    riskLevel: 'Low',
    revision: 1,
    guidelineId: 'bg-01',
    findings: [
      {
        id: 'fnd-301',
        category: 'Visual & Accessibility',
        severity: 'Low',
        affectedText: 'closed-loop water recycling',
        explanation: 'Attached schematic diagram requires verified high-contrast label formatting for screen readers.',
        supportingEvidence: 'Accessibility Guideline #bg-03: Diagram data labels must provide WCAG text equivalents.',
        confidence: 85,
        suggestedCorrection: 'closed-loop water recycling (audit verified)',
        status: 'active'
      }
    ]
  },
  {
    id: 'REV-1047',
    title: 'Partner Retail Promo — Nordic Department Stores',
    contentType: 'Advertisement',
    channel: 'Print / Ads',
    content: `NexaWear in Scandinavia. Premium Scandinavian-inspired activewear designed for everyday comfort. Featuring AeroKnit fabric with 95% recycled polyester content and waterproof seams that guarantee no water entry ever.`,
    creator: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      email: 'elena.rostova@nexawear.internal'
    },
    assignedReviewer: {
      name: 'Pooja Ravi',
      avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
      email: 'poojaravi.email@gmail.com'
    },
    submittedDate: '2026-10-27 22:30',
    complianceScore: 64,
    status: 'Pending Approval',
    riskLevel: 'High',
    revision: 1,
    guidelineId: 'bg-01',
    findings: [
      {
        id: 'fnd-401',
        category: 'Unsupported Claim',
        severity: 'Critical',
        affectedText: '95% recycled polyester content',
        explanation: 'Claim exceeds verified material certification GRS-77291-B which validates 70% recycled fabric.',
        supportingEvidence: 'Approved Fact #fact-01: Only 70% recycled fabric is certified.',
        ruleReferenceId: 'fact-01',
        confidence: 98,
        suggestedCorrection: '70% recycled fabric',
        status: 'active'
      },
      {
        id: 'fnd-402',
        category: 'Prohibited Terminology',
        severity: 'High',
        affectedText: 'guarantee no water entry ever',
        explanation: 'Absolute water resistance guarantees violate product claim limits for breathable rain-resistant gear.',
        supportingEvidence: 'Writing Style Guideline #bg-02: Avoid absolute warranty guarantees.',
        confidence: 93,
        suggestedCorrection: 'high-performance water resistance',
        status: 'active'
      },
      {
        id: 'fnd-403',
        category: 'Missing Required Term',
        severity: 'Medium',
        affectedText: 'AeroKnit',
        explanation: 'Trademark symbol missing on first mention of proprietary knit material.',
        supportingEvidence: 'Terminology Rule #term-05',
        ruleReferenceId: 'term-05',
        confidence: 96,
        suggestedCorrection: 'AeroKnit™',
        status: 'active'
      }
    ]
  },
  {
    id: 'REV-1048',
    title: 'Customer Onboarding Sequence — Welcome Email 02',
    contentType: 'Marketing Email',
    channel: 'Email / Klaviyo',
    content: `Welcome to the NexaWear family! Here is how to keep your garments performing at their peak. Wash on cold gentle cycle, dry flat, and avoid chemical fabric softeners. Designed for everyday comfort and years of reliable wear.`,
    creator: {
      name: 'Liam Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      email: 'liam.chen@nexawear.internal'
    },
    assignedReviewer: {
      name: 'Pooja Ravi',
      avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
      email: 'poojaravi.email@gmail.com'
    },
    submittedDate: '2026-10-25 14:00',
    complianceScore: 96,
    status: 'Approved',
    riskLevel: 'Low',
    revision: 1,
    guidelineId: 'bg-02',
    decisionNotes: 'Great instructional voice and adherence to care guidelines.',
    decisionDate: '2026-10-25 15:40',
    findings: []
  },
  {
    id: 'REV-1049',
    title: 'TikTok Influencer Briefing Kit — Spring Run Challenge',
    contentType: 'Social Media Post',
    channel: 'TikTok',
    content: `Hey creators! Film yourself wearing the new AeroKnit™ Pace shorts. Tell your audience they will get guaranteed results in personal records and that our prices are the cheapest in ethical apparel!`,
    creator: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      email: 'elena.rostova@nexawear.internal'
    },
    assignedReviewer: {
      name: 'Pooja Ravi',
      avatar: '/src/assets/images/avatar_pooja_1793190738791.jpg',
      email: 'poojaravi.email@gmail.com'
    },
    submittedDate: '2026-10-28 02:40',
    complianceScore: 50,
    status: 'Pending Approval',
    riskLevel: 'Critical',
    revision: 1,
    guidelineId: 'bg-01',
    findings: [
      {
        id: 'fnd-501',
        category: 'Prohibited Terminology',
        severity: 'Critical',
        affectedText: 'guaranteed results',
        explanation: 'Influencer guidelines strictly forbid commanding creators to promise guaranteed outcomes.',
        supportingEvidence: 'Terminology Rule #term-02 & Influencer Compliance Code',
        ruleReferenceId: 'term-02',
        confidence: 99,
        suggestedCorrection: 'support for every personal milestone',
        status: 'active'
      },
      {
        id: 'fnd-502',
        category: 'Prohibited Terminology',
        severity: 'High',
        affectedText: 'cheapest in ethical apparel',
        explanation: 'Disparages category perception and violates terminology rule #term-03.',
        supportingEvidence: 'Rule #term-03',
        ruleReferenceId: 'term-03',
        confidence: 95,
        suggestedCorrection: 'mindfully priced for lasting quality',
        status: 'active'
      },
      {
        id: 'fnd-503',
        category: 'Missing Required Term',
        severity: 'Medium',
        affectedText: 'Spring Run Challenge',
        explanation: 'Official campaign brief requires inclusion of primary tagline.',
        supportingEvidence: 'Guideline #term-01: Designed for everyday comfort',
        ruleReferenceId: 'term-01',
        confidence: 91,
        suggestedCorrection: 'Spring Run Challenge — Designed for everyday comfort',
        status: 'active'
      }
    ]
  }
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: 'act-01',
    actor: 'Pooja Ravi',
    action: 'Approved marketing copy for',
    targetTitle: 'Newsletter — Introducing Circular AeroKnit Fleece',
    targetId: 'REV-1043',
    timestamp: '28 minutes ago',
    type: 'approved'
  },
  {
    id: 'act-02',
    actor: 'Elena Rostova',
    action: 'Submitted new review request for',
    targetTitle: 'TikTok Influencer Briefing Kit — Spring Run Challenge',
    targetId: 'REV-1049',
    timestamp: '2 hours ago',
    type: 'review_created'
  },
  {
    id: 'act-03',
    actor: 'Pooja Ravi',
    action: 'Requested revisions on',
    targetTitle: 'Instagram Launch Teaser — Autumn Pace Collection',
    targetId: 'REV-1042',
    timestamp: '11 hours ago',
    type: 'changes_requested'
  },
  {
    id: 'act-04',
    actor: 'Marcus Vance',
    action: 'Applied suggested correction in',
    targetTitle: 'Instagram Launch Teaser — Autumn Pace Collection',
    targetId: 'REV-1042',
    timestamp: '12 hours ago',
    type: 'finding_fixed'
  },
  {
    id: 'act-05',
    actor: 'Dr. Liam Thorne',
    action: 'Updated verified claim for',
    targetTitle: 'NexaWear AeroKnit Runner Set',
    targetId: 'fact-01',
    timestamp: 'Yesterday',
    type: 'guideline_updated'
  }
];

export const INITIAL_SETTINGS = {
  workspaceName: 'AetherGrid Workspace',
  workspaceDescription: 'Central brand governance, content compliance, and legal verification suite for NexaWear global communications.',
  defaultReviewer: 'Pooja Ravi',
  strictnessMode: 'Strict', // 'Lenient' | 'Balanced' | 'Strict'
  autoNotifyCreator: true,
  requireApprovalForPublished: true,
  emailNotifications: true,
  weeklyDigest: true,
  complianceScoreThreshold: 85
};
