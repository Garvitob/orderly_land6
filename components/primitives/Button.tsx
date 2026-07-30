"use client";

import { cn } from "@/lib/cn";

type Variant = "solid" | "ink" | "outline";

/**
 * §4.2 contrast rule: white on Orderly Orange is only legal at 18px bold and
 * above, and these labels sit at 15px, so the solid variant carries **Ink**
 * text. That is the brand's own rule, not a preference.
 *
 * Interaction layer (§10.1): 160ms ease-out, press to 0.97, hover lift gated
 * behind a fine pointer. Transform only. Disabled elements do not animate.
 */
export function Button({
  children,
  variant = "solid",
  type = "button",
  onClick,
  disabled,
  className,
  ...rest
}: {
  children: React.ReactNode;
  variant?: Variant;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn("btn", `btn--${variant}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/** An anchor styled as the same pill. Used where the action is navigation. */
export function ButtonLink({
  children,
  href,
  variant = "solid",
  className,
}: {
  children: React.ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <a href={href} className={cn("btn", `btn--${variant}`, className)}>
      {children}
    </a>
  );
}

/**
 * The underlined text link that sits beside a CTA (§8.2). §6.5 allows one link
 * or one button per section, never both, except Act I which specifies exactly
 * this pair. The underline thickens on hover via scaleY on a pseudo element,
 * so the animated property stays transform.
 */
export function TextLink({
  children,
  href,
  className,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a href={href} onClick={onClick} className={cn("tlink", className)}>
      {children}
    </a>
  );
}
