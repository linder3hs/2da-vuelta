"use client";

import { motion } from "framer-motion";

export default function LiveBadge({ live = true }: { live?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
        live
          ? "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/30"
          : "bg-slate-900/5 text-slate-900/50 ring-1 ring-slate-900/10"
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
            live ? "bg-rose-400" : "bg-slate-900/30"
          }`}
        />
      </span>
      {live ? "EN VIVO" : "SIN CONEXIÓN"}
    </span>
  );
}
