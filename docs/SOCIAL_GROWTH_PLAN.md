# Implementation Plan - Social Growth & Founder Engagement

This plan outlines the steps to transition RankedByUs from a static directory to a more interactive, social-led platform with clear monetization and lead-gen paths for tool founders.

## Phase 1: Social Amplification (Virality)
- **Goal**: Make it easy for users to share tool rankings and for tool owners to brag about their position.
- [ ] Create `ShareButtons` component with support for X (Twitter), LinkedIn, and link copying.
- [ ] Integrate sharing into the `ToolDetailPage` hero section.
- [ ] Add "Click to Copy" sharing for individual review signals.

## Phase 2: Signal Quality (Review Helpful Votes)
- **Goal**: Allow the community to self-moderate and highlight the "truest" reviews.
- [ ] **SQL Migration**: Add `helpful_count` to the `reviews` table.
- [ ] **API Route**: Create `/api/review/helpful` to handle voting logic.
- [ ] **UI Update**: Add "Helpful (n)" button to `ToolCard` (if applicable) and `ToolDetailPage` review list.

## Phase 3: Founder Onboarding (The "Claim" Flow)
- **Goal**: Begin collecting verified founder leads and prepare for premium/sponsored listings.
- [ ] Create a `ClaimListingModal` to collect:
    - Founder Email
    - Proof of ownership (e.g., official email or social link)
    - Intended updates (Logo, Pricing, Feature list)
- [ ] Add a "Founder? Claim this listing to update metadata" card to the Tool sidebar.
- [ ] Create `/api/tool/claim` route to store requests in a new `claim_requests` table.

## Phase 4: Sponsored Infrastructure (Foundation)
- **Goal**: Prepare the database for paid placements.
- [ ] **SQL Migration**: Add `is_sponsored` (boolean) and `sponsored_until` (timestamp) to `items`.
- [ ] Update `ToolCard` to show a subtle "Sponsored Analysis" badge for items with `is_sponsored = true`.
- [ ] Ensure sponsored items appear at the top of category lists (Sort logic update).

---

# Execution Order
1. **Phase 1 & 2** (Social & Review Votes) - Immediate UI boost.
2. **Phase 3** (Claim Flow) - Starts building the B2B pipeline.
3. **Phase 4** (Sponsored) - Final step before launch.
