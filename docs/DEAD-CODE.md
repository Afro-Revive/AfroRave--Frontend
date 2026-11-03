# Dead Code

Files in `src/` that the running app never loads, grouped by why they're dead,
with a recommendation for each group.

Checked on the `prod` branch, October 2026. **55 dead files** in total.

---

## How this list was made

Two separate checks, and both found exactly the same 55 files:

1. **[knip](https://knip.dev)**, a dead-code finder. It starts at the app's entry point and follows real TypeScript imports.
2. **An import-graph walk** from `src/main.tsx`. It follows every `import`, every lazy-loaded page (`lazy(() => import(…))`) and every re-export, and ignores imports that are commented out.

A file only counts as dead if **nothing reachable from the app imports it**.
Tests, test setup and `vite-env.d.ts` are left out: Jest and TypeScript load
those directly.

To check again later:

```bash
npx knip --include files
```

---

## Summary

| Group | Files | Recommendation |
|---|---|---|
| [A. Removed features](#a-removed-features) | 11 | Delete |
| [B. Replaced by a newer design](#b-replaced-by-a-newer-design) | 21 | Delete |
| [C. Old helpers, mock data and schemas](#c-old-helpers-mock-data-and-schemas) | 9 | Delete |
| [D. Unused UI building blocks](#d-unused-ui-building-blocks) | 4 | Delete, or keep if you plan to use them |
| [E. Parked until the backend is ready](#e-parked-until-the-backend-is-ready) | 3 | **Keep** |
| [F. Vendor files](#f-vendor-files--check-on-the-vendors-branch) | 7 | **Don't touch here.** Check on `vendors` |

---

## A. Removed features

These belonged to features that have been taken out.

| File | What it was |
|---|---|
| `pages/creators/add-event/tabs/theme-tab.tsx` | The theme step of create event, removed in October 2026. |
| `pages/creators/add-event/ticket-forms/upgrade-form.tsx` | Ticket upgrades, removed in July 2026. |
| `pages/creators/add-event/schemas/upgrade-schema.ts` | Validation for the upgrade form. |
| `pages/creators/add-event/schemas/vendor-slot-schema.ts` | Validation for the vendor step of create event, removed in September 2026. |
| `pages/creators/add-event/ticket-forms/create/confirmation-mail-form.tsx` | "Send test confirmation email" form. Its only use is commented out. |
| `pages/creators/add-event/ticket-forms/create/ticket-modal.tsx` | Old "choose a ticket type" modal. Replaced by the inline `ticket-format-picker.tsx`. |
| `pages/creators/add-event/component/add-event-modal.tsx` | Old "add a ticket or vendor slot" modal for picking a ticket format or vendor type. Replaced by the inline format picker; vendor slots moved to the Vendor pages. |
| `pages/creators/add-event/component/create-button.tsx` | Button from the first create-event design. |
| `pages/creators/add-event/component/form-count.tsx` | "Ticket 1, Ticket 2…" label from the first create-event design. |
| `pages/creators/add-event/component/skip-btn.tsx` | "Skip" button from the first create-event design. |
| `pages/creators/standalone/components/standalone-modal.tsx` | Old event-summary modal on the dashboard. Replaced by the event card and sidebar. |

## B. Replaced by a newer design

Older versions of screens that still exist in a redesigned form.

**Fan home and website**

| File | Replaced by |
|---|---|
| `pages/landing-page/home/header.tsx` | The root layout header. |
| `pages/landing-page/home/hero.tsx` | `HeroSection` inside `home/index.tsx` (September 2026 redesign). |
| `pages/landing-page/home/own-the-stage.tsx` | `BecomeCreatorSection` inside `home/index.tsx`. |
| `pages/landing-page/home/socials.tsx` | `layouts/components/socials.tsx`. |
| `components/afro-carousel.tsx` | Nothing. An image carousel from the first fan pages that no page imports any more. |
| `pages/landing-page/creators/index.tsx` | The creators website (`pages/creators/home`, at `/home`). |
| `pages/landing-page/faq/index.tsx` | `pages/support/faq` (the FAQ route uses that one). |
| `pages/landing-page/event-page/individual-event/sections/terms.tsx` | Nothing. The terms section is commented out of the event page. |

**Support**

| File | Replaced by |
|---|---|
| `pages/support/support-center.tsx` | The contact form in `support/index.tsx` (September 2026). |

**Fan account**

| File | Replaced by |
|---|---|
| `pages/fans/account/tabs/payout-tab.tsx` | The wallet tab's withdraw modal. |
| `pages/fans/account/tabs/support-tab.tsx` | `/fans/support`. |
| `hooks/use-account-tabs.tsx` | The `?account=` switch in `fans/account/index.tsx`. |
| `pages/fans/account/components/account-input.tsx` | The inset-label fields in `profile-tab.tsx`. |
| `pages/fans/account/components/transaction-details-modal.tsx` | Nothing. The wallet no longer opens transaction details. |
| `pages/fans/account/constants.ts` | Nothing. The file is empty. |
| `pages/fans/account/fan-account.css` | Tailwind classes. Nothing imports this stylesheet. |
| `pages/fans/account/tabs/profile-dropdown-styles.css` | Tailwind classes. Nothing imports this stylesheet. |
| `pages/fans/listed-tickets/listed-tickets-tab/active.tsx`, `expired.tsx`, `sold.tsx` (3 files) | The single list in `listed-tickets/index.tsx`. |
| `layouts/user-dashboard-layout/mobile-sidebar.tsx` | The header's slide-out menu (`root-layout/header/sidebar-menu.tsx`). |

## C. Old helpers, mock data and schemas

| File | Why it's dead |
|---|---|
| `lib/cookies.ts` | The session moved to `localStorage` (`useAfroStore`). Nothing reads cookies now. |
| `hooks/use-auth-store.ts` | An early `useAuth`. Replaced by `contexts/auth-context.tsx` and `useAfroStore`. |
| `components/auth/index.ts` | An index file nothing imports. Everyone imports the guards directly. |
| `lib/geocode.ts` | Turned addresses into map points. The Google Maps embed now takes the address directly. |
| `lib/fake-data-generator.tsx` | Fake event and ticket data. Mock data was removed in August 2026, and its only imports are commented out. |
| `data/promo-code.ts` | Mock promo codes from the first build. |
| `schema/payout-schema.ts` | Validation for the dead payout tab. |
| `schema/support-schema.ts` | Validation for the dead support tab. |
| `types/leaflet.d.ts` | Types for Leaflet maps, replaced by Google Maps in June 2026. See [Leftovers](#leftovers-inside-files-that-are-used). |

## D. Unused UI building blocks

Generic components nothing uses yet. Deleting them is safe. Keep them only if a
design you're about to build needs them; the shadcn ones can be re-added with
the CLI anyway.

| File | What it is |
|---|---|
| `components/ui/radio-group.tsx` | shadcn radio group. |
| `components/ui/switch.tsx` | shadcn toggle switch. |
| `components/reusable/base-radio-group.tsx` | Project wrapper around the radio group. |
| `components/reusable/base-tab.tsx` | Old tabs wrapper. Pages use `ui/tabs` and `BaseAnimatedTab`. |

## E. Parked until the backend is ready

**Keep these.** The resale marketplace was switched off in July 2026 until the
API can list every resale ticket. Its routes are commented out in
`src/config/routes.tsx`.

| File |
|---|
| `pages/landing-page/resale-marketplace/index.tsx` |
| `pages/landing-page/resale-marketplace/individual-resale-event/index.tsx` |
| `pages/landing-page/resale-marketplace/individual-resale-event/resale-event-details.tsx` |

## F. Vendor files — check on the `vendors` branch

Vendor work happens on the `vendors` branch. These files are unused on `prod`,
but they may be in use, or already deleted, on `vendors`. **Don't delete them
here.** Check them again after `vendors` is merged.

| File | Notes |
|---|---|
| `components/auth/vendor-auth-guard.tsx` | Vendor routes don't use a guard on `prod`. |
| `components/vendor/vendor-success-overlay.tsx` | Success screen from the vendor registration callout. |
| `pages/auth/sign-up/business-signup-form.tsx` | Old organizer/vendor sign-up. Replaced by the general sign-up in June 2026. |
| `pages/auth/sign-up/vendor-signup-form.tsx` | Old vendor sign-up. |
| `pages/vendor/component/back-btn.tsx` | Back button for vendor pages. |
| `data/services.ts`, `data/slots.ts` (2 files) | Mock vendor services and slots. |

---

## Leftovers inside files that are used

These aren't dead files, just dead lines inside live ones, worth clearing at
the same time:

| Where | Leftover |
|---|---|
| `src/index.css` | `@import "leaflet/dist/leaflet.css"`. Every page loads Leaflet's styles, but no map uses Leaflet any more. |
| `vite.config.ts` | `manualChunks` still lists `leaflet`, `react-leaflet`, `vaul` and `@radix-ui/react-radio-group`, which the app doesn't use. |
| `src/config/route-map.ts` | `RouteParams` still has a `charts` key for a route that no longer exists. |
| `src/config/creator-dashboard-routes.tsx` | `/creators/season` and `/creators/reports` are still registered. Both are "Coming Soon" pages that nothing links to. |
| `src/config/routes.tsx`, `creators-landing-page-routes.tsx` | Commented-out imports and routes (the resale marketplace and the old creators landing page). |

---

## Packages

### Unused

`knip` also checks `package.json`. The packages below are installed but never
imported, and each one has been confirmed by hand. Remove them with
`yarn remove <name>`.

| Package | Why it's unused |
|---|---|
| `@faker-js/faker` | Only the dead `fake-data-generator.tsx` imports it. |
| `@radix-ui/react-radio-group` | Only the dead `ui/radio-group.tsx` imports it. |
| `react-leaflet` (and `leaflet`, once the CSS import above is gone) | The map now uses Google Maps. |
| `vaul` | No drawer component uses it. |
| `@fontsource-variable/inter` | Never imported. Inter is loaded from `public/fonts`. |
| `radix-ui` | Never imported. Components use the individual `@radix-ui/react-*` packages. |
| `shadcn` | The shadcn CLI. Run it with `npx shadcn` instead of installing it as an app dependency. |

`knip` also flags the Babel presets, `babel-plugin-transform-vite-meta-env` and
`@biomejs/biome`. Those are used: the Babel ones by `jest.config.cjs` and Biome
by `biome.json`. **Keep them.**

### Used but not listed

These are imported in the code but not listed in `package.json`. They only work
because another package installs them, so they could break without warning on
an upgrade:

| Imported as | Comes in through | Fix |
|---|---|---|
| `framer-motion` (9 files) | `motion` | Import from `motion/react` instead. |
| `react-router` (`auth-modal.tsx`) | `react-router-dom` | Import from `react-router-dom`, like everywhere else. |
| `@radix-ui/react-visually-hidden` (`base-modal.tsx`) | Other Radix packages | Add it to `package.json`. |
