import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRoutePath } from "@/config/get-route-path";
import { useAuth } from "@/contexts/auth-context";
import { useLogout } from "@/hooks/use-auth";
import { cn, getUserInitials } from "@/lib/utils";
import { useAfroStore } from "@/stores";
import {
  IoLogoInstagram,
  IoReceiptOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { FaReceipt } from "react-icons/fa6";
import { FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import { BsTicketPerforated } from "react-icons/bs";
import {
  MdOutlineContactSupport,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import type { IconType } from "react-icons";
import {
  ChevronRight,
  CircleUserRound,
  Minus,
  Plus,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { app_store_links } from "../footer";

interface MobileMenuProps {
  onClose: () => void;
}

export default function SideBarMenu({ onClose }: MobileMenuProps) {
  const { isAuthenticated, user } = useAfroStore();

  return (
    <div className="flex flex-col h-full z-[10] overflow-y-auto scrollbar-none px-6">
      {isAuthenticated && (
        <span className="absolute top-4 left-5 flex w-12 h-12 border-white border items-center justify-center rounded-full bg-charcoal font-sf-pro-text text-sm font-black uppercase text-white">
          {getUserInitials(user)}
        </span>
      )}

      {isAuthenticated ? <AccountLinks onClose={onClose} /> : <AuthButtons />}

      <Separator
        className={cn("bg-white/20 mb-6 ", {
          "mt-[19px]": isAuthenticated,
          "mt-4": !isAuthenticated,
        })}
      />

      <div className="flex flex-col gap-3 ">
        {menuLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            onClick={onClose}
            className="text-white hover:text-white transition-colors font-work-sans text-xl hover:underline"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className=" py-6">
        <Separator className="bg-white/20 mb-6" />
        <p className="text-white font-bold font-inter-tight text-right text-base mb-4">
          Get The Afrorevive App
        </p>

        <div className="flex items-center justify-end gap-3 md:mb-8 mb-6">
          {app_store_links.map((store) => (
            <a
              key={store.alt}
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={store.alt}
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={store.src}
                alt={store.alt}
                className="h-9 md:h-10 w-auto object-contain"
              />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-end">
          {socials.map((social) => (
            <Link
              key={social.alt}
              to={social.href}
              onClick={onClose}
              className="cursor-pointer hover:opacity-80"
              aria-label={social.alt}
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthButtons() {
  const { openAuthModal } = useAuth();

  return (
    <div className="flex flex-col gap-4 py-6">
      <Button
        className="w-full h-12 bg-white text-black hover:bg-white/90"
        onClick={() => openAuthModal("login", "guest")}
      >
        Log In
      </Button>
      <Button
        variant="secondary"
        onClick={() => openAuthModal("signup", undefined)}
        className="w-full h-12  border-white text-white hover:bg-white/10"
      >
        Sign Up
      </Button>
    </div>
  );
}

// Each row draws its own top rule, and the section draws the closing one, so
// the dividers land between the header and every item without doubling up.
const submenu_link_class =
  "flex w-full items-center justify-between gap-3 border-t border-white/10 py-4 text-left text-white transition-opacity hover:opacity-70";

/**
 * Phones and upright tablets get the full account/orders breakdown; from md up
 * the sheet is a secondary nav beside the avatar menu
 */
function AccountLinks({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="md:hidden">
        <AccountAccordion onClose={onClose} />
      </div>

      <div className="hidden md:block">
        <DashboardLink onClose={onClose} />
      </div>
    </>
  );
}

function DashboardLink({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-[19px] py-6">
      <Link
        to={getRoutePath("account")}
        onClick={onClose}
        className="w-full py-4 pl-[22px] pr-[11px] bg-charcoal rounded-[8px] flex items-center justify-between"
      >
        <div className="flex items-center gap-[5px]">
          <MdOutlineSpaceDashboard className="w-[19px] h-[19px]" />
          <p className="font-work-sans text-sm font-bold">DASHBOARD</p>
        </div>

        <ChevronRight
          color="#ffffff"
          strokeWidth={2}
          className="!min-w-1.5 !min-h-3.5"
        />
      </Link>
    </div>
  );
}

function AccountAccordion({ onClose }: { onClose: () => void }) {
  const logoutMutation = useLogout();

  return (
    <Accordion type="multiple" className="flex flex-col py-6">
      {account_sections.map((section) => (
        <AccordionItem
          key={section.value}
          value={section.value}
          className="border-white/10"
        >
          {/* `group` drives the +/- swap below. [&>svg]:hidden drops the
              component's built-in chevron, which is a direct svg child —
              the icons here are nested, so they're untouched by it. */}
          <AccordionTrigger className="group items-center py-4 hover:no-underline [&>svg]:hidden">
            <div className="flex items-center gap-3">
              {/* White while collapsed, red once open — the same cue on both
                  the icon and the toggle marks which section is expanded. */}
              <section.icon className="size-6 shrink-0 text-white transition-colors group-data-[state=open]:text-deep-red" />
              <span className="font-work-sans text-lg font-bold uppercase text-white">
                {section.label}
              </span>
            </div>

            <span className="text-white transition-colors group-data-[state=open]:text-deep-red">
              <Plus
                strokeWidth={2.5}
                className="size-6 group-data-[state=open]:hidden"
              />
              <Minus
                strokeWidth={2.5}
                className="hidden size-6 group-data-[state=open]:block"
              />
            </span>
          </AccordionTrigger>

          <AccordionContent className="flex flex-col pb-0">
            {section.items.map((item) => {
              const body = (
                <>
                  <span className="flex items-center gap-3">
                    <item.icon className="size-5 shrink-0" strokeWidth={1.5} />
                    <span className="font-work-sans text-base font-bold">
                      {item.name}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0" strokeWidth={2} />
                </>
              );

              return "logout" in item ? (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    onClose();
                    logoutMutation.mutate();
                  }}
                  className={submenu_link_class}
                >
                  {body}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={onClose}
                  className={submenu_link_class}
                >
                  {body}
                </Link>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

type MenuIcon = LucideIcon | IconType;

/** A link, or the log-out action — which is a mutation, not a route. */
type AccountEntry = { name: string; icon: MenuIcon } & (
  | { to: string }
  | { logout: true }
);

interface AccountSection {
  value: string;
  label: string;
  icon: MenuIcon;
  items: AccountEntry[];
}

/**
 * Local to this menu — the shared `account_links` still drives the dashboard
 * navbar and sidebar, which keep their own set of links and icons.
 */
const account_sections: AccountSection[] = [
  {
    value: "account",
    label: "ACCOUNT",
    icon: CircleUserRound,
    items: [
      { name: "Profile", icon: User, to: getRoutePath("account") },
      { name: "Settings", icon: Settings, to: getRoutePath("settings") },
      {
        name: "Support",
        icon: MdOutlineContactSupport,
        to: getRoutePath("support"),
      },
    ],
  },
  {
    value: "orders",
    label: "ORDERS",
    icon: FaReceipt,
    items: [
      {
        name: "My Tickets",
        icon: BsTicketPerforated,
        to: getRoutePath("my_tickets"),
      },
      {
        name: "Listed Tickets",
        icon: IoReceiptOutline,
        to: getRoutePath("listed_tickets"),
      },
      {
        name: "Wallet",
        icon: IoWalletOutline,
        to: `${getRoutePath("account")}?account=wallet`,
      },
    ],
  },
];

const menuLinks = [
  { href: getRoutePath("home"), name: "Discover" },
  { href: getRoutePath("blog"), name: "Blog" },
  { href: getRoutePath("creators"), name: "Creators" },
  { href: getRoutePath("support"), name: "Support" },
  { href: getRoutePath("faq"), name: "FAQ" },
];

const socials = [
  {
    href: "/",
    icon: <IoLogoInstagram className="w-7 h-7" />,
    alt: "Instagram",
  },
  { href: "/", icon: <FaXTwitter className="w-7 h-7" />, alt: "X" },
  { href: "/", icon: <FaTiktok className="w-7 h-7" />, alt: "TikTok" },
  { href: "/", icon: <FaYoutube className="w-7 h-7" />, alt: "Youtube" },
];
