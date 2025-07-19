"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { playSound } from "../utils/playSound";

export default function MCQSection({
  mcqs,
  onComplete,
}: {
  mcqs: any[];
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<{ [key: number]: string }>({});
  const [completed, setCompleted] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

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

  const handleSelect = (index: number, option: string) => {
    if (selected[index]) return;

    const correct = mcqs[index].correctAnswer === option;

    playSound("/sounds/select.mp3");
    playSound(correct ? "/sounds/correct.mp3" : "/sounds/wrong.mp3");

    setSelected((prev) => ({ ...prev, [index]: option }));
    setCompleted((prev) => [...prev, index]);
  };

  const handleSubmit = () => {
    playSound("/sounds/submit.mp3");
    setShowConfetti(true);
    setTimeout(() => {
      onComplete();
      setShowConfetti(false);
    }, 3000);
  };

  const isAllAnswered = mcqs.length === Object.keys(selected).length;
  const progressPercentage = Math.round((completed.length / mcqs.length) * 100);

  return (
    <section className="relative py-10 px-4 max-w-5xl mx-auto min-h-screen space-y-12">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-gray-700 shadow-lg">
        <div className="max-w-5xl mx-auto py-3 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-300">Progress: {progressPercentage}%</span>
            <span className="text-xs text-gray-300">
              {completed.length}/{mcqs.length} Answered
            </span>
          </div>
          <motion.div
            className="h-2.5 rounded-full bg-gray-700 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Heading */}
      <div className="pt-24 pb-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-300 to-indigo-400 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🎯 MCQ Challenge
        </motion.h2>
        <motion.p
          className="text-gray-400 max-w-xl mx-auto mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Answer each question carefully. Once selected, answers can't be changed.
        </motion.p>
      </div>

      {/* MCQ List */}
      <div className="space-y-10 pb-20">
        {mcqs.map((q, idx) => {
          const userAns = selected[idx];
          const correct = q.correctAnswer === userAns;

          return (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg relative transition-all duration-300 ${
                userAns ? "opacity-90" : "hover:border-indigo-400/30 hover:shadow-indigo-500/10"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: userAns ? 1 : 1.02 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-teal-300">
                  {idx + 1}. {q.question}
                </h3>
                {userAns && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-xl font-bold ${
                      correct ? "text-teal-400" : "text-red-400"
                    }`}
                  >
                    {correct ? "✔️" : "❌"}
                  </motion.div>
                )}
              </div>

              {q.code && (
                <motion.pre
                  className="bg-gray-800/50 text-teal-300 p-4 mt-2 rounded-lg text-sm overflow-auto border border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <code>{q.code}</code>
                </motion.pre>
              )}

              <div className="space-y-3 mt-4">
                {q.options.map((opt: string, i: number) => {
                  const isSelected = selected[idx] === opt;
                  const isCorrect = q.correctAnswer === opt;

                  let style = "border-gray-600 bg-gray-800 text-gray-300";
                  if (selected[idx]) {
                    if (isCorrect) style = "bg-green-800 text-green-300 border-green-600";
                    else if (isSelected) style = "bg-red-800 text-red-300 border-red-600";
                    else style = "opacity-60";
                  }

                  return (
                    <motion.button
                      key={i}
                      disabled={!!selected[idx]}
                      onClick={() => handleSelect(idx, opt)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all font-medium ${style}`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              {selected[idx] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 mt-4 border border-gray-700 bg-gray-800/60 rounded-xl text-sm text-yellow-200"
                >
                  <span className="font-bold">🧠 Explanation:</span> {q.explanation}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Submit Button */}
      {isAllAnswered && (
        <motion.div className="text-center mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 rounded-full font-bold bg-gradient-to-r from-teal-400 to-indigo-500 text-white shadow-lg shadow-indigo-500/20"
          >
            🎉 Submit & Proceed
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}
