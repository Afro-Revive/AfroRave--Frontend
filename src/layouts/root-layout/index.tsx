import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { useFansRadialBackground } from "@/hooks/use-fans-radial-background";
import Header from "./header";
import Footer from "./footer";
import { AuthModal } from "@/components/auth/auth-modal";

export default function IndexLayout() {
  const hasRadialBackground = useFansRadialBackground();

  return (
    <AuthProvider>
      {/* Wrapper carries the backdrop so it sits behind the header and footer. */}
      <div
        className={cn("min-h-screen", hasRadialBackground && "bg-fans-radial")}
      >
        <Header />
        <AuthModal />

        <main className="w-full flex flex-col items-center">
          <Outlet />
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}
