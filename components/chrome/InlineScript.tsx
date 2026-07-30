/**
 * React logs an error in development when a component renders a <script> tag,
 * because scripts inserted via DOM updates never execute on the client. The
 * theme script must still run during HTML parsing to beat first paint (§4.3),
 * so it is emitted as real JavaScript on the server and as inert text/plain on
 * the client. `suppressHydrationWarning` covers the deliberate type mismatch.
 *
 * This is the pattern Next's own "preventing flash before hydration" guide
 * prescribes, and it is what clears the console error without giving up the
 * flash-free swap.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
