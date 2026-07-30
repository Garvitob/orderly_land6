import { cn } from "@/lib/cn";

/**
 * §8.4 chrome. Real device proportions at 9:19.5, a 1px bezel gradient, a 12px
 * inner screen radius, and a soft CONTACT shadow, not a floating drop shadow.
 * That contact shadow is sanctioned exception 1 of §4.5's three.
 */
export function Phone({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("phone", className)}>
      <div className="phone-bezel">
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}
