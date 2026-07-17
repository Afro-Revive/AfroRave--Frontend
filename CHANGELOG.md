# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Debounce on promo code validation** (`src/pages/fans/account/components/promo-code.tsx`): `handleValidatePromocode` now debounces 600ms via a `useRef` timeout (cleared on each keystroke and on unmount) before firing `useValidatePromocode`, instead of validating on every change event.
- **Promo code discount wired to checkout total** (`promo-code.tsx`, `src/pages/landing-page/checkout/sections/checkout-summary.tsx`, `src/pages/fans/account/components/totalPrice-accordion.tsx`): `PromoCode` now accepts an `onApply(discount: PromoDiscount | null)` callback, called with `{ discountAmount, discountType, discountValue }` on a valid code and `null` on invalid/cleared/error. `CheckoutSummary` holds the discount as local (non-persisted — a stale discount shouldn't outlive a cart-quantity change) state and passes it to `TotalAccordion`, which now shows the original ticket price and total struck through next to the discounted figures, plus a "Discount (X% OFF / ₦X OFF)" line.
- **Applied promo code shown inside the input** (`promo-code.tsx`): Once a code validates, the input becomes read-only and displays `{code} · {discount} OFF` in place of the raw typed text, with a small `X` button to clear it (resets code, message, validity, `promoCodeId`, and calls `onApply(null)`) so the user can enter a different code.
- **`ApiErrorResponse` type** (`src/types/api.ts`): `{ message, status, statusCode }` — shape of a failed (non-2xx) API response body, used to type `AxiosError` generics.

### Fixed
- **Promo code validation crash on success** (`promo-code.tsx`, `src/types/cart.ts`, `src/hooks/use-cart.ts`): `ValidatePromocodeData` had an accidental extra `data` wrapper — it modeled itself as the full response envelope (`message`/`data`/`cursor`/`id`/`status`/`statusCode`) but was then wrapped again in `ApiResponse<ValidatePromocodeData>`, adding a third nesting layer that doesn't exist in the real API response. This threw inside `onSuccess` at `payload.data.isValid` (`payload.data` was `undefined`) right after `setMessage` ran, so a *successful* validation silently failed to update `isValid`/`promoCodeId`/discount state. Fixed by extracting the flat result as `PromoValidationResult`, changing `ValidatePromocodeResponse` to `ValidatePromocodeData` directly (dropping the extra `ApiResponse` wrap), and reading fields directly off `payload` (`payload.isValid`, `payload.promoCodeId`, etc.) instead of `payload.data.*`. Supersedes the earlier "Promo code validation response fix" entry below, which described the now-removed double-nesting as the intended shape.
- **`onError` error typing** (`src/hooks/use-cart.ts`): `useValidatePromocode` now types its mutation as `useMutation<ValidatePromocodeResponse, AxiosError<ApiErrorResponse>, ...>` instead of the default `Error`, so `error.response?.data?.message` in `promo-code.tsx`'s `onError` typechecks correctly instead of failing with "Property 'response' does not exist on type 'Error'".

### Added
- **Withdraw funds modal** (`src/pages/fans/account/components/withdraw-funds-modal.tsx`): Added bank account verification flow to the withdraw modal. Fetches Nigerian banks via `useGetNigerianBanks` on modal open and populates a `BaseSelect` dropdown (keyed by `bank.slug`, value is `bank.code`). Account number input (numeric, max 10 digits) debounces 400ms then calls `ticketService.verifyBankAccount` only when exactly 10 digits are entered and a bank is selected. Shows a spinner while verifying, the resolved account name in green on success, and "Account not found" on error. Confirm button disabled until amount is valid and bank account is verified. All state resets on close.
- **`titleClassName` prop on `BaseModal`** (`src/components/reusable/base-modal.tsx`): Added optional `titleClassName` to `CustomModalProps` and destructured it into the component, applied to the `DialogHeader` via `cn`.

### Changed
- **Wallet tab loading guard** (`src/pages/fans/account/tabs/wallet-tab.tsx`): `isLoading` guard now returns the `LoadingFallback` (was missing `return`). `availableBalance` no longer defaults to `0` at the variable level — `?? 0` applied only at the two call sites so `₦0` is never rendered while data is loading.

### Added
- **Ticket resale modal** (`src/pages/fans/tickets-resale/modals/ticket-resale.tsx`): Three-step flow — select tickets → set prices → price picker — within a single Radix Dialog to avoid the focus-trap issue with nested dialogs. Users can select multiple ticket types with per-type quantities capped at 3 total across all types. Price picker uses ChevronLeft/ChevronRight to step ±₦1,000, seeded from the ticket's original price on first open and persisting changes across re-opens. Fee breakdown (service fee + payout) shown inline on each ticket card once a price is set. "List for Sale" button disabled until all selected tickets have a price set; shows "Listing..." and stays disabled while the request is in-flight.
- **`TransformedTicket` component** (`src/pages/fans/my-tickets/components/transformed-ticket-icon.tsx`): Lucide `Ticket` icon rotated 180° with configurable `color` (required) and `size` (optional, default `16`) props. Used in the resale modal's price step to represent listed tickets.
- **`useTicketResale` hook** (`src/hooks/use-tickets-mutations.ts`): `useMutation` that calls `ticketService.resellTickets(TicketResaleRequest[])`. Accepts an array so all ticket types are submitted in a single request (atomic — backend either lists all or none). Shows success/error toasts via `onSuccess`/`onError`.
- **`TicketResaleRequest` type** (`src/types/ticket.ts`): `{ ticketId: string; quantity: number; price: number }`.
- **`ticketService.resellTickets`** (`src/services/tickets.service.ts`): `POST /api/profile/user/ticket/resale/list` accepting `TicketResaleRequest[]`.

### Added
- **Ticket transfer modal** (`src/pages/fans/my-tickets/tickets-transfer/index.tsx`): Two-step flow — select tickets → enter recipient emails — within a single Radix Dialog. Ticket cards show quantity selector (same cap of 3 total) without price. Email step shows one input per selected ticket; each input debounces 600ms after the user stops typing, fires `ticketService.verifyTransferRecipient` only when the value passes email regex validation, and shows a spinner while verifying, the recipient's name on success, or an error message on failure. "Send" button stays disabled until all tickets have a verified recipient. Resets all state on close.
- **`TicketTransferRequest` type** (`src/types/ticket.ts`): `{ ticketId: string; quantity: number; recipientIdentifier: string }`.
- **`VerifyTransferRecipient` / `VerifyTransferRecipientResponse` types** (`src/types/ticket.ts`): Response shape for the verify endpoint — `{ userId, firstName, lastName, email, phoneNumber }`.
- **`ticketService.verifyTransferRecipient`** (`src/services/tickets.service.ts`): `GET /api/Profile/user/ticket/transfer/verify-recipient?recipientIdentifier=` — checks whether a recipient account exists before transfer.
- **`ticketService.transferTickets`** (`src/services/tickets.service.ts`): `POST /api/Profile/user/ticket/transfer` accepting `TicketTransferRequest[]`. Returns `ApiResponse<null>` so the response `message` is available to the caller.
- **`useTransferTickets` hook** (`src/hooks/use-tickets-mutations.ts`): `useMutation` wrapping `ticketService.transferTickets`. `onSuccess` toasts `data.message` from the API response.
- **`useVerifyTransferRecipient` hook** (`src/hooks/use-tickets-mutations.ts`): `useMutation` wrapping `ticketService.verifyTransferRecipient` for use cases that need mutation lifecycle state.

### Changed
- **`OtherActions` refactored** (`src/pages/fans/my-tickets/individual-active-tickets/index.tsx`): `actions` array moved inside the component so each item holds its handler directly (`action: onSell / onTransfer / onUpgrade`). All three render as `<button>` elements. `otherActionProps` interface added with `onSell`, `onTransfer`, `onUpgrade`. TRANSFER wired to `TicketTransferModal` via `transferOpen` state.
- **SELL action wired to resale modal** (`src/pages/fans/my-tickets/individual-active-tickets/index.tsx`): SELL card now renders as a `<button>`. Clicking opens `TicketResaleModal` via `resaleOpen` state.

### Added
- **Payment confirmation page** (`src/pages/landing-page/payment-confirmation/index.tsx`): New standalone page (no navbar/layout) that Paystack redirects to after checkout via `callbackUrl`. Reads `reference`/`trxref` query params from the URL. On mount, fires `useProcessCheckout` to confirm the order with the backend. Shows a loading spinner while pending, a success state ("Thank You For Your Purchase!") with "Back to Events" and "View Tickets" CTAs on success, and an error state ("An Error Occurred") with a "Try Again" button on failure. Redirects to events if the reference param is missing.
- **`payment_confirmation` route** (`src/config/route-map.ts`, `src/application.tsx`): Added `/fans/payment-confirmation` to `ROUTE_PATHS` and `RouteParams`. Registered as a standalone `<Route>` in `application.tsx` with no layout wrapper, so the navbar is not rendered.
- **`useProcessCheckout` hook** (`src/hooks/use-cart.ts`): New mutation that calls `cartService.processCheckout(data)` with `paymentMethod`, `promoCodeId`, and `transactionReference`. Used by the payment confirmation page to finalise the order after Paystack redirect.

### Changed
- **Paystack callback URL** (`checkout-summary.tsx`): Changed from hardcoded `http://localhost:5173/fans` to `${window.location.origin}/fans/payment-confirmation`, so the redirect works correctly across dev, staging, and production environments.

### Fixed
- **`BaseModal` confirm overlay flashing on open** (`src/components/reusable/base-modal.tsx`): Replaced `useEffect` with `useLayoutEffect` to reset `showConfirm` whenever `open` changes. `useLayoutEffect` fires synchronously before the browser paints, so even if `showConfirm` was set to `true` in the same React batch as `open` becoming `true`, it is zeroed out before the user sees it. Also resets on `open → true` (not just `open → false`) so every modal open cycle starts with a clean confirm state.

### Added
- **Google Maps embed on event location** (`src/pages/landing-page/event-page/event-location.tsx`): Replaced react-leaflet `MapContainer`/`TileLayer`/`Marker` with a Google Maps `<iframe>` embed. Both the embed URL and the "Open in Maps" link are now derived synchronously from `event_location` via `encodeURIComponent` — no async geocoding or API key required. Removed all leaflet imports and the `createCustomIcon` helper.
- **`toGoogleMapsUrl` and `locationToGoogleMapsUrl` utilities** (`src/lib/geocode.ts`): Added `toGoogleMapsUrl(lat, lon)` that returns a `google.com/maps?q=` URL from coordinates, and `locationToGoogleMapsUrl(location)` that geocodes a string via Nominatim and returns the Maps URL in one call.

### Added
- **Pagination cast pattern applied across pages**: All list endpoints now cast `response?.data` to `PaginatedResponse<ItemType> | undefined` and access `.items` for the array; single-item endpoints cast directly to the data type. `PaginatedResponse` is imported from `@/types/api` (not re-exported from `@/types`). Plain-array endpoints (e.g. vendor available events) cast to `Array<ItemType> | undefined` directly. Response types for list endpoints use the singular item type (`ApiResponse<EventData>` not `ApiResponse<EventData[]>`) so `items` resolves to `T[]` not `T[][]`.
- **Promo code validation response fix** (`src/pages/fans/account/components/promo-code.tsx`): Cast `data.data` to `ValidatePromocodeData` before accessing `.data.isValid` — the type has a nested `data` object with the validity flag, not a top-level `isValid`.
- **Business Details section shown for both Organizer and Vendor** (`complete-profile/index.tsx`): Fixed `userAccountType === "Organizer" || (userAccountType === "Vendor" && <JSX>)` — `||` short-circuited to boolean `true` for Organizer, rendering nothing. Changed to `(userAccountType === "Organizer" || userAccountType === "Vendor") && <JSX>`.
- **`formState` destructuring fix** (`complete-profile/index.tsx`): `useForm` returns the form object directly — `{ form, ... } = useForm()` is invalid. Fixed to `const form = useForm()` with `const { formState: { errors, isSubmitting }, watch, setValue } = form` on the next line.
- **Numeric month values on Complete Profile birthday select** (`src/pages/fans/complete-profile/index.tsx`): Replaced `date_list.items` (which used abbreviation values like `"jan"`) with a local `months` array using zero-padded numeric values (`"01"`–`"12"`). Labels remain full month names. `dateOfBirth` is now built correctly as `YYYY-MM-DD` without a separate conversion step.
- **Error messages on Complete Profile fields** (`src/pages/fans/complete-profile/index.tsx`): Added `showMessage` to all `FormField` components (companyName, companyWebsite, gender, birthday month/day/year, country, state, phone). Category error already displayed via manual `errors.category.message`.
- **`https://` validation on `companyWebsite`** (`src/pages/fans/complete-profile/zod-schema.ts`): Added `.refine` that rejects values not starting with `https://`; field stays optional so validation only fires when a value is entered.
- **First name and last name read-only from local store** (`complete-profile/index.tsx`): Replaced profile API call with `useAuth()` store; first/last name displayed from `user.profile.firstName` / `user.profile.lastName`, email from `user.email`. No network request needed for the read-only section.
- **Complete profile route moved to top-level** (`src/config/route-map.ts`): Changed from `/fans/complete-profile` to `/complete-profile` so the page is reachable regardless of account type.
- **Organizer signup now redirects to fans account** (`src/hooks/use-auth.ts`): `useRegisterOrganizer` `onSuccess` now navigates to `getRoutePath('account')` instead of `getRoutePath('standalone')`.
- **Token refresh fires 3 minutes before expiry** (`src/hooks/use-token-refresh.ts`): `REFRESH_BEFORE_MS` changed from `60 * 1000` to `3 * 60 * 1000` so the refresh request goes out with more buffer time before the access token actually expires.
- **Pagination type system** (`src/types/api.ts`, `src/types/event.ts`): Added `PaginatedResponse<T>` interface (`items`, `pageNumber`, `pageSize`, `totalCount`, `totalPages`, `hasPrevious`, `hasNext`). `ApiResponse.data` updated to union `PaginatedResponse<T> | T`. All list response types updated to use singular item type (`ApiResponse<EventData>` instead of `ApiResponse<EventData[]>`) so `PaginatedResponse<T>.items` resolves to `T[]` not `T[][]`. Consumers cast `response.data as PaginatedResponse<ItemType>` and access `.items`.

### Added
- **`monthNumberToName` utility** (`src/lib/helper-func.ts`): Converts a month number to a 3-letter lowercase month code (e.g. `6` → `"jun"`) matching `date_list.items` values used in birthday selects. Used in `profile-transforms.ts` to correctly map `dateOfBirth.getMonth() + 1` to the select's value format.
- **Inset/floating label pattern on fan profile tab** (`src/pages/fans/account/tabs/profile-tab.tsx`): All form fields now show the field label inside the input at the top (`position: absolute`, `top-[10px]`), with the value text pushed to the bottom via `pt-6` on inputs and `items-end` on selects. Applied to First Name, Last Name, Email, Gender, Birthday (Month/Day/Year), Country, State, and Phone Number.
- **Birthday row layout** (`profile-tab.tsx`): Birthday rendered as a 4-column grid — a static "Birthday" label box on the left and Month, Day, Year selects on the same horizontal line, each with inset labels.
- **Disabled password field** (`profile-tab.tsx`): Password field rendered as a non-interactive display — `disabled`, `tabIndex={-1}`, `pointer-events-none`, muted grey background (`bg-[#595959]`) and grey label/text to communicate it is not editable on this screen.
- **`valueClassName` prop** (`src/components/reusable/base-select.tsx`): Added optional `valueClassName` to `ICustomSelectProps` for future styling of the selected value span.
- **`CompleteProfileRequest` type** (`src/types/profile.ts`): Added interface covering all fields needed for profile completion — `token`, `firstName`, `lastName`, `country`, `dateOfBirth`, `gender`, `telephone`, `website`, `businessName`, `vendorType`, `category`, `portfolio`, `socials`, `companyName`.
- **Complete Profile page** (`src/pages/fans/complete-profile/index.tsx`): New standalone page (no layout, no auth guard) accessible only via `?token=` query param from an email link. Redirects to home if token is missing or if the profile fetch returns a 401. Displays User Information (First Name, Last Name, Email, Password) as read-only greyed fields populated from `useUserProfile`. Personal Details (Gender, Birthday, Country, State, Phone) are editable `FormBase`/`FormField` fields pre-populated from the same endpoint, with a Save button that calls `useUpdateUserProfile`.
- **`complete_profile` route** (`src/config/route-map.ts`, `src/application.tsx`): Added `/fans/complete-profile` to `ROUTE_PATHS` and `RouteParams` (`never` — token is a query param, not a path segment). Registered as a standalone `<Route>` in `application.tsx` with no layout wrapper or auth guard.

### Changed
- **`SelectTrigger` default alignment** (`src/components/ui/select.tsx`): Changed `items-center` to `items-end` so the selected value text aligns to the bottom of the trigger, matching the inset label layout. `ChevronDownIcon` uses `self-center` to remain vertically centred regardless.
- **Sidebar nav divider lines** (`src/layouts/user-dashboard-layout/sidebar.tsx`): Divider elements moved outside the `<button>` into the wrapper `<div>` with `ml-[60px]` to align with the icon position (matching the button's `padding-left: 60px`). Removed `flex-col items-start` from buttons.
- **`BaseSelect` dropdown item styling** (`src/components/reusable/base-select.tsx`): Removed red `data-[highlighted]:!bg-[#AE2323]` highlight from `type="others"` items. Removed checkmark SVG via `[&>span:first-child]:hidden` and reclaimed reserved padding with `!pr-2`. Active item background now uses `focus:!bg-white/10` to match the hover style.

### Added
- **Token refresh system**: Proactive JWT refresh before expiry and automatic session cleanup on expiry or 401.
  - **`src/lib/token.ts`**: `decodeTokenExpiry(token)` decodes the `exp` claim from a JWT payload (returns Unix seconds). `isTokenExpired(token)` returns `true` if the token is malformed or `Date.now() >= exp * 1000`.
  - **`src/hooks/use-token-refresh.ts`**: `useTokenRefresh` hook mounted globally in `AppRoutes`. Calculates `delay = tokenExpiry * 1000 - 60000 - Date.now()` and schedules a `setTimeout` to fire 1 minute before expiry. On fire: calls `authService.refreshToken({ accessToken, refreshToken })`; on success stores new tokens via `setTokens` and reschedules; on failure calls `clearAuth()` which triggers `AuthGuard` to redirect.
  - **`stores/index.ts`**: Added `refreshToken`, `tokenExpiry` fields; `setAuth` now accepts optional `refreshToken`; new `setTokens(token, refreshToken)` action updates both and persists to localStorage; `clearAuth` wipes both; `getInitialState` clears stored auth if the persisted token is already expired on page load.
  - **`services/auth.service.ts`**: Added `refreshToken({ accessToken, refreshToken })` calling `POST /api/Auth/refresh`.
  - **`services/http.service.ts`**: Request interceptor calls `clearAuth()` and rejects the request if the stored token is already expired before sending. Response interceptor calls `clearAuth()` on any `401` response.
  - **`types/auth.ts`**: Added `RefreshTokenResponse` type `{ message, token, refreshToken }`; added `refreshToken?` to `LoginResponse` and `AuthResponse`.
- **`useSyncCartToServer` hook** (`use-cart.ts`): New mutation that calls `POST /api/cart/sync` with all local store items when an authenticated user clicks Continue in the cart. Server-side cart is only created at this point, not during browsing.
- **`daysUntilEvent` utility** (`src/lib/helper-func.ts`): Returns the number of calendar days between today and an event's start date using `differenceInCalendarDays` from date-fns.
- **`BaseModal` confirm-close overlay** (`base-modal.tsx`): Added `confirmClose` prop that intercepts close attempts (X button, Escape, overlay click) and renders an absolute-positioned confirmation card on top of the modal instead of closing immediately. Configurable via `confirmCloseTitle`, `confirmCloseMessage`, `confirmCloseConfirmText`, `confirmCloseCancelText`. Includes an X icon to dismiss the overlay without closing the modal. Applied to both the cart modal and checkout modal in `cart/index.tsx`.
- **`TotalAccordion` component** (`src/pages/fans/account/components/totalPrice-accordion.tsx`): Collapsible total price breakdown showing ticket subtotal and service fee in the content, with TOTAL + price in the trigger and auto-appended chevron.
- **`PromoCode` component** (`src/pages/fans/account/components/promo-code.tsx`): Extracted standalone reusable promo code component with typed `cartItems`, `totalPrice`, and `totalQuantity` props.
- **`CheckoutSummary` component** (`src/pages/landing-page/checkout/sections/checkout-summary.tsx`): New component replacing the old `cart-summary` in the checkout flow, matching updated Figma. Layout: desktop flex-row with event details + order summary on the left and event image on the right; mobile stacks event details → image → order summary.
- **Inter font** added to project (`src/styles/fonts.css`, `public/fonts/inter/`): Variable font files for Inter Regular and Italic; registered as `font-inter` in CSS.
- Initial Changelog creation.
- `formatTimeLong`, `formatDateLong`, `formatTimezone` utility functions added to `src/lib/helper-func.ts` for consistent event time and timezone display (e.g. `+1` → `WAT`).
- `PromoCode` extracted into a standalone reusable component (`src/components/reusable/promo-code.tsx`) with typed `cartItems`, `totalPrice`, and `totalQuantity` props — replaces inline promo code logic in both cart-container and cart-summary.
- `TotalAccordion` component: collapsible total price breakdown showing ticket subtotal and service fee, with TOTAL + price in the trigger and line-by-line breakdown in the content.
- Full-screen login step on mobile checkout for unauthenticated users: cart summary hidden on mobile until authenticated, login form takes full screen width.
- 10-minute countdown timer on checkout login screen (`useCountdown` hook using `setInterval`).
- `isSyncingCart` flag to `useCartStore` for tracking post-login cart sync state (excluded from localStorage persistence).

### Fixed
- **Cart close button now clears local cart** (`cart/index.tsx`): `onClose` on the cart and checkout modals calls `clearCart()` before closing, so confirming exit wipes the local store & server store (if authenticated)

### Changed
- **Cart architecture — local store as single source of truth**: All cart mutations (`useCreateCart`, `useDeleteCart`, `useUpdateCartQuantity`) now always write to `useCartStore` regardless of auth state. Server cart is only created when an authenticated user clicks Continue (`useSyncCartToServer`). Unauthenticated flow is unchanged.
- **`useGetAllCart` always reads from local store**: Removed the server fetch branch — all consumers (cart-container, tickets, checkout-summary) read from `useCartStore` directly, with ticket names/prices enriched via `useGetEventTickets`.
- **`cart-container.tsx`**: Removed auth branching; always derives `cartItems` from local store. Added `isLoading` prop that disables and shows a spinner on the Continue button during server sync.
- **`tickets.tsx` `TicketCard`**: `ticketCount` always read from `useCartStore`; `cartId` is always `ticketId`. Removed `useGetAllCart`, `useAfroStore`, and `CartData` imports.
- **`checkout-summary.tsx`**: `cartItems` always derived from local store + `useGetEventTickets` enrichment; auth branching removed. Countdown timer only rendered for authenticated users (server cart can expire; local-only carts cannot).
- **`useLogin` cart sync simplified** (`use-auth.ts`): Replaced per-item `Promise.allSettled` with a single `cartService.syncCart` call. Local store is **no longer cleared** after login sync so checkout-summary can still read items for display.
- **`useClearCart`** (`use-cart.ts`): Now also calls `useCartStore.clearLocal()` after the server clear. Only calls the server when the user is authenticated.

### Fixed
- **Business signup form not submitting** (`business-signup-form.tsx`): `InputField` and `SelectField` wrappers were not passing `showMessage` to their inner `FormField`, so Zod validation errors were invisible — form appeared to do nothing on submit. Added `showMessage` to both field components.
- **Theme tab `onSubmit` not triggering** (`theme-tab.tsx`): `RadioGroupItem` had `className='hidden'` which sets `display:none`, making the element non-interactive — label's `htmlFor` could not activate it, so `field.onChange` was never called and the theme value stayed `undefined`, failing `z.enum` validation silently. Fixed by changing to `className='sr-only'`. Also corrected typo `'defualt'` → `'default'` in the default theme option.
- **Theme and desktopMedia cleared on event details save** (`event-details-tab.tsx`): `transformEventDetailsToCreateRequest` did not include `theme` or `desktopMedia` in its output, so the backend treated missing fields as a full replace and cleared them. Fixed by merging the existing event's `theme` and `desktopMedia` into the update payload in `onSubmit`.
- **Ticket validation errors not surfaced** (`tickets-tab.tsx`): Added `onError` callback as the second argument to `handleSubmit` so Zod validation failures log to the console for debugging.
- **Mobile screens for fans route** (`bceb4d9`): Fixed layout issues across cart container, checkout page, event description, event details, ticket section, and resell page on mobile viewports. Improved helper functions for time formatting (`formatTimeLong`, `formatDateLong`, `formatTimezone`).
- **React Query stale cache after login** (`use-cart.ts`): Added `isAuthenticated` to the `useGetAllCart` query key so a state change from unauthenticated → authenticated creates a new cache slot, preventing local-format cart data from being served as server `CartData`.
- **Race condition on login** (`use-auth.ts`, `stores/index.ts`): Local cart sync is now `await`ed before navigation and `onSuccess` callback fire. `isSyncingCart` wraps the full `Promise.allSettled` call so the UI spinner stays active for the entire sync duration.
- **Post-login redirect to checkout** (`user-login-form.tsx`, `checkout/index.tsx`): User is correctly returned to the checkout page after signing in from the checkout flow.
- **Cart trigger positioning**: Removed duplicate/conflicting layout in `event-details.tsx` that caused incorrect cart trigger placement on the event page.
- **Base modal footer not visible on mobile** (`base-modal.tsx`): Switched `DialogContent` from `block` to `flex flex-col gap-0`; footer positioned with `absolute bottom-0 right-0 z-10`; removed `sm:overflow-y-auto` from full-size class.
- **Lucide icon `color` prop misuse** (`cart-container.tsx`): Changed `color="text-white"` (invalid Tailwind class as CSS value) to `color="white"` on Plus/Minus icons — icons now render correctly.
- **Cart container not scrollable on mobile**: Set `max-h-[calc(100vh-100px)] overflow-y-auto` on the inner content div so content scrolls within the modal.
- **AccordionTrigger chevron misaligned**: Overrode base `items-start` with `items-center` so the chevron is vertically centred with TOTAL text and price.
- **AccordionTrigger price appearing in the middle**: Wrapped TOTAL and price in a single `flex w-full justify-between` div before the auto-appended chevron, so layout is `TOTAL ... price ˅` rather than three separate flex items.
- **Forgot password stacking a second dialog** (`35463f7`): Renders forgot password form inside the existing auth modal instead of opening a nested dialog.
- **Settings button not opening / mobile sidebar trigger broken** (`5dc703b`): Fixed interactive trigger wiring on mobile sidebar and settings menu.
- **Resell page mobile layout** (`resell-page/index.tsx`): "Revive" headline and CTA button now inline on same row; responsive text sizing (`text-[48px] md:text-[40px] lg:text-[72px]`); text centred on mobile, left-aligned on desktop.
- **`isFan` / `isCreator` / `isVendor` always returning `false`** (`stores/index.ts`): Replaced getter pattern with explicit boolean properties set in `setAuth`, `clearAuth`, and `updateUser`.

### Changed
- **`formatNaira` refactored to options object** (`src/lib/format-price.ts`): Signature changed from `(amount, aproximate?)` to `(amount, options: { aproximate?, free? })`. Added `free` option — when `amount === 0 && free` returns the string `'FREE'` instead of `'₦0'`. Callers that previously passed a positional boolean now use `{ aproximate: true }`.
- **Cart button FREE display** (`cart/index.tsx`): Added `hasCartItems` derived boolean; the checkout button now shows `'FREE'` only when the cart has items and the total price is ₦0, so the default empty-cart state still shows `₦0`.
- **Cart container redesigned to match Figma** (`cart-container.tsx`, `875ad8a`): Layout updated to flex-row on desktop — event details and order summary on the left column, event image fixed on the right. On mobile, stacks as event details → image → order summary. Integrated `TotalAccordion` and `PromoCode` components. Inner content div uses `max-h-[calc(100vh-100px)] overflow-y-auto` for scrollability.
- **Checkout page redesigned to match Figma** (`checkout/index.tsx`, `a6c6e6b`): `cart-summary` replaced by new `CheckoutSummary` component with matching layout. `useCountdown` hook moved inside `CheckoutSummary`.
- **Publish event redirects to standalone route** (`event-details-tab.tsx`): After a successful publish, `onPublish` now calls `navigate(getRoutePath('standalone'))` instead of staying on the edit page.
- **Event routing migrated from `eventID` to `customUrl`** (`hooks/use-event-mutations.ts`, `services/event.service.ts`, `components/shared/category-block.tsx`, `event-page/`): All event navigation now uses `customUrl` as the route parameter for cleaner, human-readable URLs.
- **`eventID` removed as API request payload** (`event-transforms.ts`, creator edit-event tabs): Event ID no longer sent as part of the create/update request body; back-click navigation fixed in edit event tab.
- **Cart summary** (`cart-summary.tsx`): Fully supports both authenticated (server `CartData`) and unauthenticated (local store + ticket enrichment via `useGetEventTickets`) states. `totalPrice` and `totalQuantity` computed from the normalised cart items array.
- **Fans homepage UI** (`home/`, `afro-carousel.tsx`, `base-dropdown.tsx`): Various layout and dropdown bug fixes; carousel and own-the-stage section improvements.
- **Footer social links** (`home/socials.tsx`, footer components): Real social media URLs added, open in new tab; social icon sizing reduced; top border added to footer social row; language selector removed.
- **About-us mobile layout** (`/about-us`): Improved section spacing, typography scaling, and text readability across all mobile breakpoints.
- **`cart-summary.tsx` checkout button**: Aligned to `self-center mx-auto`.
- 2-step vendor signup flow matching Figma design specifications.
- Responsive design for Vendor Dashboard (mobile and tablet support).
- Enhanced creators landing page header with improved desktop sizing and layout.

### Fixed
- **Creators Landing Page Header Issues**:
  - Removed duplicate headers by moving `/creators` route to `CreatorsLandingPageLayout`.
  - Eliminated conflicting header from `IndexLayout` on creators page.
  - Now displays single, consistent header across all creator pages.

### Changed
- **Refactored `BusinessSignUp` component** (`src/pages/auth/sign-up/business-signup-form.tsx`):
    - Implemented multi-step state management using `useState`.
    - **Step 1:** Collects Personal Information (Name, Phone, Gender), Business Details (Business Name, URLs), and Account Credentials (Email, Password).
        - Button text: "Continue"
        - Validates all Step 1 fields before proceeding.
    - **Step 2:** Collects Business Classification (Vendor Type and Category).
        - Title changes to "Business Type"
        - Description changes to "Select The Applicable Category"
        - Button text: "Sign Up"
    - Added `handleContinue()` function to validate Step 1 fields using `form.trigger()` before transitioning to Step 2.
    - Conditional rendering of form fields based on current step.
    - Dynamic title and description based on step and user type.
- **Updated Vendor Dashboard pages** to match Figma designs:
    - Added "Discover events near you!" heading to Discover page.
    - Changed card labels from "Category" to "Available Slots" with green styling.
    - Implemented responsive grid layouts (1 column mobile → 2 columns tablet → 3-4 columns desktop).
    - Added "Discover events near you!" heading to Discover page.
    - Changed card labels from "Category" to "Available Slots" with green styling.
    - Implemented responsive grid layouts (1 column mobile → 2 columns tablet → 3-4 columns desktop).
    - Improved spacing and typography across all viewport sizes.
    - Fixed text overflow issues on Profile page.
- **Implemented new Vendor pages**:
    - **Event Details Page**: Created `/vendor/discover/:eventId` with banner, event info, expandable "About" section, and scroll-stopping slot registration card.
    - **Wishlist/Saved Events Page**: Created `/vendor/wishlist` with "RESULTS" header (mobile) / "Saved Events" (desktop) and responsive event grid.
- **Implemented Vendor Dashboard Phase 2**:
    - **Edit Profile Modal**: Implemented comprehensive modal (tabs: Profile, Inbox, Account) matching Figma Image 4. Replaced "DestructiveAddBtn".
    - **Slot Details Page**: Created `/vendor/slots/:eventId` (e.g. "Blackmarket Flea") with search function and status-badged slot list matching Figma Image 2.
    - **My Slots Integration**: Updated My Slots page (`/vendor/slots`) to display mock events that link to the new Details page.
- **Implemented Vendor Dashboard Phases 3 & 4 (Gaps & Polish)**:
    - **View Profile Modal**: Added read-only profile modal with badge, contact details, and gallery (Figma Image 2).
    - **Inbox Improvements**:
        - Populated "Inbox" tab with mock notifications (Figma Image 0).
        - Added interactive Detail View with "Secure Slot" CTA (Figma Image 1).
    - **Slot Features**:
        - **Description Modal**: Refined modal with Quantity Selector, Green Price, and "Request" button to match updated Figma reference (Image 4).
        - **Section Map**: Implemented interactive "List / Map" toggle displaying a color-coded stall grid (Figma Image 3).
- **Enhanced Creators Landing Page Header (Desktop)**:
    - **Increased header height** from `h-20` to `h-28` (40% larger on desktop).
    - **Enlarged logo** from 80x40px to 120x60px on desktop (responsive: remains 80x40px on mobile).
    - **Larger navigation links** from `text-sm` to `text-base lg:text-lg` for better readability.
    - **Improved spacing** with `gap-12 lg:gap-16` between navigation items.
    - **Added max-width** of `1400px` with enhanced padding (`px-4 md:px-8 lg:px-16`, `py-4 md:py-6`).
    - **Repositioned countdown timer** from inline with LOGIN button to centered row below navigation for better visual hierarchy.
    - **Responsive timer sizing** using `clamp(20px, 4vw, 28px)` for optimal scaling.
- **Updated Creators Page Route**:
    - **Changed route path** from `/fans/creators` to `/creators` in `src/config/route-map.ts`.
    - All navigation links automatically updated via `getRoutePath('creators')` helper.
    - **Updated content padding** from `pt-32` to `pt-40 md:pt-36` to accommodate larger header.
- **Guest Cart Support — Unauthenticated fans can now add tickets to cart**:
    - Created `useCartStore` in `src/stores/index.ts` using Zustand `persist` middleware, storing `{ ticketId, quantity }` items in localStorage under the key `afro-cart`. Cart survives page refreshes.
    - Updated all cart hooks in `src/hooks/use-cart.ts` to check authentication before acting:
        - `useGetAllCart`: returns local store items when unauthenticated, server data when authenticated.
        - `useCreateCart`: writes to `useCartStore` when unauthenticated, calls `POST /api/Cart` when authenticated.
        - `useDeleteCart`: removes from `useCartStore` when unauthenticated, calls `DELETE /api/cart/:id` when authenticated.
        - `useUpdateCartQuantity`: updates `useCartStore` when unauthenticated, calls `PATCH /api/cart/:id/quantity` when authenticated. Also now invalidates `cartKeys.lists()` on success so ticket counts stay in sync.
    - Updated `cart-trigger.tsx`: count badge reads from `useCartStore` directly when unauthenticated; loading spinner only shown for authenticated server fetches.
    - Updated `cart/index.tsx` and `cart/cart-container.tsx`: when unauthenticated, local cart items are enriched with ticket name and price via `useGetEventTickets` for display and total price calculation.
    - Updated `tickets.tsx`: replaced local `ticketCount` and `cartId` `useState` with values derived from global cart state — unauthenticated reads from `useCartStore`, authenticated reads from `useGetAllCart`. When unauthenticated, `ticketId` is used in place of `cartId`.
    - Updated `useLogin` in `src/hooks/use-auth.ts`: on successful login, any items in the local cart are synced to the server. The sync is now `await`ed (not fire-and-forget) — `setSyncing(true)` is set before the `Promise.allSettled` call and `setSyncing(false)` is set in a `finally` block. Navigation and the optional `onSuccess` callback are deferred until after the sync completes, preventing race conditions where the page re-renders in an authenticated state while the cart is mid-sync.
    - Added `isSyncingCart: boolean` and `setSyncing(value: boolean)` to `useCartStore` (`src/stores/index.ts`). `isSyncingCart` is excluded from localStorage persistence via `partialize` since it is transient runtime state. `cart/index.tsx` reads this flag so the checkout button spinner shows during both server loading and post-login sync.
    - **Fixed `isFan` / `isCreator` / `isVendor` always returning `false`**: Fixed by replacing the getter pattern with regular boolean properties (`isCreator`, `isFan`, `isVendor`) that are explicitly set alongside `user` in `setAuth`, `clearAuth`, and `updateUser`.
    - Updated `cart-summary.tsx`, `checkout/index.tsx`, and `cart/index.tsx`: threaded `eventId` through the prop chain so the checkout summary can enrich the local cart items with ticket name and price via `useGetEventTickets`. When unauthenticated, items are normalised from the local store; when authenticated, server `CartData` is used directly. `totalPrice` and `totalQuantity` are now calculated from the normalised cart items array, replacing the previous `getCartTotals` call. `handleValidatePromocode` pulls `eventIds` and `ticketIds` from the same normalised array so promo code validation works for both auth states.

### Removed
- Duplicate header component from `src/pages/landing-page/creators/index.tsx`.
- Creators route from `src/config/routes.tsx` (moved to `creators-landing-page-routes.tsx`).

### Technical Notes
- **Files Modified**:
  - `src/config/route-map.ts` - Updated creators route path
  - `src/config/routes.tsx` - Removed creators route
  - `src/config/creators-landing-page-routes.tsx` - Added creators landing page route
  - `src/layouts/creators-landing-page-layout/sections/header.tsx` - Enhanced header sizing and layout
  - `src/pages/landing-page/creators/index.tsx` - Removed duplicate header, updated padding

### Breaking Changes
- **URL Change**: Creators landing page now accessible at `/creators` instead of `/fans/creators`.
- Old URL (`/fans/creators`) will return 404.
- **Action Required**: Update any external links, bookmarks, or backend redirects pointing to `/fans/creators`.
