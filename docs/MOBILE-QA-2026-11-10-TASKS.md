# Mobile QA report (10 Nov 2026): task list

Source: *Afrorevive Creators Web — Mobile QA Report* (Nov 10, 2026, @ESE). Tested on afrorevive.com/creators at 375×812.

Each item lists the files to change and a suggested fix. Item numbers match the report. Line numbers come from `ui-fixes` at `c2e4b1e`, which is 7 commits behind `main` (#27/#28, Privacy section). None of those commits touch these files, but merge `main` in first. Many lines have moved since; the file names still hold.

**Status (2026-11-13):** sections 1 to 4 are mostly done on `ui-fixes`. What's left: the open boxes below, the **[PO]** / **[BE]** questions, section 5 and section 6. Uncommitted right now: the naming changes, card gutters, menu drawer and text details (section 4).

Tags:
- **[PO]**: needs a product decision before it can be built.
- **[BE]**: needs the backend.
- **[verify]**: check on dev before changing anything.

---

## Fix first

1. ~~**1.1**: the live site is a development build, and the devtools button covers content.~~ Fixed.
2. ~~**1.2 / 1.3**: the SF Pro fonts (about 60 MB on disk), three broken font paths, and quoted `"sans-serif"`.~~ Fixed; the SF family and Inter are removed (`749823c`).
3. ~~**2.1**: the Service Vendor time pickers make the whole page scroll sideways.~~ Fixed.
4. ~~**3.1**: the visibility rule is stated two opposite ways.~~ Fixed.
5. ~~**3.3**: the ticket price differs between the list and the form.~~ Fixed (the backend returns one price; the app reads `basePrice`).

---

## 1. Site-wide (critical)

### 1.1 Development build and devtools in production
- [x] Keep the devtools out of production.
  - **Decision:** the devtools stay in the app for development, and production doesn't show them.
  - No code change is needed. `@tanstack/react-query-devtools` renders nothing unless the build's `NODE_ENV` is `development`, and the production build leaves its code out entirely. It's mounted at [src/application.tsx:197](../src/application.tsx#L197).
  - Confirmed on the live site after the NODE_ENV fix below.
  - Keep `NODE_ENV` unset, or set to `production`, on Production in Vercel, or the devtools come back.
- [x] Fix the cause: production is being built in development mode.
  - **Done 2026-11-11.** Vercel had `NODE_ENV=development`.
  - The first change, to `Production` with a capital P, only half worked. The devtools dropped out, but React still built in development mode, because it needs exactly `production`.
  - After the fix, the live site (`index-DlFLi7eP.js`) has no `jsxDEV`, no React dev warnings and no devtools. The JavaScript for `/creators` went from about 2.25 MB to about 1.85 MB.
  - **Confirmed:** the live bundle (`afrorevive.com/assets/index-*.js`) contains React's dev-only warning text ("Function components cannot be given refs") and the devtools code.
  - The repo isn't forcing it. The `build` script in [package.json:8](../package.json#L8) is `tsc -b && vite build`, and [vite.config.ts](../vite.config.ts) sets no `mode`.
  - So check the Vercel project for:
    - a `NODE_ENV=development` environment variable on Production;
    - a Build Command override (for example `vite build --mode development`).
  - Remove it and redeploy. Then confirm that `index-*.js` no longer contains `jsxDEV` or the warning text.
- [ ] Find and fix the "Function components cannot be given refs" warning.
  - Users no longer see it, because the production build strips it. The bug behind it is still there.
  - Run `yarn dev` and open the console. It names the component.
  - Usually it's a custom component used under a Radix `asChild` without `forwardRef`.
- [x] Remove the stray `console.log` calls that ship to users:
  - [ticket-card.tsx:68](../src/pages/creators/tickets/components/ticket-card.tsx#L68) (`console.log("ticket", ticket)`);
  - [event.service.ts:128](../src/services/event.service.ts#L128).
  - Added `esbuild: { drop: ['console', 'debugger'] }` in [vite.config.ts](../vite.config.ts) (`096beef`).

### 1.2 8.9 MB of fonts per page, and SF Pro licensing
- [x] Fix the three `@font-face` paths that point at missing files. Vercel's catch-all rewrite in [vercel.json](../vercel.json) returns `index.html` for missing files, so these weights fail.
  - [src/styles/fonts.css:209](../src/styles/fonts.css#L209): `SFPro-Light.ttf`. The file on disk is `SFProText-Light.ttf`.
  - [src/styles/fonts.css:233](../src/styles/fonts.css#L233): `SFPro-Semibold.ttf`. The file on disk is `SFProText-Semibold.ttf`.
  - [src/styles/fonts.css:200](../src/styles/fonts.css#L200): `SFMonoBold.otf`. Only `SFMonoBold.woff` exists. The report didn't catch this one.
- [ ] Remove SF Pro from the whole site. Apple's licence doesn't cover web self-hosting. **Done 2026-11-13** (`749823c`).
  - **Decided with the PO on 2026-11-11:** remove it completely. No system-font fallback that keeps SF on Apple devices.
  - **The new rules (2026-11-13):**
    - **Work Sans** only for forced-caps sub-headings in forms: the label above a field ("PROMO CODE", "EVENT NAME") and its character counter.
    - **Inter Tight** for everything else: titles, headings, body, captions, buttons and icons. It's also the page's base font now.
  - **What changed:**
    - The whole SF family is gone: Display, Text, Rounded, Compact and Mono. The 37 SF `@font-face` blocks are removed from [src/styles/fonts.css](../src/styles/fonts.css), and the five `--font-sf-*` tokens from [src/index.css](../src/index.css).
    - The font files are deleted: `public/fonts/sf-pro-display/`, `sf-pro-rounded/`, `sf-pro-text/`, `sf-compact-text/` and `sf-mono/`, about 62 MB.
    - 354 SF classes became `font-inter-tight`, and 11 form-field labels became `font-work-sans`.
    - **Inter** went too: its 102 `font-inter` classes, one `font-['Inter']` and two inline styles on the creators hero became Inter Tight. Its `@font-face` rules, its token and `public/fonts/inter/` are removed. `public/fonts/` is now 576 KB.
    - **IBM Plex Mono** stays (`font-input-mono`), by decision.
    - Where a label sits on a field wrapper ([date-form.tsx](../src/components/shared/date-form.tsx), [field-with-absolute-text.tsx](../src/components/shared/field-with-absolute-text.tsx), [field-with-counter.tsx](../src/components/shared/field-with-counter.tsx), the time inputs in [time-form.tsx](../src/components/shared/time-form.tsx)), the wrapper is Inter Tight and only the label is Work Sans. Typed values inherit the wrapper's font, so they stay Inter Tight.
  - **Checked:** a production build of `/`, `/creators`, `/contact-support` and `/events` requests no SF file and fails no font.
  - **Not yet in line with the rules,** outside the SF change:
    - `font-work-sans` is still used for things that aren't form sub-headings, about 79 uses in 39 files: menus, nav links, the creators footer, auth headings.
    - ~~[custom-form.tsx](../src/components/shared/custom-form.tsx) puts Work Sans on the whole field wrapper, so values typed into those fields are Work Sans too.~~ Fixed with the form labels (`cf8405e`).
- [x] Trim what's left. **Done 2026-11-11** (`80ae1c9`, `a98ce1d`).
  - **Inter Tight and Work Sans:** now `.woff2`, cut down to Latin, in [public/fonts/](../public/fonts/).
    - The Latin set keeps Yoruba letters and tone marks, and ₦.
    - Inter Tight went from 567 KB to 144 KB; Work Sans from 351 KB to 122 KB.
    - How they were made, and the exact command, is in the comment in [src/styles/fonts.css](../src/styles/fonts.css).
  - **IBM Plex Mono:** now loads only weights 300–700, with no italics ([src/index.css:3](../src/index.css#L3)). That's what the app's classes use.
  - **Inter** was loaded three times:
    - Google Fonts in `index.html`;
    - a second Google import in `index.css`;
    - the local 854 KB `.ttf`, which was declared last, so it was the one actually used.
    - It's now self-hosted once, as a 232 KB `.woff2`. Both Google imports are gone.
  - **Phosphate** was loaded from two font-mirror sites, `db.onlinewebfonts.com` (`index.html`) and `fonts.cdnfonts.com` (`index.css`).
    - It's now self-hosted as `PhosphateSolid.woff2` (14 KB) and `PhosphateInline.woff2` (17 KB).
    - Its preconnect is removed, and so are the unused `PhosphateRR Solid` and a duplicate `Phosphate Font/` folder.
    - The 404 page renders exactly as on the live site.
  - **Checked:** in a production build, every font loads from its new file, there are no 404s, and nothing comes from the mirror sites.
- [ ] **[PO]** Phosphate's licence. It's a 1993 Red Rooster Typefounders commercial font, and the files carry no licence. Self-hosting removed the dependency on the mirror sites, but not the licence question.
  - **Options:** buy a web licence for it, or swap to a free display face.
  - **Where it's used:** `font-phosphate` (6 files) and `font-phosphate-inline` (2 files).

### 1.3 Text falls back to a serif font
- [x] Remove the quotes around `sans-serif` in all 12 font tokens: [src/index.css:198-209](../src/index.css#L198-L209). Quoted, it's read as a font named "sans-serif", not the generic family.
- [x] `--font-input-mono` at [src/index.css:197](../src/index.css#L197) still has `"sans-serif"` in quotes. It's the last of the 12.
- [x] Promo Codes text "ONLY 1 USE PER CUSTOMER" shows in serif. Checked 2026-11-11 by rendering the page and asking Chrome which font it draws.
  - **Where:** it's rendered by `BaseBooleanCheckbox` ([base-boolean-checkbox.tsx:57](../src/components/reusable/base-boolean-checkbox.tsx#L57), `text-xs font-light font-sf-pro-display`), not `BaseCheckbox`. The copy is in [promo-code-form.tsx:306](../src/pages/creators/add-event/ticket-forms/promo-code-form/promo-code-form.tsx#L306).
  - **Cause:** the SF Pro Display **Light** face is declared `font-style: italic` ([src/styles/fonts.css:14](../src/styles/fonts.css#L14)), so there's no upright Light.
    - For `font-light`, the browser picks the nearest lighter upright face instead: Ultralight, a 2.3 MB `.otf`. Chrome confirms it draws `SFProDisplay-Ultralight`.
    - The text renders in the fallback until that file arrives. On live, the fallback chain ended in the quoted `"sans-serif"`, which isn't the generic family, so the fallback was the browser's default serif (Times).
  - **Fix:** change line 14 to `font-style: normal`. There's no SF Pro Display Light Italic file, so that face was only ever meant to be upright. Then `font-light` gets the right, heavier Light weight.
  - The quotes fix above already stops the serif fallback.
  - The other `font-light font-sf-pro-display` text across the app had the same wrong weight. Dropping SF Pro (1.2) removed the problem entirely.

---

## 2. Layout breaks at 375px

### 2.1 Service Vendor: time pickers overflow the screen
- [x] [create-vendor-slot-modal.tsx:454](../src/pages/vendor/component/create-vendor-slot-modal.tsx#L454): `grid grid-cols-2 gap-4` holds two `TimeForm`s. Stack them on mobile with `grid-cols-1 sm:grid-cols-2`.
- [x] [src/components/shared/time-form.tsx:30-47](../src/components/shared/time-form.tsx#L30-L47): the `w-full` hour:minute box plus the AM/PM column can't shrink. Add `min-w-0` and let the box shrink. Other forms use this component too, so check those.
- The cut-off "(Optional)" labels are a side effect of the 385px page width. They come back once this is fixed.

### 2.2 Edit Ticket: "Update Ticket" breaks out of its card
- [x] [ticket-form.tsx:354-379](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L354-L379): both buttons are a fixed `w-[155px]` in a `flex gap-3` row. Use `flex-col sm:flex-row` and `w-full sm:w-[155px]`.
- [x] **[PO]** In edit mode, "REMOVE TICKET" calls `onCancel`, which only closes the form ([tickets/index.tsx:170](../src/pages/creators/tickets/index.tsx#L170)). It doesn't delete anything. Either relabel it "Cancel", or make it delete. This ties into the Delete/Remove naming row in section 4 (Relabled Cancel).

### 2.3 Analytics: event selector cut off
- [x] **Fixed on `analytics-redesign`**, which merges later. The fix lands with that branch; there's nothing to do on prod.
  - The event selector is gone from the analytics header. The page reads the selected event, and the header is now the tab's title, a description and **Export CSV**.
  - **Checked 2026-11-11 at 375px**, rendering every tab (Overview, Audience Insights, Vendors, Orders, Attendee List, Promo Codes) with a dev event:
    - nothing runs past the screen edge;
    - the page never scrolls sideways;
    - every title, "Audience Insights" included, fits on one line.
- [ ] **New, on `analytics-redesign`:** the tables have the same hidden-columns problem as the Guestlist (**2.5**). Each table scrolls sideways inside its card with no cue, and only the first two columns show at 375px.
  - **Table widths in a 295px card:**
    - Orders: 846px (Order and Buyer show; ticket, amount and status are hidden)
    - Attendee List: 766px
    - Vendors: 617px
    - Promo Codes: 417px
  - **Where:** `AnalyticsTable` in `src/pages/creators/realtime/components/analytics-ui.tsx` on that branch (`overflow-x-auto`).
  - **Fix:** use one mobile pattern for all of them and for the Guestlist. Either card rows below `sm`, or pin the key column and add a scroll hint.

### 2.4 Settings > Account: birthday fields clipped
- [x] [creator-account-tab.tsx:162-200](../src/pages/creators/standalone/components/creator-account-tab.tsx#L162-L200): `grid grid-cols-4`, where the first cell is just a "Birthday" label box. Move "Birthday" above as a label and use `grid-cols-3` for Month, Day and Year.
- [x] The fans page uses the same pattern in [src/pages/fans/account/tabs/profile-tab.tsx:187](../src/pages/fans/account/tabs/profile-tab.tsx#L187). Check it at 375px too.

### 2.5 Guestlist table hides Status and actions
- [x] [event-guestlist-card.tsx:174](../src/pages/creators/guest-list/components/event-guestlist-card.tsx#L174): the table (429px) sits inside `overflow-x-auto` (295px).
  - On mobile, show each guest as a card (name and email, a status chip, the menu), or hide the Category column below `sm`.
  - At minimum, add a scroll cue.
- [x] Check the same table pattern in:
  - [standalone/guestlist/components/guest-table.tsx](../src/pages/creators/standalone/guestlist/components/guest-table.tsx)
  - [guest-list/components/import-guestlist-card.tsx](../src/pages/creators/guest-list/components/import-guestlist-card.tsx)
- [ ] **Audience access requests** ([audience/components/access-requests-card.tsx](../src/pages/creators/audience/components/access-requests-card.tsx)) **get a different design.** Don't copy the guestlist card here; wait for that design.

### 2.6 Event card crops the flyer
- [x] [src/components/shared/dashboard-cards.tsx:49](../src/components/shared/dashboard-cards.tsx#L49): a fixed `h-[300px]` with cover cropping.
  - **Fixed 2026-11-11:** the image box is now `aspect-3/4`, the poster's ratio, and the loading skeleton matches it.
  - Checked at 375px and 1440px: every card's box is exactly 3:4 and the whole flyer shows, title included.
- [x] Badges at [dashboard-cards.tsx:72](../src/components/shared/dashboard-cards.tsx#L72) and [:129](../src/components/shared/dashboard-cards.tsx#L129) sit on the flyer. **Kept as they are, agreed with the PO.**
- The card is rendered from [standalone/index.tsx:290](../src/pages/creators/standalone/index.tsx#L290).

### 2.7 Edit Ticket opens off-screen, and the menu stays open
- **The ticket card's design is changing.** Fix this with the new design, not on the current card.
  - **Files:** [ticket-card.tsx](../src/pages/creators/tickets/components/ticket-card.tsx) (Tickets page), [ticket-summary-card.tsx](../src/components/shared/ticket-summary-card.tsx) (the shared card, with the ⋮ menu) and [action-popover.tsx](../src/pages/creators/add-event/component/action-popover.tsx).
  - **Also uses the shared card:** the Create Event flow ([publish-tab.tsx](../src/pages/creators/add-event/tabs/publish-tab.tsx), [ticket-forms/create/index.tsx](../src/pages/creators/add-event/ticket-forms/create/index.tsx)).
- [x] [tickets/index.tsx:118-122](../src/pages/creators/tickets/index.tsx#L118-L122) (`handleEditTicket`): Edit Ticket on a ticket further down loaded the form at the top, out of sight. **Fixed 2026-11-11.**
  - The composer has a ref, and the page scrolls it into view once editing starts. A `scroll-mt` offset keeps it clear of the sticky header.
  - **Also needed:** the menu handed focus back to its ⋮ on closing, which scrolled the page straight back down. It now keeps focus put when an option is picked; Escape and clicking outside still return it.
  - **Checked** at 375px and 1440px: editing the last ticket brings the form's top to 88px, just under the 72px header.
- [x] [src/pages/creators/add-event/component/action-popover.tsx](../src/pages/creators/add-event/component/action-popover.tsx): the ticket ⋮ menu stayed open after a choice and hung past the card. **Fixed 2026-11-11.**
  - **Closing:** the menu is controlled, and every `ActionPopoverItem` closes it before running its action. That includes items passed in as `extraActions`, like Send Invite.
  - **Position:** it opens to the left of the ⋮, centred on it, instead of centred below it. `BasePopover` gained optional `open`, `onOpenChange`, `side`, `align` and `collisionPadding`.
  - **Checked** on the Tickets page at 375px and 1440px: the menu sits fully inside its card, and Edit Ticket closes it and opens the form.
  - **Correction:** it's used only by the ticket card ([ticket-summary-card.tsx](../src/components/shared/ticket-summary-card.tsx)), not the promo and vendor cards.

### 2.8 Custom URL field truncated
- [x] [src/components/shared/field-with-absolute-text.tsx:31-33](../src/components/shared/field-with-absolute-text.tsx#L31-L33): the prefix took about 40% of the row. **Fixed 2026-11-11.**
  - On mobile the prefix sits on its own line above the input, inside the same box. From `sm` up they share one row; the prefix keeps its width and the input (`min-w-0`) takes the rest.
  - **Checked** on Event Details and Create Event: at 375px the slug input is 293–333px wide and "wizkid-live-abuja" fits whole; at 1440px it's 597–696px wide. No sideways scroll.
- [x] Change the prefix text from `afrorevive/events/` to `afrorevive.com/events/`. **Done 2026-11-11** on both pages. Event pages are now at the root after the /fans move.
  - [add-event/tabs/event-details-tab.tsx:250](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L250)
  - [edit-event/tabs/event-details-tab.tsx:254](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L254)

### 2.9 Header controls
- [ ] **[PO]** Wire up the bell, or hide it. It's a plain `<img>` in [creator-dashboard-layout/header.tsx:21](../src/layouts/creator-dashboard-layout/header.tsx#L21).
  - **Hidden for now** (`df49397`): commented out until notifications are live. Wiring it up is still open.
  - The hooks already exist: `useOrganizerNotifications` and `useMarkNotificationAsRead` in [src/hooks/use-profile-mutations.ts:171](../src/hooks/use-profile-mutations.ts#L171).
  - Wiring it up means a button and a dropdown or sheet.
- [x] Fix the ☰ behaviour in [header.tsx:23-29](../src/layouts/creator-dashboard-layout/header.tsx#L23-L29). When the mobile sidebar is open, the ☰ trigger is swapped for `CreatorMenuButton`, so Settings takes a second tap. Either:
  - keep a close (X) control and show the avatar beside it; or
  - add Settings to the sidebar footer ([creator-side-bar.tsx:176](../src/layouts/creator-dashboard-layout/creator-side-bar.tsx#L176)).

---

## 3. Contradictions in copy, data and logic

### 3.1 Visibility rule stated two opposite ways
- [x] [add-event/tabs/event-details-tab.tsx:150-153](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L150-L153) says "Public events can be switched to private one time only". That's wrong.
  - Use the agreed rule from [edit-event/tabs/event-details-tab.tsx:169](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L169): private → public at any time, public → private never.

### 3.2 Resale left on while the banner says it's off
- [x] The ticket form didn't know the event was private, so "Allow ticket resell" stayed available. **Fixed 2026-11-11.**
  - [ticket-form.tsx](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx) takes `isPrivateEvent`. It forces `allow_ticket_resell` off, which also clears it on a saved ticket opened for editing, and shows "Unavailable for private events. Tickets stay with the attendees you approve." instead of the checkbox (a new `private_event` reason).
  - The "allows attendees to resell…" line now shows only beside the checkbox; it used to show under the group-ticket note too.
  - Passed from the Tickets page (`isPrivateEvent`) and from Create Event's tickets step (`visibility === "private"`).
  - [x] Not checked in a browser yet (it needs the dev organizer login).
- [x] **[BE]** The backend enforces no resale on private events, so tickets saved earlier with `allowResell: true` are covered.

### 3.3 Ticket price differs between the list and the form ⚠️
- [x] **Fixed 2026-11-11:** the backend now returns the same value for `price` and `basePrice` (they used to differ by the fee). For consistency, the organizer side reads `basePrice` everywhere a ticket's own price is meant:
  - the Tickets page edit form, for both the price and the Paid/Free choice ([tickets/helper.ts](../src/pages/creators/tickets/helper.ts));
  - Create Event's edit of a saved ticket ([ticket-forms/create/helper.ts](../src/pages/creators/add-event/ticket-forms/create/helper.ts));
  - the Send Invites modal's price label and paid check ([send-invites-modal.tsx](../src/pages/creators/tickets/components/send-invites-modal.tsx)).
  - The card already showed `basePrice`, so the list and the form now agree. What follows is the original analysis.
- **Original analysis:**
  - **What each side reads:**
    - The card shows `ticket.basePrice` ([ticket-card.tsx:74](../src/pages/creators/tickets/components/ticket-card.tsx#L74)).
    - The edit form loads `ticket.price` ([tickets/helper.ts:28](../src/pages/creators/tickets/helper.ts#L28)).
    - Create and update send the form's value as `price` ([src/lib/event-transforms.ts:202](../src/lib/event-transforms.ts#L202)).
  - **Why it matters:** 53,000 / 50,000 = 1.06, so `price` looks like the fan price with fees added. If the backend treats the `price` it receives as the organizer's base, every edit-and-save adds the fee again.
  - **How to check:** on dev, open a ticket, save it without changes, and see whether `basePrice` moves.
  - **Likely fix:** load `basePrice` into the form, and label the card so it says which figure it shows.
  - **Confirmed from the API (2026-11-11), before the backend change:** a ticket came back with `basePrice` 50,000, `fee` 3,000 (a naira amount per ticket, currently 6%), and `price` and `salesPrice` both 53,000, so the form loaded the fan price.
- [x] **Fan side, found while checking this: checkout charged the fee twice.** Fixed 2026-11-11 (`b9439f9`).
  - **Before:** tickets showed `salesPrice` (53,000, which already includes the backend's fee), and checkout added the app's own 8% (`VITE_TICKET_SALES_PERCENTAGE`) on top of that.
  - **Now:** tickets show `basePrice`, captioned "(fees at checkout)". Checkout adds each line's API `fee` × quantity, and the TOTAL accordion shows base total + fee − discount. Nothing is calculated from the env rate.
  - **Agreed with the PO:** the fee is 8%. **The backend now charges it (2026-11-11).** A ₦10,000 ticket comes back as:

    | Field | Value | Meaning |
    |---|---|---|
    | `price` | 10,000 | the organizer's price (same as `basePrice`) |
    | `basePrice` | 10,000 | the organizer's price; what the app shows and edits |
    | `fee` | 800 | the fan's fee per ticket, in naira |
    | `feePercentage` | 0.08 | the fee rate |
    | `salesPrice` | 10,800 | what a fan pays per ticket: base + fee |
    | `resalePrice` | 10,800 | same as `salesPrice` |

    Checkout uses `basePrice` and `fee`, so it already shows the 8%; nothing in the app changed for it.
  - [x] **[BE]** Confirm that the amount actually charged is base × quantity + fee × quantity − discount, plus the Paystack fee below. Checkout doesn't send an amount, so the backend's number is what fans pay.
  - [ ] **[PO]** **Paystack's fee: who pays it?** Customers currently pay Paystack's charge on top: 1.5% + ₦100, capped at ₦2,000. Paystack's published Nigeria pricing also waives the ₦100 on payments under ₦2,500; confirm that applies.
    - **Deliberately not shown in the checkout total yet.** The PO is being asked to absorb it, in which case customers wouldn't pay it at all.
    - **Until that's decided,** a fan's Paystack charge is higher than the TOTAL shown at checkout. For example, a ₦10,800 total becomes ₦11,062.
    - **If the PO absorbs it:** nothing to change in checkout; the backend stops passing it on.
    - **If customers keep paying it:** add a "Payment processing" line to the TOTAL accordion, using the backend's figure rather than calculating it in the app, the same as the ticket fee.
  - [x] **[BE]** The promo code's subtotal is the base total. **Confirmed 2026-11-11:** discounts apply to the base price.
  - [ ] Once confirmed, remove `VITE_TICKET_SALES_PERCENTAGE` from `.env`, Vercel and `src/test/setup.ts`; nothing else uses it. (`VITE_TICKET_RESALE_PERCENTAGE` is still used for seller payouts.)
- [ ] **[PO]** **[BE]** **Resale pricing and fees.** How it works now:
  - The seller's price picker starts at the seller's ticket `price`, from `GET /api/profile/user/ticket/active`. That was the sales price (53,000) when this was written. If that endpoint follows the tickets endpoint (`price` = `basePrice`), it now starts at the base price; **[verify]** on dev. It has no upper limit. The listing stores one `price` ([ticket-resale.tsx](../src/pages/fans/my-tickets/tickets-resale/modals/ticket-resale.tsx)).
  - The seller's payout is `price − price × VITE_TICKET_RESALE_PERCENTAGE`.
  - The buyer pays the listing price. Resale lines carry no fee, so no buyer fee shows at checkout; before `b9439f9` the app added 8% to resale lines too.
  - **To decide:**
    - Does a resale buyer pay a fee? If yes, the backend sends a per-listing `fee` and `toPurchasableResaleListings` passes it through ([purchasable-tickets.ts](../src/lib/purchasable-tickets.ts)).
    - Should the picker start at the base price rather than the sales price? Likely settled by the backend making `price` the base price; confirm with the check above.
    - Is the API's `resalePrice` (the same as `salesPrice`, ₦10,800 on a ₦10,000 ticket; unused in the app) meant as the most a ticket can be resold for? If so, enforce it in the picker and on the backend.

### 3.4 "Tickets issued" differs between pages
The Tickets page said "Total Tickets Issued 0 / 10" while Analytics Overview said "10 tickets issued", because the analytics endpoint's `totalTicketsIssued` returns tickets created (capacity), not issued.
- [x] **Tickets page label renamed to "Tickets Sold"** (2026-11-11) in [ticket-summary.tsx](../src/pages/creators/tickets/components/ticket-summary.tsx). It shows `eventStat.ticketSold / totalTicket`, which is what it always meant.
- [ ] **Merge `analytics-redesign`.** Its Overview drops "tickets issued" for a **Tickets Sold** tile (`totalTicketsSold / totalTicketsCreated`), so both pages then show sold out of total under the same name.
- [ ] **[BE]** `eventStat`, which the Tickets page reads, is still known to be stale, so its sold count can trail the analytics until the backend fixes it.

### 3.5 Copy pasted into the wrong place
All fixed 2026-11-11:
- [x] Create Event > Contact Details helper ([add-event/tabs/event-details-tab.tsx](../src/pages/creators/add-event/tabs/event-details-tab.tsx)): now "Shown on your event page so attendees can reach you.", as on Edit Event.
- [x] Create Event > Date & Time helper: now "Set when your event starts and ends." (a new event has no ticket holders to notify).
- [x] Contact note in the vendor slot modal ([create-vendor-slot-modal.tsx](../src/pages/vendor/component/create-vendor-slot-modal.tsx)) branches on `isRevenue`:
  - revenue stalls keep "…hidden until a revenue vendor successfully pays for a slot…";
  - service offers say "Service vendors see your contact details once you accept their application." (agreed with the PO).
- [x] Service vendor banner ([vendor-how-it-works.tsx](../src/pages/vendor/component/vendor-how-it-works.tsx)): "How service vendor offers work".
- [x] The modal's description is split by `isRevenue`: "Open your event to marketplace sellers." for stalls, "Reach out for professional event services." for offers.

### 3.6 Flyer size guidance differs
- [x] **Decided with the PO on 2026-11-11: 3:4 everywhere on the site.** The organizer guidance and every place a flyer shows use it. The two labels that currently disagree:
  - "550 X 770" (5:7) in [poster-upload-field.tsx:78](../src/pages/creators/add-event/component/poster-upload-field.tsx#L78) and [theme-tab.tsx:229](../src/pages/creators/add-event/tabs/theme-tab.tsx#L229);
  - "Portrait (3:4)" in [poster-image-field.tsx:63](../src/pages/creators/edit-event/component/poster-image-field.tsx#L63).
- **Every place a flyer shows, and its shape** (audited 2026-11-11; ratio is width:height; cover crops the flyer, contain fits it whole):

  | Where | File | Size or ratio | Fit |
  |---|---|---|---|
  | **Organizer** | | | |
  | Create Event: poster upload (says 550 × 770) | [poster-upload-field.tsx:19](../src/pages/creators/add-event/component/poster-upload-field.tsx#L19) | 285 × 350 box (about 4:5) | contain |
  | Create Event, Theme: flyer upload (says 550 × 770) | [theme-tab.tsx:193](../src/pages/creators/add-event/tabs/theme-tab.tsx#L193) | 162 × 216 (3:4) | contain |
  | Event Details: Poster Image | [poster-image-field.tsx:80](../src/pages/creators/edit-event/component/poster-image-field.tsx#L80) | 3:4 | cover |
  | Publish step preview | [publish-tab.tsx:130](../src/pages/creators/add-event/tabs/publish-tab.tsx#L130) | 3:4 | cover |
  | Events list card | [dashboard-cards.tsx:51](../src/components/shared/dashboard-cards.tsx#L51) | 3:4 (was a fixed 300px height) | cover |
  | **Fans** | | | |
  | Event discovery cards | [category-block.tsx:103](../src/components/shared/category-block.tsx#L103) | 3:4 | cover |
  | Their loading skeleton | [category-block.tsx:149](../src/components/shared/category-block.tsx#L149) | **5:7**, so the cards change shape when they load | — |
  | Event page | [event-details.tsx:23](../src/pages/landing-page/event-page/individual-event/sections/event-details.tsx#L23) | full width up to 450px × 400px tall (550px from md up), about 4:5 | cover |
  | Cart | [cart-container.tsx:63](../src/pages/landing-page/event-page/cart/cart-container.tsx#L63) | 200 × 300 (2:3); 300 × 400 (3:4) from md | cover |
  | Checkout, mobile | [checkout-summary.tsx:196](../src/pages/landing-page/checkout/sections/checkout-summary.tsx#L196) | 200 × 300 (2:3) | cover |
  | Checkout, desktop | [checkout-summary.tsx:214](../src/pages/landing-page/checkout/sections/checkout-summary.tsx#L214) | 200 wide × the image's default 220px (about 10:11) | cover |
  | My Tickets and Listed Tickets cards | [my-tickets/components/tickets.tsx:11](../src/pages/fans/my-tickets/components/tickets.tsx#L11) | 5:7 | cover |
  | A single active ticket | [individual-active-tickets/index.tsx:166](../src/pages/fans/my-tickets/individual-active-tickets/index.tsx#L166) | 5:7, up to 360px wide | cover |
  | Accept invite | [accept-invite/index.tsx:435](../src/pages/fans/accept-invite/index.tsx#L435) | 112 × 144 (7:9) | cover |
  | **Vendors** | | | |
  | Discover and My Slots cards | [vendor-event-card.tsx:24](../src/pages/vendor/component/vendor-event-card.tsx#L24) | 3:4 | cover |
  | Event details (copies the fans' cart) | [vendor discover/event-details/index.tsx:188](../src/pages/vendor/discover/event-details/index.tsx#L188) | 200 × 300 (2:3); 300 × 400 (3:4) from md | cover |
  | Slot details | [slot-details/index.tsx:166](../src/pages/vendor/slots/slot-details/index.tsx#L166) | 2:3, up to 760px tall | cover |
  | **Shared default** | | | |
  | `RenderEventImage` with no size given | [render-event-flyer.tsx:22](../src/components/shared/render-event-flyer.tsx#L22) | full width × 200px (220px from md) | cover |
  | Its no-image placeholder | [render-event-flyer.tsx:13](../src/components/shared/render-event-flyer.tsx#L13) | 240px tall (256px from md) | — |

  - **Count:** 3:4 is used in 8 places, 5:7 in 2 (plus the skeleton), 2:3 in 4. The rest are one-offs: about 4:5, 7:9, 10:11.
  - **Plan (3:4 decided):** one shape everywhere, at a few set sizes. The ratio fixes how the flyer is cropped; the width decides how big it is.

    | Size | Width | Where |
    |---|---|---|
    | Thumbnail | 112–120px | cart and checkout on mobile, beside the event details instead of above them; accept invite |
    | Compact | 200px | cart and checkout on desktop |
    | Card | fills its grid column | Events list, fan discovery, My Tickets and Listed Tickets, vendor Discover and My Slots |
    | Feature | up to 360–450px | event page, single active ticket, vendor slot details, Event Details poster, Publish preview |

    - Change the upload boxes to 3:4, and the "550 × 770" labels to match (for example "1200 × 1600 px (3:4)"), so the preview shows organizers how the poster is cropped everywhere.
    - Replace the fixed heights with one shared 3:4 class or component, including `RenderEventImage`'s 200/220px default.
- [x] Apply 3:4 across the site, using the table and plan above. **Done 2026-11-11** (`ddf9ff1`).
  - `RenderEventImage` and its placeholder default to 3:4.
  - Cart and vendor event details show a 120px thumbnail beside the details on mobile (300px on desktop); checkout shows a 120px thumbnail on mobile (200px on desktop).
  - The event page, ticket cards, single ticket, discovery skeleton, slot details and accept invite are 3:4.
  - Both upload boxes are 3:4 and say "1200 X 1600"; their previews crop like everywhere else.
  - **Checked** at 375px and 1440px on the event page, My Tickets, a ticket, Create Event, and vendor event and slot details: every box measures 3:4 and nothing scrolls sideways.
  - [ ] **Not yet seen:** the cart and checkout pages, which need a live reservation. Add a ticket in the real flow once and check both.

### 3.7 Wrong empty state on filters
- [x] (`cee3c02`) [standalone/index.tsx:183-194](../src/pages/creators/standalone/index.tsx#L183-L194) and `EmptyState` ([:210-221](../src/pages/creators/standalone/index.tsx#L210-L221)): when the account has events but the filter is empty, say "No upcoming events" or "No drafts", not "No Events Created". Pass `activeFilter` and `allEvents.length` in.
- [ ] Optional: show `0` on the pills with no events. The counts come from `countEventsByStatus` in [event-filters.tsx:37](../src/pages/creators/standalone/components/event-filters.tsx#L37).

### 3.8 Promo Codes form
- [x] (`a4190f8`; relabelled CANCEL) "Remove promocode" shows on a new, unsaved code. [promo-codes/index.tsx:245](../src/pages/creators/promo-codes/index.tsx#L245) passes `onRemove`, which only resets the form.
  - Don't pass it for a new code, or relabel it "Clear".
  - The button is at [promo-code-form.tsx:268-280](../src/pages/creators/add-event/ticket-forms/promo-code-form/promo-code-form.tsx#L268-L280).
- [x] (`a4190f8`) The default dates are wrong in [promo-code-schema.ts:96-107](../src/pages/creators/add-event/schemas/promo-code-schema.ts#L96-L107). Both start and end are `new Date()` at 12:00 AM, so the start is already in the past and the end equals the start.
  - Default the start to now.
  - Default the end to the event's end, or the start plus 7 days.
  - Check that the schema rejects an end at or before the start.

### 3.9 Error before input
- [x] (`0c4eb05`) [add-event/tabs/event-details-tab.tsx:91-95](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L91-L95): on mount, `setValue('custom_url', …, { shouldValidate: true })` runs with an empty name, so "URL too short." shows right away. The rule is in [src/schema/edit-event-details.ts:18](../src/schema/edit-event-details.ts#L18).
  - Validate only once the name has text: `shouldValidate: Boolean(eventName)`.

---

## 4. Design-system inconsistencies

Each row needs one rule from design. Agree the rule **[PO]**, then apply it.

- [x] **Section headings:** the Create and Edit Event pages mix UPPERCASE with Title Case.
  - Uppercase `h2`s: [add-event/tabs/event-details-tab.tsx:147](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L147), [:160](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L160), [:266](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L266).
  - Title Case "Poster Image": [poster-image-field.tsx](../src/pages/creators/edit-event/component/poster-image-field.tsx).
  - Edit Event's section headings: [edit-event/tabs/event-details-tab.tsx](../src/pages/creators/edit-event/tabs/event-details-tab.tsx).
  - Make one heading component.
  - **Done 2026-11-13** (`5921a60`). [FormSectionHeading](../src/components/shared/form-section-heading.tsx) is `font-inter-tight font-black text-xl text-black uppercase`. It replaces 15 headings in 10 files across Create and Edit Event: event details, sales channel, ticket format, ticket form, theme, the tab container, confirmation email, Poster Image, and Edit Event's `SectionHeader`.
- [x] **Primary buttons** (colour, case and placement):
  - red "SAVE": [creator-account-tab.tsx:271](../src/pages/creators/standalone/components/creator-account-tab.tsx#L271);
  - grey or black: [creator-payout-tab.tsx:274](../src/pages/creators/standalone/components/creator-payout-tab.tsx#L274);
  - black "Update Password": [creator-settings-modal.tsx:286](../src/pages/creators/standalone/components/creator-settings-modal.tsx#L286);
  - "SAVE": [edit-tab-children-container.tsx:59](../src/pages/creators/edit-event/component/edit-tab-children-container.tsx#L59) and [promo-codes/index.tsx:194](../src/pages/creators/promo-codes/index.tsx#L194);
  - side by side on Tickets: [ticket-form.tsx:354](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L354);
  - stacked on Promo: [promo-code-form.tsx:268](../src/pages/creators/add-event/ticket-forms/promo-code-form/promo-code-form.tsx#L268);
  - centred pill on Vendors: [create-vendor-slot-modal.tsx](../src/pages/vendor/component/create-vendor-slot-modal.tsx).
  - Add variants to [src/components/ui/button.tsx](../src/components/ui/button.tsx) rather than per-page classes.
  - **Done 2026-11-13** (`db8e0ee`). In [button-variants.ts](../src/components/ui/button-variants.ts):
    - **Colour by role:** `variant="primary"` (deep red) for the action that commits (Save, Create); `variant="dark"` (black) for the other button (Cancel, Save Draft). Edit Event's Publish is `dark` too, so it doesn't compete with the red Save beside it.
    - **Shape by context:** `size="header"` for page-header Save/Publish; `size="block"` for full-width settings submits; `size="pill"` for cancel + submit pairs, side by side from `sm` and stacked full width on a phone. All three are `font-bold`; labels set their own case (see **Button case**).
    - Every button listed above uses them now. Tickets, Promo and Vendors pairs swapped colours: Cancel / Save Draft is black, the submit is red. Payout's Save and Update Password are red.
    - The base button font was `font-input-mono`, so any `<Button>` without its own font class rendered in IBM Plex Mono. It's `font-inter-tight` now. Links styled as buttons that set mono themselves, like the fan home's "Find Tickets", are unchanged.
- [x] **Button case:**
  - "UPDATE TICKET" ([ticket-form.tsx:374](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L374));
  - "View Analytics" ([ticket-summary.tsx](../src/pages/creators/tickets/components/ticket-summary.tsx));
  - "copy link" and "view page" ([selected-event-card.tsx:33](../src/layouts/creator-dashboard-layout/selected-event-card.tsx#L33), [:65](../src/layouts/creator-dashboard-layout/selected-event-card.tsx#L65));
  - "preview" ([poster-image-field.tsx:73](../src/pages/creators/edit-event/component/poster-image-field.tsx#L73)).
  - **Rule (2026-11-13):** a one-word label is in capitals (SAVE, CANCEL, PREVIEW, SAVING...); a longer one is in Title Case (Update Ticket, View Analytics, Copy Link).
  - **Done 2026-11-13** (`db8e0ee`). The four above follow it. So do the buttons on the new sizes: the `header`, `block` and `pill` sizes no longer force `uppercase`, so each label is written in its case ("Create Ticket", "Create Promo Code", "Update Password", "Save Draft"; "SAVE", "CANCEL", "SAVED"). "View Analytics" was Work Sans and is Inter Tight now.
- [ ] **Off-brand blue:** `bg-tech-blue` on "view page" ([selected-event-card.tsx:62](../src/layouts/creator-dashboard-layout/selected-event-card.tsx#L62)) and "preview" ([poster-image-field.tsx:71](../src/pages/creators/edit-event/component/poster-image-field.tsx#L71)).
- [x] **Form labels:** labels appear four ways.
  - Uppercase above the field: the shared `FormField` in [src/components/reusable/](../src/components/reusable/) (base-form).
  - Bold Title Case: the Guestlist cards.
  - Inside the box: [settings-inset-field.tsx](../src/pages/creators/standalone/components/settings-inset-field.tsx).
  - Placeholder only: the Change Password inputs in [creator-settings-modal.tsx](../src/pages/creators/standalone/components/creator-settings-modal.tsx).
  - The global label `htmlFor` fix belongs with this one.
  - **Done 2026-11-13:** every form puts its label above the field in Work Sans capitals (`cf8405e`, which can be reverted on its own: `git revert cf8405e`). The `htmlFor` fix is separate (`8153e9c`).
- [x] **Forced uppercase inputs:** the name, venue and URL inputs have `className="uppercase"`, so they don't show what was saved.
  - [edit-event/tabs/event-details-tab.tsx:189](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L189), [:224](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L224), [:259](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L259)
  - [add-event/tabs/event-details-tab.tsx:175](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L175)
  - **Done 2026-11-13** (`9321a21`): only the promo code is saved in capitals; event names and venues start each word with a capital; the custom URL shows as typed.
- [x] **Naming:**
  - "Guest List" ([creator-side-bar.tsx:88](../src/layouts/creator-dashboard-layout/creator-side-bar.tsx#L88)) vs "Guestlist" (guest-list cards and dashboard tab).
  - "Revenue Vendor" vs "Service Vendors" (sidebar).
  - "Delete" ([action-popover.tsx:37](../src/pages/creators/add-event/component/action-popover.tsx#L37)) vs "Remove Ticket" ([ticket-form.tsx:360](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L360)).
  - "resell" ([ticket-form.tsx:303-325](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L303-L325)) vs "resale" ([tickets/constant.ts:17](../src/pages/creators/tickets/constant.ts#L17)).
  - "Promo Code" vs "PROMOCODE" ([promo-code-form.tsx:278](../src/pages/creators/add-event/ticket-forms/promo-code-form/promo-code-form.tsx#L278), [:289](../src/pages/creators/add-event/ticket-forms/promo-code-form/promo-code-form.tsx#L289)).
  - "SAVE AS DRAFTS" should be "Save as draft" ([add-event/index.tsx:146](../src/pages/creators/add-event/index.tsx#L146)).
  - "Tiktok" should be "TikTok" ([add-event/tabs/event-details-tab.tsx:353](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L353), [edit-event/tabs/event-details-tab.tsx:366](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L366)).
  - "AfroRevive" should be "Afrorevive" in user-facing copy:
    - [user-login-form.tsx:75](../src/pages/auth/user-login/user-login-form.tsx#L75)
    - [sales-channel-field.tsx:14](../src/pages/creators/add-event/component/sales-channel-field.tsx#L14), [:21](../src/pages/creators/add-event/component/sales-channel-field.tsx#L21)
    - [event-category-blocks.tsx:450](../src/pages/landing-page/event-page/event-category-blocks.tsx#L450)
    - [vendor slot-details/index.tsx:193](../src/pages/vendor/slots/slot-details/index.tsx#L193)
  - **Decided and done 2026-11-13, not committed yet:**
    - **Guestlist:** the sidebar, the guestlist toasts and the creators landing copy.
    - **Singular:** "Revenue Vendor" and "Service Vendor" everywhere, including the vendor slot page and the Service Vendor page heading.
    - **Resale:** the ticket form's toggle and notes say "Allow Ticket Resale".
    - **Save as Draft:** the Create Event header button (Title Case, by the button rule), and the docs.
    - **TikTok:** the Socials labels in Create and Edit Event.
    - **Afrorevive:** the five places above, plus the vendor header logo's alt text. Code names are unchanged.
    - "Promo Code" was already fixed with the buttons, and "Remove Ticket" no longer exists.
    - **AfroRave, the old name, is Afrorevive too:** the three sign-up toasts ("Welcome to Afrorevive!"), the home header logo's alt text, the Payment Confirmed and creators page titles, and "The Afrorevive mobile app" on the creators landing page.
- [x] **Card gutters:** pick one value. Currently:
  - 16px on Promo ([promo-codes/index.tsx:230](../src/pages/creators/promo-codes/index.tsx#L230) `px-4`);
  - 20px on Tickets ([tickets/index.tsx:146](../src/pages/creators/tickets/index.tsx#L146) `px-5`);
  - 24px on Events ([standalone/index.tsx:176](../src/pages/creators/standalone/index.tsx#L176) `px-6`);
  - the vendor pages, which differ again.
  - **Decided and done 2026-11-13, not committed yet:** every creator dashboard page, its header bar and the top navbar use `px-5 md:px-8` (20px on phones, 32px from `md`). Promo's 56px desktop padding is now 32px. Modals, cards' own padding and the vendor's own dark dashboard are unchanged.
- [ ] **Analytics card titles.** Mostly fixed on `analytics-redesign`.
  - **Alignment:** fixed. Every card uses one `AnalyticsCard` with a left-aligned title.
  - **Wording:** still mixed on that branch.
    - Overview's cards: "Age Range" and "Top Locations".
    - Audience Insights' cards: "Age Groups" and "Locations".
    - Audience Insights' summary tile: "Top Age Range".
    - Pick one word, "Age Groups" or "Age Range", and use it in all three places. Change this on that branch.
- [x] **Menu drawer:**
  - Child links use the same `px-6` as their parents, which have an icon, so children look less indented ([base-sidebar.tsx:261](../src/components/reusable/base-sidebar.tsx#L261), [:294](../src/components/reusable/base-sidebar.tsx#L294)).
  - The `Plus` icon never changes when a group is open ([base-accordion.tsx:66](../src/components/reusable/base-accordion.tsx#L66)). Rotate it to × or swap it for Minus on `data-state=open`.
  - Analytics > "Tickets" repeats the top-level "Tickets" ([creator-side-bar.tsx:109](../src/layouts/creator-dashboard-layout/creator-side-bar.tsx#L109)). Rename it to something like "Ticket sales".
  - **Done 2026-11-13, not committed yet** (the same component is the desktop sidebar): links in a group start at 50px, in line with the group name past its icon, and sub-group links at 66px; the + turns into a × while open; Analytics › "Tickets" is "Ticket Sales".
- [ ] **Choice controls:** Paid/Free ([ticket-form.tsx:85](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L85)) and "Start immediately / Schedule" ([ticket-form.tsx:289](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L289)) are checkboxes, but only one can apply. Use [src/components/ui/radio-group.tsx](../src/components/ui/radio-group.tsx).
- [x] **Text details:**
  - Helper text is forced lowercase:
    - `descriptionClassName="… lowercase …"` at [ticket-form.tsx:296](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L296);
    - a lowercase `p` at [ticket-form.tsx:324](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L324).
  - Placeholders end in a full stop:
    - "Email Address." in [user-login-form.tsx:89](../src/pages/auth/user-login/user-login-form.tsx#L89) and [forgot-password-modal.tsx:111](../src/components/auth/forgot-password-modal.tsx#L111);
    - "Enter event name." in [add-event :174](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L174) and [edit-event :188](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L188);
    - other placeholders, which follow the same pattern.
  - "How invite only tickets works" should be "How invite-only tickets work" ([ticket-notice.tsx:18](../src/pages/creators/tickets/components/ticket-notice.tsx#L18)).
  - **Done 2026-11-13, not committed yet:** the two `lowercase` classes are gone; 21 placeholders lost their full stop (the ticket description's multi-sentence one is left); the "Email Address." placeholders went with the form labels; the notice reads "How invite-only tickets work".

---

## 5. Accessibility


- [x] White event title on the `#ACACAC` card (2.27:1) in [selected-event-card.tsx:33](../src/layouts/creator-dashboard-layout/selected-event-card.tsx#L33). Darken the card so white text reaches at least 4.5:1. White on `#767676` is about 4.5:1; on `#595959`, about 7:1.
- [x] "Choose Your Role" on black (about 2.1:1) in [creators-hub.tsx:27](../src/pages/creators/home/sections/creators-hub.tsx#L27), which uses `text-[#464444]`. Use a light grey such as `#ACACAC`, about 9:1 on black.
- [x] Give the icon-only controls accessible names:
  - **Bell:** [header.tsx:21](../src/layouts/creator-dashboard-layout/header.tsx#L21). It's an image. Make it a `<button aria-label="Notifications">`, or remove it (see 2.9). **Hidden for now**, so this applies when it comes back.
  - **Ticket "…" menu:** [action-popover.tsx:19-23](../src/pages/creators/add-event/component/action-popover.tsx#L19-L23). The trigger needs an `aria-label`, for example "Ticket options". Only the ticket card uses it.
  - **[verify]** **☰:** `SidebarTrigger` already has a hidden "Toggle Sidebar" label ([src/components/ui/sidebar.tsx:273](../src/components/ui/sidebar.tsx#L273)). Check it with VoiceOver.
  - **[verify]** **Avatar button:** [creator-menu-button.tsx](../src/components/reusable/creator-menu-button.tsx) has no `aria-label`. Check it with VoiceOver.
  - **[verify]** **Menu expand toggles:** [base-accordion.tsx](../src/components/reusable/base-accordion.tsx). Each trigger includes its group's text, so the report's claim may not apply. Check it with VoiceOver.
---

## 6. Spec checks to confirm (these may be planned work)

- [ ] **[PO]** **[BE]** Audience Insights shows only Gender, Age groups and Locations ([insights-tab.tsx](../src/pages/creators/realtime/tabs/insights-tab.tsx)). The agreed scope also has traffic sources and a total-unique-buyers summary. The analytics response has no fields for either yet ([src/types/](../src/types/)), so the backend has to add them first.
  - **On `analytics-redesign`:**
    - **Unique buyers:** Audience Insights has a **Buyers** tile, counted from buyers' profiles, and Overview's Orders tile shows "N buyers" from the order list. That may be enough for the unique-buyers summary; the PO should confirm.
    - **Traffic sources:** still missing.
- [ ] **[PO]** The Payout tab should show the next payout date, with automatic payouts every Wednesday and Friday, instead of a Withdraw button. The tab is [creator-payout-tab.tsx](../src/pages/creators/standalone/components/creator-payout-tab.tsx). The next date can be worked out on the frontend.
- [ ] **[PO]** **Door tickets** (already an open to-do):
  - **What exists:** today "Door" is a sales channel inside the ticket form ([sales-channel-field.tsx](../src/pages/creators/add-event/component/sales-channel-field.tsx)), not a choice under Add Tickets ([ticket-format-picker.tsx](../src/pages/creators/add-event/ticket-forms/create/ticket-format-picker.tsx)).
  - **What the PO expects:** a "convert to door ticket" option in the ticket menu (`extraActions` on [action-popover.tsx](../src/pages/creators/add-event/component/action-popover.tsx), via [ticket-summary-card.tsx:146](../src/components/shared/ticket-summary-card.tsx#L146)).
  - **Caveat:** the tested event was private and had ended, which may be why the option didn't show.
- [ ] **[PO]** Analytics Overview repeats the Gender, Age and Towns cards from Audience Insights. Compare [overview-tab.tsx:100-130](../src/pages/creators/realtime/tabs/overview-tab.tsx#L100-L130) with [insights-tab.tsx](../src/pages/creators/realtime/tabs/insights-tab.tsx), and decide whether Overview keeps them.
  - **Still true on `analytics-redesign`.** Overview has Gender, Age Range and Top Locations; Audience Insights has Gender, Age Groups and Locations.
  - If they stay, link each Overview card to Audience Insights. `AnalyticsCard` takes an `action` slot for that.

---

## Found while fixing, not in the report

- [x] **Logged out with "Invalid refresh token or token expired."** Fixed 2026-11-11 (`ed094c5`, corrected in `d20cf00`).
  - **Cause:** the API rotates refresh tokens (each works once). With two tabs open, both refreshed with the same token; the loser got the error and cleared the saved session, logging both out.
  - **Fix:** tabs share one session through `storage` events, and `refreshSession()` ([http.service.ts](../src/services/http.service.ts)) runs once per tab and once across tabs (Web Locks), using the last saved pair.
  - **Checked:** two tabs on dev: one refresh call at the 3-minute mark, and both tabs stayed on the same renewed token.
- **By design, not bugs** (confirmed 2026-11-11):
  - **One active session per user.** A new login revokes the previous session's refresh token, so signing in elsewhere ends the old session within 15 minutes ("Invalid refresh token or token expired."). Scripts or people signing in to the same test account do this too.
  - **Inactive for 15 minutes means logged out.** Once the access token expires without a refresh, the API won't renew it. The app clears the session on load, or on the next request, instead of trying to refresh.

## Seen in the report's screenshots, not called out in the text

- [ ] **[verify]** Page 32: in the settings modal, the **Payout** tab is highlighted while the Change Password / Settings content shows. Check the active-tab styling in [creator-settings-modal.tsx](../src/pages/creators/standalone/components/creator-settings-modal.tsx).
