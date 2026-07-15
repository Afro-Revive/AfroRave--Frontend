import { Outlet } from "react-router-dom";
import CreatorDashboardHeader from "./header";
import { SidebarProvider } from "@/components/ui/sidebar";
import CreatorSidebar from "./creator-side-bar";

export default function CreatorDashboardLayout() {
  return (
    <SidebarProvider className="w-full flex flex-col items-center bg-light-gray">
      <CreatorDashboardHeader />

      <main className="relative w-full flex">
        <CreatorSidebar />

        <div className="w-full flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
