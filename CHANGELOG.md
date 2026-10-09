# Changelog

What changed in the AfroRevive frontend, newest first. Each section says how the
design moved on, then what was **added**, **changed**, **removed** and
**fixed**. File and hook names are in `code` where they help you find things.

The previous, file-by-file version of this changelog is in git history:
`git log -p -- CHANGELOG.md`.

For what the app can do today, see [docs/FEATURES.md](docs/FEATURES.md).

---

## [Unreleased] — `prod` branch, October 2026

**Design:** the organizer dashboard got its biggest redesign so far.
- The events dashboard is a full-width page with event cards.
- Every event-level tool sits in a sidebar under a card showing the selected event.
- Organizer screens moved to the **Work Sans** and **Inter Tight** fonts, on a light grey gradient.
- On both sides of the app, a **tablet held upright now gets the mobile layout**.

### Added — organizers
- **Events dashboard** (`/creators/events`):
  - Event cards with status tags (draft, upcoming, ongoing, sold out, ended) and a public/private badge.
  - Status filters and pagination.
  - A Guestlist tab.
  - The Analytics and Tickets buttons on each card now select that event and open its page.
- **New sidebar:**
  - A card at the top for the selected event, with Copy Link and View Event.
  - Groups for Events, Tickets, Analytics, Vendor and Tools.
  - Collapsible on desktop and full screen on mobile.
- **Tickets page** (`/creators/tickets`):
  - Filters (All, Invite-Only, Door) and notices.
  - A summary card with real net sales and tickets issued.
  - Each ticket shows its format and its access type (for example "Invite-Only").
  - Ticket menus can edit a ticket and send invites.
- **Invite-only tickets:**
  - Send invites from your guestlist, or to a new guest, who is saved to the guestlist too.
  - See the invites sent and their status.
  - An orders table for the event.
- **Guest lists:**
  - An account-wide guestlist with categories, search, server-side paging and sort, and CSV upload.
  - A per-event guestlist page for adding guests or importing them from the account list.
- **Promo codes page** (`/creators/promo-codes`), moved out of the tickets tab.
- **Private events:**
  - Events can be public or private. A private event can later be made public, but never the other way round.
  - A new **Audience** page (`/creators/audience/:eventId`): approve access requests in bulk, see approved fans, and pause or resume requests.
- **Analytics** (`/creators/realtime`), merged in from the analytics branch:
  - Overview, Vendors, Orders, Promo Codes and Insights tabs, using reusable bar, line and pie charts built on `recharts`.
  - Linked from event cards and the tickets summary.

### Added — fans
- **Private event card:** shown instead of the tickets on a private event.
  - **Request access** sends a request. Fans then see "pending" until they're approved, and approved fans see the tickets.
  - Signed-out fans are taken to login, with a green "Log in to request access" bar.
- **Invite-only tickets** on the event page show a padlock instead of + and − buttons.

### Changed
- **Edit event** is now a single Event Details page. Its Tickets, Theme and Settings tabs became separate pages or were removed.
- **Create event:**
  - The **theme step is gone**: promo codes lead straight to Publish, and old `?tab=theme` links land on Publish.
  - Ticket sales **start immediately** by default.
  - **Ticket resale is on by default.** Untick it to turn it off. Invite-only and group tickets never allow it.
- **Publishing** refreshes the dashboard list straight away.
- **Sign-up** no longer redirects. The form stays open and clears itself.
- **Complete profile** (`/complete-profile`) works without being logged in. It reads the account from `/api/Auth/me?token=…`, so the email link works on any device.
- **Prices:** amounts with kobo always show two decimals (`₦8,013.60`). Whole amounts stay as they were (`₦7,420`).
- **One API address:** set by `VITE_API_URL`. Staging is `dev.afrorevive.com`; production is `api.afrorevive.com`. The test logins built into the login form were removed.

### Removed
- Ticket upgrades and vendor listings from the create-event Publish summary.
- The Charts page and the Reports link. Analytics replaces both.

### Fixed
- **Ticket resale was never saved.** The ticket form always sent "no resale", whatever the organizer chose.
- **The Publish summary never listed ticket names**, because it read the wrong field.
- **Resume Requests didn't work.** The pause setting was sent in the request body, but the API reads it from the URL.
- **The production build was failing.** It now passes both the type check and the bundle.
- Mobile layouts for the dashboard tabs, price fields and ticket cards.

---

## September 2026 — Fans redesign

**Design:** the fan side was rebuilt from the new Figma file.
- A new home page and events page.
- The event details page, rebuilt.
- New My Tickets cards and a new footer.
- One radial background across all fan pages.

### Added
- New fans **home page**, with discover, resale, become-a-creator and mobile app sections.
- **Events page:**
  - A rotating ad banner.
  - Filters that stick to the top of the screen while scrolling.
  - An event carousel.
- **Support** (`/fans/support`) as a contact form in the account sidebar, replacing Log Out there.
- Mobile menu sections for **Account** and **Orders**.
- **Payout history** in the wallet, wired to the API.
- The ticket's **purchase limit** is now enforced in the cart.

### Changed
- **Login and sign-up modals** redesigned. The video panel only shows when logging in from the fans header on desktop.
- **My Tickets** cards and the ticket detail page redesigned.
- **Listed tickets** show the payout instead of the price.
- **Resell info page** redesigned.
- Prices everywhere show the ticket's **sales price**.
- **Event creation:**
  - Descriptions can be up to 2,000 characters.
  - The custom URL is read-only.
  - Forms show errors straight away.
  - The poster URL and event frequency are sent to the API.

### Removed
- **Season events.** All events are now one-off.
- **Vendor registration from event creation.** Vendors are set up from the Vendor pages instead.

---

## August 2026 — Vendor management and account security

### Added
- **Organizer vendor management:**
  - Create and edit revenue **slots (stalls)** and service **offers**, each with a category, price, application deadline and contact details.
  - A page per slot, listing the vendors who applied.
  - A profile modal for each applicant, where the organizer can **accept or reject** them.
  - The slots appear under Vendor in the sidebar.
  - Category lists are split by vendor type, and each category shows a description.
- **Analytics groundwork:** reusable chart components and the analytics endpoint. Finished in October.
- **Fans:**
  - Buy **resale tickets** from the event page and cart.
  - **Edit the price** of, or **cancel**, a resale listing.
- **Forgot and reset password** for all account types.
- **Tests:** Jest tests covering the fan routes (`src/pages/fans/__tests__`).

### Changed
- The organizer **settings inbox** shows real notifications, and the fake-data generators were removed.
- After completing a profile, each account type is sent to its own dashboard, not the fans account page.

### Fixed
- A new slot showed in the sidebar only after a refresh. It now appears straight away.
- The date picker opened behind modals.
- The create-slot form failed silently when a field was missing. It now shows why it can't submit.

---

## July 2026 — Fans can buy, resell and transfer

### Added
- **Checkout with Paystack:**
  - After paying, Paystack sends fans back to a new `/fans/payment-confirmation` page, which confirms the order.
  - Order receipts.
- **Promo codes at checkout:** checked as you type, with the discount applied to the total.
- **Resell** tickets (choose tickets, then set prices) and **transfer** them (the recipient is checked before sending).
- **Wallet:** balance, and withdrawals to a verified Nigerian bank account.
- **Fan profile:** gender, state, country and date of birth.
- **Bookmark** an event from its page.
- **Organizers:** create vendor slots and offers.

### Removed
- **Ticket upgrades.**
- The **resale marketplace** pages were hidden until their API endpoint exists.

---

## June 2026 — Cart, routing and sessions

### Added
- **Fans can fill a cart without an account.** The cart lives in the browser (`useCartStore`) and is synced to the server when they log in.
- **Sessions stay alive:** the access token refreshes automatically a few minutes before it expires.
- **Complete profile page** for finishing an account from the email link.
- **Paged responses everywhere:** list endpoints share one type, `PaginatedResponse`.

### Changed
- **Events are addressed by their custom URL** instead of their id. See breaking changes.
- **Cart and checkout** redesigned to match Figma. Both ask "are you sure?" before closing.
- **Event location** uses Google Maps instead of OpenStreetMap.
- **One sign-up flow** for vendors and organizers.

### Fixed
- Logging in at checkout now returns the fan to checkout.
- Race conditions between logging in and syncing the cart.
- The cart and checkout on mobile screens.

---

## February – April 2026 — Figma alignment

**Design:** the first full pass to match Figma.
- The fans home page and the creators dashboard (sidebar, event cards, layout).
- Modals, including the review and settings modals.
- One brand red everywhere.

### Added
- The organizer **Settings modal** with real data.
- Event **status tags** and a **filter** on the dashboard.
- An interactive **creator guide** for first-time organizers.
- A **forgot password** flow inside the login modal.
- An **animated search bar** in the fans header.
- A **mobile sidebar** for fans.
- A **video background** on the waitlist page (`/`).
- **Real social media links**, opening in a new tab.

### Changed
- `/creators` now redirects to `/home`.
- Wallet styling updated to match Figma.

### Fixed
- Many mobile layout fixes, including About Us, event creation and the tickets tab.
- The logout redirect.
- Duplicate toasts on logout.

---

## October 2025 – January 2026 — Waitlist and vendors

### Added
- A **support page**, with a landing view and a detailed view.
- **Vendor discover page** and vendor event pages.
- **Waitlist page** (`/`), with a vendor registration callout and modal, a vendor newsletter, and a countdown timer.
- **Vendor dashboard:** profile, inbox, slot modal and section map.
- Vendor sign-up asks for portfolio and social links.
- Animations on the home and about pages.

### Fixed
- The modal close button on iOS Safari.

---

## July – September 2025 — Connecting to the backend

### Added
- **Live data:** TanStack Query for fetching data, and Sonner for notifications.
- **Accounts:** login, sign-up, route guards, and account menus for each role.
- **Creator and vendor dashboards** with their own routes.
- The **create-event wizard** (details, tickets, promo codes, theme), publishing and editing.
- A **checkout page**.
- A reusable video background, `VideoBackgroundWrapper`.

### Changed
- Fan pages moved under `/fans`.
- Routing and folders were restructured for creators and vendors.

---

## April – June 2025 — First build

### Added
- **Fans:** landing page, events and event details, cart drawer, resell page, and a resale ticket page.
- **Sign-up** form.
- A **typed route map** (`route-map.ts`), so URLs are never typed by hand.
- Documented **reusable components**.
- **Support and FAQ** layout.
- An early **charts page** and event picker for organizers.

---

## Breaking changes

These changed URLs or data that other systems might rely on. Check them when
updating links, emails or backend redirects.

| When | Change |
|---|---|
| Feb 2026 | The creators landing page moved from `/fans/creators` to `/creators`, which redirects to `/home`. |
| Jun 2026 | Event URLs use the event's custom URL: `/fans/events/<custom-url>`. |
| Jun 2026 | Complete profile moved from `/fans/complete-profile` to `/complete-profile`. |
| Jul 2026 | Paystack's callback URL is `<site>/fans/payment-confirmation`. |
| Oct 2026 | The app needs `VITE_API_URL` and refuses to start without it. |
| Oct 2026 | `/creators/charts` was removed. Use `/creators/realtime`. |
