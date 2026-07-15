import {
  Sidebar,
  SidebarMenu,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { BaseAccordion } from "./base-accordion";
import { Link } from "react-router-dom";
import type { ICreatorSidebarLinks } from "@/layouts/creator-dashboard-layout/creator-side-bar";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft } from "lucide-react";

export function BaseSideBar({
  side = "left",
  variant = "sidebar",
  collapsible = "none",
  className,
  contentClassName,
  sidebar_links,
  collapsibleOnMobile = false,
  mobileFullscreen = false,
  children,
  footerItem,
}: IBaseSidebar) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { openMobile, setOpenMobile } = useSidebar();

  const effectiveCollapsible =
    collapsibleOnMobile && isMobile ? "offcanvas" : collapsible;

  const menuItems = (onLinkClick?: () => void) => (
    <>
      {sidebar_links?.map((item) => {
        const isActive = item.links.some(
          (link) =>
            location.pathname === link.path ||
            location.pathname.startsWith(`${link.path}/`)
        );
        return (
          <AccordionSidebarMenuItem
            key={item.trigger.text}
            links={item.links}
            trigger={item.trigger.text}
            isActive={isActive}
            icon={item.trigger.icon}
            onLinkClick={onLinkClick}
          />
        );
      })}
      {children}
    </>
  );

  if (mobileFullscreen && isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 bg-white flex flex-col overflow-y-auto",
          "top-16 transition-all duration-300 ease-in-out",
          openMobile
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => setOpenMobile(false)}
            className="flex items-center gap-2 text-black/70 hover:text-black transition-colors"
          >
            <ChevronLeft size={30} />
          </button>
        </div>
        <div className="flex-1 pt-4">
          {menuItems(() => setOpenMobile(false))}
        </div>
        {footerItem && (
          <div className="mt-auto w-full" onClick={() => setOpenMobile(false)}>
            {footerItem}
          </div>
        )}
      </div>
    );
  }

  return (
    <Sidebar
      side={side}
      variant={variant}
      collapsible={effectiveCollapsible}
      className={cn(className, "w-[320px] min-h-screen h-fit bg-white border-r-[0.5px] border-r-gray-200")}
    >
      <SidebarContent className={cn(contentClassName, "flex flex-col h-full")}>
        <SidebarGroup className="px-0 flex-1">
          <SidebarGroupLabel className="sr-only">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems()}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {footerItem && (
          <div className="mt-auto w-full">
            {footerItem}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

function AccordionSidebarMenuItem({
  links,
  trigger,
  isActive,
  icon,
  onLinkClick,
}: {
  links: ICreatorSidebarLinks["links"];
  trigger: string;
  isActive: boolean;
  icon: React.ReactNode;
  onLinkClick?: () => void;
}) {
  const location = useLocation();

  return (
    <BaseAccordion
      style="dashboard"
      icon={icon}
      trigger={trigger}
      isActive={isActive}
    >
      {links.map((item) => {
        const isActiveLink =
          location.pathname === item.path ||
          location.pathname.startsWith(`${item.path}/`);

        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onLinkClick}
            className={cn(
              "w-full flex items-center px-6 h-[64px] text-xs font-sf-pro-text uppercase transition-colors duration-300",
              {
                "border-l-[3px] bg-deep-red/16 border-l-deep-red text-black":
                  isActiveLink,
                "text-black/60 hover:bg-deep-red/10": !isActiveLink,
              }
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </BaseAccordion>
  );
}

interface IBaseSidebar {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "none" | "offcanvas" | "icon";
  className?: string;
  contentClassName?: string;
  sidebar_links?: ICreatorSidebarLinks[];
  collapsibleOnMobile?: boolean;
  mobileFullscreen?: boolean;
  children?: React.ReactNode;
  footerItem?: React.ReactNode;
}
