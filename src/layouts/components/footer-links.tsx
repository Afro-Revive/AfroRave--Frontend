import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { getRoutePath } from "@/config/get-route-path";
import { cn } from "@/lib/utils";

export function FooterLinks({
  type = "default",
  className,
}: {
  type?: "default" | "support";
  className?: string;
}) {
  return (
    <div
      className={cn("w-full flex gap-2.5 font-inter-tight font-light text-sm h-5", className)}
    >
      <IndividualLinks
        to={getRoutePath("privacy_policy")}
        name="Privacy Policy"
      />

      <Separator
        orientation="vertical"
        className={cn("h-full", {
          "bg-white": type === "default",
          "bg-black": type === "support",
        })}
      />

      <IndividualLinks
        to={getRoutePath("terms_and_conditions")}
        name="Terms & Conditions"
      />
    </div>
  );
}

function IndividualLinks({ to, name }: { to: string; name: string }) {
  return (
    <Link to={to} className="font-light hover:underline hover:decoration-deep-red text-sm text-inherit">
      {name}
    </Link>
  );
}
