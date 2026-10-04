import { BaseSideBar } from "@/components/reusable/base-sidebar";
import { getRoutePath } from "@/config/get-route-path";
import { CalendarIcon } from "@/components/icons/calendar";
import { ChartIcon } from "@/components/icons/chart";
import { VendorIcon } from "@/components/icons/vendor";
import { ToolsIcon } from "@/components/icons/tools";

import { CreatorSettingsModal } from "@/pages/creators/standalone/components/creator-settings-modal";
import { BiArrowBack } from "react-icons/bi";
import { Ticket2 } from "iconsax-react";
import { useEventSelectorStore } from "@/stores";
import { useVendorSlotsByType } from "@/hooks/use-vendor-mutation";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SelectedEventCard } from "./selected-event-card";

/** `/creators/edit/` — derived rather than hardcoded so it tracks route-map. */
const EDIT_EVENT_PREFIX = getRoutePath("edit_event", { eventId: "" });

/**
 * The id of the event whose details are open, read off the URL. useParams is no
 * help here: this sidebar renders in the layout, above the route that declares
 * :eventId, so it would come back empty.
 */
function useOpenEventId(): string | undefined {
  const { pathname } = useLocation();

  if (!pathname.startsWith(EDIT_EVENT_PREFIX)) return undefined;

  return pathname.slice(EDIT_EVENT_PREFIX.length).split("/")[0] || undefined;
}

export default function CreatorSidebar() {
  const { selectedEventId, setSelectedEventId } = useEventSelectorStore();
  const { revenueSlots, serviceSlots } = useVendorSlotsByType(
    selectedEventId ?? ""
  );

  const routeEventId = useOpenEventId();

  // Only the edit route carries the id, so it's remembered here. Without this
  // the EVENTS group unmounted the moment you moved to Tickets or Analytics —
  // and a remounted accordion comes back collapsed.
  useEffect(() => {
    if (routeEventId && routeEventId !== selectedEventId) {
      setSelectedEventId(routeEventId);
    }
  }, [routeEventId, selectedEventId, setSelectedEventId]);

  const openEventId = routeEventId ?? selectedEventId ?? undefined;

  const creator_sidebar_links: ICreatorSidebarLinks[] = [
    {
      trigger: { icon: <CalendarIcon />, text: "EVENTS" },
      links: openEventId
        ? [
            {
              path: getRoutePath("edit_event", { eventId: openEventId }),
              name: "EVENT DETAILS",
            },
          ]
        : [],
    },
    {
      trigger: { icon: <Ticket2 size={16} variant="Outline" />, text: "TICKETS" },
      links: [
        { path: getRoutePath("tickets"), name: "YOUR TICKETS" },
        { path: getRoutePath("guest_list"), name: "GUEST LIST" },
        { path: getRoutePath("promo_codes"), name: "PROMO CODES" },
      ],
    },
    {
      trigger: { icon: <ChartIcon />, text: "ANALYTICS" },
      links: [
        { path: getRoutePath("reports"), name: "REPORTS" },
        { path: getRoutePath("charts"), name: "CHARTS" },
        { path: getRoutePath("realtime"), name: "REALTIME" },
      ],
    },
    {
      trigger: { icon: <VendorIcon />, text: "VENDOR" },
      links: [
        {
          path: getRoutePath("revenue_vendor"),
          name: "REVENUE VENDOR",
          subLinks: revenueSlots.length
            ? revenueSlots.map((slot) => ({
                path: getRoutePath("revenue_vendor_slot", {
                  slotId: slot.vendorId,
                }),
                name: slot.vendorDetails.slotData.slotName,
                category: slot.vendorCategory,
              }))
            : undefined,
        },
        {
          path: getRoutePath("service_vendor"),
          name: "SERVICE VENDOR",
          subLinks: serviceSlots.length
            ? serviceSlots.map((slot) => ({
                path: getRoutePath("service_vendor_slot", {
                  slotId: slot.vendorId,
                }),
                name: slot.vendorDetails.serviceData.serviceName,
                category: slot.vendorCategory,
              }))
            : undefined,
        },
      ],
    },
    {
      trigger: { icon: <ToolsIcon />, text: "TOOLS" },
      links: [
        { path: getRoutePath("access_control"), name: "ACCESS CONTROL" },
        { path: getRoutePath("seating_maps"), name: "SEATING MAPS" },
      ],
    },
  ];

  return (
    <BaseSideBar
      className="pt-8 sticky top-0"
      sidebar_links={creator_sidebar_links}
      headerItem={<SelectedEventCard eventId={openEventId} />}
      collapsibleOnMobile={true}
      mobileFullscreen={true}
      footerItem={
        <CreatorSettingsModal
          customTrigger={
            // <div className="flex items-center gap-2.5 px-6 py-4 cursor-pointer hover:bg-gray-50 bg-white border-t border-gray-100 transition-colors group w-full">
            //   <Settings className="size-[18px] text-black group-hover:text-deep-red transition-colors" />
            //   <span className="text-[13px] font-normal tracking-widest text-black font-sf-pro-display uppercase">SETTINGS</span>
            // </div>
            <Link to={getRoutePath("standalone")} className="flex items-center gap-2.5 px-6 py-7 cursor-pointer hover:bg-gray-50 bg-white border-t border-[#949494] transition-colors group w-full">
              <span className="inline-flex items-center gap-4">
                <BiArrowBack className="size-4 text-black group-hover:text-deep-red transition-colors" />
               <p className="font-inter-tight font-semibold text-sm text-system-black"> Your Events </p> 
              </span>
            </Link>
          }
        />
      }
    />
  );
}

export interface ICreatorSidebarLinks {
  trigger: { icon: React.ReactNode; text: string };
  defaultOpen?: boolean;
  links: {
    path: string;
    name: string;
    subLinks?: { path: string; category: string; name: string }[];
  }[];
}
