import { useState } from "react";
import BaseModal from "@/components/reusable/base-modal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initialsFrom, stripUnderscores } from "@/lib/helper-func";
import { cn } from "@/lib/utils";
import type { VendorSlotApplication } from "@/types/vendor";
import { Mail, Phone, Link as LinkIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useAcceptVendorApplication, useRejectVendorApplication } from "@/hooks/use-vendor-mutation";

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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const business = application.vendorBusinessData;
  const avatar = application.vendorProfilePicture || business?.profilePicture;
  const description = application.vendorDescription || business?.aboutBusiness;
  const portfolioUrl =
    business?.portfolio?.webUrl || business?.portfolio?.fileUrl;
  const gallery = business?.gallery ?? [];

  const { mutate: acceptVendorApplicationMutation, isPending: isAccepting } = useAcceptVendorApplication();
  const { mutate: rejectVendorApplicationMutation, isPending: isRejecting } = useRejectVendorApplication();

  // Socials come back as a fixed object; drop the empty ones rather than
  // rendering a row of dead links.
  const socials = Object.entries(business?.socials ?? {}).filter(
    ([, url]) => typeof url === "string" && url.trim().length > 0,
  ) as [string, string][];

  const isDecided = application.status !== "Pending";
  const isRevenue = application.vendorType === "Revenue";

  return (
    <>
    <BaseModal
      open={open}
      onClose={onOpenChange}
      size="large"
      floatingCancel
      className="bg-white sm:max-w-[650px]"
    >
      <div className="flex flex-row justify-start px-6 pt-8 py-6 border-b border-b-gray-400 items-baseline gap-3 w-full">
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
      <div className="pt-6 px-6 bg-[#EEEEEE]">
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-2 bg-white w-1/2 p-2 rounded-md text-black">
            <p className="font-inter font-bold md:text-base text-sm">
              Vendor Description
            </p>
            <span
              className={cn(
                "rounded-full w-fit font-inter text-[11px] uppercase tracking-wide",
                isRevenue ? "text-[#00AD2E]" : "text-orange-peel",
              )}
            >
              {application.vendorType} Vendor
            </span>
            <p className="font-sf-pro-display text-sm text-mid-dark-gray leading-relaxed">
              {description || "No description provided."}
            </p>
          </div>
          <div className="flex flex-col w-1/2 gap-2">
            <div className="flex flex-col gap-2 text-black rounded-md bg-white p-2">
              <p className="font-inter font-bold md:text-base text-sm">
                Details
              </p>
              <div className="flex flex-col gap-0.5">
                <p className="font-sf-pro-display font-bold md:text-base text-sm">
                  {application.vendorBusinessName}
                </p>
                <p className="font-sf-pro-display text-xs">
                  {stripUnderscores(application.category)}
                </p>
              </div>
              {
                !isRevenue ? (
                  <div className="flex flex-col gap-3">
                  <p>
                    <span className="font-inter font-medium text-sm">
                      Budget Range:{" "}
                      <span className="font-inter font-light text-sm">
                        {application.vendorDetails.serviceData.minBudget} - {application.vendorDetails.serviceData.maxBudget}
                      </span>
                    </span>
                  </p>
                  <p>
                    <span className="font-inter font-medium text-sm">
                      Requested Price:{" "}
                      <span className="font-inter font-light text-sm">
                        {application.proposedPrice}
                      </span>
                    </span>
                  </p>
                  </div>
                ): (
                  <div className="flex flex-col gap-2">
                    <p>
                      <span className="font-inter font-medium text-sm text-tech-blue">
                        Stalls Requested:{" "}
                        <span className="font-inter font-light text-sm">
                          {application.noOfRequestedStalls}
                        </span>
                      </span>
                    </p>
                    <span className="font-inter font-medium text-sm">
                      Price Per Stall:{" "}
                      <span className="font-inter font-light text-sm">
                        {application.vendorDetails.slotData.price}
                      </span>
                    </span>
                    <span>
                      <span className="font-inter font-medium text-sm">
                        Total Price:{" "}
                        <span className="font-inter font-light text-sm">
                          {application.vendorDetails.slotData.price * application.noOfRequestedStalls}
                        </span>
                      </span>
                    </span>
                    </div>
                )
              }
            </div>

            {/* Opens the full gallery rather than crowding the column. */}
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="flex items-center justify-between gap-2 text-left text-white rounded-md bg-[#ACACAC] p-2 transition-opacity hover:opacity-90"
            >
              <p className="font-sf-pro-display font-bold text-sm">
                View Gallery
              </p>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 pb-6 pt-5">
          <div className="flex flex-col gap-3 text-black rounded-md bg-white p-2">
            <p className="font-inter font-bold md:text-base text-sm">
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
                  target={
                    portfolioUrl.startsWith("http") ? "_blank" : undefined
                  }
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

          {/* TODO: not wired to the API — there is no accept/reject application
            endpoint yet, so these only close the modal. */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
             <Button
              type="button"
              variant="destructive"
              disabled={isDecided}
              onClick={() => rejectVendorApplicationMutation({applicationId:application.id}, {
                onSuccess: () => {
                  onOpenChange(false);
                },
              })}
              className="flex-1 h-10 rounded-full font-inter text-xs uppercase font-semibold disabled:opacity-50"
            >
              {isRejecting ? "Rejecting..." : "Reject Vendor"}
            </Button>
            <Button
              type="button"
              disabled={isDecided}
              onClick={() => acceptVendorApplicationMutation({applicationId:application.id}, {
                onSuccess: () => {
                  onOpenChange(false);
                },
              })}
              variant="default"
              className="flex-1 h-10 rounded-full font-inter text-xs uppercase font-semibold bg-black text-white hover:bg-black/90 disabled:opacity-50"
            >
             {isAccepting ? "Accepting..." : "Accept Vendor"}
            </Button>
           
          </div>
          {isDecided && (
            <p className="pt-2 text-center font-inter text-[11px] text-mid-dark-gray">
              This application was already {application.status.toLowerCase()}.
            </p>
          )}
        </div>
      </div>
    </BaseModal>

      {/* Sibling rather than nested, so the two dialogs do not stack. */}
      <BaseModal
        open={isGalleryOpen}
        onClose={setIsGalleryOpen}
        size="large"
        floatingCancel
        title={`${application.vendorBusinessName} Gallery`}
        titleClassName="font-sf-pro-display py-4 border-b border-b-gray-300"
        className="bg-white sm:max-w-[800px]"
      >
        <div className="max-h-[75vh] overflow-y-auto p-4 md:p-6">
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            <div className="flex items-center justify-center h-[200px] rounded-lg border border-dashed border-mid-dark-gray/30">
              <p className="font-sf-pro-display text-sm text-mid-dark-gray">
                No gallery images
              </p>
            </div>
          )}
        </div>
      </BaseModal>
    </>
  );
}
