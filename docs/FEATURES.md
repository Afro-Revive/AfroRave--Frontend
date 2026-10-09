# AfroRevive — Feature List

A plain-language list of everything the web app can do today, how important
each feature is, and whether it actually works yet. Use it to know what's left
before launch, what's safe to demo, and what to test.

Last checked against the code on the `prod` branch, October 2026.

---

## Progress at a glance

| | Critical (High) | Medium | Low | **Overall, weighted by priority** |
|---|---|---|---|---|
| **Fans** | 13 / 17 done | 8 / 10 | 1 / 4 | **75%** |
| **Organizers** | 12 / 13 done | 17 / 22 | 3 / 18 | **72%** |
| **Fans + Organizers** | **25 / 30 done (83%)** | 25 / 32 | 4 / 22 | **73%** |
| Vendors (in progress on the `vendors` branch) | 2 / 4 done | 0 / 3 | — | 33% |

**How the overall % is worked out:**
- A High feature counts 3 times as much as a Low one, and a Medium one twice as much.
- Only fully working features score.
- If half-working ("Partial") features get half credit, fans and organizers reach 77%.
- **Critical features only:** 83% are fully done, or 87% with half credit for the partly working ones.

Most of the gap is Low priority: small buttons, drag handles and extra tools.
**All the main journeys work end to end.**
- **Fans:** discover → buy → manage tickets → resell or transfer → get paid.
- **Organizers:** create → sell → invite → approve → track.

### Critical features still to do

Only **5 critical features** are left on the fan and organizer sides. Ranked by
how much they block launch:

| # | Feature | Area | Status | What's needed |
|---|---|---|---|---|
| 1 | Privacy Policy, Refund Policy, Terms and Conditions | Fans | 🚧 Coming soon | **Content.** Needed before taking real payments: payment providers and app stores ask for them. |
| 2 | Accept an invite from the email link | Fans | ⛔ Not working | **Frontend.** A page for the invite link. The backend calls and hooks are ready. Without it, invite-only tickets don't reach guests. |
| 3 | Organizer bank details (Settings → Save) | Organizers | ⛔ Not working | **Backend, then frontend.** The Save button has no action, so organizers can't set where their money goes. The API can list banks and check an account number, but has no endpoint to save an organizer's payout account yet. |
| 4 | Events page shows every event | Fans | 🟡 Partial | **Backend + frontend.** The events endpoint has no paging, so discovery and filters only see the first batch of events. |
| 5 | QR code for entry | Fans | 🟡 Partial | **Mobile app.** The QR is in the mobile app; the web app's app store links point nowhere until the apps are published. |

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
| Events page (`/fans/events`) | 🔴 High | 🟡 Partial | Category, month, "Resale", "Tonight" and "This Week" filters all work, but only on the first page of events the server sends back. |
| Event page (`/fans/events/:customUrl`) | 🔴 High | ✅ Working | Details, description, map with directions, organizer contacts. |
| Private events | 🔴 High | ✅ Working | Tickets are hidden behind a "Request access" card. Fans see their request as pending until the organizer approves it. Signed-out fans are asked to log in first. |
| Search bar in the header | 🟠 Medium | 🟡 Partial | Search by text, date and category works. The **min/max price filter is ignored**. |
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
| Support contact form (`/fans/support`) | 🟠 Medium | ⛔ Not working | Shows "Thanks — we will get back to you", but **the message is not sent anywhere**. There is no support endpoint yet. |

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

### Creating and editing events

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Create event: details → tickets → promo codes → publish | 🔴 High | ✅ Working | |
| Ticket types | 🔴 High | ✅ Working | Single, group or multi-day. Paid, free or invite-only. Sold online or at the door. |
| Publish | 🔴 High | ✅ Working | The dashboard updates straight away. |
| Edit event details, poster and visibility | 🔴 High | ✅ Working | A private event can be made public, but a public event can never be made private. |
| Sales start immediately or at a set date | 🟠 Medium | ✅ Working | Starts immediately by default. |
| Ticket resale | 🟠 Medium | ✅ Working | On by default. Organizers can untick it. Always off for invite-only and group tickets. |
| Edit the event name from the Publish summary | ⚪ Low | ⛔ Not working | The pencil icon next to the name does nothing. |

### Events dashboard (`/creators/events`)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Event cards with status and visibility tags | 🔴 High | ✅ Working | Status: draft, upcoming, ongoing, sold out, ended. Visibility: public or private. |
| Filter by status, and pagination | 🟠 Medium | ✅ Working | |
| Card buttons: Manage / Edit Draft, Analytics, Tickets | 🟠 Medium | ✅ Working | Each one selects that event and opens its page. |
| Sidebar event card | 🟠 Medium | ✅ Working | Shows the selected event, with Copy Link and View Event. |
| "Report" on an ended event | ⚪ Low | 🟡 Partial | Opens Analytics. A real report download doesn't exist yet. |
| First-time guide | ⚪ Low | 🟡 Partial | Step 3 still talks about "Theme & Media", which was removed from event creation. |

### Tickets (`/creators/tickets`)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Ticket list with All / Invite-Only / Door filters | 🔴 High | ✅ Working | |
| Edit and delete a ticket | 🔴 High | ✅ Working | |
| Orders table | 🔴 High | ✅ Working | |
| Invite-only: send invites | 🔴 High | ✅ Working | Pick guests from your guestlist, or add a new guest, who is saved to the guestlist too. |
| Summary: net sales and tickets issued | 🟠 Medium | ✅ Working | Real numbers from analytics. View Analytics opens the analytics page. |
| Invite-only: invites sent, with status | 🟠 Medium | ✅ Working | |
| Door tickets: "Sell On Mobile App" | ⚪ Low | ⛔ Not working | The button does nothing. Door sales happen in the mobile app. |
| "Drag tickets to change the order fans view them" | ⚪ Low | ⛔ Not working | The notice on the page says this, but **ticket reordering isn't built**. |

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
| Overview, Vendors, Orders, Promo Codes, Insights tabs | 🔴 High | ✅ Working | Real data from the analytics endpoint. |
| Attendee List tab | 🟠 Medium | 🚧 Coming soon | Needs an endpoint that returns individual attendees. |
| Export button | ⚪ Low | ⛔ Not working | Does nothing. |
| Reports (`/creators/reports`) | ⚪ Low | 🚧 Coming soon | No longer linked from anywhere. |

### Organizer settings (gear menu → Settings)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Bank details: SAVE | 🔴 High | ⛔ Not working | The button has no action, so organizers can't save where their payouts go. |
| Profile: name, company, phone, gender, website | 🟠 Medium | ✅ Working | |
| Change password, log out | 🟠 Medium | ✅ Working | |
| Delete Account | 🟠 Medium | ⛔ Not working | The button has no action. App stores require account deletion. |
| Inbox: notifications, mark as read | ⚪ Low | ✅ Working | |
| Order notifications (daily / weekly / off) | ⚪ Low | ⛔ Not working | Your choice is lost when the modal closes. It isn't saved. |

### Guest lists

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Account guestlist (dashboard Guestlist tab) | 🟠 Medium | ✅ Working | Categories, search, sort, 20 per page, add guest, CSV upload. |
| Event guestlist (`/creators/guest-list`) | 🟠 Medium | 🟡 Partial | Add guests one by one or import them from your guestlist. **Selecting a whole category isn't wired.** |
| Delete a guest, remove a guest from a category | ⚪ Low | ✅ Working | |
| Guest allowance card ("0 / 500") | ⚪ Low | 🧪 Mock | The numbers are fixed. There is no endpoint for them yet. |

### Promo codes (`/creators/promo-codes`)

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Create, view and delete promo codes | 🟠 Medium | ✅ Working | |
| Drag handle on each promo code | ⚪ Low | ⛔ Not working | It looks draggable, but does nothing. |

### Vendor management

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Create revenue slots (stalls) and service offers | 🟠 Medium | ✅ Working | |
| Edit a slot | 🟠 Medium | ✅ Working | |
| Slot pages listing applicants | 🟠 Medium | ✅ Working | |
| Accept or reject a vendor application | 🟠 Medium | ✅ Working | |
| Access Control (`/creators/access-control`) | 🟠 Medium | 🧪 Mock | Sample staff list. Its Download, event picker, Add Code and filter buttons do nothing. |
| Pause a slot | ⚪ Low | ⛔ Not working | The button switches on screen only. Nothing is saved, because there is no endpoint yet. |
| Seating Maps (`/creators/seating-maps`) | ⚪ Low | 🚧 Coming soon | |
| Season events (`/creators/season`) | — | Dropped | Season events were dropped. The page is still routed but not linked. Not counted. |

### Organizer website

| Feature | Priority | Status | Notes |
|---|---|---|---|
| Creators home (`/home`) and About Us | 🟠 Medium | ✅ Working | Sign up and log in buttons open the auth modal. |
| Contact Us (`/contact-us`) | 🟠 Medium | ⛔ Not working | The form only logs to the browser console. |
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
| Organizer settings | Bank details SAVE | 🔴 High | ⛔ Not working | No action. |
| Fans footer | Privacy, Refund, Terms | 🔴 High | 🚧 Coming soon | Open a "Coming Soon" page. |
| Fans footer, home page and mobile menu | App Store / Google Play badges | 🔴 High | ⛔ Not linked | Link to `#`. Waiting for the apps to be published. Fans need the app for their QR code. |
| Ticket detail page | QR code ("download the app") | 🔴 High | ⛔ Not linked | Depends on the app store links above. |
| Fans support (`/fans/support`) | Contact form Send | 🟠 Medium | ⛔ Not working | Shows a success message but sends nothing. |
| Organizer website | Contact Us Submit | 🟠 Medium | ⛔ Not working | Logs to the console only. |
| Organizer settings | Delete Account | 🟠 Medium | ⛔ Not working | No action. |
| Fans header search | Min and max price | 🟠 Medium | ⛔ Not working | The values are sent but never used to filter. |
| Event guestlist page | Selecting a whole category | 🟠 Medium | ⛔ Not working | Only individual guests can be picked. |
| Analytics | Attendee List tab | 🟠 Medium | 🚧 Coming soon | |
| Access Control | Download, event picker, Add Code, filter | 🟠 Medium | ⛔ Not working | Mock page. |
| Fans footer | About Us, Blog, FAQ, Sell, Work With Us | ⚪ Low | 🚧 Coming soon | Open a "Coming Soon" page. |
| Fans social links | YouTube icon | ⚪ Low | ⛔ Not linked | Goes to the home page instead of YouTube. |
| Organizer dashboard | Guide step 3 "Theme & Media" | ⚪ Low | ⛔ Out of date | That step no longer exists. It lands on Publish. |
| Create event → Publish | Pencil next to the event name | ⚪ Low | ⛔ Not working | No action. |
| Tickets page | Door ticket "Sell On Mobile App" | ⚪ Low | ⛔ Not working | No action. |
| Tickets page (private event) | "Drag tickets to change the order" notice | ⚪ Low | ⛔ Not working | Reordering isn't built. |
| Promo codes page | Drag handle on each code | ⚪ Low | ⛔ Not working | No action. |
| Guestlist tab | Guest allowance card | ⚪ Low | 🧪 Mock | Fixed "0 / 500". |
| Audience page | Search | ⚪ Low | ⛔ Not working | The backend has no search parameter. |
| Analytics | Export | ⚪ Low | ⛔ Not working | No action. |
| Organizer settings | Order notifications | ⚪ Low | ⛔ Not working | Not saved. |
| Vendor slot modal | Pause / resume slot | ⚪ Low | ⛔ Not working | Changes on screen only. |
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

- **Organizer bank details:** an endpoint to save an organizer's payout account (critical). Listing banks and checking an account already exist.
- **Event discovery:** `/api/Event` has no paging parameters, so filters only search the first page of results (critical).
- **Support messages:** there is no endpoint to send them to.
- **Access requests:** the list endpoint needs a `search` parameter, and order details for approved fans.
- **Private event status for signed-out fans:** `isApplicationPaused` and `isApplicationEnded` on the public event, so they can be told before logging in.
- **Organizer guest allowance:** an endpoint for the real "used / total" numbers.
- **Vendor slot pause:** a status endpoint.
- **Attendee list:** an endpoint returning individual attendees.
- **Resale marketplace:** an endpoint listing every resale ticket.
- **Invite status values:** a confirmed list, so the invites table can colour each status properly.
