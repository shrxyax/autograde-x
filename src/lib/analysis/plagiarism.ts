import "server-only";

import { clamp } from "@/lib/utils";

function toTokens(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3);
}

function uniquePairs(tokens: string[]) {
  const pairs = new Set<string>();
  for (let index = 0; index < tokens.length - 1; index += 1) {
    pairs.add(`${tokens[index]} ${tokens[index + 1]}`);
  }
  return pairs;
}

export function calculatePlagiarismScore(source: string, comparisonTexts: string[]) {
  if (!source.trim() || comparisonTexts.length === 0) {
    return 0;
  }

  const sourcePairs = uniquePairs(toTokens(source));
  if (sourcePairs.size === 0) {
    return 0;
  }

  let highestSimilarity = 0;

  for (const comparison of comparisonTexts) {
    const otherPairs = uniquePairs(toTokens(comparison));
    if (otherPairs.size === 0) {
      continue;
    }

    let overlap = 0;
    for (const pair of sourcePairs) {
      if (otherPairs.has(pair)) {
        overlap += 1;
      }
    }

    const denominator = Math.max(sourcePairs.size, otherPairs.size);
    highestSimilarity = Math.max(highestSimilarity, overlap / denominator);
  }

  return clamp(Math.round(highestSimilarity * 100), 0, 99);
}
