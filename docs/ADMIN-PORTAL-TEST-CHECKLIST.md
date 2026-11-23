# Admin Portal Test Checklist

The admin portal at `/admin`: sign-in, the dashboard, users, events, orders,
wallet transactions and fees. Run it on `admin-portal` against dev
(`https://dev.afrorevive.com`).

⚠️ marks the items most likely to break against the real API.

**Before you start:**
- The dev admin account. There is only one admin.
- A fan account, for the "not an admin" checks.
- **Throwaway accounts and orders** for suspend, delete and refund. Dev data is
  shared, and **delete and refund can't be undone**.
- A Paystack test card, to make a paid order to refund.

**Fee changes apply to every checkout on dev straight away.** Set each one back
when you're done. The current values are:

| Fee | Value |
|---|---|
| Ticket Checkout Tax | 8% |
| Vendor Slot Tax | 8% |
| Ticket Resale Tax | 6% |
| Resale Price Cap | 30% |

## 1. Getting in

- [x] Sign in at `/admin/login` with the admin account. You land on the Dashboard.
- [x] Sign in there with a fan account. You get "This account is not an admin account" and stay signed out.
- [x] Open `/admin/users` while signed out. You're sent to `/admin/login`.
- [x] Sign in as a fan on the main site, then open `/admin`. You see "This area is for admin accounts" with a Log out button.
- [x] Refresh a few admin pages. You stay signed in, on the same page and filters.
- [x] Log out from the sidebar. You land on `/admin/login`.

## 2. Dashboard

- [x] ⚠️ The totals match the lists: the Users total matches the Users page total, and Published, Drafts and Suspended match the Events filter counts.
- [c] The Users, Events and Orders tiles each open their page.
- [x] Hovering over a chart bar shows that month's sales.

## 3. Users

- [x] Search finds users by first name, email and phone.
- [x] Each account type chip (Fans, Organizers, Vendors, Admins) filters the list.
- [ ] Searching a full name ("First Last") finds nothing. That's a known backend gap.
- [x] Next and Previous go through the pages.
- [x] ⚠️ **Suspend** a throwaway user:
  - [x] The pill becomes Inactive and a toast appears.
  - [ ] Logging in as them gives "Account is inactive. Contact support."
- [x] **Reactivate** them. They can log in again.
- [x] Double-clicking Suspend in the confirm dialog leaves the user suspended; it doesn't flip back.
- [x] The admin row has no actions.
- [x] ⚠️ **Delete** a throwaway user who never bought anything. "User deleted." shows, and they're gone from the list.
- [ ] ⚠️ **Delete** a throwaway user who has orders or tickets. A warning says the account was deactivated instead.

## 4. Events

- [x] Search finds events by name, venue and organizer email.
- [x] Each status chip (Published, Drafts, Suspended) filters the list.
- [x] ⚠️ Clicking an event's name or **View** opens the drawer, with:
  - [x] dates, time and timezone;
  - [x] the organizer's contact details;
  - [x] tickets, with sold counts;
  - [x] vendor slots;
  - [x] the description.
- [x] The drawer opens for a draft event too.
- [x] With the drawer open, copying the address and opening it in a new tab opens the same event.
- [x] Closing the drawer removes `?event=` from the address.
- [ ] ⚠️ **Suspend** a test event:
  - [x] It shows Suspended.
  - [x] It disappears from the public `/events` page.
  - [x] Its tickets can't be bought.
  - [x] Note whether vendors can still apply for its slots. This is one of the questions sent to the backend.
- [x] **Unsuspend** it. It shows Draft and doesn't go live.
- [x] Publish it again as the organizer. It goes live.
- [x] Suspending from inside the drawer updates both the drawer and the list.

## 5. Orders

- [x] Search finds orders by order code and by buyer email.
- [ ] ⚠️ **Refund** a paid order from a test fan:
  - [x] The status becomes Refunded.
  - [x] The ticket is gone from the fan's My Tickets.
  - [x] A "Refund" row with + appears in Transactions.
  - [x] The ticket's sold count in the event drawer drops by one.
  - [x] The Dashboard's refunded count goes up.
- [x] Refund a free order, and note what happens with ₦0.
- [ ] ⚠️ Try to refund an order with a resale, transferred or checked-in ticket. The server's refusal message shows as a toast.
- [x] A refunded order has no Refund button.

## 6. Transactions

- [x] Each category chip filters the list.
- [x] Search finds transactions by description and email.
- [x] Money in shows + in green; money out shows −.

## 7. Fees

- [x] Edit a fee and try 101, -1, abc and 1.234. Each is blocked with a message.
- [x] Save stays off while the value is unchanged.
- [x] ⚠️ Change a fee and confirm:
  -[x] A toast appears and the card shows the new value.
  - [x] History shows the old value → the new one, marked "You".
- [x] ⚠️ A cart or checkout on dev shows the new percentage. **Then set the fee back.**
- [x] Ticket Markup Fee shows "Not in use", with no Edit button.
- [ ] ⚠️ Change **Vendor Slot Tax**, then as a vendor open an event's slots. "Price Per Slot", the cart total and an approved slot's Amount Due use the new rate. The organizer's slot form says the new percentage. **Then set it back.**
- [ ] ⚠️ Change **Ticket Resale Tax**, then as a fan list a ticket for resale. Your Payout is the full price; "Buyer pays" shows the new percentage. Buying that listing shows the same fee at checkout. **Then set it back.**
- [ ] Change **Resale Price Cap**, then list a ticket. The price picker stops at the new cap ("Up to ₦…"). **Then set it back.**
- [ ] Fee changes can take up to 5 minutes to show on a page that's already open; a refresh shows them straight away.

## 8. Phone width

- [ ] The sidebar becomes a row of tabs that scrolls sideways.
- [ ] Tables scroll sideways; the page itself doesn't.
- [ ] The event drawer fills the screen and scrolls.
- [ ] The confirm dialogs fit on screen.
