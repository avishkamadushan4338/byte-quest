import { MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const PAGE_DURATION = 0.55;
const REVEAL_DURATION = 0.6;
const REVEAL_OFFSET = 24;
const REVEAL_TRIGGER_OFFSET = -80;

interface PageTransitionProps {
  children: ReactNode;
  routeKey: string;
}

/** Fades and lifts page content in each time the route changes. */
export const PageTransition = ({ children, routeKey }: PageTransitionProps) => {
  // The first paint is server-rendered; animating it would hide the page until hydration.
  const [previousKey, setPreviousKey] = useState(routeKey);
  const [hasNavigated, setHasNavigated] = useState(false);
  if (previousKey !== routeKey) {
    setPreviousKey(routeKey);
    setHasNavigated(true);
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={hasNavigated ? { opacity: 0, y: 14 } : false}
      key={routeKey}
      transition={{ duration: PAGE_DURATION, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Slides content up and fades it in once it scrolls into view. */
export const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Reveal once the top edge enters the viewport. Checking the position (not
  // IntersectionObserver crossings) also covers sections skipped by a fast scroll.
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const check = () => {
      if (
        node.getBoundingClientRect().top <
        window.innerHeight + REVEAL_TRIGGER_OFFSET
      ) {
        setIsRevealed(true);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <motion.div
      animate={
        isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: REVEAL_OFFSET }
      }
      className={className}
      initial={{ opacity: 0, y: REVEAL_OFFSET }}
      ref={ref}
      transition={{ delay, duration: REVEAL_DURATION, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
};

/** Honours the visitor's reduced-motion preference for every animation below it. */
export const MotionProvider = ({ children }: { children: ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
