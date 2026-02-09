# 🌟 RankedByUs - Community-Driven Rankings Platform

> **The internet's safest community-ranked recommendations**

A static-first, SEO-optimized ranking platform where users vote on tools, apps, and services—without the chaos of open forums.

---

## 🎯 Project Vision

**Problem:** Most review sites are filled with spam, fake reviews, and SEO noise.

**Solution:** RankedByUs uses structured user interactions (votes, tags, polls) instead of free-text posts to create clean, trustworthy rankings.

**Business Model:** Ads + Affiliate revenue from high-traffic, SEO-optimized comparison pages.

---

## 🏗️ Architecture

### Static-First Design
- **Frontend:** Next.js 14 (App Router) with SSG + ISR
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **Hosting:** Vercel (Frontend) + Supabase (Database)
- **Styling:** Tailwind CSS v4 with custom design system

### Key Principles
1. **Static-First:** Pages pre-rendered for SEO and speed
2. **Dynamic Edge:** User interactions (voting, submissions) via Edge Functions
3. **No Spam:** Zero public free-text posting, all submissions go through moderation
4. **Safe by Design:** Structured inputs only (vote, tag, suggest)

---

## ✅ What's Built (Current Status)

### Frontend (90% Complete)
- ✅ **Landing Page** (`/`)
  - Hero section with gradient design
  - Category grid
  - How It Works section
  - Modern dark theme with glassmorphism

- ✅ **Category Pages** (`/category/[slug]`)
  - Dynamic routing
  - Ranking list with vote UI
  - Tool cards with tags
  - Affiliate CTAs

- ✅ **Interactive Components**
  - VoteButtons (with optimistic UI)
  - SubmitToolModal (form validation)
  - Responsive navigation

### Backend (Schema Ready)
- ✅ Database schema (`supabase/schema.sql`)
- ✅ TypeScript types (`types/database.types.ts`)
- ✅ Supabase client utilities
- ✅ API routes (mock implementation)

### Design System
- ✅ Custom Tailwind theme (Slate + Blue/Purple)
- ✅ CSS variables for theming
- ✅ Dark mode optimized
- ✅ Accessible contrast ratios

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
RankedByUs/
├── docs/
│   ├── RANKED_BY_US_MASTER_PLAN.md   # Full strategy & architecture
│   ├── FRONTEND_PROGRESS.md          # Current progress tracking
│   └── NEXT_STEPS.md                 # Detailed integration guide
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── vote/             # Voting API endpoint
│   │   │   ├── category/
│   │   │   │   └── [slug]/           # Dynamic category pages
│   │   │   ├── globals.css           # Custom theme
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── page.tsx              # Landing page
│   │   ├── components/
│   │   │   ├── VoteButtons.tsx       # Interactive voting
│   │   │   └── SubmitToolModal.tsx   # Tool submission
│   │   └── lib/
│   │       ├── supabase/             # Supabase clients
│   │       └── utils.ts              # Utilities
│   ├── types/
│   │   └── database.types.ts         # TypeScript types
│   ├── supabase/
│   │   └── schema.sql                # Database schema
│   └── package.json
```

---

## 🎨 Design Philosophy

### Premium Feel
- **Gradients:** Blue → Purple color scheme
- **Glassmorphism:** Backdrop blur effects
- **Micro-animations:** Smooth transitions on hover
- **Modern Typography:** Clean, readable fonts

### SEO-First
- **Static HTML:** Pre-rendered pages
- **Schema.org:** Rich snippets for Google
- **Fast Loading:** Core Web Vitals optimized
- **Semantic HTML:** Proper heading hierarchy

---

## 🔄 Data Flow

### Voting Flow
1. User clicks upvote/downvote
2. **Optimistic UI update** (instant feedback)
3. API call to `/api/vote`
4. Session validation (cookie-based)
5. Database update (Supabase)
6. Score recalculation
7. ISR revalidation (optional)

### Submission Flow
1. User fills form in modal
2. Submit to `/api/submit-tool`
3. Item saved with `status: 'pending'`
4. Admin reviews in dashboard
5. On approval → `status: 'approved'` + ISR revalidation
6. New tool appears in rankings

---

## 📊 Ranking Algorithm

**Current Implementation:** Simple vote count
```
Score = Upvotes - Downvotes
```

**Planned Enhancement:**
```
Score = (R * V) + (C * 0.5) - (D * t)

Where:
R = Average Rating
V = log10(Total Votes + 1)
C = Wilson Score Confidence
D = Decay factor for old votes
```

---

## 🛡️ Security & Anti-Spam

1. **Session-based voting:** Cookie fingerprinting prevents multiple votes
2. **Rate limiting:** Max 10 votes per hour per session
3. **Moderation queue:** All submissions reviewed before going live
4. **No public text:** Zero spam vectors for SEO manipulation

---

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Frontend design
- [x] Interactive components
- [ ] Supabase integration
- [ ] Basic admin panel
- [ ] Deploy to Vercel

### Phase 2: Growth
- [ ] Tags system
- [ ] Search & filters
- [ ] User authentication (optional)
- [ ] Email notifications

### Phase 3: Monetization
- [ ] Google AdSense integration
- [ ] Affiliate link tracking
- [ ] Sponsored placements
- [ ] Premium listings

### Phase 4: Scale
- [ ] Programmatic SEO (1000s of pages)
- [ ] Multi-language support
- [ ] Mobile app
- [ ] API for third-party integrations

---

## 📈 Target Metrics

### MVP Goals (Month 1)
- 10,000 page views
- 100 tools ranked
- 5,000 community votes
- $100 in affiliate revenue

### Growth Goals (Month 6)
- 100,000 page views/month
- 1,000 tools across 20 categories
- 50,000 votes
- $1,000/month revenue

---

## 🤝 Contributing

This is currently a solo project, but open to collaboration once the MVP is live.

---

## 📄 License

Proprietary - All rights reserved

---

## 🔗 Links

- **Documentation:** See `/docs` folder
- **Figma:** (Coming soon)
- **Live Demo:** (Coming soon after Supabase integration)

---

## 👨‍💻 Built With

- [Next.js 14](https://nextjs.org) - React framework
- [Tailwind CSS v4](https://tailwindcss.com) - Styling
- [Supabase](https://supabase.com) - Backend
- [Vercel](https://vercel.com) - Hosting
- [TypeScript](https://www.typescriptlang.org) - Type safety

---

**Status:** Frontend complete, awaiting Supabase integration for full MVP launch.

**Next Step:** Follow `docs/NEXT_STEPS.md` to integrate Supabase and deploy.
