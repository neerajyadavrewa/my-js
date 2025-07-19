"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface Note {
  title: string;
  content: string;
  codeSnippet?: string;
  link?: string;
  deepDive?: string;
}

export default function NotesSection({
  notes,
  onComplete,
}: {
  notes: Note[];
  onComplete: () => void;
}) {
  const [completedNotes, setCompletedNotes] = useState<boolean[]>(
    Array(notes.length).fill(false)
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch((err) => console.error("Sound error:", err));
  };

  const markAsUnderstood = (index: number) => {
    const updated = [...completedNotes];
    updated[index] = true;
    setCompletedNotes(updated);

    playSound("/sounds/correct.mp3");

    if (updated.every(Boolean)) {
      playSound("/sounds/submit.mp3");
      setShowConfetti(true);
      setTimeout(() => {
        onComplete();
        setShowConfetti(false);
      }, 3000);
    }
  };

  const totalCompleted = completedNotes.filter(Boolean).length;
  const totalNotes = notes.length;
  const progressPercent = Math.round((totalCompleted / totalNotes) * 100);

  return (
    <section className="relative py-10 px-4 max-w-5xl mx-auto min-h-screen">
      {showConfetti && (
        <Confetti 
          width={windowSize.width}
          height={windowSize.height}
          recycle={false} 
          numberOfPieces={500}
          gravity={0.1}
        />
      )}

      {/* Sticky Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-gray-700 shadow-lg">
        <div className="max-w-5xl mx-auto py-3 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-300">
              Progress: {progressPercent}%
            </span>
            <span className="text-xs text-gray-300">
              {totalCompleted}/{totalNotes} Completed
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
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Heading */}
      <div className="pt-24 pb-12 sm:pt-28 sm:pb-16">
        <motion.h2
          className="text-center text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-300 to-indigo-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🚀 Note Explorer
        </motion.h2>
        <motion.p
          className="text-center text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Work through these notes at your own pace. Mark each as understood when you're ready.
        </motion.p>
      </div>

      {/* Notes */}
      <div className="space-y-8 sm:space-y-10 pb-20">
        {notes.map((note, index) => (
          <motion.div
            key={index}
            className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-7 shadow-lg transition-all duration-300 relative overflow-hidden ${
              completedNotes[index] ? "opacity-80" : "hover:border-indigo-400/30 hover:shadow-indigo-500/10"
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: completedNotes[index] ? 1 : 1.02 }}
          >
            {/* Completion indicator */}
            <div className="absolute top-4 right-4">
              {completedNotes[index] ? (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400/20 to-indigo-500/20 border border-teal-400/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-gray-500" />
              )}
            </div>

            <div className="flex items-start mb-5">
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 font-bold">
                  {index + 1}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  {note.title}
                </h3>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap space-y-3">
                  {note.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-gray-300">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {note.codeSnippet && (
              <motion.pre 
                className="bg-gray-800/50 text-teal-300 p-4 mt-4 rounded-lg text-sm overflow-auto border border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <code>{note.codeSnippet}</code>
              </motion.pre>
            )}

            {(note.deepDive || note.link) && (
              <div className="mt-5 flex flex-wrap gap-3">
                {note.deepDive && (
                  <details className="flex-1 min-w-[200px]">
                    <summary className="cursor-pointer text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-lg transition-colors flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Deep Dive
                    </summary>
                    <p className="text-gray-400 mt-3 px-1 text-sm">{note.deepDive}</p>
                  </details>
                )}

                {note.link && (
                  <a
                    href={note.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Learn More
                  </a>
                )}
              </div>
            )}

            {!completedNotes[index] && (
              <motion.button
                onClick={() => markAsUnderstood(index)}
                className="mt-6 w-full sm:w-auto bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-medium py-2.5 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Mark as Understood
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-gray-800 border border-gray-700 text-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-700 transition-colors z-40"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </motion.button>
    </section>
  );
}