"use client";

import { motion } from "framer-motion";

export default function LiveBadge({ live = true }: { live?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        live
          ? "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30"
          : "bg-white/5 text-white/50 ring-1 ring-white/10"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {live && (
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-rose-400"
            animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            live ? "bg-rose-400" : "bg-white/30"
          }`}
        />
      </span>
      {live ? "EN VIVO" : "SIN CONEXIÓN"}
    </span>
  );
}
