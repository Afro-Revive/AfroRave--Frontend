# Mobile QA report (10 Nov 2026): task list

Source: *Afrorevive Creators Web — Mobile QA Report* (Nov 10, 2026, @ESE). Tested on afrorevive.com/creators at 375×812.

Each item lists the files to change and a suggested fix. Item numbers match the report. Line numbers come from `ui-fixes` at `c2e4b1e`, which is 7 commits behind `main` (#27/#28, Privacy section). None of those commits touch these files, but merge `main` in first.

Tags:
- **[PO]**: needs a product decision before it can be built.
- **[BE]**: needs the backend.
- **[verify]**: check on dev before changing anything.

---

## Fix first

1. **1.1**: the live site is a development build, and the devtools button covers content.
2. **1.2 / 1.3**: the SF Pro fonts (about 60 MB on disk), three broken font paths, and quoted `"sans-serif"`.
3. **2.1**: the Service Vendor time pickers make the whole page scroll sideways.
4. **3.1**: the visibility rule is stated two opposite ways.
5. **3.3**: the ticket price differs between the list and the form. This may also change saved prices (see 3.3).

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
  - Added `esbuild: { drop: ['console', 'debugger'] }` in [vite.config.ts](../vite.config.ts) (not committed yet).

### 1.2 8.9 MB of fonts per page, and SF Pro licensing
- [x] Fix the three `@font-face` paths that point at missing files. Vercel's catch-all rewrite in [vercel.json](../vercel.json) returns `index.html` for missing files, so these weights fail.
  - [src/styles/fonts.css:209](../src/styles/fonts.css#L209): `SFPro-Light.ttf`. The file on disk is `SFProText-Light.ttf`.
  - [src/styles/fonts.css:233](../src/styles/fonts.css#L233): `SFPro-Semibold.ttf`. The file on disk is `SFProText-Semibold.ttf`.
  - [src/styles/fonts.css:200](../src/styles/fonts.css#L200): `SFMonoBold.otf`. Only `SFMonoBold.woff` exists. The report didn't catch this one.
- [ ] **[PO]** Drop SF Pro. Apple's licence doesn't cover web self-hosting. Design picks the replacement; the report suggests Inter Tight plus at most one display face.
  - **Font declarations:** [src/styles/fonts.css](../src/styles/fonts.css) (all 302 lines are SF `@font-face` blocks), imported from [src/index.css:5](../src/index.css#L5).
  - **Files to delete:**
    - [public/fonts/sf-pro-display/](../public/fonts/sf-pro-display/) (44 MB)
    - `sf-pro-rounded/` (14 MB)
    - `sf-pro-text/` (2.6 MB)
    - `sf-compact-text/`
    - `sf-mono/`
  - **Cheapest path:** repoint the tokens in [src/index.css:199-203](../src/index.css#L199-L203) (`--font-sf-pro-display`, `--font-sf-pro-text`, `--font-sf-pro-rounded`, `--font-sf-compact`, `--font-sf-mono`) to the replacement. The existing classes keep working:
    - `font-sf-pro-display` (76 files)
    - `font-sf-pro-text` (66)
    - `font-sf-pro-rounded` (20)
    - `font-sf-compact` and `font-sf-mono` (1 each)
  - Rename the classes later.
- [x] Trim what's left. **Done 2026-11-11, not committed yet.**
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
  - The other `font-light font-sf-pro-display` text across the app has the same wrong weight. Dropping SF Pro (1.2) removes the problem entirely.

---

## 2. Layout breaks at 375px

### 2.1 Service Vendor: time pickers overflow the screen
- [ ] [create-vendor-slot-modal.tsx:454](../src/pages/vendor/component/create-vendor-slot-modal.tsx#L454): `grid grid-cols-2 gap-4` holds two `TimeForm`s. Stack them on mobile with `grid-cols-1 sm:grid-cols-2`.
- [ ] [src/components/shared/time-form.tsx:30-47](../src/components/shared/time-form.tsx#L30-L47): the `w-full` hour:minute box plus the AM/PM column can't shrink. Add `min-w-0` and let the box shrink. Other forms use this component too, so check those.
- The cut-off "(Optional)" labels are a side effect of the 385px page width. They come back once this is fixed.

### 2.2 Edit Ticket: "Update Ticket" breaks out of its card
- [ ] [ticket-form.tsx:354-379](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L354-L379): both buttons are a fixed `w-[155px]` in a `flex gap-3` row. Use `flex-col sm:flex-row` and `w-full sm:w-[155px]`.
- [ ] **[PO]** In edit mode, "REMOVE TICKET" calls `onCancel`, which only closes the form ([tickets/index.tsx:170](../src/pages/creators/tickets/index.tsx#L170)). It doesn't delete anything. Either relabel it "Cancel", or make it delete. This ties into the Delete/Remove naming row in section 4.

### 2.3 Analytics: event selector cut off
- [ ] [src/pages/creators/realtime/index.tsx:78-92](../src/pages/creators/realtime/index.tsx#L78-L92) (`ChartHeader`): the title, Export and `EventSelect` share one `h-14 px-8` row. On mobile, let it wrap or move the selector to a second row, and use `px-4`.
- [ ] [src/components/shared/vendor-select.tsx](../src/components/shared/vendor-select.tsx) (`EventSelect`; the file name is misleading): give the trigger `max-w-full` and truncate long event names.
- The `analytics-redesign` branch also edits `src/pages/creators/realtime/`. Make this change there, or after that branch merges.

### 2.4 Settings > Account: birthday fields clipped
- [ ] [creator-account-tab.tsx:162-200](../src/pages/creators/standalone/components/creator-account-tab.tsx#L162-L200): `grid grid-cols-4`, where the first cell is just a "Birthday" label box. Move "Birthday" above as a label and use `grid-cols-3` for Month, Day and Year.
- [ ] The fans page uses the same pattern in [src/pages/fans/account/tabs/profile-tab.tsx:187](../src/pages/fans/account/tabs/profile-tab.tsx#L187). Check it at 375px too.

### 2.5 Guestlist table hides Status and actions
- [ ] [event-guestlist-card.tsx:174](../src/pages/creators/guest-list/components/event-guestlist-card.tsx#L174): the table (429px) sits inside `overflow-x-auto` (295px).
  - On mobile, show each guest as a card (name and email, a status chip, the menu), or hide the Category column below `sm`.
  - At minimum, add a scroll cue.
- [ ] Check the same table pattern in:
  - [standalone/guestlist/components/guest-table.tsx](../src/pages/creators/standalone/guestlist/components/guest-table.tsx)
  - [guest-list/components/import-guestlist-card.tsx](../src/pages/creators/guest-list/components/import-guestlist-card.tsx)
  - [audience/components/access-requests-card.tsx](../src/pages/creators/audience/components/access-requests-card.tsx)

### 2.6 Event card crops the flyer
- [ ] [src/components/shared/dashboard-cards.tsx:49](../src/components/shared/dashboard-cards.tsx#L49): a fixed `h-[300px]` with cover cropping. Use the flyer's aspect ratio instead (the one picked in **3.6**), or `object-contain` over a blurred copy.
- [ ] Badges at [dashboard-cards.tsx:72](../src/components/shared/dashboard-cards.tsx#L72) and [:129](../src/components/shared/dashboard-cards.tsx#L129): give them a solid background so they don't sit on flyer text.
- The card is rendered from [standalone/index.tsx:290](../src/pages/creators/standalone/index.tsx#L290).

### 2.7 Edit Ticket opens off-screen, and the menu stays open
- [ ] [tickets/index.tsx:118-122](../src/pages/creators/tickets/index.tsx#L118-L122) (`handleEditTicket`): put a ref on the composer card ([tickets/index.tsx:156](../src/pages/creators/tickets/index.tsx#L156)) and `scrollIntoView({ behavior: 'smooth' })` after the form loads.
- [ ] [src/pages/creators/add-event/component/action-popover.tsx](../src/pages/creators/add-event/component/action-popover.tsx): `BasePopover` is uncontrolled, so the menu stays open after a choice. Make it controlled and close it in `ActionPopoverItem`'s click. It's used by [ticket-summary-card.tsx:146](../src/components/shared/ticket-summary-card.tsx#L146) and the promo and vendor cards.

### 2.8 Custom URL field truncated
- [ ] [src/components/shared/field-with-absolute-text.tsx:31-33](../src/components/shared/field-with-absolute-text.tsx#L31-L33): the prefix takes about 40% of the row. On mobile, stack the prefix above the input or shrink it, and give the input `min-w-0`.
- [ ] Change the prefix text from `afrorevive/events/` to `afrorevive.com/events/`. Event pages are now at the root after the /fans move.
  - [add-event/tabs/event-details-tab.tsx:250](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L250)
  - [edit-event/tabs/event-details-tab.tsx:254](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L254)

### 2.9 Header controls
- [ ] **[PO]** Wire up the bell, or hide it. It's a plain `<img>` in [creator-dashboard-layout/header.tsx:21](../src/layouts/creator-dashboard-layout/header.tsx#L21).
  - The hooks already exist: `useOrganizerNotifications` and `useMarkNotificationAsRead` in [src/hooks/use-profile-mutations.ts:171](../src/hooks/use-profile-mutations.ts#L171).
  - Wiring it up means a button and a dropdown or sheet.
- [ ] Fix the ☰ behaviour in [header.tsx:23-29](../src/layouts/creator-dashboard-layout/header.tsx#L23-L29). When the mobile sidebar is open, the ☰ trigger is swapped for `CreatorMenuButton`, so Settings takes a second tap. Either:
  - keep a close (X) control and show the avatar beside it; or
  - add Settings to the sidebar footer ([creator-side-bar.tsx:176](../src/layouts/creator-dashboard-layout/creator-side-bar.tsx#L176)).

---

## 3. Contradictions in copy, data and logic

### 3.1 Visibility rule stated two opposite ways
- [ ] [add-event/tabs/event-details-tab.tsx:150-153](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L150-L153) says "Public events can be switched to private one time only". That's wrong.
  - Use the agreed rule from [edit-event/tabs/event-details-tab.tsx:169](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L169): private → public at any time, public → private never.

### 3.2 Resale left on while the banner says it's off
- [ ] [ticket-form.tsx:38-47](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L38-L47) turns resell off only for invite-only and group tickets. The form doesn't know the event is private.
  - Add an `isPrivateEvent` prop.
  - Force `allow_ticket_resell` to `false` when it's set.
  - Show `UnavailableNote` instead of the checkbox. The checkbox is at [ticket-form.tsx:300-320](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L300-L320), and the reasons are in `UNAVAILABLE_REASON` (around [ticket-form.tsx:447](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L447)). Add a `private_event` reason.
- [ ] Pass the prop from [tickets/index.tsx:159](../src/pages/creators/tickets/index.tsx#L159), which already knows the event is private (it renders [ticket-notice.tsx:23](../src/pages/creators/tickets/components/ticket-notice.tsx#L23)). Pass it from the add-event tickets step too.
- [ ] **[BE]** Tickets already saved with `allowResell: true` on private events need the backend to enforce this. It's the existing `canResell` / `canTransfer` item. The banner text is in [tickets/constant.ts:17](../src/pages/creators/tickets/constant.ts#L17).

### 3.3 Ticket price differs between the list and the form ⚠️
- [ ] **[verify]** **[BE]**
  - **What each side reads:**
    - The card shows `ticket.basePrice` ([ticket-card.tsx:74](../src/pages/creators/tickets/components/ticket-card.tsx#L74)).
    - The edit form loads `ticket.price` ([tickets/helper.ts:28](../src/pages/creators/tickets/helper.ts#L28)).
    - Create and update send the form's value as `price` ([src/lib/event-transforms.ts:202](../src/lib/event-transforms.ts#L202)).
  - **Why it matters:** 53,000 / 50,000 = 1.06, so `price` looks like the fan price with fees added. If the backend treats the `price` it receives as the organizer's base, every edit-and-save adds the fee again.
  - **How to check:** on dev, open a ticket, save it without changes, and see whether `basePrice` moves.
  - **Likely fix:** load `basePrice` into the form, and label the card so it says which figure it shows.

### 3.4 "Tickets issued" differs between pages
- [ ] **[BE]** Analytics Overview shows `data.totalTicketsIssued` ([overview-tab.tsx:60](../src/pages/creators/realtime/tabs/overview-tab.tsx#L60)), and the backend currently returns capacity there. This is already on the backend list ("totalTicketsIssued equals created").
  - The Tickets page uses `eventStat` ([ticket-summary.tsx:41](../src/pages/creators/tickets/components/ticket-summary.tsx#L41)).
  - Until the backend fix, either relabel it or compute it from sold. This file is also touched on `analytics-redesign`.

### 3.5 Copy pasted into the wrong place
- [ ] Create Event > Contact Details helper ([add-event/tabs/event-details-tab.tsx:314](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L314)): use "Shown on your event page so attendees can reach you.", as Edit Event does.
- [ ] Create Event > Date & Time helper ([add-event/tabs/event-details-tab.tsx:270](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L270)): "Ticket holders will be notified" makes no sense on a new event. Reword it.
- [ ] Service Vendor contact note ([create-vendor-slot-modal.tsx:539](../src/pages/vendor/component/create-vendor-slot-modal.tsx#L539)): "until a revenue vendor successfully pays for a slot" is revenue-only.
  - Branch on `isRevenue`.
  - **[PO]** Supply the copy for service vendors.
- [ ] Service Vendor banner ([vendor-how-it-works.tsx:14](../src/pages/vendor/component/vendor-how-it-works.tsx#L14)): change "How service vendor stalls work" to "How service vendor offers work".
- [ ] Shared description ([create-vendor-slot-modal.tsx:290](../src/pages/vendor/component/create-vendor-slot-modal.tsx#L290)): split it by `isRevenue`, one line for marketplace sellers and one for event services.

### 3.6 Flyer size guidance differs
- [ ] **[PO]** Pick one ratio and use it everywhere, including the card in **2.6**:
  - "550 X 770" (5:7) in [poster-upload-field.tsx:78](../src/pages/creators/add-event/component/poster-upload-field.tsx#L78) and [theme-tab.tsx:229](../src/pages/creators/add-event/tabs/theme-tab.tsx#L229);
  - "Portrait (3:4)" in [poster-image-field.tsx:63](../src/pages/creators/edit-event/component/poster-image-field.tsx#L63).

### 3.7 Wrong empty state on filters
- [ ] [standalone/index.tsx:183-194](../src/pages/creators/standalone/index.tsx#L183-L194) and `EmptyState` ([:210-221](../src/pages/creators/standalone/index.tsx#L210-L221)): when the account has events but the filter is empty, say "No upcoming events" or "No drafts", not "No Events Created". Pass `activeFilter` and `allEvents.length` in.
- [ ] Optional: show `0` on the pills with no events. The counts come from `countEventsByStatus` in [event-filters.tsx:37](../src/pages/creators/standalone/components/event-filters.tsx#L37).

### 3.8 Promo Codes form
- [ ] "Remove promocode" shows on a new, unsaved code. [promo-codes/index.tsx:245](../src/pages/creators/promo-codes/index.tsx#L245) passes `onRemove`, which only resets the form.
  - Don't pass it for a new code, or relabel it "Clear".
  - The button is at [promo-code-form.tsx:268-280](../src/pages/creators/add-event/ticket-forms/promo-code-form/promo-code-form.tsx#L268-L280).
- [ ] The default dates are wrong in [promo-code-schema.ts:96-107](../src/pages/creators/add-event/schemas/promo-code-schema.ts#L96-L107). Both start and end are `new Date()` at 12:00 AM, so the start is already in the past and the end equals the start.
  - Default the start to now.
  - Default the end to the event's end, or the start plus 7 days.
  - Check that the schema rejects an end at or before the start.

### 3.9 Error before input
- [ ] [add-event/tabs/event-details-tab.tsx:91-95](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L91-L95): on mount, `setValue('custom_url', …, { shouldValidate: true })` runs with an empty name, so "URL too short." shows right away. The rule is in [src/schema/edit-event-details.ts:18](../src/schema/edit-event-details.ts#L18).
  - Validate only once the name has text: `shouldValidate: Boolean(eventName)`.

---

## 4. Design-system inconsistencies

Each row needs one rule from design. Agree the rule **[PO]**, then apply it.

- [ ] **Section headings:** the Create and Edit Event pages mix UPPERCASE with Title Case.
  - Uppercase `h2`s: [add-event/tabs/event-details-tab.tsx:147](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L147), [:160](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L160), [:266](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L266).
  - Title Case "Poster Image": [poster-image-field.tsx](../src/pages/creators/edit-event/component/poster-image-field.tsx).
  - Edit Event's section headings: [edit-event/tabs/event-details-tab.tsx](../src/pages/creators/edit-event/tabs/event-details-tab.tsx).
  - Make one heading component.
- [ ] **Primary buttons** (colour, case and placement):
  - red "SAVE": [creator-account-tab.tsx:271](../src/pages/creators/standalone/components/creator-account-tab.tsx#L271);
  - grey or black: [creator-payout-tab.tsx:274](../src/pages/creators/standalone/components/creator-payout-tab.tsx#L274);
  - black "Update Password": [creator-settings-modal.tsx:286](../src/pages/creators/standalone/components/creator-settings-modal.tsx#L286);
  - "SAVE": [edit-tab-children-container.tsx:59](../src/pages/creators/edit-event/component/edit-tab-children-container.tsx#L59) and [promo-codes/index.tsx:194](../src/pages/creators/promo-codes/index.tsx#L194);
  - side by side on Tickets: [ticket-form.tsx:354](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L354);
  - stacked on Promo: [promo-code-form.tsx:268](../src/pages/creators/add-event/ticket-forms/promo-code-form/promo-code-form.tsx#L268);
  - centred pill on Vendors: [create-vendor-slot-modal.tsx](../src/pages/vendor/component/create-vendor-slot-modal.tsx).
  - Add variants to [src/components/ui/button.tsx](../src/components/ui/button.tsx) rather than per-page classes.
- [ ] **Button case:**
  - "UPDATE TICKET" ([ticket-form.tsx:374](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L374));
  - "View Analytics" ([ticket-summary.tsx](../src/pages/creators/tickets/components/ticket-summary.tsx));
  - "copy link" and "view page" ([selected-event-card.tsx:33](../src/layouts/creator-dashboard-layout/selected-event-card.tsx#L33), [:65](../src/layouts/creator-dashboard-layout/selected-event-card.tsx#L65));
  - "preview" ([poster-image-field.tsx:73](../src/pages/creators/edit-event/component/poster-image-field.tsx#L73)).
- [ ] **Off-brand blue:** `bg-tech-blue` on "view page" ([selected-event-card.tsx:62](../src/layouts/creator-dashboard-layout/selected-event-card.tsx#L62)) and "preview" ([poster-image-field.tsx:71](../src/pages/creators/edit-event/component/poster-image-field.tsx#L71)).
- [ ] **Form labels:** labels appear four ways.
  - Uppercase above the field: the shared `FormField` in [src/components/reusable/](../src/components/reusable/) (base-form).
  - Bold Title Case: the Guestlist cards.
  - Inside the box: [settings-inset-field.tsx](../src/pages/creators/standalone/components/settings-inset-field.tsx).
  - Placeholder only: the Change Password inputs in [creator-settings-modal.tsx](../src/pages/creators/standalone/components/creator-settings-modal.tsx).
  - The global label `htmlFor` fix (still pending) belongs with this one.
- [ ] **Forced uppercase inputs:** the name, venue and URL inputs have `className="uppercase"`, so they don't show what was saved.
  - [edit-event/tabs/event-details-tab.tsx:189](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L189), [:224](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L224), [:259](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L259)
  - [add-event/tabs/event-details-tab.tsx:175](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L175)
- [ ] **Naming:**
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
- [ ] **Card gutters:** pick one value. Currently:
  - 16px on Promo ([promo-codes/index.tsx:230](../src/pages/creators/promo-codes/index.tsx#L230) `px-4`);
  - 20px on Tickets ([tickets/index.tsx:146](../src/pages/creators/tickets/index.tsx#L146) `px-5`);
  - 24px on Events ([standalone/index.tsx:176](../src/pages/creators/standalone/index.tsx#L176) `px-6`);
  - the vendor pages, which differ again.
- [ ] **Analytics card titles:**
  - Alignment differs: "Revenue streams" is centred ([overview-tab.tsx:36](../src/pages/creators/realtime/tabs/overview-tab.tsx#L36)), "Top Towns" is left-aligned ([:115](../src/pages/creators/realtime/tabs/overview-tab.tsx#L115)).
  - Wording differs: "Top Age Range" ([:126](../src/pages/creators/realtime/tabs/overview-tab.tsx#L126)) vs "Age groups" ([insights-tab.tsx:30](../src/pages/creators/realtime/tabs/insights-tab.tsx#L30)).
  - The card component is in [src/components/reusable/charts/](../src/components/reusable/charts/).
  - Coordinate with `analytics-redesign`.
- [ ] **Menu drawer:**
  - Child links use the same `px-6` as their parents, which have an icon, so children look less indented ([base-sidebar.tsx:261](../src/components/reusable/base-sidebar.tsx#L261), [:294](../src/components/reusable/base-sidebar.tsx#L294)).
  - The `Plus` icon never changes when a group is open ([base-accordion.tsx:66](../src/components/reusable/base-accordion.tsx#L66)). Rotate it to × or swap it for Minus on `data-state=open`.
  - Analytics > "Tickets" repeats the top-level "Tickets" ([creator-side-bar.tsx:109](../src/layouts/creator-dashboard-layout/creator-side-bar.tsx#L109)). Rename it to something like "Ticket sales".
- [ ] **Choice controls:** Paid/Free ([ticket-form.tsx:85](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L85)) and "Start immediately / Schedule" ([ticket-form.tsx:289](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L289)) are checkboxes, but only one can apply. Use [src/components/ui/radio-group.tsx](../src/components/ui/radio-group.tsx).
- [ ] **Text details:**
  - Helper text is forced lowercase:
    - `descriptionClassName="… lowercase …"` at [ticket-form.tsx:296](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L296);
    - a lowercase `p` at [ticket-form.tsx:324](../src/pages/creators/add-event/ticket-forms/create/ticket-form.tsx#L324).
  - Placeholders end in a full stop:
    - "Email Address." in [user-login-form.tsx:89](../src/pages/auth/user-login/user-login-form.tsx#L89) and [forgot-password-modal.tsx:111](../src/components/auth/forgot-password-modal.tsx#L111);
    - "Enter event name." in [add-event :174](../src/pages/creators/add-event/tabs/event-details-tab.tsx#L174) and [edit-event :188](../src/pages/creators/edit-event/tabs/event-details-tab.tsx#L188);
    - other placeholders, which follow the same pattern.
  - "How invite only tickets works" should be "How invite-only tickets work" ([ticket-notice.tsx:18](../src/pages/creators/tickets/components/ticket-notice.tsx#L18)).

---

## 5. Accessibility

- [ ] White event title on the `#ACACAC` card (2.27:1) in [selected-event-card.tsx:33](../src/layouts/creator-dashboard-layout/selected-event-card.tsx#L33). Darken the card so white text reaches at least 4.5:1. White on `#767676` is about 4.5:1; on `#595959`, about 7:1.
- [ ] "Choose Your Role" on black (about 2.1:1) in [creators-hub.tsx:27](../src/pages/creators/home/sections/creators-hub.tsx#L27), which uses `text-[#464444]`. Use a light grey such as `#ACACAC`, about 9:1 on black.
- [ ] Give the icon-only controls accessible names:
  - **Bell:** [header.tsx:21](../src/layouts/creator-dashboard-layout/header.tsx#L21). It's an image. Make it a `<button aria-label="Notifications">`, or remove it (see 2.9).
  - **Ticket "…" menu:** [action-popover.tsx:19-23](../src/pages/creators/add-event/component/action-popover.tsx#L19-L23). The trigger needs an `aria-label`, for example "Ticket options". The same component serves the promo and vendor cards.
  - **[verify]** **☰:** `SidebarTrigger` already has a hidden "Toggle Sidebar" label ([src/components/ui/sidebar.tsx:273](../src/components/ui/sidebar.tsx#L273)). Check it with VoiceOver.
  - **[verify]** **Avatar button:** [creator-menu-button.tsx](../src/components/reusable/creator-menu-button.tsx) has no `aria-label`. Check it with VoiceOver.
  - **[verify]** **Menu expand toggles:** [base-accordion.tsx](../src/components/reusable/base-accordion.tsx). Each trigger includes its group's text, so the report's claim may not apply. Check it with VoiceOver.

---

## 6. Spec checks to confirm (these may be planned work)

- [ ] **[PO]** **[BE]** Audience Insights shows only Gender, Age groups and Locations ([insights-tab.tsx](../src/pages/creators/realtime/tabs/insights-tab.tsx)). The agreed scope also has traffic sources and a total-unique-buyers summary. The analytics response has no fields for either yet ([src/types/](../src/types/)), so the backend has to add them first.
- [ ] **[PO]** The Payout tab should show the next payout date, with automatic payouts every Wednesday and Friday, instead of a Withdraw button. The tab is [creator-payout-tab.tsx](../src/pages/creators/standalone/components/creator-payout-tab.tsx). The next date can be worked out on the frontend.
- [ ] **[PO]** **Door tickets** (already an open to-do):
  - **What exists:** today "Door" is a sales channel inside the ticket form ([sales-channel-field.tsx](../src/pages/creators/add-event/component/sales-channel-field.tsx)), not a choice under Add Tickets ([ticket-format-picker.tsx](../src/pages/creators/add-event/ticket-forms/create/ticket-format-picker.tsx)).
  - **What the PO expects:** a "convert to door ticket" option in the ticket menu (`extraActions` on [action-popover.tsx](../src/pages/creators/add-event/component/action-popover.tsx), via [ticket-summary-card.tsx:146](../src/components/shared/ticket-summary-card.tsx#L146)).
  - **Caveat:** the tested event was private and had ended, which may be why the option didn't show.
- [ ] **[PO]** Analytics Overview repeats the Gender, Age and Towns cards from Audience Insights. Compare [overview-tab.tsx:100-130](../src/pages/creators/realtime/tabs/overview-tab.tsx#L100-L130) with [insights-tab.tsx](../src/pages/creators/realtime/tabs/insights-tab.tsx), and decide whether Overview keeps them. Coordinate with `analytics-redesign`.

---

## Seen in the report's screenshots, not called out in the text

- [ ] **[verify]** Page 32: in the settings modal, the **Payout** tab is highlighted while the Change Password / Settings content shows. Check the active-tab styling in [creator-settings-modal.tsx](../src/pages/creators/standalone/components/creator-settings-modal.tsx).
