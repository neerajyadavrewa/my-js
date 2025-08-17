"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import level1 from "../../../data/level1.json";
import level2 from "../../../data/level2.json";
import level3 from "../../../data/level3.json";
import level4 from "../../../data/level4.json";
import level5 from "../../../data/level5.json";

import NotesSection from "../../../components/NotesSection";
import MCQSection from "../../../components/MCQSection";
import MiniTasksSection from "../../../components/MiniTasksSection";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { LevelData } from "../../../types/level";

// Available levels
const levels: Record<number, LevelData> = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
};

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();

  const levelIdParam = params.levelId;
  const levelIdNum = Number(levelIdParam);

  const levelData = levels[levelIdNum];

  const [currentStep, setCurrentStep] = useState<
    "notes" | "mcq" | "mini" | "complete"
  >("notes");
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset step when levelId changes
  useEffect(() => {
    setCurrentStep("notes");
  }, [levelIdNum]);

  const handleNext = () => {
    if (currentStep === "notes") setCurrentStep("mcq");
    else if (currentStep === "mcq") setCurrentStep("mini");
    else if (currentStep === "mini") {
      setShowConfetti(true);
      setCurrentStep("complete");
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  if (!levelData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white text-center px-6">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-red-400">🚫 Level Not Found</h1>
          <p className="text-lg text-gray-300 mb-6">
            The level{" "}
            <span className="font-mono text-indigo-400">"{levelIdParam}"</span> does not
            exist.
          </p>
          <button
            onClick={() => router.push("/levels/1")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition duration-200"
          >
            Go to Level 1
          </button>
        </div>
      </div>
    );
  }

  const { notes, mcqs, miniTasks } = levelData;
  const totalLevels = Object.keys(levels).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-200 px-4 py-10 sm:px-6 flex">
      
      {/* Sticky Sidebar */}
      <nav className="sticky top-20 flex flex-col space-y-4 w-40 mr-8 self-start">
        <button
          onClick={() => setCurrentStep("notes")}
          className={`px-4 py-2 rounded text-left ${
            currentStep === "notes"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setCurrentStep("mcq")}
          className={`px-4 py-2 rounded text-left ${
            currentStep === "mcq"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          MCQs
        </button>
        <button
          onClick={() => setCurrentStep("mini")}
          className={`px-4 py-2 rounded text-left ${
            currentStep === "mini"
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Mini Tasks
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto space-y-14">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={400}
            recycle={false}
            gravity={0.2}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            {currentStep === "notes" && (
              <NotesSection notes={notes} onComplete={handleNext} />
            )}
            {currentStep === "mcq" && (
              <MCQSection mcqs={mcqs} onComplete={handleNext} />
            )}
            {currentStep === "mini" && (
              <MiniTasksSection tasks={miniTasks} onComplete={handleNext} />
            )}

            {currentStep === "complete" && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-6xl sm:text-7xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
                  Level {levelIdNum} Complete!
                </h2>
                <p className="text-gray-300 text-lg sm:text-xl mb-8 max-w-xl mx-auto">
                  You’ve completed all parts of this level — great job!
                </p>

                {levelIdNum < totalLevels ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg"
                    onClick={() => router.push(`/levels/${levelIdNum + 1}`)}
                  >
                    Next Level →
                  </motion.button>
                ) : (
                  <div className="text-xl text-green-400 font-semibold mt-4">
                    🎉 You have completed all levels!
                  </div>
                )}

                <div className="mt-12 max-w-lg mx-auto bg-gray-800/30 border border-gray-700 rounded-2xl p-6 text-sm text-gray-300">
                  <h3 className="text-emerald-300 text-lg font-bold mb-4">📊 Your Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-900/50 rounded-xl">
                      <div className="text-2xl font-bold text-white">📘 {notes.length}</div>
                      <div className="text-gray-400 mt-1">Notes</div>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-xl">
                      <div className="text-2xl font-bold text-white">❓ {mcqs.length}</div>
                      <div className="text-gray-400 mt-1">MCQs</div>
                    </div>
                    <div className="p-4 bg-gray-900/50 rounded-xl">
                      <div className="text-2xl font-bold text-white">💻 {miniTasks.length}</div>
                      <div className="text-gray-400 mt-1">Mini Tasks</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Gradient Strip */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 animate-pulse" />
    </div>
  );
}
