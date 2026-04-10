import "server-only";

import { getGeminiClient, uploadGeminiPdf } from "@/lib/ai/gemini";
import { buildQualityReport } from "@/lib/analysis/report";
import { clamp } from "@/lib/utils";

type GradeResult = {
  score: number;
  aiProbability: number;
  strengths: string[];
  weaknesses: string[];
};

function heuristicGrade(text: string, topic: string, rubric: string, difficulty: string) {
  const quality = buildQualityReport(text);
  const topicMentions = topic
    .toLowerCase()
    .split(/\s+/)
    .filter((part) => part.length > 3)
    .filter((part) => text.toLowerCase().includes(part)).length;
  const rubricMentions = rubric
    .toLowerCase()
    .split(/\s+/)
    .filter((part) => part.length > 5)
    .filter((part) => text.toLowerCase().includes(part)).length;

  let baseScore = quality.qualityScore + topicMentions * 3 + Math.min(rubricMentions, 4) * 2;
  if (difficulty === "Easy") baseScore += 4;
  if (difficulty === "Hard") baseScore -= 4;

  const score = clamp(baseScore, 45, 96);
  const repetitivePhrases = (text.match(/\b(\w+)\b(?:\s+\1\b){2,}/gi) ?? []).length;
  const aiProbability = clamp(18 + repetitivePhrases * 8 + (text.length > 8000 ? 8 : 0), 8, 82);

  return {
    score: Math.round(score),
    aiProbability,
    strengths: [
      quality.strengths[0],
      topicMentions > 1 ? "The report addresses core assignment concepts directly." : "The submission aligns with the assignment at a high level.",
    ],
    weaknesses: [
      quality.risks[0],
      rubricMentions < 2 ? "Rubric expectations are not covered consistently." : "Some rubric areas still need stronger evidence.",
    ],
  } satisfies GradeResult;
}

function parseGeminiJson(content: string) {
  const jsonStart = content.indexOf("{");
  const jsonEnd = content.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Gemini response did not contain JSON.");
  }

  return JSON.parse(content.slice(jsonStart, jsonEnd + 1)) as GradeResult;
}

export async function gradeAssignment(
  text: string,
  topic: string,
  rubric: string,
  difficulty: string,
  absoluteFilePath?: string,
  reportName?: string,
) {
  const trimmedText = text.slice(0, 12000);
  const ai = getGeminiClient();

  if (!ai) {
    return heuristicGrade(trimmedText, topic, rubric, difficulty);
  }

  const prompt = `
You are an experienced university professor grading a software-engineering project submission.
Assignment Topic: ${topic}
Difficulty Level: ${difficulty}
Rubric: ${rubric}
Submission Text: ${trimmedText}

Return only valid JSON:
{
  "score": number,
  "aiProbability": number,
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"]
}
`;

  try {
    const upload = absoluteFilePath && reportName
      ? await uploadGeminiPdf(absoluteFilePath, reportName)
      : null;

    const response = await (upload?.ai ?? ai).models.generateContent({
      model: "gemini-3-flash-preview",
      contents: upload ? [prompt, upload.filePart] : [prompt],
      config: {
        systemInstruction: "You are an academic grading assistant. Return JSON only.",
        temperature: 0.2,
      },
    });

    const parsed = parseGeminiJson(response.text ?? "");

    return {
      score: clamp(parsed.score, 0, 100),
      aiProbability: clamp(parsed.aiProbability, 0, 100),
      strengths: parsed.strengths.slice(0, 4),
      weaknesses: parsed.weaknesses.slice(0, 4),
    };
  } catch {
    return heuristicGrade(trimmedText, topic, rubric, difficulty);
  }
}
