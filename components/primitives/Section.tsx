import { Label } from "./Label";
import { cn } from "@/lib/cn";

/**
 * §6.5's section skeleton, as a component, because the brief is explicit that
 * rigid repetition of the skeleton is what produces the guided-tour feeling:
 *
 *   LABEL / headline / one subhead / the proof / one link
 *
 * Vary the visual wildly. Never vary the skeleton. Making it a component is
 * how I stop myself varying it at step 17 when attention has faded.
 */
export function Section({
  id,
  label,
  headline,
  subhead,
  children,
  className,
  headlineAs: HeadlineAs = "h2",
  tone,
}: {
  id: string;
  label: string;
  headline: React.ReactNode;
  subhead?: string;
  children?: React.ReactNode;
  className?: string;
  headlineAs?: "h2" | "h3";
  /** Label colour. Exactly one section gets `orange`, per §4.2. */
  tone?: "orange" | "text-2";
}) {
  return (
    <section id={id} className={cn("sec", className)}>
      <Label tone={tone ?? "text-2"}>{label}</Label>
      <HeadlineAs className="t-headline sec-head">{headline}</HeadlineAs>
      {subhead ? <p className="t-body sec-sub">{subhead}</p> : null}
      {children}
    </section>
  );
}
