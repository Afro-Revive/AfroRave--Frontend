import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VendorSidebar from "./sections/vendor-side-bar";
import VendorDashboardHeader from "./sections/header";

import { useAfroStore } from "@/stores";
import { useEffect } from "react";

export default function VendorDashboardLayout() {
  const { user, setAuth } = useAfroStore();

  useEffect(() => {
    // Inject mock data if user is missing or doesn't have the correct business name for dev purposes
    if (!user || user.profile.businessName !== "Sooyah Bistro") {
      setAuth({
        userId: "vendor-123",
        email: "eseoseatie22@icloud.com",
        accountType: "Vendor",
        profile: {
          firstName: "Favour",
          lastName: "Eseose Atie",
          businessName: "Sooyah Bistro",
          vendorType: "Food & Drinks",
          phoneNumber: "+234 814 602 7405",
          gender: "Female",
          description: "",
          profilePicture: "",
          gallery: [],
          businessData: {
            portfolio: { webUrl: "https://sooyahbistro.com/portfolio" },
            socials: {
              instagram: "https://instagram.com/sooyahbistro",
              x: "https://x.com/sooyahbistro",
              facebook: "",
              linkedIn: "",
              tikTok: "",
              youTube: "",
              socialLink: "",
            },
          },
        },
        messages: 6,
        createdAt: "2025-04-01T00:00:00.000Z",
      }, "mock-token-123");
    }
  }, [user, setAuth]);

  return (
    <SidebarProvider className="w-full flex flex-col items-center bg-light-gray">
      <VendorDashboardHeader />

      <main className="relative w-full flex">
        <VendorSidebar />

        <SidebarTrigger className="absolute flex md:hidden top-[60px] left-2 text-black" />

        <div className="w-full flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
