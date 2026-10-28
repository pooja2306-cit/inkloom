import { Finding, Severity, TerminologyRule, ApprovedFact, BrandGuideline } from '../types';

export interface AnalysisResult {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  findings: Finding[];
  wordCount: number;
  characterCount: number;
  checksCompleted: {
    prohibitedTerms: boolean;
    approvedFacts: boolean;
    toneAndVoice: boolean;
    accessibility: boolean;
  };
}

export function runSimulatedAnalysis(
  text: string,
  options: {
    contentType?: string;
    channel?: string;
    hasFile?: boolean;
    fileName?: string;
    activeTerminology?: TerminologyRule[];
    activeFacts?: ApprovedFact[];
    activeGuidelines?: BrandGuideline[];
  } = {}
): AnalysisResult {
  const findings: Finding[] = [];
  const normalizedText = text || '';

  // 1. Check Prohibited Terms from active terminology rules or built-in rules
  const prohibitedChecks = [
    {
      term: 'guaranteed results',
      severity: 'Critical' as Severity,
      category: 'Prohibited Terminology' as const,
      explanation: 'Promising definite athletic or fitness outcomes creates consumer advertising warranty liability.',
      evidence: 'Legal Rule #term-02: Strict prohibition on unverified outcome guarantees.',
      suggested: 'engineered for dependable performance',
      confidence: 99
    },
    {
      term: 'cheapest',
      severity: 'High' as Severity,
      category: 'Prohibited Terminology' as const,
      explanation: 'Language focused on rock-bottom cost diminishes brand perception and contradicts premium positioning.',
      evidence: 'Terminology Guide #term-03: Preferred phrasing is "exceptional direct-to-consumer value".',
      suggested: 'exceptional direct-to-consumer value',
      confidence: 94
    },
    {
      term: 'miracle fabric',
      severity: 'High' as Severity,
      category: 'Brand Tone & Voice' as const,
      explanation: 'Hyperbolic phrases contradict NexaWear\'s voice guideline requiring honest, grounded communication.',
      evidence: 'Brand Voice Standard: Prohibit exaggerated claims and miracle descriptors.',
      suggested: 'breathable performance knit',
      confidence: 92
    },
    {
      term: 'miracle',
      severity: 'High' as Severity,
      category: 'Brand Tone & Voice' as const,
      explanation: 'Unsubstantiated hyperbole conflicts with our scientific, evidence-based brand voice.',
      evidence: 'Voice & Tone Standards #bg-01',
      suggested: 'advanced',
      confidence: 88
    },
    {
      term: '100% eco-friendly',
      severity: 'Critical' as Severity,
      category: 'Unsupported Claim' as const,
      explanation: 'Absolute environmental friendliness claims are categorized as greenwashing under regulatory guidelines.',
      evidence: 'Green Claims Code & Fact #fact-01: Approved claim is "Made with 70% recycled fabric".',
      suggested: 'Made with 70% recycled fabric',
      confidence: 96
    },
    {
      term: 'zero carbon',
      severity: 'Critical' as Severity,
      category: 'Unsupported Claim' as const,
      explanation: 'Carbon neutrality claims require full Scope 1-3 verified offset certificates.',
      evidence: 'Approved Sustainability Fact #fact-01',
      suggested: 'produced with low-impact certified processes',
      confidence: 95
    },
    {
      term: 'act fast before stock runs out',
      severity: 'High' as Severity,
      category: 'Brand Tone & Voice' as const,
      explanation: 'Artificial scarcity and high-pressure urgency conflict with our calm, consultative peer-to-peer tone.',
      evidence: 'Writing Style Guideline #bg-02: Never use high-pressure urgency tactics.',
      suggested: 'Explore our latest collection online',
      confidence: 93
    },
    {
      term: 'act now',
      severity: 'Medium' as Severity,
      category: 'Brand Tone & Voice' as const,
      explanation: 'Urgency directive feels spammy and diminishes editorial quality.',
      evidence: 'Writing Style Guideline #bg-02',
      suggested: 'Discover the collection',
      confidence: 89
    },
    {
      term: 'revolutionary',
      severity: 'Medium' as Severity,
      category: 'Brand Tone & Voice' as const,
      explanation: 'Generic tech buzzword overused in marketing; our voice prefers tangible product benefits.',
      evidence: 'Brand Voice Standard: Clear, confident without exaggeration.',
      suggested: 'purpose-built',
      confidence: 84
    }
  ];

  // Evaluate prohibited terms
  prohibitedChecks.forEach((check, index) => {
    const regex = new RegExp(`\\b${check.term}\\b`, 'i');
    const match = regex.exec(normalizedText);
    if (match) {
      // Avoid duplicate if already matched a longer phrase
      const alreadyFlagged = findings.some(
        f => f.affectedText.toLowerCase().includes(match[0].toLowerCase()) ||
             match[0].toLowerCase().includes(f.affectedText.toLowerCase())
      );
      if (!alreadyFlagged) {
        findings.push({
          id: `gen-fnd-${Date.now()}-${index}`,
          category: check.category,
          severity: check.severity,
          affectedText: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          explanation: check.explanation,
          supportingEvidence: check.evidence,
          confidence: check.confidence,
          suggestedCorrection: check.suggested,
          status: 'active'
        });
      }
    }
  });

  // 2. Check for Missing Required Tagline
  const hasTagline = /designed for everyday comfort/i.test(normalizedText);
  if (!hasTagline && normalizedText.length > 50) {
    // Check if promotional or activewear post
    findings.push({
      id: `gen-fnd-tagline-${Date.now()}`,
      category: 'Missing Required Term',
      severity: 'Medium',
      affectedText: normalizedText.slice(0, Math.min(30, normalizedText.length)),
      explanation: 'Core brand promise is missing. Activewear campaign copy should incorporate our tagline.',
      supportingEvidence: 'Terminology Rule #term-01: "Designed for everyday comfort" is mandatory on consumer-facing copy.',
      confidence: 91,
      suggestedCorrection: 'Designed for everyday comfort — ' + normalizedText.slice(0, 30),
      status: 'active'
    });
  }

  // 3. Check for Trademark formatting on proprietary terms (e.g., AeroKnit without ™)
  const aeroMatch = normalizedText.match(/\bAeroKnit\b(?!™)/);
  if (aeroMatch && aeroMatch.index !== undefined) {
    findings.push({
      id: `gen-fnd-tm-${Date.now()}`,
      category: 'Missing Required Term',
      severity: 'Medium',
      affectedText: 'AeroKnit',
      startIndex: aeroMatch.index,
      endIndex: aeroMatch.index + 8,
      explanation: 'Proprietary fabric innovation must include the trademark symbol on first mention in marketing body copy.',
      supportingEvidence: 'Terminology Rule #term-05: Capitalize and include ™ for AeroKnit™.',
      confidence: 97,
      suggestedCorrection: 'AeroKnit™',
      status: 'active'
    });
  }

  // 4. Check for Unsupported percentage numbers for recycled content
  const recycledPercentMatch = normalizedText.match(/(\d+)%\s+(?:recycled|post-consumer)/i);
  if (recycledPercentMatch && recycledPercentMatch[1] !== '70') {
    findings.push({
      id: `gen-fnd-claim-${Date.now()}`,
      category: 'Unsupported Claim',
      severity: 'Critical',
      affectedText: recycledPercentMatch[0],
      startIndex: recycledPercentMatch.index,
      endIndex: (recycledPercentMatch.index || 0) + recycledPercentMatch[0].length,
      explanation: `Material claim "${recycledPercentMatch[0]}" contradicts verified Intertek lab certification GRS-77291-B which verifies exactly 70% recycled fabric.`,
      supportingEvidence: 'Approved Fact #fact-01: GRS Certified 70% recycled fabric only.',
      confidence: 98,
      suggestedCorrection: '70% recycled fabric',
      status: 'active'
    });
  }

  // 5. File upload accessibility check simulation
  if (options.hasFile) {
    findings.push({
      id: `gen-fnd-file-alt-${Date.now()}`,
      category: 'Visual & Accessibility',
      severity: 'Low',
      affectedText: options.fileName || 'Attached Asset',
      explanation: 'Attached creative file was inspected. Ensure descriptive alternative text and 4.5:1 text-on-image contrast are maintained for publishing.',
      supportingEvidence: 'Digital Accessibility Standard #bg-03: WCAG 2.2 AA Compliance.',
      confidence: 88,
      suggestedCorrection: 'Include alt-text: "NexaWear model wearing lightweight moisture-wicking activewear in natural light"',
      status: 'active'
    });
  }

  // Calculate Compliance Score
  // Base 100 with deduction weights: Critical: -25, High: -15, Medium: -8, Low: -4
  let scoreDeduction = 0;
  findings.forEach(f => {
    switch (f.severity) {
      case 'Critical': scoreDeduction += 25; break;
      case 'High': scoreDeduction += 15; break;
      case 'Medium': scoreDeduction += 8; break;
      case 'Low': scoreDeduction += 4; break;
    }
  });

  const finalScore = Math.max(25, Math.min(100, 100 - scoreDeduction));

  // Determine Risk Level
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (findings.some(f => f.severity === 'Critical') || finalScore < 60) {
    riskLevel = 'Critical';
  } else if (findings.some(f => f.severity === 'High') || finalScore < 75) {
    riskLevel = 'High';
  } else if (findings.some(f => f.severity === 'Medium') || finalScore < 85) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'Low';
  }

  const words = normalizedText.trim() ? normalizedText.trim().split(/\s+/).length : 0;

  return {
    score: finalScore,
    riskLevel,
    findings,
    wordCount: words,
    characterCount: normalizedText.length,
    checksCompleted: {
      prohibitedTerms: true,
      approvedFacts: true,
      toneAndVoice: true,
      accessibility: true,
    }
  };
}
