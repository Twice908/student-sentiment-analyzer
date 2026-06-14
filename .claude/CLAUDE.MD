# CLAUDE.md — VoiceIt: Anonymous Student Sentiment Analyzer

This file defines coding standards, conventions, and the phased development plan for this project.
Claude Code must read this file at the start of every session.

---

## Project Identity

- **App Name:** VoiceIt
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts · Firebase Firestore · Google Gemini API
- **Goal:** Anonymous student feedback collection with AI sentiment analysis and a teacher dashboard
- **SDG Alignment:** SDG 3 (Good Health & Well-Being) · SDG 4 (Quality Education)

---

## Coding Standards

### General

- Language: TypeScript everywhere. No plain `.js` files.
- No `any` types. Define all types in `lib/types.ts`.
- All components use named exports (no default exports except page files).
- No unused imports. No commented-out code committed.
- All async functions must have try/catch with typed error handling.

### File & Folder Conventions

```
app/                   # Next.js App Router pages only
components/            # Reusable UI components, grouped by feature
lib/                   # Utilities, types, Firebase, Gemini clients
```

- Component files: PascalCase (`FeedbackForm.tsx`)
- Utility/lib files: camelCase (`firebase.ts`)
- One component per file. No multi-export component files.

### Next.js

- Use App Router only. No `pages/` directory.
- Add `"use client"` only when the component uses hooks or browser APIs.
- Server Components are the default — keep them server-side where possible.
- API routes live in `app/api/*/route.ts`. Each route exports named HTTP methods (`GET`, `POST`).

### Tailwind CSS

- No inline `style={{}}` unless Tailwind cannot express it.
- No custom CSS classes unless absolutely necessary.
- Responsive classes follow mobile-first: `base → sm → md → lg`.
- Color palette is fixed — do not introduce new colors:

| Token | Hex | Usage |
|---|---|---|
| Primary | `#0D5C63` | Buttons, active states, headings |
| Primary Light | `#2E9EA8` | Chart accent, hover states |
| Surface | `#A8D8DC` | Subtle backgrounds, badges |
| Background | `#E8E4F0` | Page background |
| Card | `#FAFAF8` | Card backgrounds |
| Accent | `#F59E0B` | Stress badges, highlights |

### Recharts

- Always set `isAnimationActive={false}` on all chart elements.
- Wrap every chart in a `<ResponsiveContainer width="100%" height={N}>`.
- Use only teal palette colors (`#0D5C63`, `#2E9EA8`, `#A8D8DC`) plus amber (`#F59E0B`) for stress indicators.

### Firebase

- Client initialized once in `lib/firebase.ts`. Import `db` from there only.
- Never call Firebase directly from a component. All Firestore logic lives in `lib/` helper functions.
- Collection name: `feedback` (lowercase, singular).
- Never store: name, email, IP address, device ID, or any PII.

### Gemini AI

- Client initialized in `lib/gemini.ts`.
- Model: `gemini-1.5-flash` only.
- Always request JSON output. Parse and validate before use.
- Wrap every Gemini call in try/catch. On failure, return a safe fallback object — never throw to the UI.
- Expected response shape is defined in `lib/types.ts` as `AnalysisResult`.

### Environment Variables

- All secrets in `.env.local`. Never commit this file.
- Firebase public keys use `NEXT_PUBLIC_` prefix.
- Gemini key: `GEMINI_API_KEY` (server-only, no `NEXT_PUBLIC_`).

### Error Handling

- API routes return consistent shape:
  - Success: `{ success: true, data: <payload> }`
  - Error: `{ success: false, error: "<message>" }`
- HTTP status codes: 200 OK · 400 Bad Request · 500 Internal Server Error
- Never expose raw error messages or stack traces to the client.

### Mock Data

- All mock data lives in `lib/mockData.ts`.
- As real data replaces mock data phase by phase, remove the corresponding mock.
- Never mix mock and real data in the same component.

---

## Current Status

✅ Phase 0 — UI Skeleton (COMPLETE)

- Landing page (`/`)
- Student feedback form (`/feedback`) with mock submit + analysis card
- Teacher dashboard (`/dashboard`) with mock charts and AI summary card
- `lib/types.ts`, `lib/mockData.ts`
- Placeholder `lib/firebase.ts`, `lib/gemini.ts`
- Build passing, all routes 200, mobile responsive confirmed

✅ Phase 1 — Firebase Integration (COMPLETE)

- `lib/firebase.ts`, `lib/feedbackService.ts` wired to real Firestore
- `app/api/feedback/route.ts` GET/POST against the `feedback` collection
- Dashboard reads real aggregated stats

✅ Phase 2 — Gemini AI Integration (COMPLETE)

- `lib/gemini.ts` calls `gemini-1.5-flash` via `analyzeMessage()`, with JSON validation and safe fallback
- `app/api/analyze/route.ts` POST endpoint
- `FeedbackForm.tsx` calls `/api/analyze` then `/api/feedback`, shows real analysis badges and an "Analyzing your feedback…" loading state
- `mockAnalysis` removed from `lib/mockData.ts`

✅ Phase 3 — AI Summary Report (COMPLETE)

- `generateDashboardSummary()` added to `lib/gemini.ts` with safe fallback
- `app/api/summary/route.ts` GET endpoint returns `{ summary, generatedAt }`
- `AISummaryCard.tsx` fetches real summary on mount, supports regenerate, shows loading spinner and timestamp
- `aiSummary` mock removed from `lib/mockData.ts`

---

## Phases

---

### Phase 1 — Firebase Integration ✅ COMPLETE

**Goal:** Wire real Firestore reads and writes. No AI yet.

**Tasks:**

1. Complete `lib/firebase.ts`
   - Initialize Firebase app (guard against re-initialization)
   - Export `db` (Firestore instance)

2. Create `lib/feedbackService.ts`
   - `saveFeedback(entry: Omit<FeedbackEntry, 'id' | 'createdAt'>): Promise<string>` — writes to `feedback` collection
   - `getAllFeedback(): Promise<FeedbackEntry[]>` — reads all documents ordered by `createdAt` desc
   - `getFeedbackStats(): Promise<DashboardStats>` — computes sentiment/stress/category distributions

3. Create `app/api/feedback/route.ts`
   - `POST` — accepts `{ title?, message, sentiment, stressLevel, category, summary }`, saves to Firestore, returns `{ success: true, id }`
   - `GET` — returns all feedback entries for dashboard

4. Update `app/dashboard/page.tsx`
   - Fetch real stats via `GET /api/feedback`
   - Replace all mock chart data with real aggregated counts
   - Keep the AI Summary Card on mock until Phase 2

5. Add `DashboardStats` type to `lib/types.ts`:
```typescript
export interface DashboardStats {
  total: number;
  todayCount: number;
  sentimentCounts: Record<Sentiment, number>;
  stressCounts: Record<StressLevel, number>;
  categoryCounts: Record<Category, number>;
}
```

**Done when:** Submitting the form saves a document in Firestore. Dashboard charts reflect real Firestore data.

---

### Phase 2 — Gemini AI Integration ✅ COMPLETE

**Goal:** Every feedback submission is analyzed by Gemini before saving.

**Tasks:**

1. Complete `lib/gemini.ts`
   - Initialize `GoogleGenerativeAI` with `GEMINI_API_KEY`
   - Export `analyzeMessage(message: string): Promise<AnalysisResult>`
   - Prompt must instruct Gemini to return only valid JSON matching `AnalysisResult`
   - Validate parsed response shape before returning
   - On any error, return safe fallback: `{ sentiment: "Neutral", stressLevel: "Low", category: "General Feedback", summary: "Unable to analyze at this time." }`

2. Create `app/api/analyze/route.ts`
   - `POST` — accepts `{ message: string }`, calls `analyzeMessage()`, returns `AnalysisResult`

3. Update `app/feedback/page.tsx` (FeedbackForm)
   - On submit: call `POST /api/analyze` first
   - Then call `POST /api/feedback` with message + analysis result
   - Show real analysis in `SubmissionSuccess.tsx` (replace mock badges)
   - Show loading state during analysis ("Analyzing your feedback…")

4. Gemini prompt template (use exactly this structure):
```
You are an educational sentiment analyzer. Analyze the student message below.
Return ONLY a valid JSON object with no extra text, no markdown, no backticks.

Message: "${message}"

Response format:
{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "stressLevel": "Low" | "Moderate" | "High",
  "category": "Exams" | "Assignments" | "Teaching Quality" | "Bullying" | "Mental Well-Being" | "Facilities" | "Career Concerns" | "Time Management" | "General Feedback",
  "summary": "<one sentence describing the student concern>"
}
```

**Done when:** Form submission triggers Gemini, shows real analysis badges, and saves the full entry to Firestore.

---

### Phase 3 — AI Summary Report ✅ COMPLETE

**Goal:** Auto-generate an AI summary of all feedback for the teacher dashboard.

**Tasks:**

1. Add `generateDashboardSummary(entries: FeedbackEntry[]): Promise<string>` to `lib/gemini.ts`
   - Pass the last 50 entries (message + category + stressLevel) to Gemini
   - Prompt: summarize common themes, stress patterns, and recommendations in 3–4 sentences
   - Return plain text string

2. Create `app/api/summary/route.ts`
   - `GET` — fetches last 50 entries from Firestore, calls `generateDashboardSummary()`, returns `{ summary: string, generatedAt: string }`

3. Update `AISummaryCard.tsx`
   - Fetch from `GET /api/summary` on mount
   - "Regenerate Summary" button re-calls the endpoint
   - Show loading spinner during generation
   - Show `generatedAt` timestamp from response

**Done when:** Dashboard shows a real AI-generated summary based on actual submissions.

---

### Phase 4 — Polish & Deploy

**Goal:** Production-ready, deployable MVP.

**Tasks:**

1. Input validation
   - Feedback message: minimum 10 characters, maximum 1000 characters (enforce server-side in API route)
   - Return 400 with `{ success: false, error: "Message must be between 10 and 1000 characters." }` on violation

2. Rate limiting (basic)
   - Add a simple in-memory cooldown on `POST /api/analyze`: max 5 requests per minute per IP
   - Return 429 if exceeded

3. Loading & error states
   - Every page that fetches data must have: loading skeleton, error message, empty state
   - Use consistent spinner component

4. Remove all mock data
   - Delete all mock-specific code from `lib/mockData.ts`
   - Confirm `lib/mockData.ts` is empty or removed

5. Environment check
   - On startup, validate all required env vars are present
   - Log a clear error and exit if any are missing

6. Vercel deployment
   - Add all env vars to Vercel project settings
   - Confirm build passes with `npm run build`
   - Confirm all routes return expected responses on production URL

7. README.md
   - Setup instructions
   - Environment variable reference
   - How to run locally
   - How to deploy

**Done when:** App is live on Vercel, all 4 flows work end-to-end, no mock data remains.

---

## Definition of Done (Full Project)

- [ ] Students can submit anonymous feedback
- [ ] Gemini analyzes every submission (sentiment, stress, category, summary)
- [ ] All feedback stored in Firestore with no PII
- [ ] Dashboard shows real aggregated charts
- [ ] AI summary generated from real data
- [ ] No mock data in production
- [ ] Deployed and accessible on Vercel
- [ ] README complete

---

## What This Project Is NOT

Do not add any of the following — they are explicitly out of scope:

- User authentication or login for students
- Crisis detection or mental health diagnosis
- Email notifications
- Multi-school or multi-tenant support
- Admin password protection (deferred)
- Trend analysis over time periods
- Multilingual support