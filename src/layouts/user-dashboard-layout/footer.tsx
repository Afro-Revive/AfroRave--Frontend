import { FooterLinks } from "../components/footer-links";
import { Socials } from "../components/socials";
import { NavLogo } from "../root-layout/header/nav-logo";
import { app_store_links } from "../root-layout/footer";

export default function AccountFooter() {
  return (
    <footer className="w-full bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-8 items-center">
        <NavLogo />
         <FooterLinks className="items-center justify-center" />
        <div className="w-full border-t border-white/10" />
        <Socials className="justify-center"/>
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
    </footer>
  );
}