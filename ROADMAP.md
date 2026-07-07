# AI Job Watch — Master Development Roadmap

## Current State (v0.x baseline)

A well-built, anonymous, single-use assessment tool. 31 questions across 7 sections produce a 0–30 "AI Resistance Score" across 6 categories. No auth, no database beyond anonymous Netlify Blobs, no repeat visits, no monetization. The foundation is solid — the roadmap builds on it without breaking what works.

---

## Version 1 — Polish, SEO & Shareability
**Goal:** Turn the existing tool into something people discover organically and share.

**Features**
- Shareable results link (encode score + categories into URL hash, no server needed)
- "Copy results" button that generates a plain-text summary
- Social share cards — pre-built Open Graph image per risk tier (LOW/MEDIUM/HIGH)
- Retake with "What if?" mode — change 2–3 answers and see score change live

**Pages**
- `/results/:shareId` — read-only results view from a shared link
- Dynamic meta tags on results page (score + risk in OG title/description)

**Database changes**
- Extend Netlify Blobs record to include shareable ID
- Store top category and risk label for SEO metadata rendering

**UX improvements**
- Progress percentage shown numerically ("Step 3 of 7 · 43% complete")
- Keyboard navigation on choice questions
- Micro-animations on score reveal
- Mobile: sticky "Next" button at bottom of viewport

**Revenue opportunities**
- None yet — maximize reach and trust first

**Technical improvements**
- Add `sitemap.xml` and `robots.txt`
- Meta tags (title, description, OG, Twitter card) on every page
- Structured data (JSON-LD Schema.org `Quiz` type) for Google rich results
- Lazy-load images
- Lighthouse score ≥ 90 on all four metrics

---

## Version 2 — User Accounts & Score History
**Goal:** Give users a reason to come back. Track their progress over time.

**Features**
- Email + password auth (or magic link / "Continue with Google")
- Save up to 10 assessments per account
- Score history timeline — graph of scores over time
- "You've improved 4 points since March" milestone notifications
- Anonymous mode still fully supported (no forced signup)

**Pages**
- `/login` — sign in / create account
- `/dashboard` — score history chart, last assessment date, improvement streak
- `/profile` — account settings, email, delete account

**Database changes**
- Users table: `id`, `email`, `created_at`, `auth_provider`
- Assessments table: `id`, `user_id`, `answers (JSON)`, `final_score`, `risk_key`, `created_at`
- Move from Netlify Blobs to a real database (Supabase or PlanetScale recommended)

**UX improvements**
- Post-results: "Save your score — track your progress over time" prompt (not a gate)
- Dashboard shows score trend with clear date labels
- Export results as PDF

**Revenue opportunities**
- Free tier: save last 3 assessments
- Pro tier ($7/mo): unlimited history, PDF export, priority features

**Technical improvements**
- Supabase Auth (or Auth.js) for session management
- Row-level security so users only see their own data
- HTTPS-only cookies for session tokens
- Add Playwright auth tests

---

## Version 3 — Industry Intelligence & Benchmarking
**Goal:** Answer "How do I compare?" — the most natural next question after seeing a score.

**Features**
- Industry benchmarking: "Your score of 18 is above average for Software Engineers (avg: 15)"
- Leaderboard by job title (anonymous, aggregated)
- "Most at-risk jobs right now" — ranked table driven by aggregate data
- "Most protected jobs" counterpart
- Weekly stats digest — email newsletter with job risk trends

**Pages**
- `/explore` — public industry data browser, filterable by sector and risk tier
- `/jobs/:slug` — per-job-title page (e.g., `/jobs/data-analyst`) with aggregate stats, top risk factors, average score

**Database changes**
- Job titles table: normalized titles, slug, industry, BLS occupation code
- Aggregated stats table: `job_title_id`, `avg_score`, `risk_distribution`, `sample_size`, updated nightly
- Tag the incoming assessments with a normalized job title (map Q1 free text → known titles via lookup + fuzzy match)

**UX improvements**
- Results page: "Compare with others in your industry" section
- `/explore` is filterable, sortable, linkable — good for SEO
- Each `/jobs/:slug` page is SEO-optimized (Google: "Is [job title] at risk from AI?")

**Revenue opportunities**
- `/explore` is free (drives traffic)
- Detailed per-job report PDF: $4.99 one-time ("The complete AI risk profile for Data Analysts")
- Sponsored placements on job title pages from training/education partners

**Technical improvements**
- Nightly Netlify scheduled function to compute aggregate stats
- Fuzzy job-title matching (normalize "Sr. Software Engineer" → "Software Engineer")
- Static pre-rendering of top 100 `/jobs/:slug` pages for SEO (Vite SSG or Astro migration candidate)

---

## Version 4 — AI Career Coach & Action Plans
**Goal:** Move from diagnosis to prescription. Tell people what to do about their score.

**Features**
- Personalized action plan generated per assessment: 5 specific steps based on weakest categories
- "Skill gap analysis" — which skills, if added, would most improve your score
- "What would change my score?" interactive simulator — adjust hypothetical answers, see projected score
- Course/certification recommendations mapped to each protective category (linked to Coursera, LinkedIn Learning, etc.)
- Monthly re-assessment reminder emails ("It's been 90 days — retake to track growth")

**Pages**
- `/action-plan` — personalized post-results page (auth required to save)
- `/skills` — skill library browser: each skill tagged with which categories it strengthens
- `/simulator` — interactive "what-if" score simulator

**Database changes**
- Skills table: `id`, `name`, `category_tags[]`, `resource_url`, `estimated_hours`
- Action plans table: `id`, `assessment_id`, `steps (JSON)`, `created_at`
- Course recommendations table: `id`, `title`, `provider`, `url`, `skill_tags[]`, `affiliate_code`

**UX improvements**
- Action plan is the new "results page" — score is still front and center but followed immediately by "Here's what to do"
- Progress tracker: mark action plan steps complete
- Gamification: "You've completed 3 of 5 steps — your projected score is now 22"

**Revenue opportunities**
- Affiliate commissions on course referrals (Coursera: 10–45%, Udemy: ~15%)
- Pro tier unlocks the full action plan (free tier gets 2 of 5 steps)
- "AI Career Coach" premium add-on ($19/mo): monthly 1:1 video session with a human coach sourced through the platform

**Technical improvements**
- Simple recommendation engine: rule-based first (no ML yet), match weak categories → skills → courses
- Track affiliate link clicks through server-side redirect for attribution
- Action plan PDF generation (Puppeteer or html2pdf)

---

## Version 5 — Community & Social Proof
**Goal:** Build a community of workers navigating AI disruption together.

**Features**
- Job title discussion threads ("What are Data Analysts doing to adapt?")
- "Share your story" — published accounts of career pivots (moderated)
- Community tips: user-submitted strategies for improving specific categories
- "Weekly top advice" digest curated from community
- User reputation / karma system for quality contributors

**Pages**
- `/community` — feed of discussions, stories, tips
- `/community/:topic` — per-topic thread
- `/stories` — curated success stories
- `/stories/:slug` — individual story page (SEO-valuable)

**Database changes**
- Posts table: `id`, `user_id`, `type` (discussion/story/tip), `title`, `body`, `job_title`, `score_at_time`, `created_at`
- Comments table: `id`, `post_id`, `user_id`, `body`, `created_at`
- Votes table: `id`, `user_id`, `target_id`, `target_type`, `value`
- Moderation flags table

**UX improvements**
- Results page: "See how others in your situation are adapting" → community CTA
- Mobile-first community feed (most users are on phones)
- Email digest opt-in: "Weekly: Top advice for [job title]"

**Revenue opportunities**
- Promoted community posts from training companies ($50–$500/week)
- Newsletter sponsorships (at scale: $500–$5,000 per send)
- "Verified coach" badge for career coaches ($99/mo)

**Technical improvements**
- Content moderation queue (admin panel)
- Full-text search across community content
- Email notification system (new replies, weekly digest)
- Rate limiting on post creation to prevent spam

---

## Version 6 — Document Intelligence (Resume & Job Posting Analyzer)
**Goal:** Expand beyond the assessment to analyze real documents users already have.

**Features**
- **Resume Analyzer:** Upload a resume (PDF/DOCX) → receive AI risk score, specific at-risk skills highlighted, suggested additions
- **Job Posting Analyzer:** Paste or link a job description → see its AI exposure score, which tasks are automatable, and how competitive it is
- **Resume Optimizer:** Specific language suggestions to emphasize AI-resistant qualities
- **Job Match Score:** Compare a user's profile against a job posting for fit + resilience

**Pages**
- `/tools/resume` — resume upload and analysis
- `/tools/job-posting` — job description paste/analyze
- `/tools/compare` — side-by-side resume vs. job posting

**Database changes**
- Documents table: `id`, `user_id`, `type` (resume/job_posting), `raw_text`, `analysis_result (JSON)`, `created_at`
- Analysis results stored as JSON: risk flags, at-risk phrases, suggested improvements

**UX improvements**
- Drag-and-drop resume upload
- Side-by-side "before / after" view for resume suggestions
- Analysis results downloadable as PDF

**Revenue opportunities**
- Resume analysis: 1 free per month, $4.99 per additional, or unlimited on Pro
- Job posting analysis: free (drives engagement, viral when shared with teams)
- "Resume Rewrite" premium service: $49 flat — human + AI assisted rewrite delivered in 48 hours

**Technical improvements**
- PDF text extraction (pdf-parse or a Netlify function calling an extraction API)
- LLM integration (Claude API) for document analysis and suggestions
- File upload to Supabase Storage (or Cloudflare R2)
- Rate limiting and file size validation on upload endpoint

---

## Version 7 — Enterprise & Team Features
**Goal:** Sell to HR teams, managers, and companies doing workforce planning.

**Features**
- **Team assessment:** Manager sends invite link → employees complete assessment → manager sees aggregate dashboard
- **Department risk map:** Heatmap of AI risk across an org by department/role
- **Workforce planning report:** "35% of your Engineering team is HIGH RISK — recommended upskilling: [list]"
- **Custom question sets:** Enterprise clients add company-specific questions
- **SSO:** SAML / Okta / Google Workspace login for corporate accounts
- **Branded assessment:** Company logo on the assessment flow

**Pages**
- `/enterprise` — sales/marketing landing page
- `/teams` — team management dashboard (admin only)
- `/teams/:id/dashboard` — team risk overview, drill-down per person
- `/teams/:id/report` — downloadable workforce report

**Database changes**
- Organizations table: `id`, `name`, `plan`, `seats`, `billing_id`
- Team memberships table: `user_id`, `org_id`, `role` (admin/member)
- Custom questions table: `id`, `org_id`, `section`, `question_text`, `choices[]`
- Aggregate team stats: computed on-demand or cached nightly

**UX improvements**
- Invite flow: email → one-click join team → take assessment → results visible to manager
- Manager dashboard is information-dense but clear (not overwhelming)
- Export team report to PPTX for executive presentations

**Revenue opportunities**
- Enterprise SaaS pricing: $99/mo (up to 25 seats), $299/mo (up to 100), $999/mo (unlimited + custom)
- Annual discount (2 months free)
- Implementation fee for custom question sets: $500 one-time
- Consulting add-on: workforce risk assessment workshop led by the platform team ($2,500+)

**Technical improvements**
- Multi-tenant architecture: all queries scoped by `org_id`
- SAML SSO via Auth0 or Clerk
- Role-based access control (RBAC)
- Usage metering and seat-count enforcement
- Stripe Billing with seat-based pricing

---

## Version 8 — Live Market Intelligence
**Goal:** Make the platform dynamic — scores informed by real-world labor market data, not just self-reported answers.

**Features**
- **Live job displacement tracker:** Pull data from BLS, layoff trackers, and news APIs to show real-time automation events by occupation
- **Dynamic risk score:** Score now weighted by live market signals ("Data Entry Clerks: 47 layoffs reported this week linked to AI tools")
- **"AI Impact News" feed:** Curated, AI-filtered news articles by job title
- **Predictive score:** "At current displacement rates, your role's market risk will reach HIGH in ~18 months"
- **Job market heat map:** Visual geographic map of AI displacement by region and industry

**Pages**
- `/market` — live market intelligence dashboard (free, public)
- `/market/:industry` — industry-specific displacement tracker
- `/alerts` — user sets custom alerts ("Notify me when Software Engineer risk changes")

**Database changes**
- Market events table: `id`, `job_title_id`, `source_url`, `headline`, `impact_type`, `date`, `ai_confidence_score`
- Job risk timeline table: historical score snapshots per job title for trend charts
- User alerts table: `user_id`, `job_title`, `threshold`, `frequency`

**UX improvements**
- Real-time "risk pulse" widget on home page showing today's highest-displacement roles
- Personal score now has two components: self-reported (your habits) + market signal (external reality)
- Push notifications (web push) for configured alerts

**Revenue opportunities**
- Market intelligence API: $299/mo for developers and researchers
- Premium market report subscription: $29/mo for detailed weekly briefings
- Early-warning enterprise tier: real-time alerts for HR teams monitoring role-specific displacement

**Technical improvements**
- Background data ingestion pipeline (scheduled Netlify functions or a separate worker)
- News API integration (NewsAPI, GDELT, or similar)
- BLS Occupational Outlook API integration
- LLM-powered article classification (is this article about AI displacing this job?)
- Redis or Upstash for caching live data

---

## Version 9 — Marketplace & Partner Ecosystem
**Goal:** Become the hub connecting workers with everything they need to adapt — courses, coaches, jobs, tools.

**Features**
- **Course marketplace:** Curated courses from 20+ providers, tagged by category and job title. Revenue share with partners
- **Career coaching marketplace:** Vetted human coaches bookable through the platform
- **AI-resistant job board:** Partner with employers specifically hiring for roles with high AI resistance scores
- **Tool directory:** Reviewed list of AI tools workers can use to augment (not be replaced by) their work
- **Partner API:** Let training providers and job boards embed AI-resistance scores in their own products

**Pages**
- `/marketplace` — hub for courses, coaching, jobs, tools
- `/marketplace/courses` — filterable course directory
- `/marketplace/coaches` — coach profiles, specialties, booking
- `/marketplace/jobs` — job board filtered by AI resistance score
- `/marketplace/tools` — AI augmentation tool directory

**Database changes**
- Partners table: `id`, `name`, `type` (course/coaching/employer/tool), `api_key`, `revenue_share_rate`
- Listings table: `id`, `partner_id`, `type`, `title`, `url`, `tags[]`, `price`, `ai_resistance_score`
- Bookings table: `id`, `user_id`, `coach_id`, `scheduled_at`, `status`, `stripe_payment_id`
- Partner API keys and usage metering

**UX improvements**
- "Recommended for your score" — personalized marketplace surfacing
- Booking flow for coaching sessions fully in-app
- Reviews and ratings on coaches and courses

**Revenue opportunities**
- Affiliate commission on all course referrals (10–45%)
- Platform fee on coaching bookings (15–20%)
- Job board posting fees ($199–$499 per posting, or subscription for employers)
- Partner API license ($999/mo per integration)
- Sponsored placement in marketplace listings

**Technical improvements**
- Stripe Connect for marketplace payouts to coaches
- Booking/calendar integration (Calendly API or custom)
- Partner webhook system for real-time listing updates
- Review and fraud detection for marketplace

---

## Version 10 — Global AI Career Intelligence Platform
**Goal:** The definitive global resource for understanding and navigating AI's impact on work.

**Features**
- **Multi-language support:** Localized assessment in 10+ languages; regional scoring adjustments for local labor markets
- **Research publication platform:** Publish quarterly "State of AI & Work" reports using aggregate platform data
- **Government & policy dashboard:** Anonymized national-level risk data available to policymakers
- **University partnerships:** Embed platform in career centers; faculty get class-level risk analytics
- **Longitudinal research panel:** Opt-in cohort of users tracked quarterly — real-world data on AI displacement outcomes
- **Public API v1:** Developers can query risk scores by job title, build integrations

**Pages**
- `/research` — published reports, methodology, data
- `/research/:report-slug` — individual report page
- `/api-docs` — public API documentation
- `/partners/universities` — university partnership portal
- `/partners/government` — government data access portal
- `/{locale}/` — localized versions of all pages

**Database changes**
- Localization tables: translated question text, choice labels, result copy by locale
- Research cohorts table: opt-in user tracking with granular consent management
- API keys table: rate limits, usage tracking, billing
- Regional scoring adjustments: weight modifiers per country/region based on local labor data
- Audit log: all data access for compliance (GDPR, CCPA)

**UX improvements**
- Full i18n with right-to-left support (Arabic, Hebrew)
- Research pages are designed for sharing — clean, citation-ready layout
- Platform feels like a credible institution, not a startup tool

**Revenue opportunities**
- Public API: tiered pricing ($0 free/1K calls, $99/mo/10K, $999/mo/100K+)
- Research report sponsorships: $5,000–$25,000 per quarterly report
- University licensing: $2,000–$10,000/year per institution
- Government data contracts: $10,000–$100,000+ per engagement
- Platform acquisition / strategic investment target at this stage

**Technical improvements**
- i18n framework (react-i18next) with locale routing
- CDN-distributed assets by region (Cloudflare)
- GDPR and CCPA compliance: consent management, right to erasure, data portability
- SOC 2 Type II audit readiness (if targeting enterprise/government)
- Rate-limited, versioned public API with developer portal
- Migrate to a proper infrastructure stack if Netlify is a bottleneck (Vercel + Railway, or AWS)

---

## Summary Table

| Version | Theme | Key Unlock | Primary Revenue |
|---------|-------|-----------|-----------------|
| v1 | Polish & SEO | Discoverability | None |
| v2 | Accounts & History | Repeat visits | Freemium subscription |
| v3 | Industry Benchmarks | "How do I compare?" | Report sales, affiliates |
| v4 | Action Plans | "What do I do?" | Affiliate commissions, coaching |
| v5 | Community | Network effects | Sponsored content |
| v6 | Document Analysis | Resume & JD tools | Per-analysis, rewrite service |
| v7 | Enterprise | B2B revenue | SaaS seats, consulting |
| v8 | Live Market Data | Dynamic intelligence | API licensing, premium tier |
| v9 | Marketplace | Ecosystem revenue | Commissions, job board |
| v10 | Global Platform | Institution-level | Data licensing, research, API |

---

## Recommended Build Order

The phases above are sequential because each one builds the infrastructure the next depends on. Specifically:

- **v1 before v2** — SEO drives the user base that makes accounts worth building
- **v3 before v7** — enterprise buyers need industry data to trust the platform
- **v6 before v9** — document analysis proves LLM integration works before building a marketplace around it
- **v2 before v8** — alert system requires user accounts

The biggest architectural decision comes at **v2**: choosing the database. Supabase is the recommended choice — it handles auth, Postgres, storage, and real-time in one platform, pairs well with Netlify, and scales to v10 without a rewrite.
