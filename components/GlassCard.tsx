"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & {
  className?: string;
};

export default function GlassCard({ className = "", children, ...rest }: Props) {
  return (
    <motion.div
      className={`glass rounded-3xl ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
