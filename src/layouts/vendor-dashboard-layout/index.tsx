import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VendorSidebar from "./sections/vendor-side-bar";
import VendorDashboardHeader from "./sections/header";

export default function VendorDashboardLayout() {

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
