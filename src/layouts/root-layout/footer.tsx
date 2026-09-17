import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useFansRadialBackground } from "@/hooks/use-fans-radial-background";
import { getRoutePath } from "@/config/get-route-path";
import { FooterLinks } from "../components/footer-links";
import { Socials } from "../components/socials";
import {
  FooterLinkBlock,
  type IFooterLinks,
} from "../components/footer-links-block";

export default function Footer() {
  const hasRadialBackground = useFansRadialBackground();

  return (
    <footer
      className={cn(
        "w-full flex flex-col items-center md:gap-6 px-8 md:px-[60px] pb-3 md:pb-5 font-sf-pro-rounded",
        // Transparent so the layout's radial shows through; the excluded event
        // pages keep the flat footer they had.
        hasRadialBackground ? "bg-transparent" : "bg-primary",
      )}
    >
      <div className=" w-full flex flex-col gap-1 pb-3 md:gap-5 ">
        <img
          src="/assets/landing-page/AR.png"
          alt="AR"
          width={83}
          height={33}
          className="self-center py-3 ms:py-5 md:pb-3"
        />

        <FooterLinks className="max-md:justify-center items-center h-5" />
      </div>

      <Separator
        orientation="horizontal"
        className="w-full bg-[#686868] max-md:mt-7"
      />
      
      <div className="w-full flex flex-col md:flex-row md:items-start md:justify-between md:gap-10 ">
        <div className="flex flex-col gap-2">
          <Socials className="self-start justify-start max-md:py-3 w-fit" />

          <p className="text-white font-bold font-inter-tight text-sm mx-1">
            Get The Afrorevive App
          </p>

          <div className="flex items-center gap-3 mx-1">
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
        </div>

        <div className="flex justify-between md:gap-[120px] max-md:w-full">
          {footer_links.map((footer_link) => (
            <FooterLinkBlock
              key={footer_link.title}
              {...footer_link}
              className="max-md:py-4"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}

// TODO: point these at the real store listings once the apps are published.
export const app_store_links: { href: string; src: string; alt: string }[] = [
  {
    href: "#",
    src: "/assets/landing-page/apple-store.png",
    alt: "Download on the App Store",
  },
  {
    href: "#",
    src: "/assets/landing-page/google-play.png",
    alt: "Get it on Google Play",
  },
];

const footer_links: IFooterLinks[] = [
  {
    title: "Company",
    links: [
      { href: getRoutePath("about_us"), name: "About Us" },
      { href: getRoutePath("blog"), name: "Blog" },
      { href: getRoutePath("creators"), name: "Creators" },
      { href: getRoutePath("work_with_us"), name: "Work With Us" },
    ],
  },
  {
    title: "Helpful Links",
    links: [
      { href: getRoutePath("sell"), name: "Sell" },
      { href: getRoutePath("support"), name: "Support" },
      { href: getRoutePath("faq"), name: "FAQ" },
      { href: getRoutePath("refund_policy"), name: "Refund Policy" },
    ],
  },
];
