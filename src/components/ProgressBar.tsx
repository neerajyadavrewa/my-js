// ProgressBar.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-900 h-6 rounded-full overflow-hidden mb-8 shadow-lg border border-gray-800 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-blue-900/30 z-0" />
      <motion.div
        className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 transition-all duration-700 relative z-10"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
        <div className="absolute right-0 top-0 w-1 h-full bg-white/50 animate-pulse" />
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <span className="text-xs font-bold text-white drop-shadow-lg">
          {Math.round(progress)}% Complete
        </span>
      </div>
    </div>
  );
}