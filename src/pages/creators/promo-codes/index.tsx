import { SidebarToggle } from "@/components/shared/sidebar-toggle";
import { FormBase } from "@/components/reusable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { TiStarburst } from "react-icons/ti";
import {
  useCreatePromoCode,
  useDeletePromoCode,
  useGetEventAnalytics,
  useGetEventPromoCodes,
  useGetEventTickets,
  useUpdatePromoCode,
} from "@/hooks/use-event-mutations";
import { parseApiDate } from "@/lib/helper-func";
import { cn } from "@/lib/utils";
import type {
  AnalyticsPromoCode,
  EventAnalyticsData,
  PromoCodeData,
  TicketData,
} from "@/types";
import type { PaginatedResponse } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import {
  type TPromoCodeSchema,
  promoCodeDefaults,
  promoCodeSchema,
} from "../add-event/schemas/promo-code-schema";
import {
  populatePromoCodeJson,
  promoCodeToFormValues,
} from "../add-event/ticket-forms/promo-code-form/helper";
import { PromoCodeFormFields } from "../add-event/ticket-forms/promo-code-form/promo-code-form";
import {
  CreatorPageContainer,
  SelectedEventGate,
} from "../_components/selected-event-page";
import {
  AppliedPromoCodesTable,
  NoAppliedPromoCodes,
} from "./components/applied-promo-codes-table";
import { PromoCodeCard } from "./components/promo-code-card";
import { PromocodeSummaryCard } from "./components/promo-code-summary";

export default function PromoCodesPage() {
  return (
    <SelectedEventGate>
      {(event) => (
        <EventPromoCodes
          eventId={event.eventId}
          eventEndDate={event.eventDate?.endDate}
        />
      )}
    </SelectedEventGate>
  );
}

function EventPromoCodes({
  eventId,
  eventEndDate,
}: {
  eventId: string;
  /** A new code runs until the event ends. */
  eventEndDate?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  // The code being edited; the add form opens filled in with it.
  const [editing, setEditing] = useState<PromoCodeData | null>(null);

  const {
    data: promocodeResponse,
    isLoading,
    refetch,
    error,
  } = useGetEventPromoCodes(eventId);

  // The form lets you scope a code to specific tickets, so it needs the list.
  const { data: ticketsResponse } = useGetEventTickets(eventId);

  // The promo code list has each code's limit but not how it's done; its
  // redemptions, sales and commission come from analytics, per code.
  const { data: analyticsResponse, isLoading: isUsageLoading } =
    useGetEventAnalytics(eventId);
  const statsByCode = new Map(
    (
      (analyticsResponse?.data as EventAnalyticsData | undefined)?.promoCodes ??
      []
    ).map((item) => [item.promoCode?.toLowerCase(), item]),
  );

  const { mutate: createPromoCodeMutation, isPending: isCreatingPromoCode } =
    useCreatePromoCode(eventId);
  const deletePromocodeMutation = useDeletePromoCode(eventId);
  const { mutate: updatePromoCodeMutation, isPending: isUpdatingPromoCode } =
    useUpdatePromoCode(eventId);

  const promocodes = promocodeResponse?.data as
    | PaginatedResponse<PromoCodeData>
    | undefined;
  const tickets = ticketsResponse?.data as
    | PaginatedResponse<TicketData>
    | undefined;

  useEffect(() => {
    if (searchParams.get("form") === "promocode") setIsCreating(true);
  }, [searchParams]);

  const promocodeForm = useForm<{ promoCodes: TPromoCodeSchema }>({
    resolver: zodResolver(z.object({ promoCodes: promoCodeSchema })),
    defaultValues: { promoCodes: promoCodeDefaults(eventEndDate) },
  });

  function handleCreatePromoCode() {
    const promocodeRequest = populatePromoCodeJson(promocodeForm);

    createPromoCodeMutation(
      { ...promocodeRequest, eventId },
      {
        onSuccess: () => {
          promocodeForm.reset({ promoCodes: promoCodeDefaults(eventEndDate) });
          handleBackClick();
        },
      },
    );
  }

  function handleUpdatePromoCode() {
    if (!editing) return;

    updatePromoCodeMutation(
      {
        promoId: editing.promocodeId,
        data: populatePromoCodeJson(promocodeForm),
      },
      { onSuccess: handleBackClick },
    );
  }

  async function handleDeletePromocode(id: string) {
    deletePromocodeMutation.mutateAsync(id);
  }

  function openCreate() {
    // A fresh form, even straight after editing another code.
    promocodeForm.reset({ promoCodes: promoCodeDefaults(eventEndDate) });
    setEditing(null);
    setIsCreating(true);
  }

  function openEdit(promocode: PromoCodeData) {
    promocodeForm.reset({ promoCodes: promoCodeToFormValues(promocode) });
    setEditing(promocode);
  }

  function handleBackClick() {
    setIsCreating(false);
    setEditing(null);
    promocodeForm.reset({ promoCodes: promoCodeDefaults(eventEndDate) });
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("form");
      return next;
    });
  }

  const items = promocodes?.items ?? [];
  // No codes yet: the add form is on the page itself, instead of behind a button.
  const hasNoCodes = !isLoading && !error && items.length === 0;

  if (isCreating || editing) {
    const isSaving = editing ? isUpdatingPromoCode : isCreatingPromoCode;

    return (
      <CreatorPageContainer
        heading={editing ? "Edit Promo Code" : "Add Promo Code"}
        onBack={handleBackClick}
        action={
          <Button
            variant="destructive"
            className="py-2 w-fit px-8 text-xs font-inter-tight font-black rounded-[5px] "
            onClick={() =>
              promocodeForm.handleSubmit(
                editing ? handleUpdatePromoCode : handleCreatePromoCode,
              )()
            }
            disabled={isSaving}
          >
            {isSaving ? "SAVING..." : "SAVE"}
          </Button>
        }
      >
        {/* The rule sets the form apart from the header above it. */}
        <div className="w-full flex flex-col items-center pt-6 bg-white px-4 md:p-14 border-t border-black/10">
          <FormBase
            form={promocodeForm}
            onSubmit={() => {}}
            className="max-w-[560px] w-full"
          >
            <PromoCodeFormFields
              form={promocodeForm}
              eventTickets={tickets?.items}
            />
          </FormBase>
        </div>
      </CreatorPageContainer>
    );
  }

  return (
    <CreatorPageContainer>
      <div className="w-full bg-white flex items-start gap-4 px-5 py-6">
        <SidebarToggle />

        <div className="flex flex-col gap-1">
          <p className="font-inter-tight text-2xl font-bold text-black">
            Promo Codes
          </p>
          <p className="font-inter-tight text-sm text-black">
            Generate and manage discount codes, usage limits and redemption
            activity.
          </p>
        </div>
      </div>
      <div className="w-full flex flex-col gap-10 md:gap-14 pt-6 px-4 md:p-14">
        {hasNoCodes ? (
          <div className="flex flex-col gap-[13px]">
            <div className="flex flex-col rounded-2xl gap-5 bg-white px-6 py-5">
              <SectionHeading
                title="Add Promo Codes"
                description="Create discount codes for this event."
              />
              <FormBase form={promocodeForm} onSubmit={() => {}}>
                <PromoCodeFormFields
                  form={promocodeForm}
                  eventTickets={tickets?.items}
                  onSubmit={() =>
                    promocodeForm.handleSubmit(handleCreatePromoCode)()
                  }
                  onRemove={() =>
                    promocodeForm.reset({ promoCodes: promoCodeDefaults(eventEndDate) })
                  }
                  isSubmitting={isCreatingPromoCode}
                />
              </FormBase>
            </div>

            <NoAppliedPromoCodes />
          </div>
        ) : (
          <div className="flex flex-col gap-[13px]">
            <PromocodeSummaryCard eventId={eventId} />

            {/* The codes come first, then the section to add another. */}
            {(() => {
              if (isLoading) {
                return (
                  <div className="w-full py-8 flex items-center justify-center rounded-2xl bg-white">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-red mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Loading promocodes...
                      </p>
                    </div>
                  </div>
                );
              }

              if (error) {
                return (
                  <div className="w-full py-8 flex items-center justify-center rounded-2xl bg-white">
                    <div className="text-center">
                      <p className="text-sm text-red-600 mb-2">
                        Failed to load promocodes. Please try again.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        className="text-xs"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                );
              }

              return (
                // Two per row on desktop; a partnership card spans the row.
                <div className="w-full grid grid-cols-1 gap-3 md:grid-cols-2">
                  {items.map((promocode) => (
                    <PromoCodeItem
                      key={promocode.promocodeId}
                      promocode={promocode}
                      // A code nobody has used yet may not be in analytics at
                      // all; the card counts that as zero.
                      stats={statsByCode.get(promocode.promoCode.toLowerCase())}
                      isUsageLoading={isUsageLoading}
                      onEdit={() => openEdit(promocode)}
                      onDelete={() => handleDeletePromocode(promocode.promocodeId)}
                      isLoading={deletePromocodeMutation.isPending}
                    />
                  ))}
                </div>
              );
            })()}

            <div className="flex flex-col rounded-2xl gap-3 bg-white px-6 py-5">
              <SectionHeading
                title="Promo Codes"
                description="Create discount codes for this event."
              />
              <AddPromoCodeButton onClick={openCreate} className="w-fit mt-1" />
            </div>

            {items.length > 0 && (
              <AppliedPromoCodesTable
                promocodes={items}
                tickets={tickets?.items ?? []}
              />
            )}
          </div>
        )}
      </div>
    </CreatorPageContainer>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-2 items-center">
        <TiStarburst size={24} className="text-light-red" />
        <p className="font-inter-tight text-xl font-bold text-black">{title}</p>
      </div>
      <p className="font-inter-tight font-medium text-sm text-[#464444]">
        {description}
      </p>
    </div>
  );
}

function AddPromoCodeButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 py-2 px-3 bg-black rounded-[20px] text-white text-xs font-work-sans font-semibold hover:bg-black/70 shrink-0",
        className,
      )}
    >
      <Plus className="size-4" />
      ADD PROMOCODE
    </Button>
  );
}

/** A promo code's card, plus the details dialog it opens. */
function PromoCodeItem({
  promocode,
  stats,
  isUsageLoading,
  onEdit,
  onDelete,
  isLoading = false,
}: {
  promocode: PromoCodeData;
  stats?: AnalyticsPromoCode;
  isUsageLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}) {
  const [detailOpen, setDetailOpen] = useState(false);

  const discountLabel =
    promocode.discountType === "Percentage"
      ? `${promocode.discountValue}% off`
      : `₦${promocode.discountValue?.toLocaleString()} off`;

  const description = promocode.promoDetails?.note ?? "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    // Stored in UTC; shown on the organizer's local day.
    return parseApiDate(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <PromoCodeCard
        promocode={promocode}
        stats={stats}
        isUsageLoading={isUsageLoading}
        onOpen={() => setDetailOpen(true)}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isLoading}
      />

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent
          noCancel
          className="max-w-sm p-0 rounded-[10px] overflow-hidden"
        >
          <DialogTitle className="sr-only">{promocode.promoCode}</DialogTitle>
          <DialogDescription className="sr-only">
            Promo code details
          </DialogDescription>
          <div className="relative flex flex-col items-center px-10 pt-5 pb-3">
            <DialogClose asChild>
              <button
                type="button"
                className="absolute right-4 top-4 text-gray-400 hover:text-black p-1 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </DialogClose>
            <p className="font-black font-inter-tight text-base text-black text-center">
              {promocode.promoCode}
            </p>
            <p className="text-xs text-[#2E7D32] font-inter-tight mt-0.5 text-center">
              {discountLabel}
            </p>
          </div>
          <div className="px-5 pb-5 flex flex-col gap-3">
            {(promocode.startDate || promocode.endDate) && (
              <div className="flex items-center gap-4 text-xs font-inter-tight text-gray-500">
                {promocode.startDate && (
                  <span>From: {formatDate(promocode.startDate)}</span>
                )}
                {promocode.endDate && (
                  <span>Until: {formatDate(promocode.endDate)}</span>
                )}
              </div>
            )}
            <div>
              <p className="font-inter-tight font-semibold text-[14px] text-black mb-1">
                Description
              </p>
              {description ? (
                <p className="font-inter-tight text-[13px] text-[#3C3C43] leading-relaxed">
                  {description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 font-inter-tight italic">
                  No description provided.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
