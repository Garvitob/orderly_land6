/**
 * §4.3 mandates an inline blocking script in <head>, and that is what this is.
 *
 * React logs a development-only advisory when a component renders a <script>
 * tag. Next's own "preventing flash before hydration" guide mitigates it by
 * emitting real JavaScript on the server and inert text/plain on the client,
 * which is what this does. `suppressHydrationWarning` covers the deliberate
 * type mismatch.
 *
 * The alternative, an external same-origin blocking script, trips
 * @next/next/no-sync-scripts and moves the flash risk to a second request. The
 * brief is explicit about the inline form, so the brief wins.
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
