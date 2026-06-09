"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useElection } from "@/hooks/useElection";
import ProcessHeader from "@/components/ProcessHeader";
import ResultHero from "@/components/ResultHero";
import ResultsTable from "@/components/ResultsTable";
import Indicators, { CompactProgress } from "@/components/ProgressStats";

export default function Page() {
  const { totales, participantes, error, isLoading, refresh } = useElection();

  const hasData = !!(totales && participantes && participantes.length >= 2);
  const live = !error && hasData;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
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
        <div className="mt-8 space-y-8">
          {/* 1. Resultado — la noticia, primero */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultHero p={participantes!} />
          </motion.section>

          {/* 2. Avance compacto */}
          {totales && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <CompactProgress t={totales} />
            </motion.div>
          )}

          {/* 3. Tabla de resultados */}
          <section>
            <div className="section-head">
              <span className="eyebrow">Resultados detallados</span>
              <span className="rule" />
            </div>
            <ResultsTable p={participantes!} />
          </section>

          {/* 4. Indicadores */}
          {totales && (
            <section>
              <div className="section-head">
                <span className="eyebrow">Indicadores</span>
                <span className="rule" />
              </div>
              <Indicators t={totales} />
            </section>
          )}
        </div>
      ) : null}

      <footer className="mt-12 border-t border-ink/8 pt-5 text-center text-xs text-ink/40">
        Datos oficiales de la{" "}
        <span className="font-semibold text-ink/60">ONPE</span> · Proyecto
        independiente sin afiliación política. Resultados preliminares hasta el
        cómputo final.
      </footer>
    </main>
  );
}

function SkeletonDashboard() {
  return (
    <div className="mt-8 space-y-8">
      <div className="glass h-56 animate-pulse rounded-3xl" />
      <div className="glass h-16 animate-pulse rounded-2xl" />
      <div className="glass h-32 animate-pulse rounded-2xl" />
      <div className="glass h-28 animate-pulse rounded-2xl" />
    </div>
  );
}
