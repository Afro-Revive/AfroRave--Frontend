# Vendor Side — Test Checklist

Everything to test on the `vendors` branch before it merges. So far it has only
been tried in the browser with fake data, never against the real API.

⚠️ marks the items most likely to break against the real API.

**Before you start:** a vendor login on dev, and an organizer account with an
event that has both revenue slots (stalls) and service slots, so you can approve
and reject requests. How the pages work is in [VENDOR-SIDE.md](VENDOR-SIDE.md).

## 1. Dashboard layout (sidebar and header)

- [x] The sidebar card shows business name, category, phone, email, and the Saved Events and Total Slots Secured counts.
- [x] "Finish setting up your profile" shows only while the profile is incomplete, and opens the profile modal.
- [x] Edit profile opens the modal on the Profile tab.
- [x] DISCOVER and MY SLOTS work and highlight the current page.
- [x] Log Out in the sidebar logs you out.
- [x] Avatar menu: Settings opens the modal on the Settings tab, and Log out works.
- [x] On a phone or portrait tablet, the menu button opens the sidebar as a slide-out panel.
- [x] Going to `/vendor/profile` takes you to Discover.

## 2. Discover (`/vendor/discover`)

- [x] ⚠️ Event cards load with slots left out of the total ("SLOTS : 12 / 20"), and saved events show the same numbers.
- [x] Search filters the events.
- [x] The Saved Events toggle shows only saved events.
- [x] The bookmark saves an event, and the sidebar's Saved Events count goes up.
- [x] ⚠️ Tapping it again unsaves the event, the sidebar count goes down, and it stays unsaved after a reload (new vendor endpoint).
- [x] ⚠️ The sidebar's Saved Events count matches the Saved Events list.
- [x] Clicking a card opens the ticket page.

## 3. Ticket page (`/vendor/discover/:eventId`)

**About the event**

- [x] The header and About Event show the flyer (a grey box with the event name when there's none), name, date | venue, doors open, and Read more on long descriptions.

**Slots**

- [x] Each slot shows its price (revenue prices include the 8% fee) and category.
- [x] Tapping a row opens its details: price, description, slots left or work hours, apply-by date.
- [x] Revenue slot: + adds a stall, − takes one off, and + stops at the number of slots left.
- [x] Service slot: + turns green only once a price is typed, and after adding, the row shows − 1.
- [x] ⚠️ Service slot budget: the placeholder says "Up to ₦…" (the top of the range, or the single budget). Typing or pasting more sets it to that maximum and shows "The organizer's budget goes up to ₦…". A price below the minimum can still be added and requested.
- [x] Requested shows when you already have a pending, approved or secured request, and links to it.
- [x] Closed shows after the deadline or once the event has ended.
- [ ] Paused shows when the organizer has paused the slot.
- [ ] Sold out shows when a revenue slot has no stalls left.

**Cart and Request**

- [x] The cart opens by itself when something is added, and stays closed after taking something off.
- [x] The cart shows the fees box, the ×n lines with unit prices, and the right total.
- [x] Request is black, and disabled while the cart is empty.
- [x] ⚠️ Request sends one request per cart line, shows a success toast, and goes to My Slots.
- [ ] If some requests fail, only the failed ones stay in the cart. This is hard to trigger, so try it if you get the chance.
- [x] ✕ goes back to Discover, and the cart is empty when you return.

## 4. My Slots (`/vendor/slots`)

- [x] ⚠️ Your requests show up, grouped by event, with the right status: In Review, Approved, Slot Secured, Rejected, Expired, Completed.
- [x] The All, Approved and Ended filters show the right requests and counts.
- [x] The payment badge shows on approved revenue stalls only that haven't been paid for.

## 5. Request page (`/vendor/slots/:applicationId`)

Use the organizer account to get a request into each status.

**In Review**

- [x] The notice and amount due are right.
- [x] Withdraw Request opens the popup, with the slot and event names in the body.
- [x] Cancel and ✕ close the popup.
- [x] ⚠️ Withdraw deletes the request and goes back to My Slots.
- [x] After withdrawing, the slot can be requested again on the ticket page.
- [x] ⚠️ Known issue: sending that new request fails with "You have already applied for this vendor slot". Raised with the backend; recheck once it's fixed (fixed ).

**Approved, Secured and the rest**

- [x] Approved stall: the notice says Pay before “date” at “time”, matching the deadline the organizer set.
- [x] Approved stall: Slot fee (price × stalls) and Platform fee show above Amount Due, and add up to it.
- [x] ⚠️ Approved stall: Pay now shows "Starting payment..." and goes to Paystack (new initialize-payment endpoint).
- [ ] ⚠️ Paystack charges the Amount Due (slot fee + platform fee). Today it charges the slot fee only: the backend doesn't add the fee yet.
- [ ] ⚠️ After paying, Paystack comes back to the same request page, which shows "Slot secured!", the Secured state, and the sidebar's Total Slots Secured goes up.
- [x] ⚠️ Cancelling on Paystack and coming back leaves the slot Approved.
- [x] Approved service: Contact organizer opens an email to them, and is disabled when the organizer has no contact email.
- [x] Secured stall: View receipt (slot fee, 8% fee, total) and Contact organizer both work.
- [x] Secured service: only Contact organizer shows, full width, with no View receipt.
- [x] Rejected: the description popup can't be opened, and Discover Events works.
- [x] Expired: a stall that was approved but not paid by the deadline shows Expired.
- [ ] Completed: a request for an event that has ended shows Completed.
- [x] A request ID that doesn't exist shows "This request may have been withdrawn".

## 6. Profile modal

**Profile tab**

- [x] Uploading a picture works, and it shows in the modal and on the sidebar card.
- [x] The about text, contact details and socials can be edited.
- [x] Save is disabled until something changes.
- [x] ⚠️ After saving, everything is still there after a reload.
- [x] Gallery: removing every photo and saving leaves it empty after a reload.
- [ ] ⚠️ Gallery: removing some photos (2 of 8) sticks after a reload. Today all 8 come back.
- [ ] ⚠️ Gallery: adding photos saves each one once. Today removing all and adding 4 brings back each of the 4 twice. Raised with the backend.

**Account tab**

- [x] Business name is shown but can't be edited (greyed out, like email).
- [x] Web URL and category can be edited.
- [x] First name, last name, gender and phone (country code plus number) can be edited.
- [x] The Month, Day and Year labels sit above their values, even when empty.
- [x] Picking Nigeria turns State into a dropdown of the states and the FCT; other countries get a text box.
- [x] Changing country clears the state.
- [x] A state saved earlier as typed text ("lagos") shows selected in the dropdown.
- [x] ⚠️ After saving and reloading, category, country, state and birthday are still there (newly added to the API).

**Settings tab**

- [x] The smaller layout looks right.
- [x] A new password under 8 characters, or the same as the current one, shows an error.
- [x] Confirm New Password that doesn't match shows "Passwords don't match", and Update Password stays disabled until it does.
- [x] ⚠️ A real password change works, and you can log in with the new password.
- [x] Log Out works.
- [x] The Email Notifications checkbox toggles. It isn't saved yet; that's expected.

## 7. Other checks

- [x] The vendor pages render in Inter Tight.
- [x] Organizer side: approve and reject from the organizer's vendor tabs, and the vendor sees each change. Test those organizer tabs end to end while you're there.
- [ ] Phone, portrait tablet (should look like the phone layout) and landscape tablet or laptop (should look like the desktop layout) all look right.
