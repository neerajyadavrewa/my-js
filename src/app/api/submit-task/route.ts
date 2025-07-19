// /app/api/submit-task/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sourceCode, languageId = 63 } = await req.json(); // Default to JS

    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY!,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: languageId
        })
      }
    );

    if (!response.ok) {
      throw new Error("Judge0 API Error");
    }

    const data = await response.json();
    return NextResponse.json({
      stdout: data.stdout?.trim() || "",
      stderr: data.stderr?.trim() || "",
      compile_output: data.compile_output?.trim() || ""
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to run code" }, { status: 500 });
  }
}
