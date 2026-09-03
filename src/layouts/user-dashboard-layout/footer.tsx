import { FooterLinks } from "../components/footer-links";
import { Socials } from "../components/socials";
import { NavLogo } from "../root-layout/header/nav-logo";

export default function AccountFooter() {
  return (
    <footer className="w-full bg-[#1A1A1A] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col gap-8 items-center">
        <NavLogo />
        <FooterLinks className="items-center justify-center" />
        <Socials className="justify-center"/>
      </div>
    </footer>
  );
}