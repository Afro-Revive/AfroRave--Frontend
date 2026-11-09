// The fans account page's field style (src/pages/fans/account/tabs/profile-tab.tsx):
// a 64px box with its label inset at the top. Dark text and grey borders here,
// since this modal is white where the fans page is dark.
export const INSET_INPUT_CLASS =
  "w-full h-[64px] rounded-[8px] border border-[#D9D9D9] bg-transparent px-4 pt-6 text-black text-sm font-inter-tight placeholder:text-black/30 focus:border-black/40 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all tracking-wider";
export const INSET_SELECT_CLASS =
  "w-full !h-[64px] rounded-[8px] border border-[#D9D9D9] bg-white px-4 pt-6 text-black text-sm font-inter-tight focus:border-black/40 focus:ring-0 focus:ring-offset-0 transition-all tracking-wider";

// A dark grey dropdown list for a select on this white modal, the same grey as
// the payout tab's account name box, with white text. BaseSelect's default list
// is see-through glass made for dark pages, which doesn't read on white.
export const DARK_SELECT_CONTENT_CLASS =
  "bg-[#4A4A4A] border border-[#4A4A4A] backdrop-blur-none max-h-[280px] w-[var(--radix-select-trigger-width)]"
export const DARK_SELECT_ITEM_CLASS =
  "py-2.5 text-sm font-inter text-white border-white/10 hover:!bg-white/10 data-[highlighted]:!bg-white/10 data-[highlighted]:!text-white"
// Keeps the field looking the same while its list is open (BaseSelect darkens
// and unborders it by default).
export const SELECT_OPEN_STEADY_CLASS =
  "data-[state=open]:bg-transparent data-[state=open]:border data-[state=open]:border-black/40"
