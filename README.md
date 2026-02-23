# RankedByUs - Community-Driven Tool Rankings

A modern ranking platform where the community votes on the best tools across categories like AI Writing, Image Generation, Code Assistants, and more.

## 🚀 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions, RLS)
- **Deployment:** Vercel (Frontend) + Supabase (Database)

## 📂 Project Structure

```
├── src/                    # Application source code
│   ├── app/                # Next.js pages & API routes
│   ├── components/         # Reusable UI components
│   ├── lib/                # Supabase clients, utilities
│   ├── config/             # Site configuration
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── types/                  # Database type definitions
├── scripts/                # Data seeding & migration scripts
├── migrations/             # Incremental SQL migrations
├── supabase/               # Core database schema & seed data
├── docs/                   # Project documentation
└── .env.local              # Environment variables (not in git)
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🛡️ Admin Dashboard

Manage tools and reviews at `/admin`:
1. Configure `ADMIN_PASSWORD` in your environment variables.
2. Login at `/admin/login`.
3. Approve/Reject new submissions in real-time.

## 📊 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=your_admin_password
```

## 📖 Documentation

See the `docs/` folder for:
- **fullproject-building-plan.md** — Project roadmap
- **MASTER_PLAN.md** — Strategy & architecture
- **TESTING_GUIDE.md** — QA checklist
- **SUPABASE_INTEGRATION_COMPLETE.md** — Database setup guide
