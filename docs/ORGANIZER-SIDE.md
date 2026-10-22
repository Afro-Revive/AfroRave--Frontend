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
│   │   ├── ticket-forms/      ticket form (create/); promo-code-form/ holds the fields the
│   │   │                      Promo Codes page uses (no longer a wizard step)
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
│   └── creators-landing-page-layout/   the creators website: the new header, sidebar and
│                                       footer (creators-*), and the old ones blog and the
│                                       waitlist still use
└── components/shared/
    ├── dashboard-cards.tsx         the event card on the dashboard
    ├── ticket-summary-card.tsx     the ticket card used on the Tickets page and in the wizard
    ├── sidebar-toggle.tsx          the sidebar's collapse button, beside each page's title
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
    │   ├── EVENTS                 Event Details, Audience (private events only), Guest List
    │   ├── TICKETS                Your Tickets, Promo Codes
    │   ├── ANALYTICS              Overview, Audience Insights, Vendors, and a Tickets
    │   │                          accordion (Orders, Attendee List, Promo Codes). Each
    │   │                          opens /creators/realtime?tab=…; the page has no tab
    │   │                          list of its own. Links with a ?tab= are only active
    │   │                          when the tab matches (isPathActive in base-sidebar).
    │   ├── VENDOR                 Revenue Vendor, Service Vendor (each lists its slots)
    │   ├── TOOLS                  Access Control, Seating Maps
    │   └── footer: "Your Events"  back to the dashboard
    └── <Outlet />                 the page
```

- The sidebar is built on `components/reusable/base-sidebar.tsx`.
- **It stays put.** With `sticky`, it fills the screen below the header (`--dashboard-header-height`) and stays still while the page scrolls. It doesn't scroll itself, so the Your Events footer is always in view.
- **Collapsing** (desktop only) is done by `SidebarToggle` (`components/shared/sidebar-toggle.tsx`), which sits beside each page's title: Event Details, Your Tickets, Analytics, Guest List, Audience and Promo Codes. A page without one (the vendor pages, for now) still needs a way back, so the sidebar shows its own floating button only when `useSidebarToggleCount` says no toggle is on screen.
- On mobile it's a full-screen overlay opened from the header's menu button.
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
| 2 | `tickets` (`&form=create`) | `tabs/tickets-tab.tsx` → `ticket-forms/create` | Adds tickets. Saved ones are listed as `TicketSummaryCard`s with their real format, access and group size, at the price before fees. |
| 3 | `publish` | `tabs/publish-tab.tsx` | A preview in the fan page's style: `FlyerCard`, the description (clamped, with Read more), `ContactSection` titled "Contact details", and the tickets as `TicketSummaryCard`s without menus. **Publish** calls `usePublishEvent`, which refreshes the dashboard list. |

- **Promo codes aren't a step any more.** Organizers make them on the Promo Codes page. An old `?form=promocode` or `?form=upgrades` link lands on the ticket form.
- **`useEventStore`** carries the new event's id between steps. It's cleared when the wizard closes, so the next event starts fresh.
- **The header** has a **Dashboard** link (leaves; the open form isn't saved) and **Save As Drafts**:
  - On Event Info before the event exists, it submits that form by id (`EVENT_DETAILS_FORM_ID`), so it runs the same checks as Continue. A `savingDraft` ref tells the form's submit to end on the dashboard instead of the next step.
  - Once the event exists, everything is already saved as it goes and stays unpublished, so it only shows a toast and goes to the dashboard.
  - It reads `useIsMutating({ mutationKey: eventKeys.create() })` to show SAVING… while the form it doesn't own is creating the event.
- **Errors:** if creating fails, the toast shows the server's reason (`apiErrorMessage` in `lib/api-error.ts`: a field's validation message, then the response message, then its title).
- **Event Info fields:** the website URL is optional, the custom URL field is labelled "URL", and the refund terms field is commented out.
- **The description is rich text.** `components/reusable/rich-text-editor.tsx` (Tiptap, react-icons Remix toolbar) offers headings (H2, H3), bold, italic, underline, strikethrough, inline code, links, bullet and numbered lists, quotes, code blocks, dividers and undo/redo, and saves HTML. Links open in a new tab; a click while editing doesn't follow them. Older plain-text descriptions open as paragraphs (`toRichText` in `lib/rich-text.ts`). The 2000 limit and the counter count visible text, not tags (`richTextLength`). Edit event uses the same editor.
- **Old links:** `?tab=theme` (the removed theme step) redirects to `publish`.
- **The ticket form:**
  - `ticket-forms/create/ticket-form.tsx` with `ticket-format-picker.tsx`.
  - **Format:** single, group or multi-day.
  - **Access:** paid, free or invite-only.
  - **Sales:** online or at the door.
  - **Advanced:** sales start immediately (the default) or at a date; resale allowed (the default) or not.
  - **Description:** the same rich text editor as the event description. Its 10–2000 limit counts visible text. Organizer ticket cards show it with `RichTextContent`.
  - Validated by `schemas/ticket-schema.ts`.
- **`lib/event-transforms.ts` translates forms into API requests.** For example, `transformTicketsToCreateRequest` maps `single_ticket` to `Single`, and always sends `allowResell: false` for invite-only and group tickets.

### Edit event (`edit-event/`)

One page, `tabs/event-details-tab.tsx`, under an "Event Details" header with the sidebar toggle:
- **Details form:** the same fields as creation, website URL optional. Saving (`useUpdateEvent`) refreshes the event, the events dashboard, the public page (cached by custom URL) and the fan lists.
- **Visibility picker:** public ↔ private. A public event can't be made private.
- **Poster** (`component/poster-image-field.tsx`): reads `posterUrl` from the event.

### Tickets (`tickets/`)

```
TicketsPage → SelectedEventGate → EventTickets
├── TicketsHeader          "Your Tickets" + sidebar toggle + All / Invite-Only / Door filter
├── TicketNotice           how invite-only works, or the private event rules
├── TicketFormatPicker     "Add Tickets", above the list. layout='grid' puts the formats
│                          side by side without the ticket icon; private events
│                          hide group tickets
├── TicketForm             reused from add-event to create or edit a ticket
├── TicketCard (each)      built on shared TicketSummaryCard: price before fees, sold /
│                          available, group size on the group icon; menu: Edit /
│                          Delete / Send Invite (invite-only); invites-sent count
├── SummaryCard            net sales and tickets sold / total, from the event's
│                          eventStat (useGetEvent), as on its dashboard card;
│                          View Analytics
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
- Creating a code uses `PromoCodeFormFields` from `add-event/ticket-forms/promo-code-form/`, which is now only this page's form.
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

The page has no tab list of its own. The sidebar's ANALYTICS group opens each
tab with `?tab=`:

| Sidebar link | Tab |
|---|---|
| Overview | Overview |
| Audience Insights | Insights |
| Vendors | Vendors |
| Tickets (accordion) | Orders, Attendee List ("Coming Soon"), Promo Codes |

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

### Creators website (`/home`, `/about-us`, `/contact-us`)

The public organizer site, redesigned in October 2026. The layout
(`layouts/creators-landing-page-layout/index.tsx`) gives these three pages the
new header (`REDESIGNED_PAGES`); blog and the waitlist (`/`) keep the old header
and footer.

```
CreatorsLandingPageLayout
├── CreatorsHeader          logo; LOG IN (Organizer / Vendor) on desktop; menu button
│   └── BaseSheet → CreatorsSidebarMenu
│         Organizer and Vendor log ins (or Dashboard once signed in), Home,
│         About Us, Contact Us, Get The Afrorevive App, socials
├── AuthModal
└── page, each ending with CreatorsFooter (tone 'light' or 'dark'):
    the AFROREVIVE wordmark, socials, links, copyright
```

| Page | Sections | Notes |
|---|---|---|
| Home | `home/sections/creators-hub.tsx` | Organizer and Vendor open sign up for that role. The background video is `HERO_VIDEO_SRC`; `play()` is called with `?.catch`, since some browsers (and jsdom) return nothing from it. |
| About Us | `about-us/sections/`: `about-hero`, `what-we-offer` (offer cards and stats), `team` (initials set by hand), `work-with-us-banner` | |
| Contact Us | `contact-us/section/get-in-touch.tsx`, schema in `get-in-touch-schema.ts` | Sends `{ name, email, category, subject, message }` to `POST /api/Support` with `useSendSupportMessage` (`hooks/use-support-mutations.ts`). The service category is both the category and the subject. The form clears only once the message is sent. |

## 7. Hooks the organizer side uses

| File | Hooks |
|---|---|
| `use-event-mutations.ts` | `useCreateEvent`, `useUpdateEvent`, `usePublishEvent`, `useDeleteEvent`, `useGetEvent`, `useGetOrganizerEvents`, `useCreateTicket`, `useUpdateTicket`, `useDeleteTicket`, `useGetEventTickets`, `useCreatePromoCode`, `useDeletePromoCode`, `useGetEventPromoCodes`, `useGetEventAnalytics`, `useCreateVendor` |
| `use-guestlist-mutations.ts` | `useGetOrganizerGuestList`, `useGetOrganizerCategories`, `useAddGuest`, `useDeleteGuest`, `useAddCategory`, `useRemoveGuestFromCategory`, `useBulkUploadGuests`, `useDownloadCSVTemplate`, `useGetEventGuestListConfig`, `useGetEventCheckinList`, `useAddGuestToEvent`, `useConfigureEventGuestList` |
| `use-invite-ticket-mutations.ts` | `useGetTicketInvites`, `useSendTicketInvites`, `useGetEventOrders`, `useGetInviteOnlyTicketAudience`, `useUpdateInviteEmail` |
| `use-private-event-mutations.ts` | `useGetAccessRequests`, `useBatchUpdateAccessRequests`, `useUpdateApplicationStatus`, `useUpdateApplicationDeadline`, `useEndApplication`, `useGetViewerAccessStatus` |
| `use-vendor-mutation.ts` | `useVendorSlotsByType`, `useGetAllVendorSlots`, `useGetVendorSlotById`, `useVendorApplicationsByType`, `useAcceptVendorApplication`, `useRejectVendorApplication` |
| `use-profile-mutations.ts` | `useOrganizerProfile`, `useUpdateOrganizerProfile`, `useOrganizerNotifications`, `useMarkNotificationAsRead` |
| `use-support-mutations.ts` | `useSendSupportMessage` (the creators website's Contact Us) |

**Refreshing after a change:**
- Mutations refresh the queries they affect.
- Event keys nest under `eventKeys.detail(id)`, so a ticket change also refreshes that event's analytics.
- The events dashboard reads its own list (`eventKeys.organizer()`, `GET /api/Event/organizer`), separate from the fans' `eventKeys.lists()`. Creating, editing and publishing an event refresh both.
- Editing also refreshes the public page, which is cached by custom URL (`eventKeys.detailUrl`), and trending.
- Access-request changes refresh every page and filter of that event's requests.

---

## 8. Things to know before changing code

- **Read new ids from `data.id`.** The top-level `id` on a response is often an all-zero GUID.
- **Breakpoints:** an upright tablet gets the **mobile** layout (see USER-SIDE.md §10). The dashboard's tab bar and guestlist buttons stack on mobile on purpose.
- **Forms:**
  - Don't put zod `.default()` on a schema used with `zodResolver`. Pass defaults through `defaultValues` instead; `.default()` breaks the form's types.
  - Read fields that change rendering with `form.watch()`, not `form.getValues()`, which won't re-render.
- **Unused files:** 11 organizer files nothing imports, mostly the theme step, upgrades and the first create-event design (`theme-tab.tsx`, `upgrade-form.tsx`, `ticket-modal.tsx`, `standalone-modal.tsx`, …). The full list, with what to do about each, is in [DEAD-CODE.md](./DEAD-CODE.md).
- **The first-time guide** (`components/shared/creator-guide-overlay.tsx`) moves the wizard to each step's `?tab=`, so `GUIDE_STEPS` has to match the wizard's tabs. Adding or removing a step means updating both.
- **The rich text editor** (`components/reusable/rich-text-editor.tsx`): Tiptap's `useEditor` treats an editor whose view isn't mounted as destroyed, so the value sync checks `editor.isDestroyed` first, and the extensions are built once at module level. Rebuilding them every render replaced the editor and crashed the Event Details page.
