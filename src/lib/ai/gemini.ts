import "server-only";

import { createPartFromUri, GoogleGenAI } from "@google/genai";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

export async function uploadGeminiPdf(filePath: string, displayName: string) {
  const ai = getGeminiClient();

  if (!ai) {
    return null;
  }

  const uploadedFile = await ai.files.upload({
    file: filePath,
    config: {
      displayName,
    },
  });

  if (!uploadedFile.name) {
    throw new Error("Gemini upload did not return a file name.");
  }

  let current = await ai.files.get({ name: uploadedFile.name });

  while (current.state === "PROCESSING") {
    await sleep(1500);
    current = await ai.files.get({ name: uploadedFile.name });
  }

  if (current.state === "FAILED" || !current.uri || !current.mimeType) {
    throw new Error("Gemini file processing failed.");
  }

  return {
    ai,
    filePart: createPartFromUri(current.uri, current.mimeType),
  };
}
