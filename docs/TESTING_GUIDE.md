# 🧪 Testing Guide for RankedByUs

This guide will help you test all features of the RankedByUs platform before launch.

---

## 🚀 Quick Start

### 1. Start Development Server

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Testing Checklist

### Homepage (`/`)

- [ ] **Hero Section**
  - [ ] Title displays correctly
  - [ ] Gradient background renders
  - [ ] Stats show placeholder numbers
  - [ ] CTA buttons are visible and styled

- [ ] **Category Grid**
  - [ ] All 4 categories display
  - [ ] Hover effects work (border glow, arrow appears)
  - [ ] Click navigates to category page

- [ ] **How It Works Section**
  - [ ] Icons display correctly
  - [ ] Text is readable
  - [ ] Layout is centered

- [ ] **Navigation**
  - [ ] Logo links to homepage
  - [ ] Submit Tool modal opens
  - [ ] Header is sticky on scroll

---

### Category Pages (`/category/ai-writing-tools`)

- [ ] **Page Load**
  - [ ] Category header displays with emoji
  - [ ] Description shows
  - [ ] Tool count appears

- [ ] **Rankings List**
  - [ ] All tools display in order
  - [ ] #1, #2, #3 have special colors (gold, silver, bronze)
  - [ ] Tool logos load
  - [ ] Tags display correctly

- [ ] **Voting UI**
  - [ ] Upvote button changes color when clicked
  - [ ] Downvote button changes color when clicked
  - [ ] Score updates immediately (optimistic)
  - [ ] Click same button again to unvote
  - [ ] Vote count displays

- [ ] **Tool Cards**
  - [ ] Descriptions are readable
  - [ ] Tags are visible
  - [ ] "Visit Website" button works
  - [ ] "Learn More" link works

---

### Submit Tool Modal

- [ ] **Modal Open/Close**
  - [ ] Clicks "Submit Tool" button → modal opens
  - [ ] Click backdrop → modal closes
  - [ ] Click X button → modal closes
  - [ ] Press Escape → modal closes

- [ ] **Form Validation**
  - [ ] Try submitting empty form → validation errors
  - [ ] Fill all fields → submit works
  - [ ] URL requires valid format
  - [ ] Success message displays
  - [ ] Modal auto-closes after success

- [ ] **Form Fields**
  - [ ] Tool Name input works
  - [ ] Website URL input works
  - [ ] Category dropdown shows options
  - [ ] Description textarea works

---

### Admin Dashboard (`/admin`)

- [ ] **Page Load**
  - [ ] Dashboard displays
  - [ ] Stats cards show numbers
  - [ ] Pending submissions list appears

- [ ] **Pending Submissions**
  - [ ] Each submission shows:
    - [ ] Tool name
    - [ ] Description
    - [ ] Category
    - [ ] Website link
    - [ ] Submit date
  - [ ] Approve button styled
  - [ ] Reject button styled
  - [ ] Click buttons (mock - no action yet)

- [ ] **Navigation**
  - [ ] "Back to Site" link works

---

### 404 Page (`/nonexistent-page`)

- [ ] **404 Page**
  - [ ] 404 message displays
  - [ ] Emoji shows
  - [ ] "Go Home" button works
  - [ ] "Browse Categories" button works

---

### Responsive Design

Test at different viewports:

#### Mobile (375px)
- [ ] Navigation collapses properly
- [ ] Category grid stacks vertically
- [ ] Vote buttons are touch-friendly
- [ ] Modal fits screen
- [ ] Text is readable

#### Tablet (768px)
- [ ] Category grid shows 2 columns
- [ ] Rankings list adapts
- [ ] Navigation shows all items

#### Desktop (1440px)
- [ ] Category grid shows 4 columns
- [ ] Max-width containers center content
- [ ] Rankings list is well-spaced

---

### Performance Testing

- [ ] **Lighthouse Audit**
  - [ ] Run Lighthouse in Chrome DevTools
  - [ ] Performance score > 90
  - [ ] Accessibility score > 90
  - [ ] Best Practices score > 90
  - [ ] SEO score > 90

- [ ] **Core Web Vitals**
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1

- [ ] **Loading**
  - [ ] Pages load quickly
  - [ ] No layout shift
  - [ ] Images load progressively

---

### Browser Compatibility

Test in multiple browsers:

- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

---

### Accessibility Testing

- [ ] **Keyboard Navigation**
  - [ ] Tab through all interactive elements
  - [ ] Enter/Space activates buttons
  - [ ] Escape closes modal
  - [ ] Focus indicators visible

- [ ] **Screen Reader**
  - [ ] Page structure makes sense
  - [ ] Buttons have descriptive labels
  - [ ] Images have alt text
  - [ ] Headings are hierarchical

- [ ] **Color Contrast**
  - [ ] Text meets WCAG AA standards
  - [ ] Buttons are distinguishable
  - [ ] Links are identifiable

---

### Session & State Management

- [ ] **Local Storage**
  - [ ] Open DevTools → Application → Local Storage
  - [ ] Vote on something → check for session ID
  - [ ] Refresh page → session persists

- [ ] **Optimistic UI**
  - [ ] Vote updates instantly
  - [ ] If server fails, reverts
  - [ ] No double-voting possible

---

## 🐛 Common Issues to Check

### Visual Issues
- [ ] Gradients render smoothly
- [ ] No text overflow
- [ ] No broken images
- [ ] Animations are smooth (not janky)

### Functional Issues
- [ ] All links work
- [ ] Forms submit correctly
- [ ] Modals open/close properly
- [ ] Votes register

### Performance Issues
- [ ] No excessive re-renders
- [ ] No memory leaks
- [ ] Fast page transitions
- [ ] Smooth scrolling

---

## 🔧 Debug Tools

### Browser DevTools
```
F12 → Open DevTools
```

- **Console:** Check for errors
- **Network:** Monitor API calls
- **Application:** Check Local Storage
- **Performance:** Profile rendering

### React DevTools
```
Install React DevTools extension
```

- Component tree inspection
- Props debugging
- State monitoring

---

## 📊 Test Scenarios

### Scenario 1: New User Visits Site
1. Clear browser data
2. Visit homepage
3. Browse categories
4. Vote on a tool
5. Submit a new tool
6. Check session ID saved

### Scenario 2: Returning User
1. Refresh page
2. Check votes persist
3. Try voting again (should work)
4. Check session ID unchanged

### Scenario 3: Admin Review
1. Go to `/admin`
2. View pending submissions
3. Click approve/reject
4. (Currently mock - no action)

---

## 🚀 Pre-Launch Checklist

Before connecting Supabase:

- [ ] All visual tests pass
- [ ] Forms validate correctly
- [ ] Responsive design works
- [ ] No console errors
- [ ] Lighthouse scores > 90
- [ ] Session tracking works

After connecting Supabase:

- [ ] Votes persist to database
- [ ] Submissions go to moderation queue
- [ ] Category pages load real data
- [ ] ISR updates pages
- [ ] Admin dashboard shows real data

---

## 📝 Reporting Issues

When you find a bug, note:

1. **What you did** (steps to reproduce)
2. **What happened** (actual behavior)
3. **What should happen** (expected behavior)
4. **Browser/device** (environment)
5. **Screenshot** (if visual issue)

---

## ✅ Sign-Off

Once all tests pass, the frontend is ready for Supabase integration!

**Tester:** _________________  
**Date:** _________________  
**Status:** [ ] Passed  [ ] Failed  
**Notes:** _________________
