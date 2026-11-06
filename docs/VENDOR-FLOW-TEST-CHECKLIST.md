# Vendor Flow — Organizer + Vendor Test Checklist

The whole vendor flow, tested from both sides at once: the organizer's vendor
tabs in the creator dashboard, and the vendor dashboard. Run it on
`organizer-fixes`, which has both.

The vendor dashboard on its own is covered in
[VENDOR-TEST-CHECKLIST.md](VENDOR-TEST-CHECKLIST.md). This list is about the
two sides meeting: what one side does, and whether the other side sees it.

⚠️ marks the items most likely to break against the real API.

**Before you start:**
- An organizer account with an upcoming event, selected in the dashboard.
- **Two vendor accounts** (A and B), so you can test more than one applicant
  and a stall selling out.
- A Paystack test card.
- Two browsers or windows, so the organizer and a vendor can stay logged in
  side by side.

How the pages work: [ORGANIZER-SIDE.md](ORGANIZER-SIDE.md) §6 (Vendor
management) and [VENDOR-SIDE.md](VENDOR-SIDE.md).

## 1. Organizer creates a stall (revenue slot)

- [ ] Sidebar → Vendor → Revenue Vendor opens with the how-it-works note and the form already open.
- [ ] Fill in STALL NAME, CATEGORY, NUMBER OF STALLS (use **2**), PRICE PER STALL, the APPLICATION DEADLINE (date and time) and a rich text DESCRIPTION. TOTAL PRICE updates as you type.
- [ ] ⚠️ Create shows "Vendor listing created successfully." and lands on the new stall's page (the app finds the new stall in the refreshed list, since the create response's id doesn't work yet).
- [ ] The new stall shows in the sidebar under Revenue Vendor.
- [ ] The stall's page shows the stall name, "Manage all vendor applications.", the Revenue Vendors and Stall Details tabs, the note, "Application ends in n days", and a Summary of ₦0 net profit, 0 secured and 0 requests.

## 2. Organizer creates a service offer

- [ ] Sidebar → Vendor → Service Vendor: fill in SERVICE NAME, CATEGORY, a **budget range**, START TIME, STOP TIME, END DATE, the APPLICATION DEADLINE and a DESCRIPTION.
- [ ] ⚠️ Create lands on the new offer's page, with the Service Vendors and Offer Details tabs.
- [ ] The offer's Summary shows the budget range, 0 secured and 0 requests.
- [ ] Optional: tick Use Different Contact Details and add an email, to check Contact organizer later.

## 3. The vendor sees them

As vendor A:

- [ ] ⚠️ The event shows on Discover, and its card counts the new stalls in "SLOTS : left / total".
- [ ] The ticket page lists the stall and the offer, with the right names and categories.
- [ ] The stall's price is the organizer's price plus the 8% fee, marked "(includes fees)".
- [ ] The offer shows the budget range, and the price box says "Up to ₦" + the top of the range.
- [ ] Tapping each row shows the description (formatted as the organizer wrote it), slots left or work hours, and the apply-by date and time the organizer set.

## 4. Vendors request

- [ ] Vendor A: add **1** stall and the offer with a price inside the budget, then Request. Both show In Review on My Slots.
- [ ] Vendor B: add **1** stall, then Request.
- [ ] ⚠️ Organizer, the stall's page: both requests show as **Requested**, Summary → Total Requests is 2, and the Requests pill counts 2.
- [ ] Organizer, the offer's page: vendor A shows as Requested, and Total Requests is 1.
- [ ] Search on the applications list finds a vendor by business name.

## 5. Organizer reviews an applicant

Open vendor A's row on the stall's page.

- [ ] The applicant page shows the business name, picture, category, status, and "Requested slot price" (the stall price × stalls requested).
- [ ] On the offer, the same page shows "Proposed price" with the price vendor A typed.
- [ ] Call, Email and the social links open the vendor's real details, and only the ones the vendor filled in show.
- [ ] About Vendor and Gallery match what vendor A saved in their profile modal.
- [ ] Accept Vendor and Reject Vendor show while it's a request.

## 6. Reject

- [ ] Organizer rejects vendor B's stall request: "Vendor application rejected successfully.", the row shows Rejected, and Total Requests drops by 1.
- [ ] The Rejected pill counts it, and the Requests pill doesn't.
- [ ] Vendor B: the request shows **Rejected** on My Slots and its page, with Discover Events.
- [ ] Vendor B can't pay for or withdraw it.

## 7. Accept and pay (stall)

- [ ] ⚠️ Organizer accepts vendor A's stall request: "Vendor application accepted successfully.", and the row shows its accepted status (Accepted in green, or Pending in orange while it waits on payment).
- [ ] The accepted request shows under one of the filter pills. Note: there's no Accepted pill, so check where an Accepted request lands.
- [ ] Vendor A: the request shows **Approved**, with "Pay before “date” at “time”", the slot fee, the platform fee and Amount Due.
- [ ] ⚠️ Vendor A pays on Paystack and comes back to "Slot secured!" and the Secured state. Total Slots Secured in the sidebar goes up.
- [ ] ⚠️ Organizer: the row shows **Secured**, Total Secured goes up, and **Net Profit** shows the stall price × stalls. It's the organizer's price, without the vendor's 8% platform fee.
- [ ] Vendor A: View receipt matches what Paystack charged.

## 8. Accept (service offer)

- [ ] Organizer accepts vendor A's offer.
- [ ] Vendor A: the offer shows **Approved** with Contact organizer. There's no payment, since the organizer pays service vendors outside the app.
- [ ] Contact organizer emails the offer's contact email if one was set (§2), otherwise the event's.
- [ ] Organizer: the offer's Summary and list show the accepted vendor.

## 9. Selling out

- [ ] With 2 stalls: vendor B requests again (once the backend allows re-requesting after a rejection; if it doesn't, use a third vendor). Organizer accepts, vendor B pays.
- [ ] ⚠️ Both stalls secured: the ticket page shows the stall as **Sold out** (red), and the Discover card's slots left goes down.
- [ ] The organizer's Summary shows Total Secured 2 and Net Profit for both stalls.

## 10. Withdraw

- [ ] A vendor requests something, then withdraws it while it's In Review.
- [ ] ⚠️ Organizer: the request disappears from the list after a refresh, and Total Requests drops.
- [ ] The vendor can request the same slot again, and it shows on the organizer's side as a new request.

## 11. Pause and resume

- [ ] Organizer, a stall's page: Pause Application shows "Applications paused.", the button turns into Resume Application, and the grey bar says "Applications are paused. Vendors can’t apply until you resume."
- [ ] ⚠️ Vendor: after a refresh, the ticket page shows the stall as **Paused** (yellow), with no + button.
- [ ] Requests made before the pause are still there on both sides.
- [ ] Organizer resumes: "Applications resumed.", and the vendor can add the stall again.

## 12. Editing a slot

- [ ] Organizer, Stall Details: change the price, the number of stalls and the description, then save.
- [ ] The stall's page and the sidebar show the change.
- [ ] Vendor: after a refresh, the ticket page shows the new price (plus 8%), the new slots left and the new description.
- [ ] An existing request keeps its slot fee, or follows the new price. Note which one happens.
- [ ] Organizer moves the APPLICATION DEADLINE into the past: the grey bar says "Applications have closed.", and the vendor's ticket page shows **Closed** (red).
- [ ] Vendor: an Approved stall that wasn't paid by the deadline shows **Expired**. Note what the organizer sees for it.

## 13. After the event

- [ ] Once the event has ended, the vendor's requests show **Completed**, and the ticket page shows every slot as Closed.
- [ ] The organizer's stall pages still show the secured vendors and net profit.

## 14. Analytics and totals

- [ ] View Analytics on a stall's Summary opens Analytics for this event.
- [ ] ⚠️ Analytics → Vendors matches the stall and offer pages: secured vendors and revenue from stalls.
- [ ] The vendor's sidebar counts (Saved Events, Total Slots Secured) match their My Slots list.

## 15. Notes to write down while testing

- Anything one side shows that the other side doesn't.
- Wording that differs between the sides (Requested / In Review, Pending / Approved, Accepted / Secured).
- Anything that needs a refresh to show up, and whether it should update on its own.
