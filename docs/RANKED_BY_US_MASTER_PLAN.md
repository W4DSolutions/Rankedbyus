# RankedByUs – Master Strategic Plan

## 1. High-Level Architecture (Textual Diagram)

The system follows a **Static-First, Dynamic-Edge** architecture designed for maximum SEO performance, low latency, and high scalability.

**Layer 1: The Static Core (Frontend & Content)**
- **Technology:** Next.js 14+ (App Router)
- **Rendering Strategy:** 
  - **SSG (Static Site Generation):** For 95% of the page content (intro, comparison tables, affiliate links).
  - **ISR (Incremental Static Regeneration):** Rebuilds pages periodically (e.g., every hour) to bake in new rankings into the static HTML.
- **Hosting:** Vercel (Global Edge Network)
- **Styling:** Tailwind CSS (Utility-first, purgeable, small bundle size).

**Layer 2: The Dynamic Edge (User Interaction)**
- **Technology:** Vercel Edge Functions / Next.js API Routes
- **Functionality:** Handles real-time interactions (Voting, Polling, Tagging) without page reloads.
- **Data Flow:** User clicks vote -> Edge Function -> Supabase DB -> Update UI via React State (Optimistic UI) & Revalidate ISR path.

**Layer 3: Data & Logic (Backend)**
- **Database:** Supabase (PostgreSQL)
  - `items`: The tools/places being ranked.
  - `votes`: Individual vote records (linked to session/user).
  - `rankings`: Aggregate scores (materialized view or cached table).
- **Caching:** Redis (Upstash) for high-frequency counters (vote throttling, real-time score reads).
- **Auth:** Supabase Auth (Optional for voters, Mandatory for Admins).
- **Validation:** Zod schema validation on all inputs.

**Layer 4: Management (Admin)**
- **Interface:** Retool or Custom Next.js Admin Route.
- **Actions:** Moderation queue, affiliate link management, manual revalidation triggers.

---

## 2. Data Model (Supabase / Update)

We will use a relational schema optimized for aggregations.

### `categories`
- `id`: UUID
- `slug`: String (e.g., `ai-writing-tools`) [Unique, Index]
- `name`: String
- `description`: Text (Markdown)
- `seo_meta`: JSONB

### `items`
- `id`: UUID
- `category_id`: UUID [FK -> categories.id]
- `name`: String
- `slug`: String [Unique, Index]
- `affiliate_link`: String
- `logo_url`: String
- `website_url`: String
- `featured`: Boolean (default false)
- `status`: Enum (pending, approved, rejected)
- `created_at`: Timestamp

### `votes`
- `id`: UUID
- `item_id`: UUID [FK -> items.id]
- `session_id`: String (Fingerprint/Hash) [Index]
- `user_id`: UUID (Optional)
- `value`: Int (1 for up, -1 for down, or 1-5 for range)
- `created_at`: Timestamp

### `rankings_snapshot` (For fast reads/SSG)
- `item_id`: UUID [FK -> items.id]
- `score`: Float
- `vote_count`: Int (1h, 24h, 7d, all-time)
- `last_updated`: Timestamp

### `tags` / `item_tags`
- Predefined descriptive tags (e.g., "Free Plan", "Enterprise Ready") linked to items.

---

## 3. Ranking Algorithm

The **"TrustScore"** algorithm prioritizes recent consensus over historical volume to keep rankings fresh.

**Formula:**
`Score = (R * V) + (C * 0.5) - (D * t)`

Where:
- **R (Average Rating):** The mean score (1-5) or net upvotes.
- **V (Log Volume):** `log10(Total Votes + 1)`. Prevents high-volume spam from dominating purely by quantity.
- **C (Confidence):** Lower bound of Wilson Score Interval (filters out "1 vote, 5 stars" anomalies).
- **D (Decay):** Logic to slightly dampen votes older than 6 months.
- **Anti-Spam Weight:** Votes from flagged IPs or suspicious patterns (bursts) have a weight of 0.

*Note: Initially, we will use a simpler **Weighted Average** for MVP:*
`Score = (Positive Votes - Negative Votes) + (New Votes in last 7d * 2)`

---

## 4. MVP Feature List (Mandatory)

**Niche:** **"Best AI Tools for Creators"** (High CPM, Affiliate friendly)

### Frontend (Public)
1. **Landing Page:** List of top categories (Writing, Image Gen, Video, Audio).
2. **Category Page:**
   - Static SEO Intro.
   - Dynamic List of Tools (sorted by Rank).
   - "Upvote" button (Optimistic UI).
   - "Visit Website" button (Affiliate link wrapper).
3. **Submit Tool Modal:** Simple form for users to suggest (Name, URL, Category).

### Backend (API/Edge)
1. `GET /api/rankings`: Fetch live scores (for client-side hydration).
2. `POST /api/vote`: Handle upvotes with fingerprinting (IP + UserAgent hash).
3. `POST /api/suggest`: Add to moderation queue.

### Admin
1. **Simple Dashboard:** List of pending tools. "Approve" button triggers `revalidatePath`.

---

## 5. Production Roadmap

**Phase 1: MVP (Days 1-7)**
- Setup Next.js, Tailwind, Supabase.
- Implement "AI Tools" schema.
- Build static category pages.
- Integrate basic voting (cookie-based protection).
- Deploy to Vercel + Google Analytics.

**Phase 2: Growth & Interaction (Days 8-14)**
- Add "Tags" system (users can tag tools "Free", "Paid", "Freemium").
- Implement "Reviews" (Star rating only, no text).
- Add "Sorting" (Trending vs. All Time).
- **Monetization:** Add AdSense slots between Rank #3 and #4.

**Phase 3: Automation (Days 15-30)**
- **Programmatic SEO:** Generate pages for "Best Free [Category]", "Best [Category] for Mac".
- **Email Digest:** "Top 5 New AI Tools this Week" (newsletter capture).
- **Data Enrichment:** Auto-fetch generic icons/descriptions using AI.

---

## 6. SEO & Monetization Strategy

### SEO Strategy (Programmatic & Static)
1. **Keyword Targeting:** "Best [X]", "Top Rated [X]", "[X] vs [Y]".
2. **Schema.org:**
   - `ItemList` schema for the ranking table.
   - `AggregatedRating` for individual tools.
   - `SoftwareApplication` schema.
3. **Speed:** Core Web Vitals < 2.5s LCP. Zero CLS from ads (fixed height containers).

### Monetization
1. **Affiliate (Primary):**
   - Direct partnerships (Jasper, Copy.ai via Impact/PartnerStack).
   - Amazon Associates (for hardware niches later).
2. **Ads (Secondary):**
   - Display ads in sidebar and inter-content.
   - Native ads: "Sponsor this ranking" (Pinned #1 spot).

---

## 7. Key Risks & Mitigations

- **Risk: Spam Voting.**
  - *Mitigation:* Browser fingerprinting + Rate limiting (10 votes/hour) + Recaptcha v3 (invisible).
- **Risk: Content Staleness.**
  - *Mitigation:* ISR (rebuild every hour). "Trending" tab highlights movers.
- **Risk: Low Initial Traffic.**
  - *Mitigation:* Launch on Product Hunt + Reddit. "Submit your tool" feature incentivizes founders to share.

---

## 8. Final Technical Decisions Summary

- **Framework:** Next.js 14 App Router (React Server Components).
- **Styling:** Tailwind CSS + Shadcn/UI (for rapid component building).
- **Database:** Supabase (PostgreSQL).
- **Hosting:** Vercel Pro (if possible) or Hobby for MVP.
- **Niche:** **AI Tools** (Validated demand, high affiliate payouts).
