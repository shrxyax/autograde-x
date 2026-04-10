import "server-only";

import { clamp } from "@/lib/utils";

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function buildQualityReport(text: string, repositoryUrl?: string | null) {
  const normalized = normalize(text);
  const words = normalized ? normalized.split(" ").length : 0;
  const sentences = (normalized.match(/[.!?]/g) ?? []).length || 1;
  const avgSentenceLength = words / sentences;
  const headingCount = (text.match(/\n[A-Z][A-Z0-9\s:-]{4,}\n/g) ?? []).length;
  const listCount = (text.match(/(^|\n)\s*[-*•]\s+/g) ?? []).length;
  const citations = (text.match(/\[[0-9]+\]|\([A-Za-z]+,\s*\d{4}\)/g) ?? []).length;
  const codeBlocks = (text.match(/[{};<>]/g) ?? []).length;

  let score = 35;
  if (words > 350) score += 18;
  if (words > 900) score += 12;
  if (avgSentenceLength > 8 && avgSentenceLength < 24) score += 10;
  if (headingCount >= 2) score += 8;
  if (listCount >= 2) score += 5;
  if (citations >= 2) score += 6;
  if (repositoryUrl) score += 4;
  if (codeBlocks > 40) score += 5;
  if (words < 150) score -= 12;
  if (avgSentenceLength > 35) score -= 8;

  const qualityScore = clamp(Math.round(score), 20, 98);

  const strengths = [
    words > 900 ? "Detailed report with strong coverage." : "Readable submission structure.",
    repositoryUrl ? "Repository link included for reproducibility." : "Submission focuses on written explanation.",
    citations >= 2 ? "References or citations are present." : "Opportunity remains to cite external sources.",
  ];

  const risks = [
    words < 350 ? "Report is shorter than expected for a full project review." : "Report length is within an acceptable range.",
    headingCount < 2 ? "Document structure could be clearer with section headings." : "Document sections are easy to follow.",
    citations < 2 ? "Add references to strengthen technical justification." : "Reference usage supports credibility.",
  ];

  return {
    qualityScore,
    summary: `Quality analysis detected ${words} words, ${headingCount} major sections, and ${citations} references.`,
    strengths,
    risks,
    metrics: {
      words,
      avgSentenceLength: Number(avgSentenceLength.toFixed(1)),
      headingCount,
      listCount,
      citations,
      hasRepository: Boolean(repositoryUrl),
    },
  };
}
