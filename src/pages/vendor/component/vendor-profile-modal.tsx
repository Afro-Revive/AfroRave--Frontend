import BaseModal from "@/components/reusable/base-modal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsFrom, stripUnderscores } from "@/lib/helper-func";
import { cn } from "@/lib/utils";
import type { VendorSlotApplication } from "@/types/vendor";
import { Mail, Phone, Link as LinkIcon } from "lucide-react";

interface VendorProfileModalProps {
  application: VendorSlotApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VendorProfileModal({
  application,
  open,
  onOpenChange,
}: VendorProfileModalProps) {
  const business = application.vendorBusinessData;
  const avatar = application.vendorProfilePicture || business?.profilePicture;
  const description =
    application.vendorDescription ||
    business?.aboutBusiness ||
    application.description;
  const portfolioUrl =
    business?.portfolio?.webUrl || business?.portfolio?.fileUrl;
  const gallery = business?.gallery ?? [];

  // Socials come back as a fixed object; drop the empty ones rather than
  // rendering a row of dead links.
  const socials = Object.entries(business?.socials ?? {}).filter(
    ([, url]) => typeof url === "string" && url.trim().length > 0,
  ) as [string, string][];

  const isDecided = application.status !== "Pending";
  // Revenue reads green, service yellow — same tint/text pairing as the
  // "Application Ongoing" badge on the slot modal.
  const isRevenue = application.vendorType === "Revenue";

  return (
    <BaseModal
      open={open}
      onClose={onOpenChange}
      size="large"
      floatingCancel
      className="bg-white sm:max-w-[650px]"
    >
      <div className="flex flex-row justify-start px-6 mt-10 items-baseline gap-3 w-full">
        <Avatar className="w-16 h-16">
          <AvatarImage src={avatar} alt="" className="object-cover" />
          <AvatarFallback className="bg-mid-dark-gray/20 text-black font-inter text-lg">
            {initialsFrom(application.vendorBusinessName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col ">
          <p className="font-sf-pro-display font-bold text-base text-system-black capitalize truncate">
            {application.vendorBusinessName}
          </p>
          <p className="font-sf-pro-display text-sm text-system-black capitalize truncate">
            {stripUnderscores(application.category)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 w-fit font-inter text-[11px] uppercase tracking-wide",
            isRevenue
              ? "bg-[#00AD2E] text-white"
              : "bg-[#FBEEC1] text-[#B7860B]",
          )}
        >
          {application.vendorType} Vendor
        </span>
        <p className="font-sf-pro-display text-sm text-mid-dark-gray leading-relaxed">
          {description || "No description provided."}
        </p>
      </div>
      <div className="max-h-[80vh] overflow-y-auto px-5 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Details ── */}

          <div className="flex flex-col gap-2">
            <p className="font-inter font-bold text-sm uppercase text-system-black">
              About
            </p>
            <p className="font-sf-pro-display text-sm text-mid-dark-gray leading-relaxed">
              {description || "No description provided."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-inter font-bold text-sm uppercase text-system-black">
              Contact Details
            </p>

            {application.vendorEmail && (
              <a
                href={`mailto:${application.vendorEmail}`}
                className="flex items-center gap-2 font-sf-pro-display text-sm text-black hover:underline"
              >
                <Mail className="w-4 h-4 text-mid-dark-gray shrink-0" />
                <span className="truncate">{application.vendorEmail}</span>
              </a>
            )}

            {application.vendorPhone && (
              <p className="flex items-center gap-2 font-sf-pro-display text-sm text-black">
                <Phone className="w-4 h-4 text-mid-dark-gray shrink-0" />
                {application.vendorPhone}
              </p>
            )}

            {portfolioUrl && (
              <a
                href={portfolioUrl.startsWith("http") ? portfolioUrl : "#"}
                target={portfolioUrl.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-sf-pro-display text-sm text-black hover:underline"
              >
                <LinkIcon className="w-4 h-4 text-mid-dark-gray shrink-0" />
                {portfolioUrl.startsWith("http")
                  ? "View portfolio"
                  : "View file"}
              </a>
            )}

            {socials.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {socials.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-mid-dark-gray/30 px-3 py-1 font-inter text-[11px] capitalize text-mid-dark-gray hover:border-black hover:text-black transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Gallery ── */}
          <div className="lg:w-[320px] shrink-0 flex flex-col gap-3">
            <p className="font-inter font-bold text-sm uppercase text-system-black">
              Gallery
            </p>
            {gallery.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {gallery.map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt={`${application.vendorBusinessName} gallery ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg bg-black/5"
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[160px] rounded-lg border border-dashed border-mid-dark-gray/30">
                <p className="font-sf-pro-display text-xs text-mid-dark-gray">
                  No gallery images
                </p>
              </div>
            )}
          </div>
        </div>

        {/* TODO: not wired to the API — there is no accept/reject application
            endpoint yet, so these only close the modal. */}
        <div className="flex flex-col sm:flex-row gap-3 pt-8">
          <Button
            type="button"
            disabled={isDecided}
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10 rounded-full font-inter text-xs uppercase font-semibold bg-[#00AD2E] text-white hover:bg-[#00AD2E]/90 disabled:opacity-50"
          >
            Accept Vendor
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDecided}
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10 rounded-full font-inter text-xs uppercase font-semibold disabled:opacity-50"
          >
            Reject Vendor
          </Button>
        </div>
        {isDecided && (
          <p className="pt-2 text-center font-inter text-[11px] text-mid-dark-gray">
            This application was already {application.status.toLowerCase()}.
          </p>
        )}
      </div>
    </BaseModal>
  );
}
