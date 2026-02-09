# 🎯 Next Steps for RankedByUs MVP

## Overview
We've successfully built the **frontend foundation** with a modern, premium design. The site is now visually complete with interactive components. The next critical steps are to integrate Supabase and deploy the MVP.

---

## 🚀 IMMEDIATE PRIORITY: Supabase Setup & Integration

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project initialization (~2 minutes)
4. Navigate to **SQL Editor**
5. Paste the contents of `web/supabase/schema.sql`
6. Click "Run" to create tables

### Step 2: Get Credentials
1. Go to **Project Settings** → **API**
2. Copy:
   - `Project URL` → Set as `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - `anon/public key` → Set as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

### Step 3: Seed Initial Data
Create a SQL script to add initial categories and tools:

```sql
-- Insert categories
INSERT INTO categories (slug, name, description) VALUES
('ai-writing-tools', 'AI Writing Tools', 'Best AI-powered writing assistants'),
('ai-image-generators', 'AI Image Generators', 'Top-rated AI image creation tools'),
('ai-video-tools', 'AI Video Tools', 'Best AI video editing and generation'),
('ai-code-assistants', 'AI Code Assistants', 'Top AI coding companions');

-- Insert a few sample tools
INSERT INTO items (category_id, name, slug, description, website_url, affiliate_link, status) 
SELECT 
  (SELECT id FROM categories WHERE slug = 'ai-writing-tools'),
  'ChatGPT',
  'chatgpt',
  'Advanced AI chatbot for writing, coding, and creative tasks',
  'https://chat.openai.com',
  'https://chat.openai.com',
  'approved';
```

---

## 🔨 Development Tasks (Post-Supabase)

### Task 1: Update Category Page to Use Real Data
**File:** `src/app/category/[slug]/page.tsx`

Replace mock data with Supabase queries:

```typescript
import { createClient } from '@/lib/supabase/server';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();
  
  // Fetch items with rankings
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('category_id', category.id)
    .eq('status', 'approved')
    .order('score', { ascending: false });
  
  // ... rest of component
}
```

### Task 2: Implement Real Voting API
**File:** `src/app/api/vote/route.ts`

Replace mock with real Supabase logic:

```typescript
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { item_id, value } = await request.json();
  
  // Get or create session ID from cookies
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('session_id')?.value;
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set('session_id', sessionId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
    });
  }
  
  // Check existing vote
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('item_id', item_id)
    .eq('session_id', sessionId)
    .single();
  
  if (existingVote) {
    if (value === null) {
      // Remove vote
      await supabase.from('votes').delete().eq('id', existingVote.id);
    } else {
      // Update vote
      await supabase.from('votes').update({ value }).eq('id', existingVote.id);
    }
  } else if (value !== null) {
    // Insert new vote
    await supabase.from('votes').insert({ item_id, session_id: sessionId, value });
  }
  
  // Recalculate score (you may want to use a database function for this)
  // For now, simple count:
  const { count: upvotes } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', item_id)
    .eq('value', 1);
  
  const { count: downvotes } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', item_id)
    .eq('value', -1);
  
  const newScore = (upvotes || 0) - (downvotes || 0);
  
  await supabase.from('items').update({ score: newScore }).eq('id', item_id);
  
  return NextResponse.json({ success: true, new_score: newScore });
}
```

### Task 3: Create Submit Tool API
**File:** `src/app/api/submit-tool/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { name, website_url, description, category } = await request.json();
  
  // Find category ID
  const { data: categoryData } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category)
    .single();
  
  if (!categoryData) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  
  // Insert item with pending status
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const { error } = await supabase.from('items').insert({
    category_id: categoryData.id,
    name,
    slug,
    description,
    website_url,
    affiliate_link: website_url, // Can be updated later
    status: 'pending',
  });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
```

### Task 4: Update SubmitToolModal to Call API
**File:** `src/components/SubmitToolModal.tsx`

Replace the mock submission with:

```typescript
const response = await fetch('/api/submit-tool', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

---

## 📦 Additional Features (Phase 2)

### 1. Admin Dashboard
- Create `/admin` route with password protection
- List pending submissions
- Approve/reject buttons
- Trigger ISR revalidation

### 2. Tags System
- Add `tags` table
- Allow users to tag tools
- Display tag cloud

### 3. Search & Filters
- Add search bar
- Filter by tags
- Sort options (Trending, All-Time, New)

### 4. Analytics & Monetization
- Google Analytics integration
- Google AdSense placement
- Affiliate link tracking

---

## 🎨 Design Enhancements (Optional)

1. **Add Loading States**
   - Skeleton loaders for category pages
   - Smooth transitions

2. **Error Handling**
   - 404 page design
   - Error boundaries
   - Toast notifications

3. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Focus management

---

## 📊 Testing Checklist

Before launch, verify:

- [ ] Homepage loads and displays all sections
- [ ] Category pages load with correct data
- [ ] Voting works (upvote/downvote/toggle)
- [ ] Submit tool modal works
- [ ] Mobile responsive design
- [ ] Core Web Vitals score > 90
- [ ] All links work
- [ ] SEO meta tags are correct

---

## 🚢 Deployment

### Vercel Deployment
1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Domain Setup
1. Add custom domain in Vercel
2. Configure DNS
3. Enable SSL

---

## 📈 Post-Launch

1. **Monitor Analytics**
   - Track page views
   - Monitor vote patterns
   - Watch for spam

2. **Content Strategy**
   - Add 10 tools per category
   - Weekly updates
   - Community engagement

3. **SEO Optimization**
   - Submit sitemap to Google
   - Start building backlinks
   - Create programmatic pages

---

**Current Status:** Frontend 90% complete, Backend 0% (Supabase setup pending)

**Time to MVP:** ~2-4 hours with Supabase integration
