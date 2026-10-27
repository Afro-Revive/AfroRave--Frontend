# AfroRevive — Feature List

A plain-language list of everything the web app can do today, how important
each feature is, and whether it actually works yet. Use it to know what's left
before launch, what's safe to demo, and what to test.

Last checked against the code on the `prod` branch, October 2026.

---

## Progress at a glance

| | Critical (High) | Medium | Low | **Overall, weighted by priority** |
|---|---|---|---|---|
| **Fans** | 14 / 17 done | 10 / 11 | 1 / 4 | **82%** |
| **Organizers** | 13 / 13 done | 23 / 27 | 5 / 16 | **83%** |
| **Fans + Organizers** | **27 / 30 done (90%)** | 33 / 38 | 6 / 20 | **82%** |
| Vendors (in progress on the `vendors` branch) | 2 / 4 done | 0 / 3 | — | 33% |

**How the overall % is worked out:**
- A High feature counts 3 times as much as a Low one, and a Medium one twice as much.
- Only fully working features score.
- If half-working ("Partial") and "Awaiting backend" features get half credit, fans and organizers reach 84%.
- **Critical features only:** 90% are fully done, or 92% with half credit for the partly working ones.

Most of the gap is Low priority: small buttons and extra tools.
**All the main journeys work end to end.**
- **Fans:** discover → buy → manage tickets → resell or transfer → get paid.
- **Organizers:** create → sell → invite → approve → track.

### Critical features still to do

Only **3 critical features** are left on the fan and organizer sides. Ranked by
how much they block launch:

| # | Feature | Area | Status | What's needed |
|---|---|---|---|---|
| 1 | Privacy Policy, Refund Policy, Terms and Conditions | Fans | 🚧 Coming soon | **Content.** Needed before taking real payments: payment providers and app stores ask for them. |
| 2 | Accept an invite from the email link | Fans | ⛔ Not working | **Frontend.** A page for the invite link. The backend calls and hooks are ready. Without it, invite-only tickets don't reach guests. |
| 3 | QR code for entry | Fans | 🟡 Partial | **Mobile app.** The QR is in the mobile app; the web app's app store links point nowhere until the apps are published. |

Vendors have 2 more on the `vendors` branch: **Register For Slot** and
**slot checkout**.

---

## How to read the tables

**Priority**
| Priority | Meaning |
|---|---|
| 🔴 **High** | The product doesn't work for its main purpose without it, it handles money, or launch needs it. |
| 🟠 **Medium** | Important, but the main journeys work without it. |
| ⚪ **Low** | Polish, extras or nice-to-haves. |

**Status**
| Status | Meaning |
|---|---|
| ✅ **Working** | Built and connected to the real backend. |
| 🟡 **Partial** | Works, but with a known limitation (explained in the note). |
| 🧪 **Mock** | The screen exists but shows sample data, not real data. |
| 🚧 **Coming soon** | A placeholder page that says "Coming Soon". |
| ⛔ **Not working** | A button or link that does nothing, or only pretends to. |
| 🔵 **Awaiting backend** | Done on the frontend. The backend side has been requested but isn't confirmed live yet. |

There are three kinds of people on AfroRevive:

- **Fans** buy, resell and transfer tickets.
- **Organizers** (also called *creators* in the code) create and run events.
- **Vendors** apply for stalls and service slots at events.

Within each table, rows run from High to Low priority.

---

## 1. Fans

### Finding events

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Fans home page (`/fans`) | 🔴 High | ✅ Working | Hero, discover events with category chips, resale, become a creator, and mobile app sections. |
| Events page (`/fans/events`) | 🔴 High | ✅ Working | Search, category and "Resale" are filtered by the server, 12 events per page. |
| Date filters: "Tonight", "This Week", month, a picked date | 🟠 Medium | ✅ Working | On the events page and the `/fans` "This Week" chip. Tonight and a picked date are sent as `date`; This Week and a month as `startDate` and `endDate`. An event shows if it's running on those days, not only if it starts on them. |
| Event page (`/fans/events/:customUrl`) | 🔴 High | ✅ Working | Details, description, map with directions, organizer contacts. |
| Private events | 🔴 High | ✅ Working | Tickets are hidden behind a "Request access" card. Fans see their request as pending until the organizer approves it. Signed-out fans are asked to log in first. |
| Search bar in the header | 🟠 Medium | ✅ Working | Search by text, date, category, and min/max price. The price filter shows events with at least one ticket in the range. |
| Bookmark an event | ⚪ Low | 🟡 Partial | The bookmark button works, but there is **no page that lists your bookmarks**. |

### Buying tickets

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Add tickets to cart without an account | 🔴 High | ✅ Working | The cart is saved in the browser and synced when the fan logs in. |
| Resale tickets on the event page | 🔴 High | ✅ Working | A "Resale" tab appears when other fans are reselling tickets. |
| Checkout and payment (Paystack) | 🔴 High | ✅ Working | Paystack redirects back to `/fans/payment-confirmation`, which confirms the order. |
| Accept an invite from an email link | 🔴 High | ⛔ Not working | The backend calls exist, but **there is no page for the invite link to open**. |
| Purchase limits | 🟠 Medium | ✅ Working | Fans can't add more than a ticket's purchase limit. |
| Invite-only tickets on the event page | 🟠 Medium | ✅ Working | Shown with a padlock. They can't be bought, only received by invite. |
| Promo codes at checkout | 🟠 Medium | ✅ Working | Validated as you type, and the discount is applied to the total. |

### After buying

| Feature | Priority | Status | Notes |
|---|---|---|---|
| My Tickets: active and past | 🔴 High | ✅ Working | |
| Ticket detail page | 🔴 High | ✅ Working | Orders for the event, with receipts. |
| Resell tickets | 🔴 High | ✅ Working | Pick tickets, set your price, list them. |
| QR code for entry | 🔴 High | 🟡 Partial | The web app says "Download the app to view your QR code", but the app store buttons don't go anywhere yet. |
| Transfer tickets | 🟠 Medium | ✅ Working | Checks the recipient's account exists before sending. |
| Listed tickets (active, sold, expired) | 🟠 Medium | ✅ Working | Edit the price or cancel a listing. |
| Ticket upgrades | — | Removed | Dropped as a feature in July 2026. Not counted. |

### Account

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Sign up and log in (fan, organizer, vendor) | 🔴 High | ✅ Working | After signing up, the form stays open and clears itself. |
| Forgot and reset password | 🔴 High | ✅ Working | |
| Complete profile from the email link | 🔴 High | ✅ Working | Works even on a device where you aren't logged in. |
| Wallet: balance and withdraw | 🔴 High | ✅ Working | Withdrawals check the bank account before sending. |
| Profile | 🟠 Medium | ✅ Working | Name, gender, state, country, date of birth. |
| Wallet: payout history | 🟠 Medium | ✅ Working | |
| Settings: change password, log out | 🟠 Medium | ✅ Working | |
| Support contact form (`/fans/support`) | 🟠 Medium | ⛔ Not working | Shows "Thanks — we will get back to you", but **the message is not sent anywhere**. The API now has `POST /api/Support`, and the organizer website's Contact Us already sends to it with `useSendSupportMessage`. |

### Information pages

| Page | Priority | Status | Notes |
|---|---|---|---|
| Privacy Policy, Refund Policy, Terms and Conditions | 🔴 High | 🚧 Coming soon | Legal pages. Needed before going live with payments. |
| About Us, Blog, FAQ | ⚪ Low | 🚧 Coming soon | |
| Sell, Work With Us | ⚪ Low | 🚧 Coming soon | |
| Resell info page (`/fans/resell`) | ⚪ Low | ✅ Working | Explains resale and links to My Tickets. |
| Resale marketplace | — | Parked | The pages exist in code but are switched off until the backend endpoint is ready. Not counted. |

---

## 2. Organizers

### Left to do (`organizer-fixes` branch)

Everything below is planned for the `organizer-fixes` branch, except **ticket
reordering**, which will be built on the latest `prod`. Each item's row in the
tables further down says where it stands today.

| Work | Priority | What's needed |
|---|---|---|
| Attendee List tab | 🟠 Medium | Build it on `GET /api/Event/{eventId}/attendees`. |
| Event guestlist: select a whole category | 🟠 Medium | Frontend only. |
| Analytics Export | ⚪ Low | Frontend only. |
| Door tickets | ⚪ Low | Not built yet: how fans see them, and the organizer's "Sell On Mobile App". |
| ~~Ticket reordering~~ | ⚪ Low | **On `prod` instead**, with `PATCH /api/Event/{eventId}/tickets/reorder`. |

Still waiting on the backend, so not planned yet: Delete Account, Audience
search and approved fans' orders, saving email
notifications, and a report download (see §5).

### Creating and editing events

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Create event: details → tickets → publish | 🔴 High | ✅ Working | Promo codes are no longer a step; they're made on the Promo Codes page. The website URL is optional and the refund terms field is hidden. If creating fails, the server's reason is shown. |
| Ticket types | 🔴 High | ✅ Working | Single, group or multi-day. Paid, free or invite-only. Sold online or at the door. |
| Publish | 🔴 High | ✅ Working | The Publish step previews the event: flyer card, description, contact details and its tickets. The dashboard updates straight away. |
| Edit event details, poster and visibility | 🔴 High | ✅ Working | A private event can be made public, but a public event can never be made private. Saving refreshes the events dashboard and the public event page straight away. |
| Rich text descriptions (event and tickets) | 🟠 Medium | ✅ Working | Headings, bold, italic, underline, strikethrough, code, links, lists, quotes, code blocks and dividers. Fans see them cleaned of anything unsafe. |
| Save As Drafts and Dashboard (create-event header) | 🟠 Medium | ✅ Working | On Event Info, Save As Drafts creates the event (same checks as Continue), then goes to the dashboard. After that, everything is already saved as it goes, so it just goes to the dashboard. Dashboard goes back without saving the form that's open. |
| Sales start immediately or at a set date | 🟠 Medium | ✅ Working | Starts immediately by default. |
| Ticket resale | 🟠 Medium | ✅ Working | On by default. Organizers can untick it. Always off for invite-only and group tickets. |

### Events dashboard (`/creators/events`)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Event cards with status and visibility tags | 🔴 High | ✅ Working | Status: draft, upcoming, ongoing, sold out, ended. Visibility: public or private. |
| Filter by status, and pagination | 🟠 Medium | ✅ Working | |
| Card buttons: Manage / Edit Draft, Analytics, Tickets | 🟠 Medium | ✅ Working | Each one selects that event and opens its page. |
| Sidebar event card | 🟠 Medium | ✅ Working | Shows the selected event, with Copy Link and View Event. The sidebar stays put at screen height while the page scrolls, and its collapse button sits beside each page's title. |
| "Report" on an ended event | ⚪ Low | 🟡 Partial | Opens Analytics. A real report download doesn't exist yet. |
| First-time guide | ⚪ Low | ✅ Working | Three steps, matching create event: Event Details (with the poster), Add Tickets, Publish. |

### Tickets (`/creators/tickets`)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Ticket list with All / Invite-Only / Door filters | 🔴 High | ✅ Working | The Add Tickets format picker sits above the list. Cards show the price before fees, sold and available counts, and a group ticket's size on its icon. |
| Edit and delete a ticket | 🔴 High | ✅ Working | |
| Orders table | 🔴 High | ✅ Working | |
| Invite-only: send invites | 🔴 High | ✅ Working | Pick guests from your guestlist, or add a new guest, who is saved to the guestlist too. |
| Summary: net sales and tickets issued | 🟠 Medium | ✅ Working | The same numbers as the event's card on the dashboard: net profit, and tickets sold out of the total. Below the ticket list. View Analytics opens the analytics page. |
| Invite-only: invites sent, with status | 🟠 Medium | ✅ Working | |
| Door tickets: "Sell On Mobile App" | ⚪ Low | ⛔ Not working | The button does nothing. Door sales happen in the mobile app. |
| "Drag tickets to change the order fans view them" | ⚪ Low | ⛔ Not working | The notice on the page says this, but **ticket reordering isn't built**. The API now has `PATCH /api/Event/{eventId}/tickets/reorder` for it. |

### Audience — private events only (`/creators/audience/:eventId`)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Pending and Approved lists with counts | 🔴 High | ✅ Working | |
| Select and approve requests in bulk | 🔴 High | ✅ Working | Approvals are final. There is no "deny" — unapproved requests stay pending. |
| Pause and resume requests | 🟠 Medium | ✅ Working | |
| Search requests | ⚪ Low | ⛔ Not working | The search box is there, but **the backend doesn't support search yet**. |
| Order and amount for approved fans | ⚪ Low | 🟡 Partial | Shows "No orders made" for everyone until the backend sends order details. |

### Analytics (`/creators/realtime`)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Overview, Audience Insights, Vendors, Orders, Promo Codes | 🔴 High | ✅ Working | Real data from the analytics endpoint. Opened from the sidebar's ANALYTICS group, where Orders, Attendee List and Promo Codes sit in a Tickets accordion. |
| Attendee List tab | 🟠 Medium | 🚧 Coming soon | The API now has `GET /api/Event/{eventId}/attendees`; the tab isn't built yet. |
| Export button | ⚪ Low | ⛔ Not working | Does nothing. |
| Reports (`/creators/reports`) | ⚪ Low | 🚧 Coming soon | No longer linked from anywhere. |

### Organizer settings (avatar menu → Settings)

Three tabs: **Account**, **Payout** and **Settings**.

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Payout: bank account | 🔴 High | ✅ Working | Choose the bank and type the account number; the account name fills in from the bank, and Save only works once the bank has confirmed it. Saved to `/api/Profile/organizer/bank-account`. |
| Payout: total revenue | 🟠 Medium | ✅ Working | From `GET /api/Profile/organizer/wallet`. Until a bank account is saved, it says to add one for auto payouts. |
| Payout: early payout | 🟠 Medium | ✅ Working | "Request an early payout" pays out an amount the organizer chooses, up to what's available, to the saved account (`POST /api/Profile/organizer/wallet/withdraw`). |
| Payout: history | 🟠 Medium | ✅ Working | Paged, newest first, with status (`GET /api/Profile/organizer/payout-history`). |
| Account: user information, personal details, business details | 🟠 Medium | ✅ Working | Laid out like the fans account page: name, email (read-only), gender, birthday, country, state, phone, company and website, all filled in from the saved organizer profile and saved with `PATCH /api/Profile/organizer`. |
| Settings: change password, log out | 🟠 Medium | ✅ Working | Current, new and confirm new password, checked by the same schema as the fans page, on `PATCH /api/profile/organizer/change-password`. |
| Delete Account | 🟠 Medium | ⛔ Not working | Not in the modal any more; the backend has no endpoint for an organizer to delete their own account. App stores require it. |
| Inbox: notifications, mark as read | ⚪ Low | ⛔ Not working | The Inbox tab is switched off (commented out) for now. |
| Email notifications (on / off) | ⚪ Low | ⛔ Not working | A single checkbox. It isn't saved: there's no endpoint for it. |

### Guest lists

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Account guestlist (dashboard Guestlist tab) | 🟠 Medium | ✅ Working | Categories, search, sort, 20 per page, add guest, CSV upload. |
| Event guestlist (`/creators/guest-list`) | 🟠 Medium | 🟡 Partial | Add guests one by one or import them from your guestlist. **Selecting a whole category isn't wired.** |
| Delete a guest, remove a guest from a category | ⚪ Low | ✅ Working | |
| Guest allowance card | ⚪ Low | ✅ Working | Uses live account and category limits from `GET /api/GuestList/allowance`, including the active category's usage. |

### Promo codes (`/creators/promo-codes`)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Create, view, edit and delete promo codes | 🟠 Medium | ✅ Working | The redesigned page shows summary cards, usage and redemption data, promo-code cards, and applied promo codes for the event. |

### Vendor management

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Create revenue slots (stalls) and service offers | 🟠 Medium | ✅ Working | The Revenue Vendor and Service Vendor pages open with a how-it-works note and the form already open. The description is rich text, and the application deadline has a date and a time. After creating, the organizer lands on the new stall's page. |
| Edit a slot | 🟠 Medium | ✅ Working | On the stall's page, the Stall Details tab (Offer Details for services) opens the same form, filled in. |
| Slot pages listing applicants | 🟠 Medium | ✅ Working | Redesigned in October 2026: the how-it-works note, how long until applications close, a summary (net profit or budget, secured vendors, requests), and the applications list with status filters and search. |
| Accept or reject a vendor application | 🟠 Medium | ✅ Working | |
| Access Control (`/creators/access-control`) | 🟠 Medium | 🧪 Mock | Sample staff list. Its Download, event picker, Add Code and filter buttons do nothing. |
| Pause a slot | ⚪ Low | ✅ Working | Pause / Resume Application in the stall page's header. |
| Seating Maps (`/creators/seating-maps`) | ⚪ Low | 🚧 Coming soon | |
| Season events (`/creators/season`) | — | Dropped | Season events were dropped. The page is still routed but not linked. Not counted. |

### Organizer website

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Creators home (`/home`) and About Us | 🟠 Medium | ✅ Working | Redesigned in October 2026. Home: "All-in-one hub for creators", with Organizer and Vendor buttons that open sign up for that role, over a background video. About Us: who Afrorevive is, what organizers and vendors get, the team, and Work With Us. The header's menu is a slide-out sidebar with Organizer and Vendor log ins, the pages, and the app. |
| Contact Us (`/contact-us`) | 🟠 Medium | ✅ Working | Redesigned as "Get in touch". The form (name, email, service category, message) is sent to the support team through `POST /api/Support`. |
| Waitlist page (`/`) | ⚪ Low | ✅ Working | Joins the newsletter. Also shows the vendor registration callout. |
| Blog (`/blog`) | ⚪ Low | 🚧 Coming soon | |

---

## 3. Vendors

The vendor dashboard is still being built on the `vendors` branch. This is where
it stands on `prod`. It will be rechecked after that branch is merged.

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Vendor sign-up and registration callout | 🔴 High | ✅ Working | |
| Discover events (`/vendor/discover`) | 🔴 High | ✅ Working | Real events. The bookmark and "…" buttons on each card do nothing. |
| Event details for vendors | 🔴 High | 🟡 Partial | Real event, but the application deadline is hard-coded. **View Section Map** and **Register For Slot** do nothing. |
| Slot details and checkout | 🔴 High | 🧪 Mock | Sample data. **Download** and **Checkout** do nothing. |
| My Slots and Wishlist | 🟠 Medium | 🧪 Mock | Sample events. |
| Profile | 🟠 Medium | 🟡 Partial | Shows your real details. The **upload button and gallery arrows** do nothing. |
| Edit profile | 🟠 Medium | ⛔ Not working | **SAVE**, **Edit picture**, the inbox filters, **Mark all as read** and **Secure Slot** have no actions. |

---

## 4. Buttons and links that are not linked or not working

Everything in this table is visible to users today but does nothing, or only
pretends to. Rows run from High to Low priority.

| Where | Button or link | Priority | Status | What happens |
|---|---|---|---|---|
| Invite email | Accept invite link | 🔴 High | ⛔ Not working | There is no page for the link to open. |
| Fans footer | Privacy, Refund, Terms | 🔴 High | 🚧 Coming soon | Open a "Coming Soon" page. |
| Fans footer, home page and mobile menu | App Store / Google Play badges | 🔴 High | ⛔ Not linked | Link to `#`. Waiting for the apps to be published. Fans need the app for their QR code. |
| Ticket detail page | QR code ("download the app") | 🔴 High | ⛔ Not linked | Depends on the app store links above. |
| Fans support (`/fans/support`) | Contact form Send | 🟠 Medium | ⛔ Not working | Shows a success message but sends nothing. |
| Event guestlist page | Selecting a whole category | 🟠 Medium | ⛔ Not working | Only individual guests can be picked. |
| Analytics | Attendee List tab | 🟠 Medium | 🚧 Coming soon | |
| Access Control | Download, event picker, Add Code, filter | 🟠 Medium | ⛔ Not working | Mock page. |
| Fans footer | About Us, Blog, FAQ, Sell, Work With Us | ⚪ Low | 🚧 Coming soon | Open a "Coming Soon" page. |
| Fans social links | YouTube icon | ⚪ Low | ⛔ Not linked | Goes to the home page instead of YouTube. |
| Tickets page | Door ticket "Sell On Mobile App" | ⚪ Low | ⛔ Not working | No action. |
| Tickets page (private event) | "Drag tickets to change the order" notice | ⚪ Low | ⛔ Not working | Reordering isn't built. |
| Audience page | Search | ⚪ Low | ⛔ Not working | The backend has no search parameter. |
| Analytics | Export | ⚪ Low | ⛔ Not working | No action. |
| Organizer settings | Email notifications checkbox | ⚪ Low | ⛔ Not working | Not saved. |
| Sidebar → Tools | Seating Maps | ⚪ Low | 🚧 Coming soon | |

Vendor dashboard buttons (on the `vendors` branch, rechecked after merge):

| Where | Button or link | Priority | Status |
|---|---|---|---|
| Vendor event details | Register For Slot | 🔴 High | ⛔ Not working |
| Vendor slot details | Checkout | 🔴 High | ⛔ Not working |
| Vendor event details | View Section Map | 🟠 Medium | ⛔ Not working |
| Vendor edit profile | SAVE, Edit picture | 🟠 Medium | ⛔ Not working |
| Vendor discover | Card bookmark and "…" | ⚪ Low | ⛔ Not working |
| Vendor slot details | Download | ⚪ Low | ⛔ Not working |
| Vendor profile | Upload, gallery arrows | ⚪ Low | ⛔ Not working |
| Vendor edit profile | Inbox filters, Mark all as read, Secure Slot | ⚪ Low | ⛔ Not working |

---

## 5. Waiting on the backend

Things the frontend is ready for, or has worked around, until an endpoint exists
or changes:

- **Price filter (to confirm):** `minPrice` and `maxPrice` seem to compare ticket prices *before* the booking fee, while fans see prices with it. With `minPrice=50000`, a ticket shown as ₦51,410 (₦48,500 + fee) is left out. Confirm which price the filter should use.
- **Access requests:** the list endpoint needs a `search` parameter, and order details for approved fans.
- **Private event status for signed-out fans:** `isApplicationPaused` and `isApplicationEnded` on the public event, so they can be told before logging in.
- **New vendor slot's id:** creating a slot returns an id in a different format from the one the slot's own endpoint takes, so the app finds the new slot in the refreshed list to open its page. Returning the slot's `vendorId` would remove that step.
- **Organizer account deletion:** the API only has an admin delete (`DELETE /api/Admin/users/{userId}`), nothing an organizer can call on their own account.

**Now in the API, waiting on the frontend.** These endpoints are in the API's
Swagger list (checked October 2026), but nothing in the app calls them yet:

- **Support messages:** `POST /api/Support`. The organizer website's Contact Us uses it (`useSendSupportMessage`); the fans support form still needs wiring to the same hook.
- **Attendee list:** `GET /api/Event/{eventId}/attendees` (analytics variants too).
- **Ticket order:** `PATCH /api/Event/{eventId}/tickets/reorder`. Tickets also carry `displayOrder` and `sortOrder`.
- **Invite status values:** `GET /api/InviteTicket/statuses`: Queued, Sent, Accepted, PaymentPending, Issued, Expired, Cancelled.
