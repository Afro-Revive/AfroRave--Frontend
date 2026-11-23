import { useAdminFees, useFeeAudit, useUpdateFee } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";
import { useAfroStore } from "@/stores";
import type { FeeConfiguration } from "@/types/admin";
import { useState } from "react";
import {
  RiErrorWarningLine,
  RiHistoryLine,
  RiPencilLine,
} from "react-icons/ri";
import { ConfirmDialog } from "./components/confirm-dialog";
import {
  feeTypeLabel,
  formatDateTime,
  formatPercent,
} from "./components/format";
import { PageHeader } from "./components/page-header";
import { StatusPill } from "./components/status-pill";

const NO_USER = "00000000-0000-0000-0000-000000000000";

/** What each fee does, where the backend's description is thin. */
const FEE_NOTES: Record<string, string> = {
  TicketCheckoutTax: "Platform commission on new tickets, added at checkout.",
  TicketResaleTax: "Platform commission on resale tickets, paid by the buyer.",
  VendorSlotTax: "Platform commission when a vendor pays for a revenue slot.",
  ResalePriceCap: "How far above face value a resale can be listed.",
  TicketMarkupFee:
    "No longer used: the checkout commission replaced it. Kept for older records.",
};

/** Still stored, but checkout no longer reads them, so editing them changes nothing. */
const UNUSED_FEES = new Set(["TicketMarkupFee"]);

/** A percentage between 0 and 100, at most two decimal places. Null if not. */
function parsePercent(text: string): number | null {
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(text.trim())) return null;
  const value = Number(text);
  return value >= 0 && value <= 100 ? value : null;
}

export default function AdminFeesPage() {
  const { data, isLoading, isError } = useAdminFees();
  // The ones that do nothing go last.
  const fees = [...(data?.data ?? [])].sort(
    (a, b) =>
      Number(UNUSED_FEES.has(a.feeType)) - Number(UNUSED_FEES.has(b.feeType)),
  );

  return (
    <>
      <PageHeader
        title="Fees"
        description="The platform’s percentage fees and taxes. A change applies to new purchases straight away, and each one is recorded in its history."
      />

      {isError && (
        <p className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          <RiErrorWarningLine className="size-5 shrink-0" aria-hidden />
          Couldn&rsquo;t load the fees. Try again in a moment.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]"
              />
            ))
          : fees.map((fee) => <FeeCard key={fee.id} fee={fee} />)}
      </div>
    </>
  );
}

function FeeCard({ fee }: { fee: FeeConfiguration }) {
  const userId = useAfroStore((state) => state.user?.userId);
  const update = useUpdateFee();
  const [isEditing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [isConfirming, setConfirming] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const isUnused = UNUSED_FEES.has(fee.feeType);
  const current = Math.round(fee.percentageValue * 10000) / 100;
  const next = parsePercent(text);
  const isValid = next !== null && next !== current;

  const startEditing = () => {
    setText(String(current));
    setEditing(true);
  };

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5",
        isUnused && "border-dashed opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">{feeTypeLabel(fee.feeType)}</h2>
          <p className="text-xs text-white/60">
            {FEE_NOTES[fee.feeType] ?? fee.description}
          </p>
        </div>
        {isUnused ? (
          <StatusPill tone="gray">Not in use</StatusPill>
        ) : fee.isActive ? (
          <StatusPill tone="green">Active</StatusPill>
        ) : (
          <StatusPill tone="gray">Inactive</StatusPill>
        )}
      </div>

      {isEditing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (isValid) setConfirming(true);
          }}
          className="flex flex-col gap-2"
        >
          <label className="flex flex-col gap-1.5 text-xs text-white/60">
            New value
            <span className="relative flex items-center">
              <input
                autoFocus
                inputMode="decimal"
                value={text}
                onChange={(event) => setText(event.target.value)}
                aria-invalid={text !== "" && next === null}
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-3 pr-8 text-lg font-semibold text-white focus:border-white/30 focus:outline-none aria-[invalid=true]:border-red-500/60"
              />
              <span className="absolute right-3 text-white/50">%</span>
            </span>
          </label>
          {text !== "" && next === null && (
            <p className="text-xs text-red-300">
              Enter a number from 0 to 100, with up to two decimals.
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-9 flex-1 rounded-lg border border-white/15 text-sm hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="h-9 flex-1 rounded-lg bg-white text-sm font-semibold text-system-black hover:bg-white/90 disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-end justify-between gap-3">
          <p className="text-3xl font-bold tabular-nums">
            {formatPercent(fee.percentageValue)}
          </p>
          {!isUnused && (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 text-xs font-medium text-white/80 hover:bg-white/10"
            >
              <RiPencilLine className="size-3.5" aria-hidden />
              Edit
            </button>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-white/50">
        <span>Updated {formatDateTime(fee.updatedAt)}</span>
        <button
          type="button"
          aria-expanded={showHistory}
          onClick={() => setShowHistory((shown) => !shown)}
          className="flex items-center gap-1 text-white/70 hover:text-white"
        >
          <RiHistoryLine className="size-3.5" aria-hidden />
          {showHistory ? "Hide history" : "History"}
        </button>
      </div>

      {showHistory && (
        <FeeHistory feeType={fee.feeType} currentUserId={userId} />
      )}

      <ConfirmDialog
        open={isConfirming}
        title={`Change ${feeTypeLabel(fee.feeType)}?`}
        description={
          <p>
            From <span className="text-white">{current}%</span> to{" "}
            <span className="text-white">{next}%</span>. It applies to new
            purchases straight away.
          </p>
        }
        confirmLabel="Change fee"
        tone="neutral"
        isPending={update.isPending}
        onClose={() => setConfirming(false)}
        onConfirm={() =>
          next !== null &&
          update.mutate(
            { feeType: fee.feeType, percentageValue: next / 100 },
            {
              onSuccess: () => setEditing(false),
              onSettled: () => setConfirming(false),
            },
          )
        }
      />
    </article>
  );
}

function FeeHistory({
  feeType,
  currentUserId,
}: {
  feeType: string;
  currentUserId?: string;
}) {
  const { data, isLoading, isError } = useFeeAudit(feeType, true);
  const entries = data?.data ?? [];

  const who = (id: string) =>
    id === currentUserId ? "You" : id === NO_USER ? "System" : "An admin";

  if (isLoading)
    return <div className="h-12 animate-pulse rounded-lg bg-white/5" />;
  if (isError)
    return (
      <p className="text-xs text-red-300">Couldn&rsquo;t load the history.</p>
    );
  if (entries.length === 0)
    return <p className="text-xs text-white/50">No changes recorded yet.</p>;

  return (
    <ol className="flex max-h-60 flex-col gap-2 overflow-y-auto">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex flex-col gap-0.5 rounded-lg bg-white/5 px-3 py-2 text-xs"
        >
          <span
            className={cn(
              "font-medium",
              entry.action === "Created" ? "text-sky-300" : "text-white",
            )}
          >
            {entry.action === "Created"
              ? `Set to ${formatPercent(entry.newPercentageValue)}`
              : `${formatPercent(entry.oldPercentageValue)} → ${formatPercent(entry.newPercentageValue)}`}
          </span>
          <span className="text-white/50">
            {who(entry.modifiedByUserId)} · {formatDateTime(entry.modifiedAt)}
          </span>
        </li>
      ))}
    </ol>
  );
}
