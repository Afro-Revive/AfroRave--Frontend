# Organizer Side (Creators) — Code Guide

How the organizer part of AfroRevive is put together: where files live, how
pages find "the current event", and how each feature talks to the API.

"Organizer" and "creator" mean the same thing. The API calls the account type
`Organizer`; URLs and folders say `creators`.

For what works and what doesn't, see [FEATURES.md](./FEATURES.md). The stack,
environment variable, data-layer rules and styling rules are the same as the fan
side, and are explained in [USER-SIDE.md](./USER-SIDE.md) §1, §7 and §10.

---

## 1. Two separate areas

| Area | Who sees it | Layout | URLs |
|---|---|---|---|
| **Creators website** | Anyone. It's the organizer marketing site and waitlist. | `layouts/creators-landing-page-layout` | `/`, `/home`, `/about-us`, `/contact-us`, `/blog`, `/creators` (redirects to `/home`) |
| **Creator dashboard** | Logged-in organizers | `layouts/creator-dashboard-layout` | `/creators/...` |

The create-event wizard (`/creators/add-event`) is a third case: a full-screen
page with no dashboard layout.

---

## 2. Where organizer code lives

```
src/
├── pages/creators/
│   ├── _components/
│   │   └── selected-event-page.tsx   SelectedEventGate + CreatorPageContainer (see §4)
│   ├── standalone/            /creators/events — the events dashboard
│   │   ├── components/        dashboard tabs, status filters, settings modal, filter button
│   │   └── guestlist/         Guestlist tab: the account-wide guest list
│   ├── add-event/             /creators/add-event — the create-event wizard
│   │   ├── tabs/              event-details, tickets, publish (theme-tab.tsx is unused)
│   │   ├── ticket-forms/      ticket form (create/), promo code form
│   │   ├── schemas/           zod schemas for tickets, promo codes, …
│   │   └── component/         fields shared with other pages: price, poster, visibility, …
│   ├── edit-event/            /creators/edit/:eventId — event details, visibility, poster
│   ├── tickets/               /creators/tickets — tickets, invites, orders
│   ├── guest-list/            /creators/guest-list — one event's guest list
│   ├── promo-codes/           /creators/promo-codes
│   ├── audience/              /creators/audience/:eventId — private event access requests
│   ├── realtime/              /creators/realtime — analytics
│   ├── access-control/        /creators/access-control — mock data
│   ├── reports/, season/      "Coming Soon" pages
│   └── home/, about-us/, contact-us/, blog/, wishlist/   the creators website
├── pages/vendor/              Vendor dashboard, AND the organizer's vendor pages:
│   ├── revenue-vendor/        /creators/revenue-vendor (+ /:slotId)
│   ├── service-vendors/       /creators/service-vendor (+ /:serviceId)
│   ├── seating-maps/          /creators/seating-maps ("Coming Soon")
│   └── component/             create/edit slot modals, vendor profile modal
├── layouts/
│   ├── creator-dashboard-layout/   header, sidebar, selected-event card
│   └── creators-landing-page-layout/
└── components/shared/
    ├── dashboard-cards.tsx         the event card on the dashboard
    ├── ticket-summary-card.tsx     the ticket card used on the Tickets page and in the wizard
    └── creator-guide-overlay.tsx   the first-time "how to create an event" guide
```

The `wishlist/` folder is really the **waitlist** page at `/`. The name is
historical.

---

## 3. Dashboard routes

Paths live in `src/config/route-map.ts`. Routes are in
`src/config/creator-dashboard-routes.tsx`, each wrapped in `OrganizerAuthGuard`.

| URL | Page | Event comes from |
|---|---|---|
| `/creators/events` | `standalone` | none (lists every event) |
| `/creators/add-event?tab=…` | `add-event` | `useEventStore` (the event being created) |
| `/creators/edit/:eventId` | `edit-event` | the URL |
| `/creators/audience/:eventId` | `audience` | the URL |
| `/creators/tickets` | `tickets` | the selected event (§4) |
| `/creators/guest-list` | `guest-list` | the selected event |
| `/creators/promo-codes` | `promo-codes` | the selected event |
| `/creators/realtime?tab=…` | `realtime` | the selected event |
| `/creators/revenue-vendor`, `/:slotId` | `vendor/revenue-vendor` | the selected event |
| `/creators/service-vendor`, `/:serviceId` | `vendor/service-vendors` | the selected event |
| `/creators/access-control` | `access-control` | none (mock data) |
| `/creators/seating-maps`, `/creators/reports`, `/creators/season` | placeholders | — |

---

## 4. "Which event am I working on?"

Most dashboard pages have no event id in their URL. They all read one shared
**selected event** instead:

- **`useEventSelectorStore`** (`src/stores/index.ts`) holds `selectedEventId`. It's saved to `localStorage` as `afro-selected-event`, so it survives a reload.
- **It gets set when** the organizer:
  - clicks an event card button on the dashboard (Manage, Analytics, Tickets, Report),
  - opens `/creators/edit/:id` or `/creators/audience/:id` (the sidebar copies the id from the URL), or
  - picks an event in the analytics page's dropdown.
- **`SelectedEventGate`** (`_components/selected-event-page.tsx`) wraps pages that need an event. It loads the event and passes it to the page. It shows "No event selected" or "No event found" when it can't.
- **`CreatorPageContainer`** is the shared page frame, with an optional header bar.

```tsx
export default function TicketsPage() {
  return (
    <SelectedEventGate>
      {(event) => <EventTickets eventId={event.eventId} accessType={event.accessType} />}
    </SelectedEventGate>
  )
}
```

---

## 5. Dashboard layout

```
CreatorDashboardLayout
├── CreatorDashboardHeader         logo, CreatorMenuButton (Dashboard / Settings / Log out),
│                                  mobile hamburger
└── main
    ├── CreatorSidebar             hidden on /creators/events (that page is full width)
    │   ├── SelectedEventCard      the selected event: name, date, visibility,
    │   │                          Copy Link, View Event
    │   ├── EVENTS                 Event Details, and Audience (private events only)
    │   ├── TICKETS                Your Tickets, Guest List, Promo Codes
    │   ├── ANALYTICS              Realtime
    │   ├── VENDOR                 Revenue Vendor, Service Vendor (each lists its slots)
    │   ├── TOOLS                  Access Control, Seating Maps
    │   └── footer: "Your Events"  back to the dashboard
    └── <Outlet />                 the page
```

- The sidebar is built on `components/reusable/base-sidebar.tsx`.
- It collapses on desktop and becomes a full-screen overlay on mobile.
- The Audience link only appears when the open event is private (`toVisibility(event.accessType) === 'private'`).

The organizer **Settings modal** is
`standalone/components/creator-settings-modal.tsx`, opened from the header
menu. It has three tabs:

| Tab | Contents | Data |
|---|---|---|
| Profile | Name, company, phone, gender, website, bank details | `useOrganizerProfile`, `useUpdateOrganizerProfile` |
| Inbox | Notifications | `useOrganizerNotifications`, `useMarkNotificationAsRead` |
| Account | Change password, order notifications, log out, delete account | |

---

## 6. Feature walkthroughs

### Events dashboard (`standalone/index.tsx`)

```
StandalonePage
├── DashboardTabs                  Events | Guestlist; Create Event, or the guestlist actions
├── Events tab
│   ├── EventFilters               All / Ongoing / Upcoming / Drafts / Ended, with counts
│   ├── StandAloneEvents (per event)  → DashboardCards
│   │     image → edit event; stats: tickets sold, net profit;
│   │     buttons: Analytics, Tickets, Manage / Edit Draft / Report
│   ├── Pagination
│   └── EmptyState                 "Start guide" → CreatorGuideOverlay
└── Guestlist tab → GuestlistTab (standalone/guestlist)
```

- Events come from `useGetOrganizerEvents({ pageNumber, pageSize })`, and each card loads its own detail with `useGetEvent(id)`.
- The status (draft, upcoming, ongoing, sold out, ended) is worked out in the browser from the publish state, dates and ticket stats.

### Create event (`add-event/`)

A wizard driven by `?tab=` in the URL:

| Step | `tab` | Component | What happens |
|---|---|---|---|
| 1 | `event-details` | `tabs/event-details-tab.tsx` | Creates the event (`useCreateEvent`). Saves its id in `useEventStore`. |
| 2 | `tickets` (`&form=create` or `&form=promocode`) | `tabs/tickets-tab.tsx` → `ticket-forms/create`, then `promo-code-form` | Adds tickets, then promo codes. |
| 3 | `publish` | `tabs/publish-tab.tsx` | Shows a summary (tickets, promo codes, whether resale is on). **Publish** calls `usePublishEvent`, which refreshes the dashboard list. |

- **`useEventStore`** carries the new event's id between steps. It's cleared when the wizard closes, so the next event starts fresh.
- **Old links:** `?tab=theme` (the removed theme step) redirects to `publish`.
- **The ticket form:**
  - `ticket-forms/create/ticket-form.tsx` with `ticket-format-picker.tsx`.
  - **Format:** single, group or multi-day.
  - **Access:** paid, free or invite-only.
  - **Sales:** online or at the door.
  - **Advanced:** sales start immediately (the default) or at a date; resale allowed (the default) or not.
  - Validated by `schemas/ticket-schema.ts`.
- **`lib/event-transforms.ts` translates forms into API requests.** For example, `transformTicketsToCreateRequest` maps `single_ticket` to `Single`, and always sends `allowResell: false` for invite-only and group tickets.

### Edit event (`edit-event/`)

One page, `tabs/event-details-tab.tsx`:
- **Details form:** the same fields as creation.
- **Visibility picker:** public ↔ private. A public event can't be made private.
- **Poster** (`component/poster-image-field.tsx`): reads `posterUrl` from the event.

### Tickets (`tickets/`)

```
TicketsPage → SelectedEventGate → EventTickets
├── TicketsHeader          "Your Tickets" + All / Invite-Only / Door filter
├── TicketNotice           how invite-only works, or the private event rules
├── SummaryCard            net sales and tickets issued (useGetEventAnalytics);
│                          View Analytics
├── TicketForm             reused from add-event to create or edit a ticket
├── TicketCard (each)      built on shared TicketSummaryCard; menu: Edit / Delete /
│                          Send Invite (invite-only); invites-sent count
├── TicketInvitesTable     when an invite-only ticket is selected
│   └── or EventOrdersTable   otherwise: every order for the event
└── SendInvitesModal       two tabs:
    ├── InviteGuestlistTab     pick guests from the guestlist
    └── InviteNewGuestTab      add a new guest (also saved to the guestlist)
```

Hooks used: `use-invite-ticket-mutations.ts` (`useGetTicketInvites`,
`useSendTicketInvites`, `useGetEventOrders`), plus `useCreateTicket`,
`useUpdateTicket` and `useDeleteTicket`.

### Guest lists

There are **two different guest lists**, so keep them apart:

| | Account guestlist | Event guestlist |
|---|---|---|
| Where | Dashboard → Guestlist tab (`standalone/guestlist/`) | `/creators/guest-list` (`guest-list/`) |
| What | Every guest the organizer has saved, in categories | Who is on one event's list |
| Main parts | `GuestCategories`, `GuestTable`, `AddGuestModal`, `NewCategoryModal`, `GuestLimitCard` | `AddGuestCard`, `ImportGuestlistCard`, `EventGuestlistCard` |
| Paging | Server side, 20 per page, with search and sort | Server side, 8 per page |

**An important backend rule:** the event's "configure guestlist" call
**replaces** the whole list. `useAddGuestToEvent` and the import screen always
send the full selection: what was already saved plus the new guests.

Hooks live in `use-guestlist-mutations.ts`; query keys are in
`lib/guestlist-keys.ts`.

### Promo codes (`promo-codes/index.tsx`)

- Lists the event's codes (`useGetEventPromoCodes`).
- Creating a code reuses `PromoCodeFormFields` from the wizard.
- Each row opens a details modal, and its menu deletes the code.

### Audience (`audience/`), private events only

```
AudiencePage (reads :eventId, checks the event is private)
└── EventAudience
    ├── AudienceHeader        Pending / Approved pills with counts; Pause / Resume Requests
    ├── NoticeCard            "Approvals are final"
    └── AccessRequestsCard    Pending: select rows, Approve Selected, search, 8 per page
                              Approved: status, order, amount
```

- Hooks: `use-private-event-mutations.ts`.
- The pill counts come from one-row queries, so they don't change as you search.
- Paused and ended are read from `useGetViewerAccessStatus`.
- Approving sends `{ requestIds, decision: 'Approved' }` in one batch.
- `pause` goes in the **query string**, not the body.

### Analytics (`realtime/`)

Tabs, in sections, chosen with `?tab=`:

| Section | Tabs |
|---|---|
| Event | Overview, Vendors |
| Tickets | Orders, Attendee List ("Coming Soon"), Promo Codes |
| Audience | Insights |

- All tabs share one request, `useGetEventAnalytics(selectedEventId)`, and use `components/analytics-state.tsx` for loading, error and empty states.
- The charts are reusable components in `components/reusable/charts/` (bar, line, pie) built on recharts.

### Vendor management (`pages/vendor/...`, inside the dashboard)

| File | What it does |
|---|---|
| `revenue-vendor/` | Revenue slots ("stalls") for the selected event; `/:slotId` lists that slot's applicants. |
| `service-vendors/` | Service offers, laid out the same way. |
| `component/create-vendor-slot-modal.tsx` | Create a slot or offer. |
| `component/edit-vendor-slot-form-modal.tsx` | Edit one. |
| `component/vendor-profile-modal.tsx` | Review an applicant, then accept or reject. |

`useVendorSlotsByType(eventId)` fetches the slots once and splits them into
revenue and service. The sidebar uses it to list slots under each vendor type.

---

## 7. Hooks the organizer side uses

| File | Hooks |
|---|---|
| `use-event-mutations.ts` | `useCreateEvent`, `useUpdateEvent`, `usePublishEvent`, `useDeleteEvent`, `useGetEvent`, `useGetOrganizerEvents`, `useCreateTicket`, `useUpdateTicket`, `useDeleteTicket`, `useGetEventTickets`, `useCreatePromoCode`, `useDeletePromoCode`, `useGetEventPromoCodes`, `useGetEventAnalytics`, `useCreateVendor` |
| `use-guestlist-mutations.ts` | `useGetOrganizerGuestList`, `useGetOrganizerCategories`, `useAddGuest`, `useDeleteGuest`, `useAddCategory`, `useRemoveGuestFromCategory`, `useBulkUploadGuests`, `useDownloadCSVTemplate`, `useGetEventGuestListConfig`, `useGetEventCheckinList`, `useAddGuestToEvent`, `useConfigureEventGuestList` |
| `use-invite-ticket-mutations.ts` | `useGetTicketInvites`, `useSendTicketInvites`, `useGetEventOrders`, `useGetInviteOnlyTicketAudience`, `useUpdateInviteEmail` |
| `use-private-event-mutations.ts` | `useGetAccessRequests`, `useBatchUpdateAccessRequests`, `useUpdateApplicationStatus`, `useUpdateApplicationDeadline`, `useEndApplication`, `useGetViewerAccessStatus` |
| `use-vendor-mutation.ts` | `useVendorSlotsByType`, `useGetAllVendorSlots`, `useGetVendorSlotById`, `useVendorApplicationsByType`, `useAcceptVendorApplication`, `useRejectVendorApplication` |
| `use-profile-mutations.ts` | `useOrganizerProfile`, `useUpdateOrganizerProfile`, `useOrganizerNotifications`, `useMarkNotificationAsRead` |

**Refreshing after a change:**
- Mutations refresh the queries they affect.
- Event keys nest under `eventKeys.detail(id)`, so a ticket change also refreshes that event's analytics.
- Publishing refreshes the organizer's event list.
- Access-request changes refresh every page and filter of that event's requests.

---

## 8. Things to know before changing code

- **Read new ids from `data.id`.** The top-level `id` on a response is often an all-zero GUID.
- **Breakpoints:** an upright tablet gets the **mobile** layout (see USER-SIDE.md §10). The dashboard's tab bar and guestlist buttons stack on mobile on purpose.
- **Forms:**
  - Don't put zod `.default()` on a schema used with `zodResolver`. Pass defaults through `defaultValues` instead; `.default()` breaks the form's types.
  - Read fields that change rendering with `form.watch()`, not `form.getValues()`, which won't re-render.
- **Unused files:** 11 organizer files nothing imports, mostly the theme step, upgrades and the first create-event design (`theme-tab.tsx`, `upgrade-form.tsx`, `ticket-modal.tsx`, `standalone-modal.tsx`, …). The full list, with what to do about each, is in [DEAD-CODE.md](./DEAD-CODE.md).
- **The first-time guide** (`components/shared/creator-guide-overlay.tsx`) still has a "Theme & Media" step for the removed theme tab.
