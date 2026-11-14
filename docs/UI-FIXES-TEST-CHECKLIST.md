# `ui-fixes` test checklist

Everything this branch changes, to check by hand before the PR. It covers the
10 Nov mobile QA fixes, the font, button and form rules, and the merged
`analytics-redesign`.

**How to test:** use dev (https://dev.afrorevive.com) at **375px** (phone) and
**1440px** (desktop). Tick each box once it looks right. ✓ marks what I already
checked in a browser on 14 Nov 2026.

---

## The big changes, in one line each

1. **Fonts:** SF Pro and Inter are gone. Everything is **Inter Tight**, except the small capital labels above form fields, which are **Work Sans**. IBM Plex Mono and Phosphate stay where they were.
2. **Flyers are 3:4 everywhere.**
3. **Form labels sit above every field** in small Work Sans capitals, on every form (organizer, fan, vendor, sign-in). No labels inside the box, and no placeholder-only fields.
4. **Buttons:** red for the main action, black for the other one. One-word labels are in capitals (SAVE, CANCEL); longer ones are in Title Case (Create Ticket).
5. **Section headings** in Create and Edit Event are one style: bold capitals.
6. **Page edges:** every creator page sits 20px from the edge on phones and 32px on desktop.
7. **Names:** Afrorevive (not AfroRevive or AfroRave), Guestlist, Revenue Vendor and Service Vendor (singular), resale, TikTok.
8. **Checkout:** tickets show their base price, and checkout adds the 8% fee once.
9. **Analytics:** redesigned page; the audience cards are on Overview only.

---

## 1. Site-wide

- [ ] No text anywhere falls back to a serif (Times-like) font. ✓ on public pages
- [ ] Form field labels are small Work Sans capitals; what you type into a field is Inter Tight. ✓
- [ ] Buttons without a special style are Inter Tight, not the monospace font. ✓
- [ ] Placeholders don't end in a full stop (for example "Enter event name"). ✓
- [ ] "Afrorevive" is spelled that way in visible text: the login form, the sign-up toasts, page titles, the creators landing page.

## 2. Organizer: header and sidebar

- [x] **Phone header:** the avatar always shows. ☰ appears only on pages with a sidebar (not on Events), turns into ✕ while the menu is open, and the bell is hidden. ✓
- [x] **Sidebar:** a group's links are indented past its icon; Analytics › Ticket Sales links are indented one step more. ✓
- [x] **Sidebar:** a group's **+** turns into **×** while it's open. ✓
- [x] **Sidebar:** it says "Guestlist" and "Ticket Sales" (not "Guest List", or "Tickets" under Analytics).
- [x] **Selected event card** (top of the sidebar): dark grey, with readable white text; Copy Link and View Page in Title Case.

## 3. Organizer: Events dashboard (`/creators/events`)

- [x] **Phone:** Create Event is a floating round red **+** at the bottom right. ✓
- [x] **Empty filters** say what's missing: Ongoing, Upcoming, Drafts and Ended each have their own message; All says "No Events Created". ✓
- [x] Event cards show the whole flyer at 3:4, with the badges on top.
- [x] **Guestlist tab:** on phones each guest is a card (name, email, category), green when checked in; search is full width with a filter icon.

## 4. Organizer: Create Event (`/creators/add-event`)

- [x] The form doesn't open showing "URL too short." ✓
- [x] Section headings (Visibility, Basic Info, Date & Time, Contact Details, Socials) are the same bold capitals.
- [x] Typing a name or venue capitalises each word ("afro revive fest" → "Afro Revive Fest") without the cursor jumping.
- [x] Visibility text: switching to public is permanent; public events can't be made private.
- [x] The custom URL prefix reads `afrorevive.com/events/` and sits above the input on phones.
- [x] Socials say **TikTok**.
- [x] The header button reads **Save as Draft**.
- [x] Flyer upload box is 3:4 and says 1200 × 1600.

## 5. Organizer: Edit Event (`/creators/edit/:id`)

- [x] Section headings match Create Event's. ✓
- [x] Name and venue capitalise as you type; the custom URL shows in lower case, as typed. ✓
- [x] Poster Image is 3:4; its **PREVIEW** button is in capitals.
- [x] Header buttons: **SAVE** (red) and **PUBLISH** (black) on drafts.

## 6. Organizer: Tickets (`/creators/tickets`)

- [x] **Paid / Free** and **Start immediately / Schedule** are radio buttons: picking one unpicks the other. ✓ (Paid / Free)
- [x] Form buttons: **CANCEL** (black) and **Create Ticket** / **Update Ticket** (red); side by side on desktop, stacked full width on phones. ✓
- [x] The ticket card's ⋮ menu opens inside the card, closes when you pick something, and **Edit Ticket** scrolls the form into view.
- [x] On a **private event**, resale is off and the form says why ("Unavailable for private events…").
- [x] The resale toggle says **Allow Ticket Resale**; the helper text under it isn't forced to lower case.
- [x] The form loads the ticket's own price (the base price, before fees).
- [ ] The summary says **Tickets Sold**.
- [x] The invite-only notice reads "How invite-only tickets work".
- [ ] **Orders** are cards, not a table: the buyer's name and email, the order ID, a line per ticket type ("X1 Standard" and its price), and the total paid in green. One column on phones, up to three on desktop. ✓

## 7. Organizer: Promo Codes (`/creators/promo-codes`)

- [x] A new code starts **now** and ends when the **event ends**. ✓
- [ ] Saving with the end at or before the start shows "The end must be after the start."
- [x] Typing a code turns it into capitals ("earlybird25" → EARLYBIRD25), and it's saved that way.
- [x] Buttons on the inline form: **CANCEL** (black) and **Create Promo Code** (red).

## 8. Organizer: Settings (avatar → Settings)

- [x] The active tab (Account, Payout, Settings) is **underlined**; hovering another tab doesn't make it look selected. ✓
- [x] **Account:** labels above every box; Birthday is one label over Month / Day / Year; Phone Number is one label over the code and number. ✓
- [x] **Payout:** the Bank list shows each bank once. ✓ (no duplicate keys). Account Number's label goes red on a wrong number.
- [x] **Settings:** Change Password fields have labels (no placeholders). ✓
- [x] SAVE (Account), SAVE / SAVED (Payout) and Update Password are red, full width.

## 9. Organizer: Analytics (`/creators/realtime`)

- [x] The header shows the tab's title, a description and **Export CSV**, with no event picker.
- [x] **Overview** has Gender, **Age Groups** and **Locations** (top ten). ✓
- [ ] **Audience Insights is gone:** not in the sidebar, and an old `?tab=insights` link opens Overview. Overview's Export CSV includes the audience counts. ✓ (redirect)
- [x] Orders, Attendee List, Vendors and Promo Codes tables scroll sideways inside their card on phones (by design).
- [x] Export CSV downloads the open tab.

## 10. Organizer: vendor pages

- [x] "Revenue Vendor" and "Service Vendor" (singular) in the sidebar and page headings.
- [x] **Slot form:** the two time pickers stack on phones (no sideways scroll); buttons are **Save Draft** (black) and **Create Stall / Offer** (red).
- [x] Service offers' contact note: "Service vendors see your contact details once you accept their application."

## 11. Fans

- [x] **Event page, ticket cards, My Tickets, a single ticket:** flyers are 3:4.
- [x] **Cart and checkout:** a 120px 3:4 thumbnail beside the event details on phones. *(Not checked by me: needs a live reservation.)*
- [x] **Checkout total:** tickets show the base price "(fees at checkout)"; the TOTAL adds the 8% fee once, minus any discount.
- [x] **Promo code at checkout** works with several tickets in the cart; a code that covers only some tickets says which.
- [x] **Account, Settings, Support, Complete Profile:** labels above the fields, white on the dark pages. ✓
- [x] **Log in, Sign up, Forgot / Reset password:** labels above the fields. ✓

## 12. Vendors

- [x] **Edit profile** (Profile, Account, Settings tabs): labels above every box; Birthday and Phone Number have one label over their row. ✓

## 13. Sessions

- [x] With two tabs open, the session stays alive in both past the 15-minute token refresh.
- [ ] After 15 minutes inactive, the next action logs you out (by design).

## 14. Accessibility

- [ ] "Choose Your Role" on the creators home page is readable light grey on black.
- [ ] With VoiceOver: the ticket ⋮ is "Ticket options", the avatar is "Account menu", and the ☰ is "Open menu" / "Close menu".

---

## Known, not fixed here

- **Labels on wrapped fields:** labels on the counter, date and icon fields (like log in's email) don't focus their input when clicked; the id lands on a wrapper.
- **My Tickets:** the dev console shows a React warning about a non-boolean attribute. It's older than this branch.
- **Event filter:** you changed the Ongoing empty state to "No Ongoing Event". It's in Title Case while the others are sentence case.
