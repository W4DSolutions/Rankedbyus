
# Phase 4: Admin & Analytics Execution Plan

## Objective
Enhance the Admin Dashboard with actionable analytics and implement a user feedback loop for tool submissions.

## 1. Analytics Architecture
- [ ] **Database Schema**:
    - [ ] Add `view_count` to `articles` table.
    - [ ] Create `article_views` table for time-series tracking (similar to `clicks`).
    - [ ] Create RPC function `increment_article_view` for atomic updates.
- [ ] **Data Collection**:
    - [ ] Update `ArticlePage` to log views on load (client-side effect or server-side logging).
    - [ ] Ensure `clicks` on tools are already being tracked (verified in `go/[slug]`).

## 2. Admin Dashboard Enhancements
- [ ] **Visualizations**:
    - [ ] Implement a `TrafficChart` component to show daily views & clicks.
    - [ ] Add "Top Performing Articles" section.
- [ ] **User Feedback Loop**:
    - [ ] Update `items` table to include `submitter_email`.
    - [ ] Update Submission Form to capture email (optional field).
    - [ ] Create API endpoint/trigger to send notification emails on approval (using a service or logging for now).

## 3. Implementation Steps
1.  **Migration**: Create `migrations/02_analytics_schema.sql` to set up tables and functions.
2.  **Backend**: Update `ArticlePage` and creates API `api/article/view` to track detailed views.
3.  **Frontend**: Build `AnalyticsChart` component using `recharts` (if available) or SVG/Canvas.
4.  **Integration**: Embed charts into `/admin/page.tsx`.

## 4. Future (Phase 5)
- Automated email notifications via Resend/SendGrid.
- Advanced filtering in Admin Panel.
