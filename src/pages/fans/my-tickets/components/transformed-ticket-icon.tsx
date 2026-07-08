import { Ticket } from "lucide-react";
export function TransformedTicket({
  color,
  size = 16,
}: {
  color: string;
  size?: number;
}) {
  return (
    <Ticket
      size={size}
      className="rotate-90 shrink-0"
      style={{ color }}
    />
  );
}
