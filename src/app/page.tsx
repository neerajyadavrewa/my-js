"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import levels from "../data/levels.json";
import Link from "next/link";

export default function HomePage() {
  const [floaters, setFloaters] = useState<
    { key: number; size: string; top: string; left: string; opacity: number; delay: number }[]
  >([]);
  const [scope, animate] = useAnimate();
  const sectionList = ["notes", "mcq", "mini"];

  // Responsive particles
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 8 : 16;
    const newFloaters = Array.from({ length: count }).map((_, i) => ({
      key: i,
      size: `${Math.random() * 12 + 6}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.1 + 0.03,
      delay: Math.random() * 5
    }));
    setFloaters(newFloaters);
  }, []);

  // Staggered card animation
  useEffect(() => {
    animate(
      ".card",
      { opacity: 1, y: 0 },
      { delay: stagger(0.1, { startDelay: 0.3 }), duration: 0.6 }
    );
  }, [animate]);

  return (
    <div 
      className="flex min-h-screen text-white overflow-x-hidden"
      style={{
        background: "radial-gradient(ellipse at top, #1a1b2f 0%, #0f111a 100%)"
      }}
    >
      <main className="flex-1 px-4 py-8 md:px-8 md:py-12 lg:px-12 relative max-w-7xl mx-auto w-full">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-10 left-[20%] w-64 h-64 bg-teal-500/10 rounded-full mix-blend-soft-light filter blur-[90px] animate-blob"></div>
          <div className="absolute top-1/3 right-[15%] w-80 h-80 bg-indigo-500/15 rounded-full mix-blend-soft-light filter blur-[90px] animate-blob animation-delay-3000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-violet-500/10 rounded-full mix-blend-soft-light filter blur-[90px] animate-blob animation-delay-5000"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {floaters.map(({ key, size, top, left, opacity, delay }) => (
            <motion.div
              key={key}
              className="absolute rounded-full bg-gradient-to-r from-teal-400/20 to-indigo-500/20"
              style={{ width: size, height: size, top, left, opacity }}
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 10,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-12 md:mb-16 lg:mb-20 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text bg-300% animate-gradient">
                Master JavaScript Step-by-Step
              </span>
            </motion.h1>
            
            <motion.p
              className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Structured learning path with comprehensive notes, quizzes, and hands-on coding challenges
            </motion.p>
          </motion.div>

          {/* Level cards */}
          <motion.div 
            ref={scope}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            initial={false}
          >
            {levels.map((level, index) => (
              <motion.div
                key={level.id}
                className="card opacity-0 transform translate-y-10"
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" } 
                }}
              >
                <Link href={`/levels/${level.id}`} className="block h-full">
                  <motion.div
                    className="group h-full bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-700/60 p-7 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 relative overflow-hidden"
                    whileHover={{ 
                      borderColor: "rgba(99, 102, 241, 0.3)",
                      boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.15)"
                    }}
                  >
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg transform rotate-6 z-10">
                      Level {index + 1}
                    </div>

                    <div className="flex items-start space-x-5 mb-5">
                      <motion.div 
                        className="min-w-[60px] w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="mt-1">JS</span>
                      </motion.div>
                      <div className="pt-1">
                        <h2 className="text-xl font-semibold text-white mb-2">{level.title}</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">{level.description}</p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                      {sectionList.map((section) => (
                        <motion.span
                          key={section}
                          className="bg-gray-700/50 text-xs text-gray-200 px-3 py-1.5 rounded-full font-medium capitalize border border-gray-600/50"
                          whileHover={{ 
                            scale: 1.05,
                            backgroundColor: "rgba(99, 102, 241, 0.2)",
                            borderColor: "rgba(129, 140, 248, 0.4)"
                          }}
                        >
                          {section === "notes"
                            ? "Study Notes"
                            : section === "mcq"
                            ? "MCQs"
                            : section === "mini"
                            ? "Coding Tasks"
                            : section}
                        </motion.span>
                      ))}
                    </div>

                    <motion.div 
                      className="mt-8 text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-medium py-2.5 px-6 rounded-full shadow-lg transition-all duration-300 group-hover:shadow-indigo-500/30">
                        <span className="relative z-10 flex items-center justify-center">
                          Start Learning 
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </button>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 10s infinite ease-in-out;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
}