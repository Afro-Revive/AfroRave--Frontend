import { FooterLinks } from "@/layouts/components/footer-links";
import { Socials, type ISocials } from "@/layouts/components/socials";

export default function SupportFooter() {
  return (
    <footer className="w-full h-fit flex flex-col border-t border-black/50 bg-[#f8f8f8]">
      <div className="w-full flex items-center justify-between py-5 px-8">
        <img
          src="/assets/event/ar-black.png"
          alt="Logo"
          width={84}
          height={33}
        />

        <FooterLinks className="text-black w-fit" type="support" />
      </div>
      <div className="w-full flex items-center justify-between pb-10 px-8">
        <div className="flex flex-col gap-3">
          <p className="text-base text-black font-light font-inter-tight">
            Get the App for more features!
          </p>
          <img
            src="/assets/support/apple.png"
            alt="Apple"
            width={29}
            height={29}
          />
        </div>

        <Socials data={socials} className="md:!justify-end w-fit" />
      </div>
    </footer>
  );
}

const socials: ISocials[] = [
  { href: "/", icon: "/assets/support/s1.png", alt: "Instagram" },
  { href: "/", icon: "/assets/support/s2.png", alt: "X" },
  { href: "/", icon: "/assets/support/s3.png", alt: "Youtube" },
];
