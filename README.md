# 🛡️ Inkloom AI — BrandGuard

### AI-Powered Brand Governance Platform

**Keeping every piece of content consistent with your brand, accurate, and ready for review.**

🔗 **Live Demo:** https://inkloom-tau.vercel.app/  
💻 **GitHub Repository:** [pooja2306-cit/inkloom](https://github.com/pooja2306-cit/inkloom)

---

## 📌 About the Project

Inkloom AI — BrandGuard is an AI-powered brand governance platform designed to help organizations maintain consistent brand identity, messaging, terminology, and factual accuracy across their content.

Organizations often struggle to ensure that documents and marketing materials follow approved brand guidelines. Manual reviews can be time-consuming, inconsistent, and prone to human error.

BrandGuard aims to simplify this process by identifying potential brand violations, explaining issues, suggesting corrections, and supporting human review before content is published.

## 🎯 Problem Statement

Organizations create content across multiple platforms, teams, and communication channels. Maintaining consistent brand voice, approved terminology, and factual accuracy becomes increasingly difficult as content grows.

Traditional manual review processes can delay publication and allow preventable errors to go unnoticed.

**Our goal:** Build an intelligent platform that helps teams identify, understand, and resolve brand compliance issues before publication.

## ✨ Key Features

- **Brand Voice Analysis:** Identify potential tone mismatches and inconsistent messaging.
- **Terminology Validation:** Check content against approved terms and prohibited wording.
- **Fact and Claim Verification:** Flag unsupported or conflicting claims against approved sources.
- **AI-Powered Suggestions:** Provide explanations and recommended corrections for detected issues.
- **Evidence-Linked Findings:** Connect findings to relevant guidelines or approved sources wherever available.
- **Content Review Workflow:** Support review, comments, approval decisions, and revision tracking.
- **Accessibility Checks:** Support applicable checks such as missing alternative text and low color contrast.
- **Governance Insights:** Help teams identify recurring content issues and improve their review process.

*Feature availability depends on the current implementation; some capabilities may be part of the planned roadmap.*

## 🔄 How It Works

1. **Submit Content** — Provide content for brand compliance review.
2. **Apply Brand Guidelines** — Evaluate the content against configured rules and approved information.
3. **Analyze Issues** — Identify potential terminology, tone, factual, and other supported compliance issues.
4. **Review Findings** — Examine explanations, evidence, and suggested corrections.
5. **Revise Content** — Make the required changes and review the updated content.
6. **Human Approval** — Accept or dismiss findings and record the final review decision.

## 🧰 Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Development and Build | Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Icons | Lucide React |
| Animations | Motion |
| Charts and Analytics | Recharts |
| Proposed Backend | Python, FastAPI |
| Proposed Database and Authentication | Supabase, PostgreSQL, Supabase Auth |
| Proposed AI Analysis | LLM API with structured outputs |

The frontend technologies are based on the repository's current dependencies. Backend, database, authentication, and AI integrations listed as proposed components should be considered planned until implemented and verified.

## 🏗️ System Architecture

The planned system follows this workflow:

**User Interface → Content Submission → Text/PDF Processing → Rule Validation → AI Analysis → Evidence-Linked Findings → Suggested Corrections → Human Review**

The architecture is designed to combine deterministic rule checks with AI-assisted analysis, helping distinguish objective rule violations from more subjective writing suggestions.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- npm installed
- Git installed if cloning the repository

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/pooja2306-cit/inkloom.git
```

**2. Navigate to the project folder**

```bash
cd inkloom
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Visit the local URL displayed in your terminal. The current Vite configuration uses port `3000`, so the application will typically be available at:

http://localhost:3000

### Production Build

To create a production build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## 🔐 Security and Responsible AI

- Keep API keys and credentials out of source code and public repositories.
- Store secrets in environment variables and keep actual `.env` files out of Git.
- Use approved sources to support factual findings wherever possible.
- Treat AI-generated findings as recommendations that require human judgment.
- Apply appropriate access controls and privacy protections when handling confidential content.
- Evaluate false positives and accuracy before relying on the system for publication decisions.

## 🔮 Future Scope

- Integration with content management systems and marketing platforms.
- Advanced visual checks for logos, colors, and approved brand assets.
- Support for multilingual content and additional document formats.
- Configurable approval chains and escalation workflows.
- Detailed compliance analytics and audit reports.
- Enhanced access controls and private deployment options.

## 👥 Team AetherGrid

**Institution:** Chennai Institute of Technology  
**Department:** Information Technology

- Sandhya S — Team Lead / Product & Presentation
- Pooja Ravi — Backend & Database
- Monishwaran B — Frontend / UI-UX
- Pooja G — AI / Testing & Quality Assurance

*Team responsibilities reflect the proposed project plan and should be updated to match actual contributions.*

## 🌱 Expected Impact

Inkloom AI — BrandGuard aims to help organizations:

- Reduce preventable brand and terminology inconsistencies.
- Make content reviews more structured and understandable.
- Improve traceability through evidence-linked findings.
- Encourage accountable human approval of AI suggestions.
- Identify recurring compliance issues and improve brand guidelines over time.

## 📄 Project Status

Developed as a hackathon project, Inkloom AI — BrandGuard explores how AI-assisted analysis and structured review workflows can improve brand governance.

The repository and live demo represent the current prototype. Features described as proposed or future capabilities may require further development.

---

**Built with purpose by Team AetherGrid.** 🛡️

