import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function FooterLinkBlock({ title, links, className }: IFooterLinks) {
  return (
    <div className={cn("flex flex-col gap-4 font-inter-tight", className)}>
      <p>{title}</p>

      <div className="flex flex-col gap-2">
        {links.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="font-light text-[14px] hover:underline"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export interface IFooterLinks {
  title: string;
  links: { href: string; name: string }[];
  className?: string;
}
