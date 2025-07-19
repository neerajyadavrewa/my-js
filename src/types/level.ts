export interface Note {
  title: string;
  content: string;
  codeSnippet: string;
  deepDive: string;
}

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TestCase {
  input: any;      // flexible: number[], string, null, etc.
  expected: any;
}

export interface MiniTask {
  title: string;
  description: string;
  topic: string;
  starterCode: string;
  testCases: TestCase[];
}

export interface LevelData {
  id: string;
  title: string;
  description: string;
  topics: string[];
  notes: Note[];
  mcqs: MCQ[];
  miniTasks: MiniTask[];
}
