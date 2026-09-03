import { account_links } from "@/components/constants";
import { UserMenuButton } from "@/components/reusable/user-menu-button";
import { cn } from "@/lib/utils";
import { useAfroStore } from "@/stores";
import { Link, useLocation } from "react-router-dom";
import { NavLogo } from "../root-layout/header/nav-logo";

export default function AccountHeader() {
  const { user } = useAfroStore();
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-[#1A1A1A]">
      <nav className="w-full px-4 md:px-10 h-[80px] flex items-center justify-between">

        {/* Left: Logo and Menu Trigger */}
        <div className="flex items-center gap-4">
          {/* <button
            onClick={onMenuToggle}
            className="md:hidden text-white p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button> */}
          <div className="w-[120px] md:w-[140px]">
            <NavLogo />
          </div>
        </div>

        {/* Center/Right: Navigation Links */}
        <div className="flex-1 flex justify-end md:justify-center md:mr-10">
          <NavigationLinks />
        </div>

        {/* Right: Avatar */}
        <div className="shrink-0 flex items-center justify-end">
          <UserMenuButton user={user} />
        </div>

      </nav>
    </header>
  );
}

function NavigationLinks() {
  const location = useLocation();

  const isLinkActive = (itemLink: string) => {
    if (itemLink.includes('?')) {
      const linkQuery = itemLink.split('?')[1];
      return location.search.includes(linkQuery);
    }

    if (location.pathname === itemLink) {
      if (itemLink.endsWith('/account') && location.search.includes('account=wallet')) {
        return false;
      }
      return true;
    }

    return false;
  };

  // Red filter for icons
  const redFilter = 'brightness(0) saturate(100%) invert(19%) sepia(98%) saturate(6947%) hue-rotate(356deg) brightness(91%) contrast(113%)';

  return (
    <div className="hidden md:flex items-center gap-6 lg:gap-10">
      {account_links.map((item) => {
        const active = isLinkActive(item.link);

        return (
          <Link
            key={item.name}
            to={item.link}
            className={cn(
              "relative flex items-center gap-2 transition-all pb-1 group font-input-mono",
              active ? "opacity-100 text-white" : "opacity-60 hover:opacity-100 text-white"
            )}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-4 h-4"
              style={{
                filter: redFilter
              }}
            />
            <span className="text-[12px] uppercase tracking-[0.05em] font-medium">
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
