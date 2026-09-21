import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRoutePath } from "@/config/get-route-path";
import { useAuth } from "@/contexts/auth-context";
import { cn, getUserInitials } from "@/lib/utils";
import { useAfroStore } from "@/stores";
import { ChevronRight } from "lucide-react";
import { IoLogoInstagram } from "react-icons/io5";
import { FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { app_store_links } from "../footer";

interface MobileMenuProps {
  onClose: () => void;
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const { isAuthenticated, user } = useAfroStore();

  return (
    <div className="flex flex-col h-full z-[10] overflow-y-auto scrollbar-none px-6">
      {/* Positioned against the sheet so it shares the close button's row —
          that button renders as its own full-width row above these children. */}
      {isAuthenticated && (
        <span className="absolute top-4 left-5 flex w-12 h-12 border-white border items-center justify-center rounded-full bg-charcoal font-sf-pro-text text-sm font-black uppercase text-white">
          {getUserInitials(user)}
        </span>
      )}

      {isAuthenticated ? <AccountLinks onClose={onClose} /> : <AuthButtons />}

      {/* {isAuthenticated && <LogOutButton />} */}

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

function AccountLinks({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-[19px] py-6">
      {mobile_account_links.map((item) => (
        <Link
          key={item.name}
          to={item.link}
          onClick={onClose}
          className="w-full py-4 pl-[22px] pr-[11px] bg-charcoal rounded-[8px] flex items-center justify-between"
        >
          <div className="flex items-center gap-[5px]">
            <item.icon className="w-[19px] h-[19px]" />
            <p className="font-work-sans text-sm font-bold">{item.name}</p>
          </div>

          <ChevronRight
            color="#ffffff"
            strokeWidth={2}
            className="!min-w-1.5 !min-h-3.5"
          />
        </Link>
      ))}
    </div>
  );
}

// function LogOutButton() {
//   const { clearAuth, user } = useAfroStore();

//   const handleLogout = () => {
//     const accountType = user?.accountType;
//     if (accountType === "User") {
//       window.location.href = getRoutePath("home");
//     } else {
//       window.location.href = getRoutePath("creators_home");
//     }
//     clearAuth();
//   };

//   return (
//     <Button
//       onClick={handleLogout}
//       className="w-full min-h-fit border-t !border-neutral-gray px-[11px] bg-transparent hover:bg-transparent hover:text-white rounded-none mt-[42px]"
//     >
//       <div className="w-full flex items-center gap-[5px] pt-4">
//         <img
//           src="/assets/harmburger/logout.png"
//           alt="Log Out"
//           className="!min-w-4 !min-h-4 h-4 w-4"
//         />
//         <p className="font-input-mono text-[15px]">Log Out</p>
//       </div>
//     </Button>
//   );
// }

/**
 * Local to the mobile menu — the shared `account_links` still drives the
 * dashboard navbar and sidebar, which keep their own set of links and icons.
 */
const mobile_account_links: { link: string; icon: IconType; name: string }[] = [
  {
    link: getRoutePath("account"),
    icon: MdOutlineSpaceDashboard,
    name: "DASHBOARD",
  },
];

const menuLinks = [
  { href: getRoutePath("home"), name: "Discover" },
  // { href: getRoutePath("resale"), name: "Resale" },
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
