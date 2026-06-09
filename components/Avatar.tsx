"use client";

import { useState } from "react";
import { candidatePhoto, initials } from "@/lib/format";

interface Props {
  dni: string;
  name: string;
  gradient: string;
  size?: number; // px
  className?: string;
}

/**
 * Foto oficial del candidato con fallback a iniciales sobre gradiente del
 * partido (la imagen de ONPE puede fallar fuera de Perú por geo-restricción).
 */
export default function Avatar({
  dni,
  name,
  gradient,
  size = 56,
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl ring-1 ring-slate-900/15 ${className}`}
      style={{ width: size, height: size, background: gradient }}
    >
      {/* iniciales de respaldo (siempre detrás) */}
      <span
        className="absolute inset-0 grid place-items-center font-extrabold text-white"
        style={{ fontSize: size * 0.32 }}
      >
        {initials(name)}
      </span>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={candidatePhoto(dni)}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}
    </div>
  );
}
