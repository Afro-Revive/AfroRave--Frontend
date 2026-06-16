# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial Changelog creation.
- `formatTimeLong`, `formatDateLong`, `formatTimezone` utility functions added to `src/lib/helper-func.ts` for consistent event time and timezone display (e.g. `+1` → `WAT`).
- `PromoCode` extracted into a standalone reusable component (`src/components/reusable/promo-code.tsx`) with typed `cartItems`, `totalPrice`, and `totalQuantity` props — replaces inline promo code logic in both cart-container and cart-summary.
- `TotalAccordion` component: collapsible total price breakdown showing ticket subtotal and service fee, with TOTAL + price in the trigger and line-by-line breakdown in the content.
- Full-screen login step on mobile checkout for unauthenticated users: cart summary hidden on mobile until authenticated, login form takes full screen width.
- 10-minute countdown timer on checkout login screen (`useCountdown` hook using `setInterval`).
- `isSyncingCart` flag to `useCartStore` for tracking post-login cart sync state (excluded from localStorage persistence).

### Fixed
- **React Query stale cache after login** (`use-cart.ts`): Added `isAuthenticated` to the `useGetAllCart` query key so a state change from unauthenticated → authenticated creates a new cache slot, preventing local-format cart data from being served as server `CartData`.
- **Race condition on login** (`use-auth.ts`, `stores/index.ts`): Local cart sync is now `await`ed before navigation and `onSuccess` callback fire. `isSyncingCart` wraps the full `Promise.allSettled` call so the UI spinner stays active for the entire sync duration.
- **Post-login redirect to checkout** (`user-login-form.tsx`, `checkout/index.tsx`): User is correctly returned to the checkout page after signing in from the checkout flow.
- **Cart trigger positioning**: Removed duplicate/conflicting layout in `event-details.tsx` that caused incorrect cart trigger placement on the event page.
- **Base modal footer not visible on mobile** (`base-modal.tsx`): Switched `DialogContent` from `block` to `flex flex-col gap-0`; footer positioned with `absolute bottom-0 right-0 z-10`; removed `sm:overflow-y-auto` from full-size class.
- **Lucide icon `color` prop misuse** (`cart-container.tsx`): Changed `color="text-white"` (invalid Tailwind class as CSS value) to `color="white"` on Plus/Minus icons — icons now render correctly.
- **Cart container not scrollable on mobile**: Set `max-h-[calc(100vh-100px)] overflow-y-auto` on the inner content div so content scrolls within the modal.
- **AccordionTrigger chevron misaligned**: Overrode base `items-start` with `items-center` so the chevron is vertically centred with TOTAL text and price.
- **AccordionTrigger price appearing in the middle**: Wrapped TOTAL and price in a single `flex w-full justify-between` div before the auto-appended chevron, so layout is `TOTAL ... price ˅` rather than three separate flex items.
- **Forgot password stacking a second dialog** (`35463f7`): Renders forgot password form inside the existing auth modal instead of opening a nested dialog.
- **Settings button not opening / mobile sidebar trigger broken** (`5dc703b`): Fixed interactive trigger wiring on mobile sidebar and settings menu.
- **Resell page mobile layout** (`resell-page/index.tsx`): "Revive" headline and CTA button now inline on same row; responsive text sizing (`text-[48px] md:text-[40px] lg:text-[72px]`); text centred on mobile, left-aligned on desktop.
- **`isFan` / `isCreator` / `isVendor` always returning `false`** (`stores/index.ts`): Replaced getter pattern with explicit boolean properties set in `setAuth`, `clearAuth`, and `updateUser`.

### Changed
- **Event routing migrated from `eventID` to `customUrl`** (`hooks/use-event-mutations.ts`, `services/event.service.ts`, `components/shared/category-block.tsx`, `event-page/`): All event navigation now uses `customUrl` as the route parameter for cleaner, human-readable URLs.
- **`eventID` removed as API request payload** (`event-transforms.ts`, creator edit-event tabs): Event ID no longer sent as part of the create/update request body; back-click navigation fixed in edit event tab.
- **Cart summary** (`cart-summary.tsx`): Fully supports both authenticated (server `CartData`) and unauthenticated (local store + ticket enrichment via `useGetEventTickets`) states. `totalPrice` and `totalQuantity` computed from the normalised cart items array.
- **Fans homepage UI** (`home/`, `afro-carousel.tsx`, `base-dropdown.tsx`): Various layout and dropdown bug fixes; carousel and own-the-stage section improvements.
- **Footer social links** (`home/socials.tsx`, footer components): Real social media URLs added, open in new tab; social icon sizing reduced; top border added to footer social row; language selector removed.
- **About-us mobile layout** (`/about-us`): Improved section spacing, typography scaling, and text readability across all mobile breakpoints.
- **`cart-summary.tsx` checkout button**: Aligned to `self-center mx-auto`.
- 2-step vendor signup flow matching Figma design specifications.
- Responsive design for Vendor Dashboard (mobile and tablet support).
- Enhanced creators landing page header with improved desktop sizing and layout.

### Fixed
- **Creators Landing Page Header Issues**:
  - Removed duplicate headers by moving `/creators` route to `CreatorsLandingPageLayout`.
  - Eliminated conflicting header from `IndexLayout` on creators page.
  - Now displays single, consistent header across all creator pages.

### Changed
- **Refactored `BusinessSignUp` component** (`src/pages/auth/sign-up/business-signup-form.tsx`):
    - Implemented multi-step state management using `useState`.
    - **Step 1:** Collects Personal Information (Name, Phone, Gender), Business Details (Business Name, URLs), and Account Credentials (Email, Password).
        - Button text: "Continue"
        - Validates all Step 1 fields before proceeding.
    - **Step 2:** Collects Business Classification (Vendor Type and Category).
        - Title changes to "Business Type"
        - Description changes to "Select The Applicable Category"
        - Button text: "Sign Up"
    - Added `handleContinue()` function to validate Step 1 fields using `form.trigger()` before transitioning to Step 2.
    - Conditional rendering of form fields based on current step.
    - Dynamic title and description based on step and user type.
- **Updated Vendor Dashboard pages** to match Figma designs:
    - Added "Discover events near you!" heading to Discover page.
    - Changed card labels from "Category" to "Available Slots" with green styling.
    - Implemented responsive grid layouts (1 column mobile → 2 columns tablet → 3-4 columns desktop).
    - Added "Discover events near you!" heading to Discover page.
    - Changed card labels from "Category" to "Available Slots" with green styling.
    - Implemented responsive grid layouts (1 column mobile → 2 columns tablet → 3-4 columns desktop).
    - Improved spacing and typography across all viewport sizes.
    - Fixed text overflow issues on Profile page.
- **Implemented new Vendor pages**:
    - **Event Details Page**: Created `/vendor/discover/:eventId` with banner, event info, expandable "About" section, and scroll-stopping slot registration card.
    - **Wishlist/Saved Events Page**: Created `/vendor/wishlist` with "RESULTS" header (mobile) / "Saved Events" (desktop) and responsive event grid.
- **Implemented Vendor Dashboard Phase 2**:
    - **Edit Profile Modal**: Implemented comprehensive modal (tabs: Profile, Inbox, Account) matching Figma Image 4. Replaced "DestructiveAddBtn".
    - **Slot Details Page**: Created `/vendor/slots/:eventId` (e.g. "Blackmarket Flea") with search function and status-badged slot list matching Figma Image 2.
    - **My Slots Integration**: Updated My Slots page (`/vendor/slots`) to display mock events that link to the new Details page.
- **Implemented Vendor Dashboard Phases 3 & 4 (Gaps & Polish)**:
    - **View Profile Modal**: Added read-only profile modal with badge, contact details, and gallery (Figma Image 2).
    - **Inbox Improvements**:
        - Populated "Inbox" tab with mock notifications (Figma Image 0).
        - Added interactive Detail View with "Secure Slot" CTA (Figma Image 1).
    - **Slot Features**:
        - **Description Modal**: Refined modal with Quantity Selector, Green Price, and "Request" button to match updated Figma reference (Image 4).
        - **Section Map**: Implemented interactive "List / Map" toggle displaying a color-coded stall grid (Figma Image 3).
- **Enhanced Creators Landing Page Header (Desktop)**:
    - **Increased header height** from `h-20` to `h-28` (40% larger on desktop).
    - **Enlarged logo** from 80x40px to 120x60px on desktop (responsive: remains 80x40px on mobile).
    - **Larger navigation links** from `text-sm` to `text-base lg:text-lg` for better readability.
    - **Improved spacing** with `gap-12 lg:gap-16` between navigation items.
    - **Added max-width** of `1400px` with enhanced padding (`px-4 md:px-8 lg:px-16`, `py-4 md:py-6`).
    - **Repositioned countdown timer** from inline with LOGIN button to centered row below navigation for better visual hierarchy.
    - **Responsive timer sizing** using `clamp(20px, 4vw, 28px)` for optimal scaling.
- **Updated Creators Page Route**:
    - **Changed route path** from `/fans/creators` to `/creators` in `src/config/route-map.ts`.
    - All navigation links automatically updated via `getRoutePath('creators')` helper.
    - **Updated content padding** from `pt-32` to `pt-40 md:pt-36` to accommodate larger header.
- **Guest Cart Support — Unauthenticated fans can now add tickets to cart**:
    - Created `useCartStore` in `src/stores/index.ts` using Zustand `persist` middleware, storing `{ ticketId, quantity }` items in localStorage under the key `afro-cart`. Cart survives page refreshes.
    - Updated all cart hooks in `src/hooks/use-cart.ts` to check authentication before acting:
        - `useGetAllCart`: returns local store items when unauthenticated, server data when authenticated.
        - `useCreateCart`: writes to `useCartStore` when unauthenticated, calls `POST /api/Cart` when authenticated.
        - `useDeleteCart`: removes from `useCartStore` when unauthenticated, calls `DELETE /api/cart/:id` when authenticated.
        - `useUpdateCartQuantity`: updates `useCartStore` when unauthenticated, calls `PATCH /api/cart/:id/quantity` when authenticated. Also now invalidates `cartKeys.lists()` on success so ticket counts stay in sync.
    - Updated `cart-trigger.tsx`: count badge reads from `useCartStore` directly when unauthenticated; loading spinner only shown for authenticated server fetches.
    - Updated `cart/index.tsx` and `cart/cart-container.tsx`: when unauthenticated, local cart items are enriched with ticket name and price via `useGetEventTickets` for display and total price calculation.
    - Updated `tickets.tsx`: replaced local `ticketCount` and `cartId` `useState` with values derived from global cart state — unauthenticated reads from `useCartStore`, authenticated reads from `useGetAllCart`. When unauthenticated, `ticketId` is used in place of `cartId`.
    - Updated `useLogin` in `src/hooks/use-auth.ts`: on successful login, any items in the local cart are synced to the server. The sync is now `await`ed (not fire-and-forget) — `setSyncing(true)` is set before the `Promise.allSettled` call and `setSyncing(false)` is set in a `finally` block. Navigation and the optional `onSuccess` callback are deferred until after the sync completes, preventing race conditions where the page re-renders in an authenticated state while the cart is mid-sync.
    - Added `isSyncingCart: boolean` and `setSyncing(value: boolean)` to `useCartStore` (`src/stores/index.ts`). `isSyncingCart` is excluded from localStorage persistence via `partialize` since it is transient runtime state. `cart/index.tsx` reads this flag so the checkout button spinner shows during both server loading and post-login sync.
    - **Fixed `isFan` / `isCreator` / `isVendor` always returning `false`**: Fixed by replacing the getter pattern with regular boolean properties (`isCreator`, `isFan`, `isVendor`) that are explicitly set alongside `user` in `setAuth`, `clearAuth`, and `updateUser`.
    - Updated `cart-summary.tsx`, `checkout/index.tsx`, and `cart/index.tsx`: threaded `eventId` through the prop chain so the checkout summary can enrich the local cart items with ticket name and price via `useGetEventTickets`. When unauthenticated, items are normalised from the local store; when authenticated, server `CartData` is used directly. `totalPrice` and `totalQuantity` are now calculated from the normalised cart items array, replacing the previous `getCartTotals` call. `handleValidatePromocode` pulls `eventIds` and `ticketIds` from the same normalised array so promo code validation works for both auth states.

### Removed
- Duplicate header component from `src/pages/landing-page/creators/index.tsx`.
- Creators route from `src/config/routes.tsx` (moved to `creators-landing-page-routes.tsx`).

### Technical Notes
- **Files Modified**:
  - `src/config/route-map.ts` - Updated creators route path
  - `src/config/routes.tsx` - Removed creators route
  - `src/config/creators-landing-page-routes.tsx` - Added creators landing page route
  - `src/layouts/creators-landing-page-layout/sections/header.tsx` - Enhanced header sizing and layout
  - `src/pages/landing-page/creators/index.tsx` - Removed duplicate header, updated padding

### Breaking Changes
- **URL Change**: Creators landing page now accessible at `/creators` instead of `/fans/creators`.
- Old URL (`/fans/creators`) will return 404.
- **Action Required**: Update any external links, bookmarks, or backend redirects pointing to `/fans/creators`.
