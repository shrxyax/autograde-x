import { NextResponse } from "next/server";
import {
  createSubmission,
  getSubmissions,
} from "@/lib/submissions/service";
import { cookies

 } from "next/headers";  
 
import pdfParse from "pdf-parse/lib/pdf-parse";
import fs from "fs/promises";
import { gradeAssignment } from "@/lib/ai/grader"; 

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token, JWT_SECRET) as any;

  if (decoded.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissions = await prisma.submission.findMany({
    include: {
      user: true,
      assignment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });



  return NextResponse.json(submissions);
}




import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";

const JWT_SECRET = "SUPER_SECRET_KEY";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const assignmentId = formData.get("assignmentId") as string;

    if (!file || !assignmentId) {
      return NextResponse.json(
        { error: "Missing file or assignmentId" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 }
      );
    }

   const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;

    const uploadPath = path.join(
      process.cwd(),
      "public/uploads",
      fileName
    );

    await writeFile(uploadPath, buffer);

    // Read the saved PDF
const dataBuffer = await fs.readFile(uploadPath);

// Extract text from PDF
const pdfData = await pdfParse(dataBuffer);

// This contains all the text from the PDF
const extractedText = pdfData.text;

// get assignment info
const assignment = await prisma.assignment.findUnique({
  where: { id: assignmentId }
});

if (!assignment) {
  throw new Error("Assignment not found");
}



// run AI grader
const aiResultRaw = await gradeAssignment(
  extractedText,
  assignment.topic,
  assignment.rubric,
  assignment.difficulty
);

let aiResult;

try {
  aiResult = JSON.parse(aiResultRaw ?? "{}");
  console.log("AI grading result:", aiResult);
} catch(err) {
  console.error("Failed to parse AI result:", err);
  aiResult = {
    score: 0,
    strengths: [],
    weaknesses: [],
    aiProbability: 0
  };
}

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        userId: decoded.userId,
        fileUrl: `/uploads/${fileName}`,
        fileName: file.name,

        aiScore: aiResult.score,
    aiFeedback: JSON.stringify({
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses
    }),

    aiProbability: aiResult.aiProbability,

    status: "AI_GRADED"
      },
    });

    return NextResponse.json(submission, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}