"use client";

import { useRef, type ReactNode } from "react";
import { m, useScroll, useTransform } from "framer-motion";

type ParallaxElementProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

export default function ParallaxElement({
  children,
  speed = 1,
  className,
}: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-24 * speed, 24 * speed]);

  return (
    <m.div ref={ref} style={{ y }} className={className}>
      {children}
    </m.div>
  );
}
