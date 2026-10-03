import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getRoutePath } from "@/config/get-route-path";
import CreatorDashboardHeader from "./header";
import CreatorSidebar from "./creator-side-bar";

export default function CreatorDashboardLayout() {
  const location = useLocation();

  // The events dashboard is a standalone, full-width page — the sidebar isn't
  // collapsed there, it isn't rendered. SidebarProvider still wraps everything
  // because the header's trigger reads from its context.
  const isEventsDashboard = location.pathname === getRoutePath("standalone");

  return (
    <SidebarProvider className="w-full flex flex-col items-center bg-gradient-to-b from-[#F3F3F3] to-[#D9D9D9]">
      <CreatorDashboardHeader />

      <main className="relative w-full flex">
        {!isEventsDashboard && <CreatorSidebar />}

        <div className="w-full flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
