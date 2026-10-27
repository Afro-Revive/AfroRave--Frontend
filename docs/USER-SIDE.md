# User Side (Fans) — Code Guide

How the fan-facing part of AfroRevive is put together: where files live, how a
page is assembled, and how data gets from the API onto the screen.

"User" and "fan" mean the same thing. The API calls this account type `User`;
the URLs and folders say `fans`.

For what works and what doesn't, see [FEATURES.md](./FEATURES.md). For the
organizer side, see [ORGANIZER-SIDE.md](./ORGANIZER-SIDE.md).

---

## 1. Stack in one minute

| Tool | Used for |
|---|---|
| React 18 + TypeScript + Vite | The app itself. |
| React Router 7 | Pages and URLs. |
| TanStack Query | Fetching, caching and refetching server data. |
| Zustand | Small global stores: the logged-in user, the cart. |
| react-hook-form + zod | Forms and their validation. |
| Tailwind CSS v4 + shadcn/ui | Styling, plus the base components in `src/components/ui`. |
| Axios | HTTP, through one shared client in `src/services/http.service.ts`. |
| Jest + Testing Library | Tests for the fan routes. |

**Environment:** the app needs `VITE_API_URL` (no trailing slash), for example
in `.env.local`. It refuses to start without it. Staging is
`https://dev.afrorevive.com`; production is `https://api.afrorevive.com`.

**Commands:** `yarn dev`, `yarn build` (type check, then bundle), `yarn test`,
`yarn lint`.

---

## 2. Where fan code lives

```
src/
├── pages/
│   ├── landing-page/          Public fan pages (no login needed)
│   │   ├── home/              /fans — the fans home page
│   │   ├── event-page/        /fans/events and each event's page
│   │   │   ├── individual-event/   One event: details, tickets, map, contacts
│   │   │   └── cart/               Cart modal (opens checkout)
│   │   ├── checkout/          Checkout modal content + Paystack hand-off
│   │   ├── payment-confirmation/   Where Paystack sends the fan back
│   │   ├── resell-page/       /fans/resell — explains resale
│   │   ├── resale-marketplace/     Built but NOT routed (waiting on the API)
│   │   ├── _component/        EmptyPage ("Coming Soon"), promo code, totals
│   │   └── about-us, blog, faq, privacy-policy, refund-policy,
│   │       sell, terms-and-condition, work-with-us   → all "Coming Soon"
│   ├── fans/                  Logged-in fan pages
│   │   ├── account/           /fans/account — profile and wallet tabs
│   │   ├── my-tickets/        Active/past tickets, ticket detail, resell, transfer
│   │   ├── accept-invite/     /fans/invite/accept — where an invite email's link lands
│   │   ├── listed-tickets/    Tickets the fan is reselling
│   │   ├── settings/          Change password, log out
│   │   └── complete-profile/  /complete-profile — reached from an email link
│   ├── auth/                  Login, sign-up and reset-password forms
│   └── support/               /fans/support — contact form (not sent anywhere yet)
├── layouts/
│   ├── root-layout/           Header, search, footer for public fan pages
│   ├── user-dashboard-layout/ Account sidebar for logged-in fan pages
│   ├── support-layout/        Used by /fans/support/faq
│   └── components/            Pieces shared by layouts (login button, footer links, socials)
├── components/auth/           Auth modal, role selection, forgot password, route guards
├── hooks/                     Data hooks (TanStack Query) — one file per area
├── services/                  Raw API calls — one class per area
├── stores/index.ts            Zustand stores
├── lib/                       Helpers: price formatting, dates, query keys, cart logic
└── types/                     API response and request types
```

---

## 3. Routes

All route paths live in one map, `src/config/route-map.ts`. Code never types a
URL by hand. It calls `getRoutePath('key', params)` from
`src/config/get-route-path.ts`, so renaming a URL is a one-line change.

| URL | Page folder | Layout | Login needed |
|---|---|---|---|
| `/fans` | `landing-page/home` | root | No |
| `/fans/events` | `landing-page/event-page` | root | No |
| `/fans/events/:eventId` | `landing-page/event-page/individual-event` | root | No |
| `/fans/resell` | `landing-page/resell-page` | root | No |
| `/fans/about-us`, `/blog`, `/refund-policy`, `/work-with-us`, `/sell`, `/terms-and-conditions`, `/privacy-policy` | `landing-page/*` | root | No (all "Coming Soon") |
| `/fans/support` | `support` | user dashboard | No |
| `/fans/support/faq` | `support/faq` | support | No ("Coming Soon") |
| `/fans/account` (`?account=wallet` for the wallet) | `fans/account` | user dashboard | Yes |
| `/fans/settings` | `fans/settings` | user dashboard | Yes |
| `/fans/my-tickets` | `fans/my-tickets` | user dashboard | Yes |
| `/fans/my-tickets/:eventId` | `fans/my-tickets/individual-active-tickets` | user dashboard | Yes |
| `/fans/listed-tickets` | `fans/listed-tickets` | user dashboard | Yes |
| `/fans/invite/accept?token=…` | `fans/accept-invite` | root | No (it opens the login itself) |
| `/fans/events/:eventId/cart` | `landing-page/event-page/cart` | none (full screen) | No |
| `/fans/events/:eventId/checkout` | `landing-page/checkout` | none (full screen) | No (it shows the login form) |
| `/fans/payment-confirmation` | `landing-page/payment-confirmation` | none | No |
| `/complete-profile?token=…` | `fans/complete-profile` | none | No (the token is the proof) |
| `/reset-password?token=…` | `auth/reset-password` | none | No |
| `*` | `landing-page/not-found` | root | No |

Despite the name, `:eventId` in an event URL is the event's **custom URL**
(its slug), not its id. Events have been routed by slug since June 2026.

Route groups are defined in `src/config/routes.tsx` (public) and
`src/config/user-dashboard-routes.tsx` (logged in). `src/application.tsx` wraps
each group in its layout. Every page is lazy-loaded behind a `<Suspense>` with
`LoadingFallback`.

---

## 4. How a page is assembled

```
Application (src/application.tsx)
└── QueryClientProvider        TanStack Query; data stays fresh for 5 minutes
    └── Router
        └── <Routes>
            ├── IndexLayout (root-layout)       Header + page + footer
            ├── UserDashboardLayout             Header + account sidebar + page
            ├── SupportLayout
            └── standalone routes (complete profile, reset password, payment confirmation)
```

Each layout mounts its own `AuthProvider`, which owns the login and sign-up
modal (see §5). Root, support and the creators website also render
`<AuthModal />`. Standalone routes have no layout, so they can't open the
modal.

**Root layout** (`layouts/root-layout`):
- `header/`: logo, the animated search bar, Log In (or the user menu when logged in), and the slide-out menu (`sidebar-menu.tsx`) with Account and Orders sections.
- `footer.tsx`: links, socials, and app store badges.
- On fan pages, `useFansRadialBackground()` turns on the shared radial background and makes the footer transparent.

**User dashboard layout** (`layouts/user-dashboard-layout`):
- `sidebar.tsx` is the account sidebar: Profile, Settings, Support.
- On phones, the same links are in the header's slide-out menu (`root-layout/header/sidebar-menu.tsx`). `mobile-sidebar.tsx` is an older version that nothing uses.

---

## 5. Logging in

Login is a **modal, not a page.** Any URL with `?login=guest` (or `creator` or
`vendor`) or `?signup=…` opens it. That's how links and redirects ask someone to
log in.

| Piece | File | Job |
|---|---|---|
| `AuthProvider`, `useAuth()` | `src/contexts/auth-context.tsx` | Modal state. `openAuthModal(type, loginType, options)`. |
| `AuthModal` | `src/components/auth/auth-modal.tsx` | Renders login, sign-up, role selection or forgot password. |
| `UserLoginForm` | `src/pages/auth/user-login/user-login-form.tsx` | The login form. |
| `SignupForm` | `src/pages/auth/sign-up/signup-form.tsx` | Sign-up. Stays open and clears itself on success. |
| `UserAuthGuard` | `src/components/auth/user-auth-guard.tsx` | Protects logged-in fan routes. |
| `useLogin`, `useLogout`, … | `src/hooks/use-auth.ts` | Auth calls. After login, sends the user to their dashboard. |

`openAuthModal` takes these options:

| Option | What it does |
|---|---|
| `withVideo: true` | Shows the video panel. Used by the fans header login. |
| `notice: '…'` | Turns the modal full screen with a green bar across the top of the login form. The private-event card and the invite page use this. |
| `signupNotice: '…'` | The same bar for the sign-up form, when it needs different wording. The invite page uses it to say only the invited email can accept. |
| `stayOnPage: true` | After login the user stays where they were, instead of going to their dashboard. |

Opening or switching forms only changes `?login=` / `?signup=`. The page's other
query params stay, so a page that needs its query (an invite's `?token=`) still
has it after logging in.

`useLogout({ stayOnPage: true })` logs out without leaving the page. The invite
page uses it when someone is signed in with the wrong email.

**The session:**
- The logged-in user and tokens live in `useAfroStore` (`src/stores/index.ts`), saved to `localStorage` under `afro-store-v1`.
- `isFan`, `isCreator` and `isVendor` come from the user's `accountType`.
- `useTokenRefresh()` (`src/hooks/use-token-refresh.ts`) refreshes the access token 3 minutes before it expires.
- The HTTP client adds `Authorization: Bearer …` to every request.

---

## 6. Feature walkthroughs

### Home (`landing-page/home/index.tsx`)

One file with five sections: `HeroSection`, `DiscoverEventsSection` (category
chips filter the events shown), `ResaleSection`, `BecomeCreatorSection` and
`MobileAppSection`. Events come from `useGetAllEvents()`.

> `home/hero.tsx`, `own-the-stage.tsx`, `socials.tsx` and `header.tsx` are older
> sections that nothing imports any more. See [DEAD-CODE.md](./DEAD-CODE.md).

### Event discovery (`landing-page/event-page`)

- `index.tsx` renders `EventCategoryBlocks`.
- `event-category-blocks.tsx` reads the filters from the URL: `q`, `category`, `resale`, `date`, `month`, `when` (`tonight` or `week`), `minPrice`, `maxPrice` and `page`. Changing any filter resets `page`.
- The header search (`layouts/root-layout/header/animated-search-bar.tsx`) builds those same URL parameters and navigates here.

**Server or browser?** `useGetAllEvents(params)` calls `GET /api/Event`, which
takes `pageNumber`, `pageSize`, `search`, `category`, `hasResaleTickets`,
`includeEnded`, `date`, `startDate`, `endDate`, `minPrice` and `maxPrice`.

| Filter | Where it runs |
|---|---|
| `q` → `search` (name and venue) | Server |
| `category` (one value from `eventCategories`, matched exactly) | Server |
| `resale` → `hasResaleTickets` | Server |
| `page` → `pageNumber`, 12 per page | Server |
| `when`, `month`, `date` → `date`, or `startDate` + `endDate` | Server. `toDateFilter()` turns the one selected date filter into `YYYY-MM-DD` params: Tonight and a picked date are a single `date`; This Week is today to today+7, and a month is its first to last day (next year's if it has passed). The server returns events *running* on those days, so a two-day event matches either day. |
| `minPrice`, `maxPrice` | Server. `toPriceRange()` ignores anything that isn't a price of 0 or more, and swaps the two if min is above max. An event matches if any of its tickets is in the range; free events count as ₦0. |

Date filters are one at a time: picking Tonight, This Week, a month or a date
clears whichever was set before (`setDateFilter()`), so there's only one to
send.

Under the filter row, a "Results From" line names what's active, with the
count once it loads: `Results From “afro” in Concert · This Week · ₦5,000 and
up · 4 events`. `dateFilterLabel()` and `priceFilterLabel()` word the date and
price filters. Resale isn't listed.

The `/fans` home page chips work the same way, all on the server: Concert
(`category: 'concert'`), Resale (`hasResaleTickets`) and This Week
(`thisWeekRange()`).

> Categories come from the organizer list (`eventCategories` in
> `pages/creators/edit-event/constant.ts`), so a filter matches what was saved.
> The price filter seems to compare prices before the booking fee, while fans
> see them with it; that's with the backend to confirm.

### One event (`event-page/individual-event`)

```
IndividualEventPage (index.tsx)        loads the event with useGetEventByCustomUrl
└── EventDetails (event-details.tsx)
    ├── EventDetailsSection            left column, pinned on desktop: flyer, date, venue
    ├── EventBookmarkButton            logged-in only; save to or remove from watchlist
    ├── EventDescription               rich text, sanitized (see below)
    ├── PrivateEventGuard              public events → tickets; private → access card
    │   └── TicketSection (sections/tickets.tsx)
    │         Tickets / Resale tabs, + and − per ticket, invite-only padlock,
    │         purchase-limit guard
    ├── EventLocation                  Google Maps embed + "get directions"
    └── ContactSection                 organizer socials, email, website
```

**Private events** (`_components/private-event-guard.tsx`):
- Signed out: the "This is a private event" card. **Request access** opens the login modal with a notice and `stayOnPage`.
- Signed in: it reads `useGetViewerAccessStatus` and shows one of these:
  - **Approved:** the tickets.
  - **Pending** (Denied is treated as Pending): "Your request is pending".
  - **Paused:** "Requests are paused".
  - **Ended:** "Requests have closed".
  - **Not requested:** the request card, which sends the request with `useRequestAccess`.

**The description** (`components/reusable/show-more-text.tsx`, also on the cart
page): organizers write it in a rich text editor, so it can be HTML with
headings, bold, italic, underline, strikethrough, code, links, lists, quotes,
code blocks and dividers. It's passed through DOMPurify (`sanitizeRichText` in
`lib/rich-text.ts`), which keeps only the tags the editor makes and, on links,
only the address; every link is forced to open in a new tab with
`rel="noopener noreferrer nofollow"`, and `javascript:` links are dropped. So
nothing an organizer types can run on a fan's screen. Long ones are clipped to a few lines with a fade until **Read more**.
Older plain-text descriptions still show as before, line breaks and all.
Ticket descriptions are rich text too, shown in full in the ticket's details
modal by `RichTextContent` (`components/reusable/rich-text-content.tsx`), with the
same sanitizing.

### Cart and checkout

The cart is the most involved fan flow. The rules:

1. **The browser cart is the single source of truth.** `useCartStore` (saved to `localStorage` as `afro-cart`) holds every line. Fans can fill a cart without an account.
2. **Adding** goes through `useCreateCart` and `useUpdateCartQuantity` (`hooks/use-cart.ts`). Both write to the store.
3. **Logging in syncs the cart.** `useLogin` sends the local cart to the server with `cartService.syncCart`, including resale lines (`listingId`, `resellTicketId`), and waits for that before navigating.
4. **One event per cart.** The store records the cart's `eventSlug`. On the event page, adding a ticket takes the fan to the cart page. If the saved cart holds another event's tickets (say, from a closed tab), the fan is asked to replace them first.
5. **Cart page** (`/fans/events/:eventId/cart`, `event-page/cart/index.tsx`): a full-screen page with `CartContainer`, styled like the modal it replaced. Continue syncs to the server, then goes to the checkout page.
6. **Checkout page** (`/fans/events/:eventId/checkout`, `checkout/index.tsx`). It has no layout, so it brings its own `AuthProvider` and `<AuthModal />`.
   - Signed out: shows `UserLoginForm` with `onLoginSuccess={() => {}}` so the fan stays in checkout.
   - Signed in: shows `CheckoutSummary` with the promo code, the totals accordion, and a 15-minute countdown.
   - **The countdown** starts the moment the server reserves the tickets: when `useSyncCartToServer` succeeds (Continue on the cart page) and when `useLogin` syncs the cart (logging in at checkout). Each sync restarts it. The start is saved in the store, so a refresh carries on counting. The summary only displays it.
   - **Extending:** in the last two minutes, while the reservation still exists, a "Need more time?" link appears. `useExtendReservation` fetches the fan's server cart (`GET /api/Cart`), calls `POST /api/Cart/{cartId}/extend-reservation` for every line, since each line has its own reservation, and restarts the countdown.
   - **Expiry:** when the countdown reaches zero, the server has already deleted the cart and would reject payment. The summary clears the browser's cart and says the tickets were released. The empty cart then sends the fan back to the event page, without the "are you sure?" step. A refresh or Back onto an expired checkout does the same.
7. **Leaving asks first.** `useCheckoutFlowGuard` (`hooks/use-checkout-flow-guard.ts`) uses React Router's `useBlocker`. Any way out of the cart or checkout (the ✕, a link, the browser's Back) shows "Exit Cart?" or "Exit Checkout?", and confirming clears the cart. Moving between this event's cart and checkout isn't blocked, and neither is the redirect to Paystack. `useBlocker` needs a data router, which is why `application.tsx` uses `createBrowserRouter`.
8. **Refresh and empty carts.** A refresh keeps the fan on the cart or checkout page, because the cart and promo code are saved. An empty cart, or one for another event, sends the fan back to the event page.
9. **Paying:** `CheckoutSummary` sends the fan to Paystack, with the callback set to `${origin}/fans/payment-confirmation`.
10. **Payment confirmation** (`payment-confirmation/index.tsx`) reads Paystack's reference from the URL, calls `useProcessCheckout`, and shows success or failure. `useProcessCheckout` clears the local cart when it succeeds.

`lib/purchasable-tickets.ts` turns normal tickets and resale listings into one
shape (`PurchasableTicket`), so the ticket list and cart can treat both alike.

### My tickets (`fans/my-tickets`)

| File | What it is |
|---|---|
| `index.tsx` | Active and Past tabs (`useUserActiveTickets`, `useUserPastTickets`). |
| `individual-active-tickets/index.tsx` | One event's tickets: order cards, receipt modal (`useOrderReceiptDetails`), and the Resell and Transfer actions. |
| `tickets-resale/modals/ticket-resale.tsx` | Resell: choose tickets, then set prices (`useTicketResale`). |
| `tickets-transfer/index.tsx` | Transfer: choose tickets, then enter recipients. Each recipient is verified first (`useTransferTickets`). |

**Tickets that can't be resold or transferred.** `resaleBlockedReason()` and
`transferBlockedReason()` (`lib/helper-func.ts`) say why, or return nothing
when a ticket is allowed:

| Ticket | Resell | Transfer |
|---|---|---|
| Invite-only (`accessType: 'Invite'`) | No | No |
| Group (`isGroupTicket()`) | No | Yes |

- **In the modals,** a blocked ticket is faded, can't be picked, and shows the reason.
- **With only one ticket for the event,** a blocked ticket turns the Resell or Transfer button off, with the reason as its tooltip. With more than one, the buttons stay on and the modals do the blocking.
- **An ended event** turns both buttons off.

### Accepting an invite (`fans/accept-invite`)

An organizer's invite email links to `/fans/invite/accept?token=…`. The route
sits with the public pages because it needs the login modal, and it checks the
user itself:

1. **No token:** "This invite link is incomplete".
2. **Signed out:** the login opens over the invite (`notice`, `signupNotice`, `stayOnPage`), so the guest lands back here with the token.
3. **The invite** comes from `useGetInviteTicketByToken`. Expired or cancelled invites, and errors, show a message.
4. **Wrong account:** signed in with an email other than the invited one, the guest sees Email Mismatch. "Log out and continue" uses `useLogout({ stayOnPage: true })`, so the login reopens here.
5. **The invite:** "You're invited to {event}" with the event card. **Accept Ticket** calls `useAcceptInviteTicket`:
   - `requiresPayment: false` (free): the ticket is issued, and the guest sees You're In.
   - `requiresPayment: true` (paid): the Pay step. **Pay ₦…** goes to the Paystack `authorizationUrl`. The invite's status is now `PaymentPending`, so a reload comes back to Pay.
6. **Back from Paystack** (`?reference=`): the payment webhook issues the ticket, so the invite read on arrival usually says `Issued`, and the guest sees You're In. If it doesn't yet, the page calls `useVerifyInviteTicketPayment` once as a backup, showing "Confirming your payment" until it answers:
   - `Issued`: You're In. The reference is removed from the URL, so a refresh doesn't verify again.
   - Anything else: back to Pay, with the server's reason and a **Check again** button that verifies again.

You're In links to the ticket in My Tickets and to the app for the QR code.

Invite statuses: `Queued`, `Sent`, `Accepted`, `PaymentPending`, `Issued`,
`Expired`, `Cancelled`.

### Listed tickets (`fans/listed-tickets`)

Active, sold and expired listings (`useGetUsersResaleTickets`).
`review-listing-modal.tsx` edits the price (`useEditResaleListingPrice`) or
cancels the listing (`useCancelResaleListing`).

### Account, settings, support

| Page | Files | Data |
|---|---|---|
| Profile | `fans/account/tabs/profile-tab.tsx` | `useUserProfile`, `useUpdateUserProfile` |
| Wallet | `fans/account/tabs/wallet-tab.tsx`, `components/withdraw-funds-modal.tsx` | `useWalletDetails`, `usePayoutHistory`, `useWithdrawFunds`, `useGetNigerianBanks`, `useVerifyBankAccount` |
| Settings | `fans/settings/index.tsx` | `useChangePassword`, `useLogout` |
| Support | `support/index.tsx`, `support/contact-us-form.tsx` | None. The form only shows a toast. |

> Several account files are leftovers that nothing renders: the payout and
> support tabs, `transaction-details-modal.tsx`, the `listed-tickets-tab/`
> folder, and `hooks/use-account-tabs.tsx`. The full list is in
> [DEAD-CODE.md](./DEAD-CODE.md).

### Complete profile and reset password

Both are reached from an emailed link with `?token=`, and neither needs the fan
to be logged in.

- **Complete profile:** prefills from `/api/Auth/me?token=…` (`useGetCurrentUser`), and only renders once that data has loaded. If the token has expired, it shows "This link may have expired" with a Go Home button.
- **Reset password:** `useResetPassword`.

---

## 7. Data layer

Every API area follows the same three layers:

```
services/x.service.ts     →  hooks/use-x-mutations.ts  →  page component
(one method per endpoint)    (TanStack Query hooks)       (calls the hook)
```

**Response shapes** (`types/api.ts`): every response is an `ApiResponse<T>`:
`{ message, data, status, statusCode, id?, cursor? }`.

- **Lists:** `data` is a `PaginatedResponse<T>`: `{ items, pageNumber, pageSize, totalCount, totalPages, hasNext, hasPrevious }`. Put the **item** type in `T`, not an array.
- **Created ids:** read them from `data.id`. The top-level `id` is often an all-zero GUID.
- **Normalising:** newer hooks use TanStack's `select` option to unwrap the envelope once in the hook, so pages get clean data.

**Query keys:** these are the arrays TanStack uses to name cached data. Each
area keeps its keys in `src/lib/*-keys.ts` (`event-keys`, `cart-keys`,
`private-event-keys`, …). Keys are nested, so invalidating a parent refreshes
everything under it. For example, invalidating `eventKeys.detail(id)` also
refreshes that event's tickets, promo codes and analytics.

**Hooks the fan side uses:**

| File | Hooks |
|---|---|
| `use-auth.ts` | `useLogin`, `useLogout`, `useRegister`, `useRegisterUser`, `useForgotPassword`, `useResetPassword`, `useCompleteProfile`, `useGetCurrentUser` |
| `use-event-mutations.ts` | `useGetAllEvents`, `useGetEventByCustomUrl`, `useGetEventTickets`, `useGetEventResaleListings`, `useSaveEventToWatchlist`, `useDeleteEventFromWatchlist`, `useGetTrendingEvents` |
| `use-cart.ts` | `useCreateCart`, `useUpdateCartQuantity`, `useDeleteCart`, `useClearCart`, `useSyncCartToServer`, `useCheckoutCart`, `useProcessCheckout`, `useValidatePromocode`, `useExtendReservation` |
| `use-tickets-mutations.ts` | `useTicketResale`, `useGetUsersResaleTickets`, `useEditResaleListingPrice`, `useCancelResaleListing`, `useTransferTickets`, `useVerifyTransferRecipient` |
| `use-profile-mutations.ts` | `useUserProfile`, `useUpdateUserProfile`, `useUserActiveTickets`, `useUserPastTickets`, `useWalletDetails`, `useWithdrawFunds`, `usePayoutHistory`, `useChangePassword` |
| `use-payments.ts` | `useGetNigerianBanks` (a cached query, fresh for a day, so the withdraw modal's bank list doesn't come back empty; `enabled` waits until the modal opens), `useVerifyBankAccount` |
| `use-order-mutations.ts` | `useOrderReceiptDetails` |
| `use-private-event-mutations.ts` | `useGetViewerAccessStatus`, `useRequestAccess` |
| `use-newsletter.ts` | `useNewsletterSubscription` |
| `use-invite-ticket-mutations.ts` | `useGetInviteTicketByToken`, `useAcceptInviteTicket`, `useVerifyInviteTicketPayment` |

---

## 8. Global state

| Store | Saved in the browser? | Holds |
|---|---|---|
| `useAfroStore` | Yes (`afro-store-v1`) | The user, tokens, `isAuthenticated`, `isFan`, `isCreator`, `isVendor` |
| `useCartStore` | Yes (`afro-cart`, version 2) | Cart lines, the event they belong to (`eventSlug`), the applied promo code, when the checkout countdown started, and whether a sync is running |

Use a store only for state many pages share. Server data belongs in TanStack
Query, not in a store.

---

## 9. Shared building blocks

| Where | What |
|---|---|
| `components/ui/` | shadcn base components: button, dialog, select, table and so on. |
| `components/reusable/` | Project wrappers: `BaseModal` (with `confirmClose`), `FormBase` and `FormField`, `BaseSelect`, `BaseDropdown`, `BaseAnimatedTab`, `ComingSoon`. |
| `components/shared/` | Cross-page pieces: `CategoryBlock` (event cards), `RenderEventImage`, `Pagination`, `TicketSummaryCard`. |
| `lib/format-price.ts` | `formatNaira(amount, { free, aproximate })`: `₦8,013.60`, `₦7,420`, `FREE`, `₦2.5K`. |
| `lib/helper-func.ts` | Dates (`formatShortDate`, `formatTimeAgo`, `relativeDateGroup`), `toVisibility`, `copyToClipboard`, `maskEmail`, … |
| `lib/environment.tsx` | `OnlyShowIf`: renders its children only when a condition is true. |

---

## 10. Styling rules

- **Breakpoints are changed on purpose.** `sm`, `md` and `lg` (in `src/index.css`) treat a **tablet held upright as mobile** and a tablet on its side as desktop. A `tablet:` variant targets upright tablets only. When something looks wrong on an iPad, check orientation first.
- **Fonts:**
  - Newer fan screens use `font-work-sans` (headings) and `font-inter-tight` (body).
  - Older screens use the SF Pro families: `font-sf-pro-display` and `font-sf-pro-text`.
  - Display type uses `font-phosphate` and `font-input-mono`.
- **Colours:** use the tokens in `index.css`, such as `deep-red`, `tech-blue`, `system-black` and `gunmetal-gray`, rather than raw hex values where one exists.

---

## 11. Tests

Jest tests for the fan routes live in `src/pages/fans/__tests__` and
`src/pages/landing-page/__tests__`. Shared setup (an API mock, fixtures and a
render helper with providers) is in `src/test/`. Run `yarn test`.
