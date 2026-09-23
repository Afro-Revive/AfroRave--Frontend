import { SEO } from "@/components/seo";
import { Link } from "react-router-dom";
import { getRoutePath } from "@/config/get-route-path";
import { IoPricetagOutline } from "react-icons/io5";
import { FaNairaSign } from "react-icons/fa6";
import { TransformedTicket } from "@/pages/fans/my-tickets/components/transformed-ticket-icon";
import type { ReactNode } from "react";
// this is the closest screen currently in the folder.
const HERO_MOCKUP = "/assets/FAN_HOMEPAGE/sell.png";

const STEPS: {
  image: string;
  icon: ReactNode;
  title: string;
  description: string;
}[] = [
  {
    image: "/assets/RESELL_INFO_PAGE/SELECT TICKET.png",
    icon: <TransformedTicket color="currentColor" size={18}  />,
    title: "Select Ticket",
    description:
      "If the event supports resale and you purchased your ticket on Afro Revive, you can list it directly from your account.",
  },
  {
    image: "/assets/RESELL_INFO_PAGE/SET PRICE.png",
    icon: <IoPricetagOutline className="h-[18px] w-[18px]" />,
    title: "Set Your Price",
    description:
      "Using our pricing tool, set your price and see exactly how much you'll be paid when your tickets sell.",
  },
  {
    image: "/assets/RESELL_INFO_PAGE/GET PAID SECURELY.png",
    // Bordered so the bare glyph reads as a mark rather than stray text.
    icon: (
      <span className="flex items-center justify-center rounded-full border border-white/60 p-1">
        <FaNairaSign className="h-3 w-3" />
      </span>
    ),
    title: "Get Paid Securely",
    description:
      "Once your tickets are sold, you'll receive your payout through your preferred payment method — usually within 7 business days after the event.",
  },
];

export default function ResellPage() {
  return (
    <>
      <SEO
        title="Resell with Ease on Afro Revive"
        description="Sell your tickets with ease on Afro Revive. We provide a seamless resale experience with secure payments and guaranteed payouts."
      />

      <div className="w-full bg-[#0F0F0F] text-white">
        {/* pt clears the fixed 90px header. */}
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10 pt-[140px] pb-20 md:pb-28">
          {/* Hero */}
          <section className="flex flex-col-reverse items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
             <img
              src={HERO_MOCKUP}
              alt=""
              aria-hidden="true"
              className="w-[260px] md:w-[340px] lg:w-[380px] md:hidden block shrink-0 object-contain -rotate-3"
            />
            <div className="flex w-full flex-col gap-5 md:max-w-[520px]">
              <p className="font-input-mono text-sm  uppercase tracking-[0.50em] text-white">
                Ticket Resale
              </p>

              <h1 className="font-work-sans text-4xl md:text-6xl font-black uppercase leading-[1.05]">
                Can&rsquo;t Make It To An Event?
              </h1>

              <p className="font-inter-tight text-base md:text-xl leading-relaxed text-white">
                Resell your ticket directly on the platform. Once sold, ownership
                transfers securely to the new buyer and the ticket is revalidated,
                removing the need for external payments, DMs, or unverified QR codes.
              </p>
            </div>

            <img
              src={HERO_MOCKUP}
              alt=""
              aria-hidden="true"
              className="w-[260px] md:w-[340px] lg:w-[380px] hidden md:block shrink-0 object-contain -rotate-3"
            />
          </section>

          {/* Steps */}
          <section className="mt-20 md:mt-28">
            <h2 className="font-inter text-2xl md:text-4xl font-black uppercase leading-tight">
              Sell Your Tickets In
              <br />3 Simple Steps
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
              {STEPS.map((step) => (
                <StepCard key={step.title} {...step} />
              ))}
            </div>
          </section>

          {/* Important to know */}
          <section className="mt-20 md:mt-28 flex flex-col gap-5">
            <h2 className="font-inter text-2xl md:text-4xl font-black uppercase">
              Important To Know
            </h2>

            <p className="font-sf-pro-display max-w-xl text-base md:text-xl leading-relaxed text-secondary-white">
              Resale availability may depend on the event organizer, ticket type,
              event rules, or resale deadline.
            </p>

            <Link
              to={getRoutePath("my_tickets")}
              className="mt-2 w-fit rounded-full bg-white px-8 py-3.5 font-input-mono text-xs font-bold uppercase tracking-wide text-black transition-colors hover:bg-white/90">
              List Your Ticket
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}

function StepCard({
  image,
  icon,
  title,
  description,
}: (typeof STEPS)[number]) {
  return (
    <div className="flex flex-col gap-4">
      {/* Fixed ratio so the three screenshots line up despite differing crops. */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#1A1A1A]">
        <img src={image} alt={title} className="h-full w-full object-cover object-top" />
      </div>

      <div className="flex items-center gap-2">
        <span className="shrink-0 text-white">{icon}</span>
        <h3 className="font-sf-pro-display font-semibold text-base font-bold">{title}</h3>
      </div>

      <p className="font-sf-pro-display text-sm md:text-base leading-relaxed text-white">
        {description}
      </p>
    </div>
  );
}
