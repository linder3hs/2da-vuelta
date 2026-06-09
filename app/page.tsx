"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useElection } from "@/hooks/useElection";
import ProcessHeader from "@/components/ProcessHeader";
import HeadToHead from "@/components/HeadToHead";
import CandidateCard from "@/components/CandidateCard";
import ProgressStats, { CountProgress } from "@/components/ProgressStats";
import GlassCard from "@/components/GlassCard";

export default function Page() {
  const { totales, participantes, error, isLoading, refresh } = useElection();

  const hasData = !!(totales && participantes && participantes.length >= 2);
  const live = !error && hasData;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <ProcessHeader totales={totales} live={live} onRefresh={refresh} />

      {/* Banner de error / API no disponible */}
      <AnimatePresence>
        {error && !hasData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="rounded-2xl border border-amber-500/40 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              <strong className="font-semibold">No se pudieron cargar los datos.</strong>{" "}
              {error.message}
              <span className="block text-amber-700/80">
                La API de ONPE puede estar temporalmente no disponible.
                Reintentando automáticamente…
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && !hasData ? (
        <SkeletonDashboard />
      ) : hasData ? (
        <div className="mt-8 space-y-10">
          {/* Avance del conteo — al inicio */}
          {totales && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <CountProgress t={totales} />
            </motion.div>
          )}

          {/* Head to head — foco principal */}
          <section>
            <div className="section-head">
              <span className="eyebrow">El escrutinio</span>
              <span className="rule" />
            </div>
            <GlassCard
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8"
            >
              <HeadToHead participantes={participantes!} />
            </GlassCard>
          </section>

          {/* Tarjetas por candidato */}
          <section>
            <div className="section-head">
              <span className="eyebrow">Los candidatos</span>
              <span className="rule" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {participantes!.map((p, i) => (
                <CandidateCard
                  key={p.codigoAgrupacionPolitica}
                  p={p}
                  rank={i}
                  delay={0.1 + i * 0.08}
                />
              ))}
            </div>
          </section>

          {/* Indicadores secundarios */}
          {totales && (
            <section>
              <div className="section-head">
                <span className="eyebrow">Indicadores</span>
                <span className="rule" />
              </div>
              <ProgressStats t={totales} />
            </section>
          )}
        </div>
      ) : null}

      <footer className="mt-12 text-center text-xs text-slate-900/30">
        Datos oficiales de la ONPE · Proyecto independiente sin afiliación. Los
        resultados son preliminares hasta el cómputo final.
      </footer>
    </main>
  );
}

function SkeletonDashboard() {
  return (
    <div className="mt-8 space-y-8">
      <div className="glass h-40 animate-pulse rounded-3xl" />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass h-56 animate-pulse rounded-3xl" />
        <div className="glass h-56 animate-pulse rounded-3xl" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass h-28 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
