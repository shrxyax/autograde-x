import "server-only";

import path from "node:path";
import { uploadGeminiPdf } from "@/lib/ai/gemini";

export async function extractPdfText(buffer: Buffer, absoluteFilePath?: string) {
  try {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    const extractedText = result.text?.trim() ?? "";

    if (extractedText.length > 80) {
      return extractedText;
    }
  } catch {
    // Fall through to Gemini document understanding when available.
  }

  if (!absoluteFilePath || !process.env.GEMINI_API_KEY) {
    return "";
  }

  try {
    const upload = await uploadGeminiPdf(absoluteFilePath, path.basename(absoluteFilePath));

    if (!upload) {
      return "";
    }

    const response = await upload.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        "Extract the visible document text from this PDF. Return plain text only, preserving headings and bullets when possible.",
        upload.filePart,
      ],
    });

    return response.text?.trim() ?? "";
  } catch {
    return "";
  }
}
