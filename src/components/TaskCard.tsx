"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { playSound } from "../utils/playSound"; // Optional

interface TestCase {
  input: any;
  expected: any; // Allow objects, strings, numbers, etc.
}

interface Task {
  title: string;
  description: string;
  topic?: string;
  starterCode: string;
  testCases: TestCase[];
}

export default function TaskCard({
  task,
  onComplete,
}: {
  task: Task;
  onComplete: () => void;
}) {
  const [code, setCode] = useState(task.starterCode);
  const [results, setResults] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const deepCompare = (a: any, b: any) =>
    JSON.stringify(a) === JSON.stringify(b);

  const runAllTests = async () => {
    setLoading(true);
    const newResults: string[] = [];

    for (const testCase of task.testCases) {
      const fullCode = `${code}\n\n${generateFunctionCall(code, testCase.input)}`;

      const res = await fetch("/api/submit-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceCode: fullCode }),
      });

      const data = await res.json();
      const outputRaw =
        data.stdout?.trim() ||
        data.stderr?.trim() ||
        data.compile_output?.trim() ||
        "No Output";

      newResults.push(outputRaw);
    }

    setResults(newResults);

    const allPassed = newResults.every((out, i) =>
      deepCompare(clean(out), clean(task.testCases[i].expected))
    );

    if (allPassed) {
      setCompleted(true);
      playSound("/sounds/correct.mp3");
      onComplete();
    } else {
      playSound("/sounds/wrong.mp3");
    }

    setLoading(false);
  };

  const clean = (val: any) => {
    try {
      return typeof val === "string" ? JSON.parse(val) : val;
    } catch {
      return String(val).trim();
    }
  };

 const generateFunctionCall = (code: string, input: any) => {
  const match = code.match(/function\s+(\w+)/);
  if (!match) return "// Error: No function found";

  const functionName = match[1];
  const args = Array.isArray(input)
    ? input.map((arg) => JSON.stringify(arg)).join(", ")
    : JSON.stringify(input);

  // Special case: for Safe JSON Parse task, wrap output in JSON.stringify
  if (task.title === "Safe JSON Parse") {
    return `console.log(JSON.stringify(${functionName}(${args})));`;
  }

  // Default: normal console.log output
  return `console.log(${functionName}(${args}));`;
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-md border ${
        completed ? "border-green-500" : "border-gray-700"
      } rounded-2xl p-6 sm:p-7 shadow-lg transition-all duration-300`}
    >
      {/* Title & Topic */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{task.title}</h3>
        {task.topic && (
          <span className="text-xs font-semibold text-teal-300 bg-teal-900/30 px-2 py-1 rounded">
            {task.topic}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-4 whitespace-pre-line">{task.description}</p>

      {/* Code Editor */}
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <Editor
          height="300px"
          defaultLanguage="javascript"
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {/* Run Button */}
      <motion.button
        onClick={runAllTests}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-5 w-full sm:w-auto bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-400 hover:to-teal-300 text-black font-medium py-2.5 px-6 rounded-xl shadow-lg transition-all duration-300"
      >
        {loading ? "⏳ Running..." : "▶ Run All Test Cases"}
      </motion.button>

      {/* Results */}
      <div className="mt-6 space-y-4 text-sm text-white">
        {task.testCases.map((tc, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/60 border border-gray-700 rounded-xl p-4"
          >
            <div>
              <strong className="text-gray-400">Input:</strong>{" "}
              <span className="text-yellow-300">{JSON.stringify(tc.input)}</span>
            </div>
            <div>
              <strong className="text-gray-400">Expected:</strong>{" "}
              <span className="text-pink-400">{JSON.stringify(tc.expected)}</span>
            </div>
            <div>
              <strong className="text-gray-400">Output:</strong>{" "}
              <span
                className={`${
                  deepCompare(clean(results[idx]), clean(tc.expected))
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {results[idx] || "Not Run Yet"}
              </span>
              {results[idx] && (
                <span className="ml-2">
                  {deepCompare(clean(results[idx]), clean(tc.expected)) ? "✔️" : "❌"}
                </span>
              )}
            </div>
          </motion.div>
        ))}
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-400 font-semibold text-center mt-4"
          >
            ✅ All test cases passed!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
