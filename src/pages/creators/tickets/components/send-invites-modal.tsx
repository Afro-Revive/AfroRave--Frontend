import BaseModal from "@/components/reusable/base-modal";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  useGetOrganizerCategories,
  useGetOrganizerGuestList,
} from "@/hooks/use-guestlist-mutations";
import {
  useGetTicketInvites,
  useSendTicketInvites,
} from "@/hooks/use-invite-ticket-mutations";
import { formatNaira } from "@/lib/format-price";
import { cn } from "@/lib/utils";
import type { PaginatedResponse, TicketData } from "@/types";
import type { CategoryData, GuestListData } from "@/types/guestlist";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BsInfoCircle, BsTicketPerforated } from "react-icons/bs";
import { ALL_INVITE_CATEGORIES_ID, INVITE_PAGE_SIZE } from "../constant";
import { InviteGuestlistTab } from "./invite-guestlist-tab";
import {
  InviteNewGuestTab,
  type NewInviteValues,
} from "./invite-new-guest-tab";

const NEW_GUEST_FORM_ID = "invite-new-guest";

type InviteTab = "guestlist" | "new";

/**
 * Sends invites for one invite-only ticket, either to guests already on the
 * account or to someone new by email.
 *
 * Mount it only while it's open: it fetches the guestlist on mount, and
 * unmounting on close is what clears its selection for the next ticket.
 */
export function SendInvitesModal({
  eventId,
  ticket,
  onClose,
}: {
  eventId: string;
  ticket: Pick<TicketData, "ticketId" | "ticketName" | "price">;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<InviteTab>("guestlist");
  const [activeCategoryId, setActiveCategoryId] = useState(
    ALL_INVITE_CATEGORIES_ID,
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const debouncedSearch = useDebouncedValue(search);

  // Each of these changes the result set, so the old page number is meaningless.
  useEffect(() => setPage(1), [activeCategoryId, debouncedSearch]);

  const { data: invites = [] } = useGetTicketInvites(ticket.ticketId);
  const sendTicketInvites = useSendTicketInvites(eventId, ticket.ticketId);

  const { data, isPending, isFetching } = useGetOrganizerGuestList({
    categoryId:
      activeCategoryId === ALL_INVITE_CATEGORIES_ID
        ? undefined
        : activeCategoryId,
    pageNumber: page,
    pageSize: INVITE_PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  // One row fetched purely for its totalCount, which the All Guests pill needs
  // and a filtered page can't know.
  const { data: totalsResponse } = useGetOrganizerGuestList({
    pageNumber: 1,
    pageSize: 1,
  });
  const { data: categoriesResponse } = useGetOrganizerCategories();

  // Two unwraps: the envelope's data is a page, the guests are its items.
  const guestPage = data?.data as PaginatedResponse<GuestListData> | undefined;
  const guests = guestPage?.items ?? [];

  const totalsPage = totalsResponse?.data as
    | PaginatedResponse<GuestListData>
    | undefined;
  const categories =
    (categoriesResponse?.data as CategoryData[] | undefined) ?? [];

  // Invites carry an email but no guest id, so a guest counts as invited when
  // their email matches one. Emails are unique within a guestlist, and are
  // compared lowercased so casing can't hide a match.
  const invitedEmails = useMemo(
    () => new Set(invites.map((invite) => invite.email?.toLowerCase())),
    [invites],
  );

  const invitedGuestIds = guests
    .filter((guest) => invitedEmails.has(guest.email?.toLowerCase()))
    .map((guest) => guest.id);

  const isSending = sendTicketInvites.isPending;

  /** Invites guests already on the guestlist. */
  function inviteGuests(guestIds: string[]) {
    sendTicketInvites.mutate(
      {
        ticketId: ticket.ticketId,
        // Whole-category invites aren't offered here — the pills filter.
        categoryIds: [],
        guestIds,
      },
      { onSuccess: onClose },
    );
  }

  /**
   * Invites someone new. Sent as a manual guest, which the server also saves
   * to the guestlist — one request covers both.
   */
  function saveGuestAndInvite({ name, email, categoryIds }: NewInviteValues) {
    sendTicketInvites.mutate(
      {
        ticketId: ticket.ticketId,
        categoryIds: [],
        guestIds: [],
        manualGuests: [{ name, email, categoryIds }],
      },
      { onSuccess: onClose },
    );
  }

  function toggleGuest(guestId: string) {
    setSelectedIds((current) =>
      current.includes(guestId)
        ? current.filter((id) => id !== guestId)
        : [...current, guestId],
    );
  }

  function toggleAll(guestIds: string[], select: boolean) {
    setSelectedIds((current) =>
      select
        ? Array.from(new Set([...current, ...guestIds]))
        : current.filter((id) => !guestIds.includes(id)),
    );
  }

  const selectedCount = selectedIds.length;
  const isPaid = ticket.price > 0;

  return (
    <BaseModal
      open
      onClose={onClose}
      size="small"
      // The built-in header is centred and mono, so it's kept for screen
      // readers only and the visible one is built below.
      title="Send Invites"
      description={`Send invites for ${ticket.ticketName}.`}
      titleClassName="sr-only"
      removeCancel
      className="sm:max-w-[480px]"
    >
      <div className="flex flex-col gap-5 px-6 py-6 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-inter-tight text-2xl font-bold text-black">
              Send Invites
            </p>

            <p className="flex items-center gap-2 font-inter-tight text-sm">
              <BsTicketPerforated className="size-4 rotate-90 text-[#00AD2E]" />
              <span className="font-semibold capitalize text-black">
                {ticket.ticketName}
              </span>
              <span className="text-mid-dark-gray">
                {formatNaira(ticket.price, { free: true })}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-black transition-colors hover:bg-black/10"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* The payment clause only applies to paid tickets. */}
        <p className="flex items-center gap-2.5 rounded-lg bg-black/5 px-4 py-3 font-inter-tight text-xs text-black">
          <BsInfoCircle className="size-4 shrink-0" />
          {isPaid
            ? "Guests must accept from the invited email address, then pay within 5 days."
            : "Guests must accept from the invited email address."}
        </p>

        {tab !== "guestlist" && (
          <p className="flex items-center gap-2.5 rounded-lg bg-black/5 px-4 py-3 font-inter-tight text-xs text-black">
            <BsInfoCircle className="size-4 shrink-0" />
            New guests are saved to your guestlist.
          </p>
        )}

        <div
          role="tablist"
          className="flex items-center gap-1 border-b border-black/15"
        >
          <TabButton
            isActive={tab === "guestlist"}
            onClick={() => setTab("guestlist")}
          >
            From guestlist
            {selectedCount > 0 && (
              <span className="ml-2 font-normal text-black">
                {selectedCount}
              </span>
            )}
          </TabButton>

          <TabButton isActive={tab === "new"} onClick={() => setTab("new")}>
            Add guest
          </TabButton>
        </div>

        {tab === "guestlist" ? (
          <InviteGuestlistTab
            guests={guests}
            categories={categories}
            totalGuests={totalsPage?.totalCount ?? 0}
            selectedIds={selectedIds}
            invitedIds={invitedGuestIds}
            onToggleGuest={toggleGuest}
            onToggleAll={toggleAll}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
            search={search}
            onSearchChange={setSearch}
            page={guestPage?.pageNumber ?? page}
            totalPages={guestPage?.totalPages ?? 1}
            totalCount={guestPage?.totalCount ?? guests.length}
            onPageChange={setPage}
            isLoading={isPending}
            isFetching={isFetching}
          />
        ) : (
          <InviteNewGuestTab
            formId={NEW_GUEST_FORM_ID}
            categories={categories}
            onSubmit={saveGuestAndInvite}
          />
        )}

        <div className="flex items-center gap-3 pt-1">
          <Button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-lg bg-[#1A1A1A] font-inter-tight text-sm font-semibold text-white hover:bg-[#1A1A1A]/90"
          >
            Cancel
          </Button>

          {tab === "guestlist" ? (
            <Button
              type="button"
              disabled={isSending || selectedCount === 0}
              onClick={() => inviteGuests(selectedIds)}
              className="h-11 flex-1 rounded-lg bg-[#00AD2E] font-inter-tight text-sm font-semibold text-white hover:bg-[#00AD2E]/90"
            >
              {isSending
                ? "Sending..."
                : selectedCount === 1
                  ? "Send Invite"
                  : `Send ${selectedCount} Invites`}
            </Button>
          ) : (
            // Lives outside the form, so it submits it through the form attribute.
            <Button
              type="submit"
              form={NEW_GUEST_FORM_ID}
              disabled={isSending}
              className="h-11 flex-1 rounded-lg bg-[#00AD2E] font-inter-tight text-sm font-semibold text-white hover:bg-[#00AD2E]/90"
            >
              {isSending ? "Saving..." : "Save and Send Invite"}
            </Button>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

function TabButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        // -mb-px lays the active underline over the tablist's own border.
        "-mb-px flex items-center border-b-2 px-3 pb-2.5 font-inter-tight text-sm font-semibold transition-colors",
        isActive
          ? "border-deep-red text-deep-red"
          : "border-transparent text-black hover:text-black/70",
      )}
    >
      {children}
    </button>
  );
}
