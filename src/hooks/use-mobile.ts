import * as React from "react";

/**
 * The exact query behind the `md:` variant in index.css. Keep the two in step:
 * a tablet in portrait counts as mobile, the same tablet in landscape does not.
 */
const DESKTOP_QUERY =
  "(min-width: 1025px), (min-width: 768px) and (orientation: landscape)";

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    // Read mql.matches rather than re-deriving from innerWidth, so this can't
    // drift from the CSS and so rotating a tablet is picked up as a change.
    const onChange = () => setIsMobile(!mql.matches);
    mql.addEventListener("change", onChange);
    setIsMobile(!mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
