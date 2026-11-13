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
│   │   └── profile-fields.tsx      ProfileInput, ProfilePasswordInput, ProfileSelect (label above
│   │                               the box, as in every form) and the Save button
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
- **"Finish setting up your profile"** shows until `useVendorProfileComplete()` is true: first name, business name, phone, email, about text, profile picture, and at least one social link. It reads the vendor profile first, then the logged-in user.
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

- **The payment deadline** is the slot's application deadline (`slotData.applicationDeadline` or `serviceData.applicationDeadline`, then `vendorDetails.applicationDeadline`). The design's copy calls it that too: "Pay before {application deadline}", shown as the day and the time, read as UTC like every deadline.
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
- **The bookmark** (`useToggleVendorSavedEvent`) saves with `POST /api/Event/{eventId}/save`, or, when the event is already saved, removes it with `DELETE /api/Profile/vendor/event/watchlist/remove` and `{ id: eventId }` in the body. Either way it refreshes the saved list and the summary.
- **Empty states:** "No Slots Available", "No Saved Events", or "No Events Found" for a search.
- **The card's slots count** shows the number left out of the total, "12 / 20" (`availableSlot` / `totalSlots`). Saved events don't carry the counts, so they take them from the same event in the available list; a saved event that isn't in that list shows no pill.

### Event details, the "ticket page" (`discover/event-details/`)

Full screen with a close button back to Discover, like the fans' ticket page.

```
VendorEventDetailsPage
├── header               event name, venue, date, ✕ → Discover
├── AboutEvent           same markup as the fans' cart page: 3:4 flyer (a 120px thumbnail beside
│                        the details on mobile, 300px on desktop), name, date | venue, doors,
│                        ShowMoreText full width below
├── Available Slots      a SlotRow per slot or offer, styled like the fans' TicketCard
│   ├── tap the row      details modal: price, description, slots left or work hours, apply-by date and time
│   ├── revenue slot     green pill: + adds a stall up to the slots left, − takes one off
│   ├── service offer    ₦ + "Up to ₦…" + (green once a price is in) adds it (capped at the top of the budget); then − takes it out
│   └── or a label       Requested (blue, the row is read only), Closed or Sold out (red), Paused (yellow)
└── SlotCart             Your Slots, styled like the fans' CartSummaryFloat: Request + total, opens to the ×n lines
```

- **Data:** the event (`useGetEvent`), its slots (`useGetVendorSlots` → `GET /api/Event/{eventId}/vendors`), and the vendor's applications, so a slot with a request In Review, Approved or Secured shows **Requested** instead of +, and the row is read only: no details modal, no counter or price input. The status comes from `getSlotStatus`, the same mapping as My Slots.
- **Availability** (`getSlotAvailability` in `slot-request.ts`): closed once the event has ended or the slot's deadline has passed, paused when the slot's status says so, sold out when a revenue slot has no stalls left (`slotData.slotNumber`).
- **Prices:**
  - Revenue prices are shown with the platform fee (`withPlatformFee` in `slots/slot-status.ts`), so the row says "(includes fees)".
  - A service offer shows the organizer's budget, and the cart shows the vendor's proposed price.
  - **The proposed price can't go above the budget** (`getMaxPriceOffer`): the top of the range, or the single budget when there's no range. Below the minimum is allowed. The input's placeholder says "Up to ₦…"; typing or pasting more sets it to the maximum with a toast, "The organizer's budget goes up to ₦…". `addService` caps it again before it goes in the cart. With no budget set, there's no cap.
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
├── All / In Review / Approved / Ended  filter chips with counts
└── VendorCardGrid
    └── VendorEventCard     one per request, newest first; the status pill in the footer
```

- **Requests:** `useGetVendorApplications` (`GET /api/Event/vendor/applications`, 100 per page).
- **Flyers and end dates** aren't on the application, so `useVendorEventsById` loads each event once with `useQueries`. It shares `eventKeys.detail(id)` with `useGetEvent`, so the request page opens from the cache.
- **In Review** counts requests still waiting on the organizer. **Approved** counts Approved and Slot Secured. **Ended** counts requests whose event has ended.
- **Empty:** "No Slots Yet", with **Discover Events**.

### A request's page (`slots/slot-details/`)

```
VendorSlotDetailsPage (loads :applicationId with useVendorApplication)
├── VendorPageHeader        event name, slot name, back to My Slots, Revenue / Service vendor tag
├── EventFlyerCard          3:4 flyer (up to 570px wide), About Event, Go to eventpage (the fan page, new tab)
└── column
    ├── SlotSummaryCard     YOUR SLOT + status pill, name, category, description (scrolls),
    │                       details table, then the part that depends on the status
    └── CommunityCard       Instagram, X, the creators website
```

The page loads the request on its own with `GET /api/Event/vendor/application/{applicationId}`.
A withdrawn or unknown id isn't retried and shows "This request may have been
withdrawn". Swagger also lists the same `GET` under `/applications/{applicationId}`.

What the bottom of the summary card shows:

| Status | Revenue slot | Service offer |
|---|---|---|
| In Review | "Request sent on …" notice, Slot fee (price × stalls), Platform fee, Amount Due, **Withdraw Request**, faded "Secure Payment With Paystack" | Budget and proposed price, the notice, **Withdraw Request** |
| Approved | "Pay before “date” at “time”" notice, Slot fee (price × stalls), Platform fee, Amount Due, **Pay now** | **Contact organizer** |
| Slot Secured | "Paid ₦…" with the date, **View receipt**, **Contact organizer** | "Offer accepted", **Contact organizer** |
| Rejected, Expired, Completed | The notice, **Discover Events** | Same |

- **Withdraw Request** asks for confirmation, then calls `DELETE /api/Event/vendor/application/{id}` and goes back to My Slots. The ticket page then shows the slot as open again, and it can be requested again. A service offer's proposed price can't be edited once it's sent; withdrawing and requesting again is the way to change it.
- **Pay now** calls `POST /api/Event/vendor/slot/initialize-payment` (`useInitializeVendorSlotPayment`) with `{ applicationId, paymentMethod: 'paystack-checkout', callbackUrl }`. The callback is the request's own page. Paystack charges the Amount Due the page shows (slot fee + platform fee).
  - The page goes to the checkout link in the response (`authorizationUrl`, also `authorization_url`, `checkoutUrl`, `paymentUrl`, or the data itself if it's a link). With no link, it says the payment couldn't start.
  - Back from Paystack, a `?reference=` (or `?trxref=`) in the URL is sent once to `POST /api/Event/vendor/slot/pay` (`usePayVendorSlot`) to confirm the payment, then removed from the URL. On success it says "Slot secured!" and refreshes the applications and the summary.
- **Contact organizer** is a `mailto:`. It uses the slot's own contact email when the organizer set different contact details, otherwise the event's contact email. It's greyed out when there's neither.
- **View receipt** is for stalls only (a service vendor doesn't pay for the slot). It's a dialog built from the application: slot fee, platform fee, total and the date it was last updated. There's no receipt endpoint; these are the dashboard's numbers.

### Profile, Account and Settings (`profile/`)

One modal, opened from the sidebar's **Edit profile** and **Finish setting up your profile** (on Profile) and the avatar menu's **Settings** (on Settings).

| Tab | Contents | Saves with |
|---|---|---|
| Profile | Picture (tap to change), business name and email, bio (450 characters), contact details (email, read only; phone, website, Instagram), gallery (up to 12 photos) | `PATCH /api/profile/vendor` |
| Account | Business name (shown, not editable), website, category; first and last name, email and password (both shown, not editable), gender, birthday, country, state (a list of the 36 states and the FCT when the country is Nigeria, typed otherwise; changing country clears it), phone with country code | `PATCH /api/profile/vendor` |
| Settings | Change password (current, new and confirm new; 8 characters or more, different from the current one, and the two must match), email notifications, Log Out | `PATCH /api/profile/vendor/change-password` |

- **One draft for both tabs.** Phone and website are on Profile and Account (email too, read only, since it's the sign-in email), so both tabs edit one draft (`VendorProfileDraft`), and either Save sends all of it. Save stays grey until something changes.
- **Where the values come from:** `toDraft` reads the vendor profile (`GET /api/profile/vendor`) and falls back to the logged-in user. Name and gender only come from the user.
- **What's sent:** `toUpdateRequest` keeps the rest of `businessData` and writes the bio to `aboutBusiness`, the website to `portfolio.webUrl`, Instagram to `socials.instagram` (a handle becomes a full link), the picture and gallery. The phone goes as `+234…` in both `phoneNumber` and `telephone`. Category also goes as `services` and `vendorType`, and the website also as `website`, to keep the profile's duplicate fields in step. The app never reads those three back: Web URL comes from `portfolio.webUrl` and category from `category`. Country and state go as they are, and the birthday as `dateOfBirth`, `1998-03-07`. The old `gallary` spelling is cleared so it can't bring back removed photos. The birthday is read back from the vendor profile's `dateOfBirth`, falling back to the user.
- **After saving**, the logged-in user is updated too (`applyDraftToUser`), so the sidebar and the "Finish setting up" check change straight away.
- **Photos** upload to Cloudinary as they're picked (`useUploadImage`). Only their links are saved, and only on Save.
- **Email notifications** isn't saved; the API has no setting for it.

---

## 6. Hooks and endpoints

| Hook | File | Endpoint |
|---|---|---|
| `useGetVendorAvailableEvents` | `use-vendor-mutation.ts` | `GET /api/Event/vendor/available-events` |
| `useGetVendorSlots` | `use-event-mutations.ts` | `GET /api/Event/{eventId}/vendors`. Shares its cache with `useGetEventVendors`, which calls the same endpoint. |
| `useGetVendorApplications` | `use-event-mutations.ts` | `GET /api/Event/vendor/applications` |
| `useVendorApplication` | `use-vendor.ts` | `GET /api/Event/vendor/application/{applicationId}` |
| `useVendorSummary` | `use-vendor.ts` | `GET /api/Event/vendor/summary` |
| `useVendorSavedEvents` | `use-vendor.ts` | `GET /api/Profile/vendor/event/watchlist` |
| `useToggleVendorSavedEvent` | `use-vendor.ts` | `POST /api/Event/{eventId}/save`, `DELETE /api/Profile/vendor/event/watchlist/remove` |
| `useRequestVendorSlots` | `use-vendor.ts` | `POST /api/Event/vendor/apply`, once per slot |
| `useWithdrawVendorApplication` | `use-vendor.ts` | `DELETE /api/Event/vendor/application/{applicationId}` |
| `useInitializeVendorSlotPayment` | `use-vendor.ts` | `POST /api/Event/vendor/slot/initialize-payment` |
| `usePayVendorSlot` | `use-vendor.ts` | `POST /api/Event/vendor/slot/pay` (confirms with the reference) |
| `useVendorEventsById` | `use-vendor.ts` | `GET /api/Event/{eventId}` for each event |
| `useVendorProfileComplete` | `use-vendor.ts` | none (reads the logged-in user) |
| `useVendorProfile` | `use-profile-mutations.ts` | `GET /api/profile/vendor` |
| `useUpdateVendorProfile` | `use-vendor.ts` | `PATCH /api/profile/vendor` |
| `useChangeVendorPassword` | `use-vendor.ts` | `PATCH /api/profile/vendor/change-password` |
| `useUploadImage` | `useCloudinaryUpload.ts` | Cloudinary (profile picture and gallery) |

The new dashboard hooks are in their own file, `use-vendor.ts`, rather than
`use-event-mutations.ts`.

**Query keys** are in `lib/event-keys.ts`: `vendorAvailable`, `vendors` (an
event's slots), `myVendorApplications` and `myVendorApplication` (the vendor's
own requests), `vendorSummary` and `vendorSaved`. `vendorApplications(eventId)`,
`vendorSlots` and `vendorSlotById` are the organizer's, for an event's slots and
applicants. Requesting and withdrawing refresh the applications. Saving refreshes saved events and the summary. A secured
payment refreshes the applications and the summary.

---

## 7. Things to know before changing code

- **Vendor and organizer code share files.** The vendor service, `types/vendor.ts`, `event-keys.ts` and the vendor hooks hold both sides: the vendor's own calls and the organizer's slot and applicant calls. `VendorSlot` is one type for both. Check the other side still typechecks when you change them.
- **Icons** are react-icons (Remix, `react-icons/ri`), added to `package.json` here at the same version as `prod`, like `dompurify`.
- **Descriptions are rich text HTML.** `RichTextContent` (`components/reusable/rich-text-content.tsx`) and `lib/rich-text.ts` show them sanitized. Both were copied unchanged from `prod`, with `dompurify` at prod's version, so the merge sees the same files on both sides.
- **Colours are written inline** (`#1E1E1E`, `#2A2A2A`, …) to match the Figma file. There are no dark theme tokens for the vendor dashboard yet.
- **No in-app notifications.** Vendors get notifications by email only; the old modal's Inbox tab went with the redesign and won't come back. The old inbox hooks and service calls were removed when `vendors` merged.
- **Categories** (`VENDOR_CATEGORIES` in `types/vendor.ts`) are now the design's 12. Where a category carried over, its old value was kept (`food_beverage` is Food & Drinks), so saved profiles still match. Sign-up and complete profile use the same list. `vendorCategoryLabel` tidies up values that are no longer listed.
