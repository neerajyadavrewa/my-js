"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import TaskCard from "./TaskCard";
import { playSound } from "../utils/playSound"; // Optional

export default function MiniTasksSection({
  tasks,
  onComplete,
}: {
  tasks: any[];
  onComplete: () => void;
}) {
  const [doneCount, setDoneCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTaskComplete = () => {
    playSound("/sounds/correct.mp3");
    setDoneCount((prev) => {
      const updated = prev + 1;
      if (updated === tasks.length) {
        playSound("/sounds/submit.mp3");
        setShowConfetti(true);
        setTimeout(() => {
          onComplete();
          setShowConfetti(false);
        }, 3000);
      }
      return updated;
    });
  };

  const progressPercent = Math.round((doneCount / tasks.length) * 100);

  return (
    <section className="relative py-10 px-4 max-w-5xl mx-auto min-h-screen">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.1}
        />
      )}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-gray-700 shadow-lg">
        <div className="max-w-5xl mx-auto py-3 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-300">Progress: {progressPercent}%</span>
            <span className="text-xs text-gray-300">
              {doneCount}/{tasks.length} Completed
            </span>
          </div>
          <motion.div
            className="h-2.5 rounded-full bg-gray-700 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-pink-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Heading */}
      <div className="pt-24 pb-10 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-pink-300 to-teal-400 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🧪 Mini Tasks
        </motion.h2>
        <motion.p
          className="text-gray-400 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Complete each mini task below to continue your journey.
        </motion.p>
      </div>

      {/* Task Cards */}
      <div className="space-y-8 sm:space-y-10 pb-24">
        {tasks.map((task, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <TaskCard task={task} onComplete={handleTaskComplete} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
