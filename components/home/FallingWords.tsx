"use client";

import { m } from "framer-motion";

const ITEMS = [
  { word: "Bella", left: "2%", delay: 0, duration: 16 },
  { word: "Cucina", left: "16%", delay: 5, duration: 19 },
  { word: "Bella", left: "32%", delay: 9, duration: 15 },
  { word: "Cucina", left: "48%", delay: 2, duration: 20 },
  { word: "Bella", left: "64%", delay: 7, duration: 17 },
  { word: "Cucina", left: "80%", delay: 12, duration: 16 },
  { word: "Bella", left: "92%", delay: 4, duration: 18 },
];

export default function FallingWords() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {ITEMS.map((item, i) => (
        <m.span
          key={i}
          className="absolute font-heading text-2xl font-bold italic text-white/25 drop-shadow-md sm:text-4xl"
          style={{ left: item.left }}
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {item.word}
        </m.span>
      ))}
    </div>
  );
}
