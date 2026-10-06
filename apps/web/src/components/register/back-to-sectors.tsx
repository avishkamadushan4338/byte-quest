import { Link } from "@tanstack/react-router";

/**
 * Sits directly above the Register/Volunteers page's own hero (which
 * supplies its own header clearance), so this only needs enough top
 * padding to clear the fixed nav itself — not a second full spacer. The
 * nav's own unscrolled height tops out around 102px; 130px leaves a safe
 * margin so this bar's text never renders under (or visually above) it.
 */
export const BackToSectors = () => (
  <div className="bg-ink px-[clamp(20px,5vw,64px)] pt-[130px] pb-1">
    <div className="mx-auto max-w-[1280px]">
      <Link
        className="text-muted-2 hover:text-volt font-mono text-[11px] tracking-[0.1em]"
        to="/register"
      >
        ← CHOOSE A DIFFERENT OPTION
      </Link>
    </div>
  </div>
);
