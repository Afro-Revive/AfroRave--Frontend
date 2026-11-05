import { Link, useParams } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  RiArrowLeftSLine,
  RiFacebookLine,
  RiGlobalLine,
  RiInformationLine,
  RiInstagramLine,
  RiLinkedinLine,
  RiLinksLine,
  RiMailLine,
  RiPhoneLine,
  RiTiktokLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { LoadingFallback } from "@/components/loading-fallback";
import { RichTextContent } from "@/components/reusable/rich-text-content";
import { getRoutePath } from "@/config/get-route-path";
import {
  useAcceptVendorApplication,
  useRejectVendorApplication,
  useVendorApplicationsSlotsByType,
} from "@/hooks/use-vendor-mutation";
import { formatNaira } from "@/lib/format-price";
import { stripUnderscores } from "@/lib/helper-func";
import { cn } from "@/lib/utils";
import type { VendorSlotApplication } from "@/types/vendor";
import { APPLICATION_STATUS } from "./vendor-application-status";

const SOCIAL_ICONS: Record<
  keyof VendorSlotApplication["vendorBusinessData"]["socials"],
  { icon: IconType; label: string }
> = {
  instagram: { icon: RiInstagramLine, label: "Instagram" },
  x: { icon: RiTwitterXLine, label: "X" },
  facebook: { icon: RiFacebookLine, label: "Facebook" },
  linkedin: { icon: RiLinkedinLine, label: "LinkedIn" },
  tikTok: { icon: RiTiktokLine, label: "TikTok" },
  youTube: { icon: RiYoutubeLine, label: "YouTube" },
  socialLink: { icon: RiGlobalLine, label: "Website" },
};

/** Links are saved as typed; one without a scheme would open as a local path. */
const toUrl = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

/**
 * One vendor's application to a stall or offer: who they are, how to reach
 * them, their gallery, and Accept / Reject. There's no endpoint for a single
 * application, so it's found in the slot's list (usually cached already).
 */
export function VendorApplicationPage({
  type,
}: {
  type: "Revenue" | "Service";
}) {
  const { slotId = "", applicationId = "" } = useParams();
  const { slots: applications, isLoading } =
    useVendorApplicationsSlotsByType(slotId);
  console.log("applications", applications, slotId, applicationId);
  const accept = useAcceptVendorApplication();
  const reject = useRejectVendorApplication();

  const backTo = getRoutePath(
    type === "Revenue" ? "revenue_vendor_slot" : "service_vendor_slot",
    { slotId },
  );

  if (isLoading) return <LoadingFallback />;

  const application = applications.find(
    (item) => String(item.id) === applicationId,
  );

  if (!application) {
    return (
      <section className="w-full flex flex-col items-center gap-3 px-5 py-16 text-center font-inter-tight">
        <p className="text-base font-semibold text-black">
          This application couldn’t be found.
        </p>
        <Link to={backTo} className="text-sm text-deep-red underline">
          Back to vendors
        </Link>
      </section>
    );
  }

  const business = application.vendorBusinessData;
  const about = application.vendorDescription || business?.aboutBusiness;
  const gallery = business?.gallery ?? [];
  const portfolio = business?.portfolio?.webUrl || business?.portfolio?.fileUrl;
  const stalls =
    application.noOfRequestedStalls || application.requestedSlots || 1;
  const isDeciding = accept.isPending || reject.isPending;
  const status = APPLICATION_STATUS[application.status];

  // Revenue: what the requested stalls cost. Service: what the vendor asks.
  const price =
    type === "Revenue"
      ? (application.vendorDetails?.slotData?.price ?? 0) * stalls
      : application.proposedPrice || application.priceOffer;

  // Only what the vendor filled in, in the design's order.
  const contacts: { href: string; icon: IconType; label: string }[] = [
    ...(application.vendorPhone
      ? [{ href: `tel:${application.vendorPhone}`, icon: RiPhoneLine, label: "Call" }]
      : []),
    ...(portfolio
      ? [{ href: toUrl(portfolio), icon: RiLinksLine, label: "Portfolio" }]
      : []),
    ...Object.entries(SOCIAL_ICONS)
      .map(([key, social]) => ({
        url: business?.socials?.[key as keyof typeof SOCIAL_ICONS],
        ...social,
      }))
      .filter((social) => social.url?.trim())
      .map(({ url, icon, label }) => ({ href: toUrl(url!), icon, label })),
    ...(application.vendorEmail
      ? [{ href: `mailto:${application.vendorEmail}`, icon: RiMailLine, label: "Email" }]
      : []),
  ];

  const decision = { applicationId: application.id };

  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="w-full bg-white flex flex-wrap items-start justify-between gap-4 px-5 py-6">
        <div className="flex flex-col gap-1">
          <Link
            to={backTo}
            className="flex w-fit items-center gap-0.5 font-inter-tight text-sm text-black hover:underline"
          >
            <RiArrowLeftSLine className="size-4" />
            Vendors
          </Link>
          <p className="font-inter-tight text-2xl font-bold text-black capitalize">
            {application.vendorBusinessName}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 font-inter-tight text-sm text-black">
            <span className="capitalize">
              {stripUnderscores(application.category)}
            </span>
            {type === "Revenue" && (
              <span className="text-[#007AFF]">
                Requests For {stalls} {stalls === 1 ? "Slot" : "Slots"}
              </span>
            )}
          </p>
        </div>

        {application.status === "Pending" ? (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              disabled={isDeciding}
              onClick={() => reject.mutate(decision)}
              className="h-9 rounded-lg bg-deep-red px-4 font-inter-tight text-sm text-white hover:bg-deep-red/90"
            >
              {reject.isPending ? "Rejecting..." : "Reject Vendor"}
            </Button>
            <Button
              type="button"
              disabled={isDeciding}
              onClick={() => accept.mutate(decision)}
              className="h-9 rounded-lg bg-green px-4 font-inter-tight text-sm text-white hover:bg-green/90"
            >
              {accept.isPending ? "Accepting..." : "Accept Vendor"}
            </Button>
          </div>
        ) : (
          // Already decided: say where it stands instead of offering the buttons.
          <p className={cn("font-inter-tight text-sm font-semibold", status?.className)}>
            {status?.label ?? application.status}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col gap-6 px-5 py-6 md:py-8">
        {price ? (
          <div className="w-full flex items-center gap-2 rounded-lg bg-green/20 px-4 py-3 font-inter-tight text-sm font-semibold text-green">
            <RiInformationLine className="size-5 shrink-0" />
            {type === "Revenue" ? "Requested slot price" : "Proposed price"} :{" "}
            {formatNaira(price)}
          </div>
        ) : null}

        <div className="w-full flex flex-col gap-3 rounded-xl bg-white p-5">
          <p className="font-inter-tight text-xl font-bold text-black">
            Contact Details
          </p>
          {contacts.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              {contacts.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex size-9 items-center justify-center rounded-full border border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          ) : (
            <p className="font-inter-tight text-sm text-mid-dark-gray">
              No contact details shared.
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-2 rounded-xl bg-white p-5">
          <p className="font-inter-tight text-base font-bold text-black">
            About Vendor
          </p>
          <RichTextContent
            value={about || "No description provided."}
            className="font-inter-tight text-sm text-black"
          />
        </div>

        <div className="w-full flex flex-col gap-3 rounded-xl bg-white p-5">
          <div className="flex flex-col gap-1">
            <p className="font-inter-tight text-xl font-bold text-black">
              Gallery
            </p>
            <p className="font-inter-tight text-sm text-black">
              Photos shared by the vendor.
            </p>
          </div>
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {gallery.map((image, index) => (
                <a key={image} href={image} target="_blank" rel="noopener noreferrer">
                  <img
                    src={image}
                    alt={`${application.vendorBusinessName} gallery ${index + 1}`}
                    className="w-full aspect-square object-cover bg-black/5"
                  />
                </a>
              ))}
            </div>
          ) : (
            <p className="font-inter-tight text-sm text-mid-dark-gray">
              No photos shared yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
