import { BaseSideBar } from "@/components/reusable/base-sidebar";
import { getRoutePath } from "@/config/get-route-path";
import { CalendarIcon } from "@/components/icons/calendar";
import { ChartIcon } from "@/components/icons/chart";
import { VendorIcon } from "@/components/icons/vendor";
import { ToolsIcon } from "@/components/icons/tools";

import { CreatorSettingsModal } from "@/pages/creators/standalone/components/creator-settings-modal";
import { Settings } from "lucide-react";
import { useEventSelectorStore } from "@/stores";
import { useVendorSlotsByType } from "@/hooks/use-vendor-mutation";

export default function CreatorSidebar() {
  const { selectedEventId } = useEventSelectorStore();
  const { revenueSlots, serviceSlots } = useVendorSlotsByType(
    selectedEventId ?? ""
  );

  const creator_sidebar_links: ICreatorSidebarLinks[] = [
    {
      trigger: { icon: <CalendarIcon />, text: "EVENTS" },
      links: [
        { path: getRoutePath("standalone"), name: "STANDALONE" },
        { path: getRoutePath("season"), name: "SEASON" },
      ],
    },
    {
      trigger: { icon: <ChartIcon />, text: "ANALYTICS" },
      links: [
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
        { path: getRoutePath("promo_codes"), name: "PROMO CODES" },
        { path: getRoutePath("seating_maps"), name: "SEATING MAPS" },
      ],
    },
  ];

  return (
    <BaseSideBar
      className="pt-24 sticky top-0"
      sidebar_links={creator_sidebar_links}
      collapsibleOnMobile={true}
      collapsibleOnDesktop={true}
      mobileFullscreen={true}
      footerItem={
        <CreatorSettingsModal
          customTrigger={
            <div className="flex items-center gap-2.5 px-6 py-4 cursor-pointer hover:bg-gray-50 bg-white border-t border-gray-100 transition-colors group w-full">
              <Settings className="size-[18px] text-black group-hover:text-deep-red transition-colors" />
              <span className="text-[13px] font-normal tracking-widest text-black font-sf-pro-display uppercase">SETTINGS</span>
            </div>
          }
        />
      }
    />
  );
}

export interface ICreatorSidebarLinks {
  trigger: { icon: React.ReactNode; text: string };
  links: {
    path: string;
    name: string;
    subLinks?: { path: string; category: string; name: string }[];
  }[];
}
