import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores";
import { useProcessCheckout } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { getRoutePath } from "@/config/get-route-path";

export default function PaymentConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  const { promoCodeId } = useCartStore();
  const processCheckoutMutation = useProcessCheckout();

  useEffect(() => {
    if (!reference) return;
    processCheckoutMutation.mutate({
      paymentMethod: "paystack",
      promoCodeId: promoCodeId ?? undefined,
      transactionReference: reference,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SEO
        title="Payment Confirmed - AfroRave"
        description="Your ticket purchase was successful."
      />
      <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-16">
        <div className="flex flex-col items-center gap-6 max-w-md w-full text-center">

          {processCheckoutMutation.isPending && (
            <>
              <Loader2 size={48} className="animate-spin text-white/60" />
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black font-inter uppercase">
                  Processing Payment...
                </h1>
                <p className="text-white/60 font-sf-pro-display font-light text-sm md:text-base">
                  Please wait while we confirm your order.
                </p>
              </div>
            </>
          )}

          {processCheckoutMutation.isError && (
            <>
              <XCircle size={48} className="text-red-400" />
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black font-inter uppercase">
                  An Error Occurred
                </h1>
                <p className="text-white/60 font-sf-pro-display font-light text-sm md:text-base">
                  Something went wrong while processing your payment. Please
                  contact support if you were charged.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <Button
                  className="flex-1 py-5 border-white/20 bg-white text-black hover:bg-white/10 hover:text-white font-sf-pro-display"
                  onClick={() => navigate(getRoutePath("events"))}
                >
                  BACK TO EVENTS
                </Button>
                <Button
                  className="flex-1 py-5 bg-red-500 text-white hover:bg-red-500/90 font-sf-pro-display"
                  onClick={() =>
                    processCheckoutMutation.mutate({
                      paymentMethod: "paystack",
                      promoCodeId: promoCodeId ?? undefined,
                      transactionReference: reference ?? "",
                    })
                  }
                >
                  TRY AGAIN
                </Button>
              </div>
            </>
          )}

          {processCheckoutMutation.isSuccess && (
            <>
              <CheckCircle size={48} className="text-green-400" />
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-black font-inter uppercase">
                  Thank You For Your Purchase!
                </h1>
                <p className="text-white font-sf-pro-display font-light text-sm md:text-base">
                  Your payment was successful and your spot is officially
                  secured. We've sent your confirmation details to your email.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <Button
                  className="flex-1 py-5 border-white/20 bg-white text-black hover:bg-white/10 hover:text-white font-sf-pro-display"
                  onClick={() => navigate(getRoutePath("events"))}
                >
                  BACK TO EVENTS
                </Button>
                <Button
                  className="flex-1 py-5 bg-[#00AD2E] text-white hover:bg-[#00AD2E]/90 font-sf-pro-display"
                  onClick={() => navigate(getRoutePath("my_tickets"))}
                >
                  VIEW TICKETS
                </Button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
