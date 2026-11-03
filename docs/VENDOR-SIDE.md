# Vendor Side — Code Guide

How the vendor dashboard is put together: where files live, how a slot's status
is worked out, and how each page talks to the API.

Vendors are businesses that apply for spaces at events. There are two kinds of
spaces, and the code treats them differently:

- **Revenue slots** (stalls): the organizer sets a price. The vendor requests a
  slot, the organizer approves it, and the vendor **pays** to secure it.
- **Service offers**: the organizer needs a service (sound, media, security) and
  gives a budget. The vendor proposes a price, and the organizer **pays the
  vendor**, outside the app.

For what works and what doesn't, see [FEATURES.md](./FEATURES.md) §3. The stack,
environment variable, data-layer rules and styling rules are the same as the fan
side, and are explained in [USER-SIDE.md](./USER-SIDE.md) §1, §7 and §10. The
organizer's side of vendors (creating slots, reviewing applicants) is in
[ORGANIZER-SIDE.md](./ORGANIZER-SIDE.md) §6.

---

## 1. The dashboard at a glance

Redesigned in November 2026. Everything is dark, and every page sits inside one
layout with the vendor's profile in the sidebar.

| URL | Page | What it shows |
|---|---|---|
| `/vendor/discover` | `discover/index.tsx` | Events taking vendor applications, with search and a Saved Events toggle |
| `/vendor/discover/:eventId` | `discover/event-details/index.tsx` | The "ticket page": one event's slots and offers, and Your Slots to request them. Full screen, outside the dashboard layout, like the design. |
| `/vendor/slots` | `slots/index.tsx` | Every request the vendor has made, one card per request |
| `/vendor/slots/:applicationId` | `slots/slot-details/index.tsx` | One request: the event, the slot and what to do next |
| `/vendor/profile` | — | Forwards to `/vendor/discover`. Login, the auth guard and the account menus still send vendors here. |

Paths live in `src/config/route-map.ts`. Dashboard routes are in
`src/config/vendor-dashboard-routes.tsx`, each wrapped in `VendorAuthGuard`; the
event details route is in `src/application.tsx`.

The old Profile and Wishlist pages are gone. The profile moved into the sidebar,
and saved events replaced the wishlist, which only ever showed sample data.

---

## 2. Where vendor code lives

```
src/
├── layouts/vendor-dashboard-layout/
│   ├── index.tsx                   header, sticky sidebar (desktop), sheet (mobile), <Outlet />
│   └── sections/
│       ├── header.tsx              logo, menu button (mobile), avatar menu: Settings, Log out
│       ├── vendor-side-bar.tsx     profile card, DISCOVER and MY SLOTS, Log Out
│       └── vendor-profile-card.tsx name, category, phone, email, summary, Edit profile
├── pages/vendor/
│   ├── discover/
│   │   ├── index.tsx               Discover
│   │   └── event-details/
│   │       ├── index.tsx           the ticket page: header, About Event, Available Slots
│   │       ├── slot-row.tsx        one slot: details modal, +/− (revenue) or a price box (service)
│   │       ├── slot-cart.tsx       Your Slots
│   │       └── slot-request.ts     availability, prices and the apply request body
│   ├── slots/
│   │   ├── index.tsx               My Slots
│   │   ├── slot-status.ts          status, deadline, fee and amount-due rules (§4)
│   │   └── slot-details/
│   │       ├── index.tsx           a request's page: flyer card, summary card, community card
│   │       ├── slot-summary-card.tsx   the right-hand card, one layout per status
│   │       └── slot-receipt-dialog.tsx
│   ├── component/
│   │   ├── vendor-event-card.tsx   the portrait event card, its grid, skeleton and SLOTS pill
│   │   ├── slot-status-pill.tsx    status pill, and the Revenue / Service vendor tag
│   │   ├── vendor-page-header.tsx  the title band on My Slots and a request's page
│   │   ├── vendor-empty-state.tsx  the store icon empty state
│   │   └── …                       the rest are the organizer's vendor pages
│   ├── profile/                    the Profile / Account / Settings modal (§5)
│   │   ├── edit-profile-modal.tsx  the modal, its tabs and the shared draft
│   │   ├── profile-tab.tsx, account-tab.tsx, settings-tab.tsx
│   │   ├── profile-draft.ts        API ↔ form values, and the request body
│   │   └── profile-fields.tsx      the dark inputs, selects and Save button
│   └── lib/format-date.ts          'May 20th 2025' and 'Apr 28, 2025'
├── hooks/use-vendor.ts             the dashboard's hooks (§6)
└── services/vendor.service.ts      every vendor endpoint
```

`pages/vendor/` is shared with the organizer's vendor management
(`revenue-vendor/`, `service-vendors/`, most of `component/`). Those are
organizer pages; don't restyle them with the vendor dashboard.

---

## 3. Layout

```
VendorDashboardLayout
├── VendorDashboardHeader      logo → Discover; avatar menu (Settings opens the modal on Settings)
├── aside (lg and up)          sticky below the header, scrolls on its own
│   └── VendorSidebar
│       ├── VendorProfileCard  business name and category, phone and email,
│       │                      Summary: Saved Events, Total Slots Secured,
│       │                      Edit profile, and "Finish setting up your profile"
│       │                      while the profile is incomplete
│       ├── DISCOVER, MY SLOTS NavLinks; the active one gets a red border and icon
│       └── Log Out
├── Sheet (below lg)           the same VendorSidebar, opened from the header's menu button
└── <Outlet />
```

- **Profile card data:** identity comes from `useVendorProfile` (`GET /api/profile/vendor`), falling back to the logged-in user. The counts come from `useVendorSummary` (`GET /api/Event/vendor/summary`): Saved Events is `savedEvents`, Total Slots Secured is `acquiredSlots`.
- **"Finish setting up your profile"** shows until `useVendorProfileComplete()` is true: name, business name, phone, email, description, profile picture, a portfolio link or file, and at least one social link.
- **Breakpoints:** `lg` needs landscape below 1025px, so an upright tablet gets the phone layout with the sheet (see USER-SIDE.md §10).

---

## 4. A slot's status

The API sends four application statuses: `Pending`, `Approved`, `Rejected` and
`Secured`. The design has six, so `getSlotStatus(application, event)` in
`slots/slot-status.ts` works out the other two:

| Shown as | When |
|---|---|
| **In Review** | `Pending` |
| **Approved** | `Approved`, before the payment deadline and before the event ends |
| **Slot Secured** | `Secured`, before the event ends |
| **Rejected** | `Rejected` |
| **Expired** | A revenue slot that was `Approved` but not paid before its deadline, or before the event ended |
| **Completed** | `Secured` after the event ends. Also an approved service offer after the event ends, since service vendors don't pay. |

- **The payment deadline** is the slot's application deadline (`slotData.applicationDeadline` or `serviceData.applicationDeadline`, then `vendorDetails.applicationDeadline`). The design's copy calls it that too: "Pay before {application deadline}".
- **"Ended"** uses the event's `endDate` once the event has loaded. Before then it falls back to the end of the event's start day, from the application.
- **Money:**
  - `getSlotFee` is the slot price × slots requested.
  - `getAmountDue` adds the platform fee, `VITE_VENDOR_APPLICATIONS_PERCENTAGE` (0.08 today). It's the same fee the event details page adds to "Price Per Slot".
- **Copy:** the pill labels are in `component/slot-status-pill.tsx`; the notice under the details table is in `StatusNotice` in `slot-summary-card.tsx`.

Never compare against the label. Compare against the status `getSlotStatus` returns.

---

## 5. Pages

### Discover (`discover/index.tsx`)

```
VendorDiscoverPage
├── search (by event name, in the browser) + SAVED EVENTS toggle
└── VendorCardGrid
    └── VendorEventCard (each)   flyer, name, date and venue, SLOTS : n,
                                 bookmark → save / unsave; card → event details
```

- **Available events:** `useGetVendorAvailableEvents` (`GET /api/Event/vendor/available-events`). The service asks for 100 at once, because search is done in the browser (the endpoint has no search parameter).
- **Saved events:** `useVendorSavedEvents` (`GET /api/Profile/vendor/event/watchlist`). The bookmark's state comes from this list, on Discover and My Slots.
- **Saving** is `POST /api/Event/{eventId}/save`. **Removing** has no vendor endpoint, so it uses the shared `POST /api/Profile/user/event/watchlist/remove` with `{ id: eventId }`. Both refresh the saved list and the summary. *Removing hasn't been tried against the real API yet.*
- **Empty states:** "No Slots Available", "No Saved Events", or "No Events Found" for a search.
- **The card's slots count** shows only the number left (`availableSlot`). The design's "12 / 20" needs a total the endpoint doesn't send.

### Event details, the "ticket page" (`discover/event-details/`)

Full screen with a close button back to Discover, like the fans' ticket page.

```
VendorEventDetailsPage
├── header               event name, venue, date, ✕ → Discover
├── AboutEvent           same markup as the fans' cart page: flyer, name, date | venue, doors, ShowMoreText
├── Available Slots      a SlotRow per slot or offer, styled like the fans' TicketCard
│   ├── tap the row      details modal: price, description, slots left or work hours, apply-by date
│   ├── revenue slot     green pill: + adds a stall up to the slots left, − takes one off
│   ├── service offer    ₦ + "Enter your price" + (green once a price is in) adds it (capped at the top of the budget); then − takes it out
│   └── or a pill        Requested (links to that request), Closed, Paused or Sold out
└── SlotCart             Your Slots, styled like the fans' CartSummaryFloat: Request + total, opens to the ×n lines
```

- **Data:** the event (`useGetEvent`), its slots (`useGetVendorSlots` → `GET /api/Event/{eventId}/vendors`), and the vendor's applications, so a slot with a live request (Pending, Approved or Secured) shows **Requested** instead of +.
- **Availability** (`getSlotAvailability` in `slot-request.ts`): closed once the event has ended or the slot's deadline has passed, paused when the slot's status says so, sold out when a revenue slot has no stalls left (`slotData.slotNumber`).
- **Prices:**
  - Revenue prices are shown with the platform fee (`withPlatformFee` in `slots/slot-status.ts`), so the row says "(includes fees)".
  - A service offer shows the organizer's budget, and the cart shows the vendor's proposed price.
- **Your Slots:**
  - A white bar fixed bottom right (centred on phones) with the black Request button and the total; the arrow opens it upward to show "Price Includes Fees." and the slots, each with its unit price.
  - Quantities change on the rows, not in the cart, as with fans' tickets.
- **Request** sends one `POST /api/Event/vendor/apply` per line (`useRequestVendorSlots`; the API takes one at a time), built by `toApplicationRequest`.
  - When they all go through, it goes to My Slots.
  - If some fail, it says how many, and keeps only the failed ones in Your Slots to try again.
- The cart lives in page state, so it empties on leaving the page.

### My Slots (`slots/index.tsx`)

```
VendorSlotsPage
├── VendorPageHeader        MY SLOTS; "n slots need payment" when any approved revenue slot is unpaid
├── All / Approved / Ended  filter chips with counts
└── VendorCardGrid
    └── VendorEventCard     one per request, newest first; the status pill in the footer
```

- **Requests:** `useGetVendorApplications` (`GET /api/Event/vendor/applications`, 100 per page).
- **Flyers and end dates** aren't on the application, so `useVendorEventsById` loads each event once with `useQueries`. It shares `eventKeys.detail(id)` with `useGetEvent`, so the request page opens from the cache.
- **Approved** counts Approved and Slot Secured. **Ended** counts requests whose event has ended.
- **Empty:** "No Slots Yet", with **Discover Events**.

### A request's page (`slots/slot-details/`)

```
VendorSlotDetailsPage (finds :applicationId in the applications list)
├── VendorPageHeader        event name, slot name, back to My Slots, Revenue / Service vendor tag
├── EventFlyerCard          flyer, About Event, Go to eventpage (the fan page, new tab)
└── column
    ├── SlotSummaryCard     YOUR SLOT + status pill, name, category, description (scrolls),
    │                       details table, then the part that depends on the status
    └── CommunityCard       Instagram, X, the creators website
```

There's no single-application endpoint, so the page finds the request in the
applications list.

What the bottom of the summary card shows:

| Status | Revenue slot | Service offer |
|---|---|---|
| In Review | "Request sent on …" notice, Amount Due, **Withdraw Request**, faded "Secure Payment With Paystack" | Budget and proposed price, the notice, **Withdraw Request** |
| Approved | "Pay before …" notice, Amount Due, **Pay now** | **Contact organizer** |
| Slot Secured | "Paid ₦…" with the date, **View receipt**, **Contact organizer** | "Offer accepted", **Contact organizer** |
| Rejected, Expired, Completed | The notice, **Discover Events** | Same |

- **Withdraw Request** asks for confirmation, then calls `DELETE /api/Event/vendor/application/{id}` and goes back to My Slots.
- **Pay now** calls `POST /api/Event/vendor/slot/pay` with `{ applicationId, paymentMethod: 'paystack-checkout' }`:
  - If the response holds a checkout link (`authorizationUrl`, `authorization_url`, `checkoutUrl` or `paymentUrl`), the page goes to Paystack.
  - Otherwise it treats the slot as secured, says so, and refreshes the applications and the summary.
  - Back from Paystack, a `?reference=` (or `?trxref=`) in the URL is sent once to the same endpoint to confirm the payment, then removed from the URL.
  - *Which of these the backend does hasn't been confirmed* (see FEATURES.md §5).
- **Contact organizer** is a `mailto:`. It uses the slot's own contact email when the organizer set different contact details, otherwise the event's contact email. It's greyed out when there's neither.
- **View receipt** is a dialog built from the application: slot fee, platform fee, total and the date it was last updated. There's no receipt endpoint, so these are the dashboard's numbers, not Paystack's.

### Profile, Account and Settings (`profile/`)

One modal, opened from the sidebar's **Edit profile** and **Finish setting up your profile** (on Profile) and the avatar menu's **Settings** (on Settings).

| Tab | Contents | Saves with |
|---|---|---|
| Profile | Picture (tap to change), business name and email, bio (450 characters), contact details (email, phone, website, Instagram), gallery (up to 12 photos) | `PATCH /api/profile/vendor` |
| Account | Business name, website, category; first and last name, email, password (shown, not editable), gender, birthday, country, state (a list of the 36 states and the FCT when the country is Nigeria, typed otherwise; changing country clears it), phone with country code | `PATCH /api/profile/vendor` |
| Settings | Change password (current and new, 8 characters or more), email notifications, Log Out | `PATCH /api/profile/vendor/change-password` |

- **One draft for both tabs.** Email, phone and website are on Profile and Account, so both tabs edit one draft (`VendorProfileDraft`), and either Save sends all of it. Save stays grey until something changes.
- **Where the values come from:** `toDraft` reads the vendor profile (`GET /api/profile/vendor`) and falls back to the logged-in user. Name and gender only come from the user.
- **What's sent:** `toUpdateRequest` keeps the rest of `businessData` and writes the bio to `aboutBusiness`, the website to `portfolio.webUrl`, Instagram to `socials.instagram` (a handle becomes a full link), the picture and gallery. The phone goes as `+234…` in both `phoneNumber` and `telephone`. The birthday goes as `1998-03-07`.
- **Not in the API's schema yet:** category, country, state and birthday. They're sent anyway so they save once the backend accepts them (FEATURES.md §5).
- **After saving**, the logged-in user is updated too (`applyDraftToUser`), so the sidebar and the "Finish setting up" check change straight away.
- **Photos** upload to Cloudinary as they're picked (`useUploadImage`). Only their links are saved, and only on Save.
- **Email notifications** isn't saved; the API has no setting for it.

---

## 6. Hooks and endpoints

| Hook | File | Endpoint |
|---|---|---|
| `useGetVendorAvailableEvents` | `use-event-mutations.ts` | `GET /api/Event/vendor/available-events` |
| `useGetVendorSlots` | `use-event-mutations.ts` | `GET /api/Event/{eventId}/vendors` |
| `useGetVendorApplications` | `use-event-mutations.ts` | `GET /api/Event/vendor/applications` |
| `useVendorSummary` | `use-vendor.ts` | `GET /api/Event/vendor/summary` |
| `useVendorSavedEvents` | `use-vendor.ts` | `GET /api/Profile/vendor/event/watchlist` |
| `useToggleVendorSavedEvent` | `use-vendor.ts` | `POST /api/Event/{eventId}/save`, `POST /api/Profile/user/event/watchlist/remove` |
| `useRequestVendorSlots` | `use-vendor.ts` | `POST /api/Event/vendor/apply`, once per slot |
| `useWithdrawVendorApplication` | `use-vendor.ts` | `DELETE /api/Event/vendor/application/{applicationId}` |
| `usePayVendorSlot` | `use-vendor.ts` | `POST /api/Event/vendor/slot/pay` |
| `useVendorEventsById` | `use-vendor.ts` | `GET /api/Event/{eventId}` for each event |
| `useVendorProfileComplete` | `use-vendor.ts` | none (reads the logged-in user) |
| `useVendorProfile` | `use-profile-mutations.ts` | `GET /api/profile/vendor` |
| `useUpdateVendorProfile` | `use-vendor.ts` | `PATCH /api/profile/vendor` |
| `useChangeVendorPassword` | `use-vendor.ts` | `PATCH /api/profile/vendor/change-password` |
| `useUploadImage` | `useCloudinaryUpload.ts` | Cloudinary (profile picture and gallery) |
| `useVendorNotifications`, `useMarkVendorNotificationsAsRead` | `use-profile-mutations.ts` | `GET /api/profile/vendor/notifications`, `PATCH …/{id}/read`. **Nothing uses them now**: the new profile modal has no Inbox tab. |

The new dashboard hooks are in their own file, `use-vendor.ts`, rather than
`use-event-mutations.ts`.

**Query keys** are in `lib/event-keys.ts`: `vendorAvailable`,
`vendorApplications`, `vendorSummary` and `vendorSaved`. Requesting and
withdrawing refresh the applications. Saving refreshes saved events and the summary. A secured
payment refreshes the applications and the summary.

---

## 7. Things to know before changing code

- **The `vendors` branch is behind `prod`.** It forked in July 2026, and `prod` has about 190 commits it doesn't, including the organizer vendor tabs redesign. `docs/` was copied in from `organizer-fixes` for this guide. Expect conflicts in shared files (`use-event-mutations.ts`, `helper-func.ts`, `event-keys.ts`, the vendor service and types) when the branches meet.
- **Icons** are react-icons (Remix, `react-icons/ri`), added to `package.json` here at the same version as `prod`, like `dompurify`.
- **Descriptions are rich text HTML.** `RichTextContent` (`components/reusable/rich-text-content.tsx`) and `lib/rich-text.ts` show them sanitized. Both were copied unchanged from `prod`, with `dompurify` at prod's version, so the merge sees the same files on both sides.
- **Colours are written inline** (`#1E1E1E`, `#2A2A2A`, …) to match the Figma file. There are no dark theme tokens for the vendor dashboard yet.
- **Vendor notifications have nowhere to show.** The old modal's Inbox tab went with the redesign. The hooks and service calls are still there for when the design gives notifications a home.
- **Categories** (`VENDOR_CATEGORIES` in `types/vendor.ts`) are now the design's 12. Where a category carried over, its old value was kept (`food_beverage` is Food & Drinks), so saved profiles still match. Sign-up and complete profile use the same list. `vendorCategoryLabel` tidies up values that are no longer listed.
