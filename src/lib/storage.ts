import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const uploadsDirectory = path.join(process.cwd(), "public", "uploads");

export async function saveReport(file: File) {
  await mkdir(uploadsDirectory, { recursive: true });

  const extension = path.extname(file.name).toLowerCase();
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadsDirectory, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return {
    absoluteFilePath: filePath,
    filePath: `/uploads/${filename}`,
    buffer,
  };
}
