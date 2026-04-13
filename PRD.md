# RepoRead — AI GitHub Repository Analyzer

**Product Requirements Document (PRD)**  
*Version: 1.0*  
*Date: 2026-04-12*  
*Status: Draft*  
*Language: English (Global Market)*

---

## 1. Product Overview

### 1.1 Product Background

In the AI era, open-source repositories are exploding. Developers daily encounter dozens of new GitHub projects but lack time to read through entire codebases. Existing solutions (README-only summaries, generic ChatGPT queries) fail to provide quick, actionable insights.

### 1.2 Product Vision

> **"One click to understand any GitHub repo."**

RepoRead transforms a GitHub URL into instant, actionable intelligence — telling users what a project does, how it works, and how to get started — without reading a single line of code.

### 1.3 Target Users

| User Segment | Description |
|--------------|-------------|
| **AI Engineers** | Evaluate open-source AI/ML projects quickly |
| **Bootstrapped Founders** | Assess technical feasibility of projects |
| **Tech Recruiters** | Understand candidate's portfolio projects |
| **Open-source Contributors** | Quickly review unfamiliar repositories |
| **Students/Learners** | Understand project structure and tech stacks |

### 1.4 Core Value Proposition

| For | RepoRead Provides |
|-----|-------------------|
| Time-strapped developers | 80% time savings on repo evaluation |
| Non-English speakers | Clear English summaries of global projects |
| Bootstrappers | Fast technical due diligence |

### 1.5 System Scope

| Component | Responsibility |
|-----------|----------------|
| **Web Frontend** | User input (GitHub URL), display analysis results |
| **API Gateway** | Request routing, rate limiting |
| **GitHub Fetcher** | Fetch repo metadata, README, file tree via GitHub API |
| **AI Analyzer** | Process code, generate insights using Kimi API |
| **Cache Layer** | Store previous analyses to reduce API costs |

---

## 2. UML Use Case Model

### 2.1 System Use Case Diagram

```
                        ┌─────────────────────────────────────────┐
                        │           RepoRead System                │
                        │                                         │
   ┌─────────────┐      │  ┌─────────────┐  ┌─────────────────┐  │
   │   User      │      │  │ UC-1: Input │  │ UC-2: Analyze   │  │
   │  (Actor)    │◄────►│  │   GitHub    │  │   Repository    │  │
   └─────────────┘      │  │     URL     │  │                 │  │
                        │  └─────────────┘  └─────────────────┘  │
                        │         │                  │              │
                        │         │                  ▼              │
                        │         │         ┌─────────────────┐    │
                        │         │         │ UC-3: Display   │    │
                        │         │         │    Results      │    │
                        │         │         └─────────────────┘    │
                        │         │                               │
                        │         │         ┌─────────────────┐    │
                        │         │         │ UC-4: Cache &   │    │
                        │         │         │  History        │    │
                        │         │         └─────────────────┘    │
                        └─────────┴───────────────────────────────┘

                         External Systems:
                         ┌──────────────┐
                         │  GitHub API  │
                         └──────────────┘
                              ▲
                              │
                         ┌────┴────┐
                         │ UC-2    │
                         └─────────┘
```

### 2.2 Actor Definitions

| Actor | Type | Description |
|-------|------|-------------|
| **User** | Primary | End user who wants to understand a repo |
| **GitHub API** | External | Provides repo data (metadata, README, file tree) |
| **Kimi API** | External | AI engine for code analysis and summarization |

### 2.3 Use Case List

| UC-ID | Use Case Name | Primary Actor | Priority |
|-------|---------------|---------------|----------|
| UC-1 | Input GitHub URL | User | High |
| UC-2 | Analyze Repository | System | High |
| UC-3 | Display Results | System | High |
| UC-4 | Cache & History | System | Medium |

### 2.4 Use Case Relationships

```
UC-2 (Analyze Repository)
  ├── INCLUDE ──► UC-1 (validates URL format)
  ├── INCLUDE ──► GitHub API (fetch data)
  └── EXTEND ────► UC-4 (if cached result exists)
```

---

## 3. Detailed Use Case Specifications

### UC-1: Input GitHub URL

| Field | Content |
|-------|---------|
| **Use Case ID** | UC-1 |
| **Use Case Name** | Input GitHub URL |
| **Actors** | User (Primary) |
| **Priority** | High |
| **Pre-conditions** | None |
| **Post-conditions** | Valid GitHub URL is submitted to system |

#### Basic Flow

1. User navigates to RepoRead homepage
2. System displays input field with placeholder text: "Paste a GitHub repository URL..."
3. User pastes or types GitHub URL (e.g., `https://github.com/facebook/react`)
4. System validates URL format in real-time
5. User clicks "Analyze" button
6. System validates URL is accessible (returns 200)
7. System creates analysis session
8. **INCLUDE UC-2: Analyze Repository**

#### Alternate Flows

| Step | Condition | System Response |
|------|-----------|-----------------|
| 4a | Invalid URL format | Show inline error: "Please enter a valid GitHub URL" |
| 6a | URL returns 404 | Show error: "Repository not found. Check the URL." |
| 6b | URL returns non-200 | Show error: "Unable to access repository. It may be private." |

#### Business Rules

1. Supported URL formats:
   - `https://github.com/{owner}/{repo}`
   - `https://github.com/{owner}/{repo}/tree/{branch}`
   - `github.com/{owner}/{repo}`
2. Private repos are NOT supported in MVP (public repos only)
3. Maximum URL length: 500 characters

#### Data Dictionary

| Field | Description | Type | Required |
|-------|-------------|------|----------|
| `url` | GitHub repository URL | STRING(500) | Yes |
| `is_valid_format` | URL format validation result | BOOLEAN | Yes |
| `is_accessible` | GitHub API accessibility check | BOOLEAN | Yes |

---

### UC-2: Analyze Repository

| Field | Content |
|-------|---------|
| **Use Case ID** | UC-2 |
| **Use Case Name** | Analyze Repository |
| **Actors** | System (Primary), GitHub API (External), Kimi API (External) |
| **Priority** | High |
| **Pre-conditions** | Valid GitHub URL received from UC-1 |
| **Post-conditions** | Analysis results ready for display |

#### Basic Flow

1. System extracts `{owner, repo}` from URL
2. **CHECK** if cached result exists for this URL
   - If YES: **EXTEND UC-4** (return cached result)
   - If NO: Continue to step 3
3. System calls GitHub API to fetch:
   - Repository metadata (stars, forks, language, description)
   - README content (markdown)
   - Top-level file tree (first 2 levels)
4. System sends combined data to Kimi API with analysis prompt
5. Kimi API returns structured analysis:
   - Project summary (1-2 paragraphs)
   - Tech stack list
   - Key features
   - How to run
   - Common pitfalls
6. System structures the response
7. System caches result with TTL (24 hours)
8. **INCLUDE UC-3: Display Results**

#### Alternate Flows

| Step | Condition | System Response |
|------|-----------|-----------------|
| 3a | GitHub API rate limit exceeded | Show: "GitHub API limit reached. Try again in a few minutes." |
| 3b | README is empty or missing | Proceed without README, note in output |
| 5a | Kimi API error | Show: "Analysis failed. Please try again." |
| 5b | Kimi API timeout (>30s) | Show partial results with retry option |

#### Kimi API Prompt Template

```
You are an expert software developer analyzing a GitHub repository.

## Repository Info
- Name: {repo_name}
- Owner: {owner}
- Description: {description}
- Stars: {stars} | Forks: {forks} | Language: {language}

## README Content
{readme_content}

## File Structure
{file_tree}

## Your Task
Provide a structured analysis with these sections:

1. **Project Summary** (2-3 sentences): What does this project do?

2. **Tech Stack**: List the main technologies used (languages, frameworks, libraries)

3. **Key Features**: Top 5 most important features/capabilities

4. **How to Run**: Essential steps to get this project running (max 5 steps)

5. **Common Pitfalls**: Top 3 issues or mistakes users commonly encounter

Be concise, use bullet points where possible. Target: developers evaluating this project.
```

#### Business Rules

1. **GitHub API Rate Limits**:
   - Unauthenticated: 60 requests/hour
   - Authenticated: 5,000 requests/hour
   - MVP uses unauthenticated (sufficient for <60 analyses/hour)
2. **Cache TTL**: 24 hours per URL
3. **Kimi API Timeout**: 30 seconds max
4. **Analysis includes**: README + file tree (max 100 files)

#### Data Dictionary

| Field | Description | Type | Source |
|-------|-------------|------|--------|
| `owner` | Repository owner username | STRING | GitHub API |
| `repo` | Repository name | STRING | GitHub API |
| `stars` | Number of stars | INTEGER | GitHub API |
| `forks` | Number of forks | INTEGER | GitHub API |
| `language` | Primary language | STRING | GitHub API |
| `description` | Repo description | STRING | GitHub API |
| `readme` | README content (max 50KB) | TEXT | GitHub API |
| `file_tree` | JSON of file structure | JSON | GitHub API |
| `analysis_result` | Structured AI output | JSON | Kimi API |

---

### UC-3: Display Results

| Field | Content |
|-------|---------|
| **Use Case ID** | UC-3 |
| **Use Case Name** | Display Results |
| **Actors** | System (Primary) |
| **Priority** | High |
| **Pre-conditions** | Analysis complete (UC-2 finished) |
| **Post-conditions** | Results rendered on screen for user |

#### Basic Flow

1. System receives structured analysis result
2. System renders results in predefined UI sections:
   - Hero: Repo name + summary
   - Stats bar: Stars, Forks, Language
   - Tech Stack section
   - Key Features section
   - How to Run section
   - Pitfalls section
3. System enables "Copy" and "Share" actions
4. System logs analysis event (for analytics)

#### UI Layout (ASCII Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo: RepoRead]                           [History ▼]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🔗 https://github.com/facebook/react                  │  │
│  │  [Analyze]                                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ⚛️ facebook/react                          ⭐ 225k  │
│  │  "A declarative, efficient, and flexible JavaScript   │  │
│  │   library for building user interfaces."              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ## Tech Stack                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ JavaScript│ │   Yarn   │ │   Jest   │ │   Babel  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  ## Key Features                                            │
│  • Component-based architecture                            │
│  • Virtual DOM for performance                              │
│  • Unidirectional data flow                                 │
│  • JSX syntax extension                                    │
│  • Rich ecosystem                                          │
│                                                             │
│  ## How to Run                                              │
│  1. `git clone https://github.com/facebook/react.git`       │
│  2. `cd react`                                             │
│  3. `yarn install`                                         │
│  4. `yarn start`                                           │
│  5. Open http://localhost:3000                             │
│                                                             │
│  ## Common Pitfalls                                          │
│  ⚠️  JSX requires compilation (don't edit .jsx directly)   │
│  ⚠️  State management needs external library (Redux)      │
│  ⚠️  Large bundle size (~40KB gzipped)                    │
│                                                             │
│  [Copy Results]  [Share]  [ Analyze Another ]               │
└─────────────────────────────────────────────────────────────┘
```

#### Component States

| Component | States |
|-----------|--------|
| Analyze Button | Default / Hover / Loading / Disabled |
| Result Card | Loading / Success / Error / Empty |
| Copy Button | Default / Copied (shows "Copied!" for 2s) |
| History Dropdown | Open / Closed / Empty |

---

### UC-4: Cache & History

| Field | Content |
|-------|---------|
| **Use Case ID** | UC-4 |
| **Use Case Name** | Cache & History |
| **Actors** | System (Primary) |
| **Priority** | Medium |
| **Pre-conditions** | Analysis completed successfully |
| **Post-conditions** | Result cached; history updated |

#### Basic Flow

1. System generates cache key from URL hash (MD5)
2. System stores in cache:
   - `key`: URL hash
   - `url`: original URL
   - `result`: analysis JSON
   - `timestamp`: analysis time
   - `ttl`: 24 hours
3. System updates localStorage history (last 10 items)
4. On subsequent UC-1, if URL matches cache:
   - Return cached result (EXTEND to UC-2)
   - Show "From cache" indicator

#### Data Dictionary

**Cache Entry (client-side localStorage)**

| Field | Type | TTL |
|-------|------|-----|
| `cache_key` | STRING | - |
| `url` | STRING | - |
| `result` | JSON | 24h |
| `analyzed_at` | DATETIME | 24h |

**History Entry (localStorage)**

| Field | Type | Max Items |
|-------|------|-----------|
| `url` | STRING | 10 |
| `repo_name` | STRING | 10 |
| `analyzed_at` | DATETIME | 10 |

---

## 4. Detailed Interaction Design

### 4.1 Page Flow

```
[Homepage]
    │
    ├── User inputs GitHub URL
    │       │
    │       ▼
    │   [URL Validation]
    │       │
    │       ├── Valid ──► [Loading State]
    │       │                    │
    │       │                    ▼
    │       │            [GitHub API Fetch]
    │       │                    │
    │       │                    ▼
    │       │             [Kimi API Analyze]
    │       │                    │
    │       │                    ▼
    │       │              [Display Results]
    │       │                    │
    │       └── Invalid ◄── [Error: Invalid URL]
    │                            │
    └── User clicks History ──► [History Modal]
```

### 4.2 Loading State Machine

```
[IDLE] ──► [VALIDATING_URL] ──► [FETCHING_GITHUB] ──► [ANALYZING_AI]
   ▲              │                    │                     │
   │              │                    │                     │
   └── [ERROR] ◄──┴────────────────────┴─── [TIMEOUT/FAIL] ──┘
```

### 4.3 Error Handling Flow

| Error Type | User Message | Action |
|------------|--------------|--------|
| Invalid URL | "Please enter a valid GitHub URL" | Highlight input |
| 404 Not Found | "Repository not found" | Suggest checking URL |
| Private Repo | "Private repos are not supported" | Explain limitation |
| GitHub Rate Limit | "GitHub is busy. Try again in a minute." | Auto-retry after 60s |
| Analysis Timeout | "Analysis took too long. [Retry]" | Show retry button |
| Network Error | "Connection failed. Check your internet." | Retry button |

---

## 5. UI Design Specification

### 5.1 Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#2563EB` | Buttons, links, active states |
| **Primary Hover** | `#1D4ED8` | Button hover state |
| **Secondary** | `#64748B` | Secondary text, borders |
| **Success** | `#10B981` | Success states, checkmarks |
| **Warning** | `#F59E0B` | Warning icons, pitfalls |
| **Error** | `#EF4444` | Error messages |
| **Background** | `#FFFFFF` | Main background |
| **Surface** | `#F8FAFC` | Cards, elevated surfaces |
| **Text Primary** | `#0F172A` | Headlines, body text |
| **Text Secondary** | `#64748B` | Captions, placeholders |
| **Border** | `#E2E8F0` | Dividers, card borders |

### 5.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| **H1 (Logo)** | Inter | 24px | 700 (Bold) |
| **H2 (Section)** | Inter | 20px | 600 (Semibold) |
| **H3 (Subsection)** | Inter | 16px | 600 (Semibold) |
| **Body** | Inter | 14px | 400 (Regular) |
| **Caption** | Inter | 12px | 400 (Regular) |
| **Code** | JetBrains Mono | 13px | 400 (Regular) |

### 5.3 Spacing System

**Base unit: 4px**

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Component internal spacing |
| `md` | 16px | Section padding |
| `lg` | 24px | Card padding |
| `xl` | 32px | Page margins |
| `2xl` | 48px | Section gaps |

### 5.4 Component Specifications

#### Input Field

```
Height: 48px
Border: 1px solid #E2E8F0
Border Radius: 8px
Padding: 0 16px
Placeholder Color: #94A3B8
Focus: 2px ring #2563EB
```

#### Primary Button

```
Height: 48px
Background: #2563EB
Text: #FFFFFF
Border Radius: 8px
Padding: 0 24px
Font Weight: 600
Hover: #1D4ED8
Active: #1E40AF
Disabled: #94A3B8
Loading: Spinner icon + "Analyzing..."
```

#### Result Card

```
Background: #FFFFFF
Border: 1px solid #E2E8F0
Border Radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Margin: 16px 0
```

#### Tech Badge

```
Background: #F1F5F9
Border: 1px solid #E2E8F0
Border Radius: 6px
Padding: 4px 12px
Font Size: 13px
Text Color: #334155
```

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target |
|--------|--------|
| **First Contentful Paint (FCP)** | < 1.5s |
| **Time to Interactive (TTI)** | < 3s |
| **Analysis Time (URL → Results)** | < 10s (excluding AI) |
| **Cache Hit Response** | < 500ms |

### 6.2 Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

**Mobile**: Responsive design, optimized for 375px - 1440px viewport widths.

### 6.3 Security

| Requirement | Implementation |
|-------------|----------------|
| **Input Sanitization** | Strip HTML/scripts from URLs before API calls |
| **Rate Limiting** | Client-side: max 10 analyses/hour; Server-side: 60/hour |
| **No Code Execution** | All code analysis is read-only |
| **No Credential Storage** | No user accounts in MVP |

### 6.4 Reliability

| Requirement | Target |
|-------------|--------|
| **Uptime** | 99% (excluding external API downtime) |
| **Error Rate** | < 5% of analyses |
| **Graceful Degradation** | Show partial results on timeout |

---

## 7. Appendix

### 7.1 Glossary

| Term | Definition |
|------|------------|
| **Repository (Repo)** | A GitHub project containing code, docs, and version history |
| **README** | The main documentation file in a repo's root |
| **Kimi API** | Moonshot AI's API for natural language processing |
| **TTL** | Time To Live — how long cached data is valid |
| **FCP** | First Contentful Paint — when first content appears |
| **TTI** | Time To Interactive — when page becomes usable |

### 7.2 External Dependencies

| Service | Purpose | Rate Limit |
|---------|---------|------------|
| GitHub REST API | Fetch repo metadata, README, file tree | 60 req/hour (unauthenticated) |
| Kimi API | AI-powered code analysis | Based on account tier |

### 7.3 Future Enhancements (Post-MVP)

| Feature | Priority |
|---------|----------|
| Private repo support (GitHub OAuth) | P1 |
| File content analysis | P2 |
| Compare two repos side-by-side | P2 |
| Save/share analysis via link | P2 |
| Browser extension | P3 |

---

## 8. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-12 | PM | Initial draft |

---

*This PRD was generated following the professional UML-driven methodology.*
