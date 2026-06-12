import { SEO } from "@/components/seo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRoutePath } from "@/config/get-route-path";

export default function ResellPage() {
  return (
    <>
      <SEO
        title="Resell with Ease on Afro Revive"
        description="Sell your tickets with ease on Afro Revive. We provide a seamless resale experience with secure payments and guaranteed payouts."
      />
      <div className="bg-white text-white min-h-screen mx-auto w-full">
        {/* Hero Section */}
        <section className="relative max-h-[620px] h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 w-full ">
          {/* Background Image with Grayscale */}
          <div
            className="absolute inset-0 bg-cover bg-center filter grayscale-[40%] "
            style={{ backgroundImage: "url('/assets/resell/hero1.jpg')" }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-dark-gray/10 to-transparent" />

          {/* Content (remains on top) */}
          <div className="w-full relative z-10 md:pl-10 lg:pl-24">
            <p className="w-full text-center md:text-start text-[48px] md:text-[40px] lg:text-[72px] text-white font-bold leading-tight">
              Resell with Ease{" "}
              <br className="max-lg:hidden" />{" "}
              on Afro{" "}
              <span className="inline-flex items-center gap-3 whitespace-nowrap">
                Revive <ListYourTicketButton />
              </span>
            </p>

            <div className="flex w-full h-fit justify-center mt-[30px]">
              <ListYourTicketButton type="mobile" />
            </div>
          </div>
        </section>

        {/* Existing Content - Add padding top to separate from hero */}
        <div className="max-w-[1400px] mx-auto py-6 md:py-16 px-4 sm:px-6 lg:px-8 pt-6 md:pt-24">
          {/* Top Section: 3 Steps */}
          <section className="mb-10 md:mb-[62px] text-center max-md:px-11">
            <h2 className="text-xl md:text-[32px] text-black font-bold mb-[40px]">
              SELL YOUR TICKETS IN 3 SIMPLE STEPS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px] md:gap-[112px] mx-auto">
              <StepCard
                title="Select the Ticket You Want to sell"
                description="If the event supports resale and you purchased your ticket on Afro Revive, you can list it directly from your account."
                icon="/assets/resell/Icon1.svg"
              />
              <StepCard
                title="Set Your Price"
                description="Using our pricing tool, Set your price and see exactly how much you'll be paid when your tickets sell. Get Paid"
                icon="/assets/resell/icon2.svg"
              />
              <StepCard
                title="Get Paid Securely"
                description="Once your tickets are sold, you'll receive your payout through your preferred payment method — usually within 7 business days after the event."
                icon="/assets/resell/icon3.svg"
              />
            </div>
          </section>

          {/* Middle Section: Seamless Resale Experience */}
          <section className="mb-[78px] md:mb-24 text-center">
            <h2 className="text-xl md:text-3xl sm:text-[24px] text-black font-bold mb-1 md:mb-4">
              Seamless Resale Experience
            </h2>
            <p className="text-xs md:text-base mx-auto mb-10 md:mb-[120px] text-black font-normal max-w-[640px]">
              List your ticket and let Afro Revive do the rest—from secure
              delivery to guaranteed payouts, we ensure a seamless resale
              process.
            </p>

            {/* Features Grid */}
            <div className="flex flex-col gap-8 md:gap-16 items-center">
              <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-0 text-left h-full max-w-[980px] w-full">
                {/* Feature Group 1 */}
                <div className="flex flex-col justify-between text-left h-full gap-10 md:gap-[120px] ">
                  <FeatureItem
                    title="Smart Pricing"
                    description="Using real-time ticket pricing information, We help you sell your tickets with confidence."
                  />
                  <FeatureItem
                    title="Transparent Earnings"
                    description="Know what you'll earn before you list. We show you a full breakdown of your resale payout, no hidden fees."
                  />
                </div>
                {/* Image 1 */}
                <div className="flex justify-center md:justify-end max-md:hidden">
                  <img
                    src="/assets/resell/pic3.jpg"
                    alt="image1"
                    className="w-full h-full object-cover md:w-[320px] md:h-[320px] rounded-full grayscale-100 aspect-square"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center w-full gap-10 md:gap-0 justify-between text-left h-full max-w-[980px]">
                {/* Image 2 */}
                <div className="flex justify-center md:justify-start max-md:hidden">
                  <img
                    src="/assets/resell/pic2.png"
                    alt="image2"
                    className="w-full h-full object-cover md:w-[320px] md:h-[320px] rounded-full"
                  />
                </div>

                {/* Feature Group 2 */}
                <div className="flex flex-col text-left gap-10 justify-between h-full ">
                  <FeatureItem
                    title="Share Your Listing"
                    description="Know what you'll earn before you list. We show you a full breakdown of your resale payout, no hidden fees." // Note: Description duplicated in image, using it here.
                  />
                  <FeatureItem
                    title="You're In Control"
                    description="Want your ticket to sell faster? Share your personal resale link with friends and drive more visibility to your listing."
                  />
                  <FeatureItem
                    title="We've Got you Covered"
                    description="When your ticket sells, we take care of everything — from secure delivery to the buyer to processing your payout."
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function ListYourTicketButton({
  type = "desktop",
}: {
  type?: "mobile" | "desktop";
}) {
  return (
    <Button
      asChild
      className={cn(
        "relative w-fit h-fit rounded-md  px-6 py-4 bg-black text-white font-black font-sf-pro-text",
        {
          "max-md:hidden": type === "desktop",
          "flex md:hidden": type === "mobile",
        }
      )}
    >
      <Link to={getRoutePath("events")}>LIST YOUR TICKET</Link>
    </Button>
  );
}

function StepCard({
  title,
  description,
  icon,
}: IFeatureItem & { icon: string }) {
  return (
    <div className="flex flex-col items-center text-center text-black">
      <img
        src={icon}
        alt={title}
        className="size-[75px] md:h-[150px] md:w-[150px] mb-4"
      />
      <h3 className="text-sm md:text-[24px] font-semibold mb-2">{title}</h3>
      <p className="font-sf-pro-text text-xs md:text-base font-normal">
        {description}
      </p>
    </div>
  );
}

function FeatureItem({ title, description }: IFeatureItem) {
  return (
    <div className="flex items-center space-x-4 text-black">
      <img
        src="/assets/resell/lighting.svg"
        alt={title}
        className="max-md:hidden"
      />
      <div className="flex flex-col max-md:items-center w-[200px] md:w-full">
        <h4 className="md:text-[20px] font-semibold">{title}</h4>
        <p className="font-sf-pro-text text-xs md:text-sm max-w-[320px] max-md:text-center">
          {description}
        </p>
      </div>
    </div>
  );
}

interface IFeatureItem {
  title: string;
  description: string;
}
