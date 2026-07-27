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
import { ChevronLeft, ChevronRight } from "lucide-react";

function isPathActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

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
            isPathActive(location.pathname, link.path) ||
            link.subLinks?.some((sub) =>
              isPathActive(location.pathname, sub.path),
            ),
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
      className={cn(
        className,
        "w-[320px] min-h-screen h-fit bg-white border-r-[0.5px] border-r-gray-200",
      )}
    >
      <SidebarContent className={cn(contentClassName, "flex flex-col h-full")}>
        <SidebarGroup className="px-0 flex-1">
          <SidebarGroupLabel className="sr-only">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{menuItems()}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {footerItem && <div className="mt-auto w-full">{footerItem}</div>}
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
        const isActiveLink = isPathActive(location.pathname, item.path);

        if (item.subLinks && item.subLinks.length > 0) {
          const isSubActive = item.subLinks.some((sub) =>
            isPathActive(location.pathname, sub.path),
          );

          return (
            <BaseAccordion
              key={item.name}
              style="dashboard"
              trigger={item.name}
              isActive={isActiveLink || isSubActive}
              triggerClassName={cn({
                "border-l-[3px] bg-deep-red/16 rounded-none border-l-deep-red":
                  isActiveLink || isSubActive,
              })}
            >
              {item.subLinks.map((sub) => {
                const isActiveSubLink = isPathActive(
                  location.pathname,
                  sub.path,
                );

                return (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    onClick={onLinkClick}
                    className={cn(
                      "w-full flex items-center px-6 h-[56px] text-xs font-inter uppercase transition-colors duration-300",
                      {
                        " text-deep-red": isActiveSubLink,
                        "text-black hover:bg-deep-red/10": !isActiveSubLink,
                      },
                    )}
                  >
                    <div className="flex flex-row justify-between items-center w-full ">
                      <div className="flex flex-col">
                        {sub.name}
                        {sub.category && (
                          <span className="text-xs font-inter text-gray-500">
                            {sub.category}
                          </span>
                        )}
                      </div>
                      <div>
                        <ChevronRight size={20} className="ml-auto text-light-red" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </BaseAccordion>
          );
        }

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
                "text-black hover:bg-deep-red/10": !isActiveLink,
              },
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
