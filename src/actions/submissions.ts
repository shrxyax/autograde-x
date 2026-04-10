"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { reviewSchema, submissionSchema } from "@/lib/auth/validation";
import { gradeAssignment } from "@/lib/ai/grader";
import { calculatePlagiarismScore } from "@/lib/analysis/plagiarism";
import { buildQualityReport } from "@/lib/analysis/report";
import { extractPdfText } from "@/lib/pdf";
import { saveReport } from "@/lib/storage";
import { submissionThreshold } from "@/lib/constants";
import { ActionState } from "@/actions/types";
import { roles, submissionStatuses } from "@/lib/domain";

export async function submitAssignmentAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const student = await requireRole([roles.STUDENT]);

  const parsed = submissionSchema.safeParse({
    assignmentId: formData.get("assignmentId"),
    repositoryUrl: formData.get("repositoryUrl"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid repository URL if you provide one." };
  }

  const file = formData.get("report");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Upload a PDF report before submitting." };
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { status: "error", message: "Only PDF reports are accepted right now." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { status: "error", message: "Report must be smaller than 5 MB." };
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: parsed.data.assignmentId },
  });

  if (!assignment) {
    return { status: "error", message: "Assignment not found." };
  }

  const existingVersions = await prisma.submission.findMany({
    where: {
      assignmentId: assignment.id,
      userId: student.id,
    },
    select: { version: true },
  });

  const nextVersion = existingVersions.length === 0
    ? 1
    : Math.max(...existingVersions.map((item) => item.version)) + 1;

  const { absoluteFilePath, filePath, buffer } = await saveReport(file);
  const extractedText = await extractPdfText(buffer, absoluteFilePath);

  if (!extractedText.trim()) {
    return {
      status: "error",
      message: process.env.GEMINI_API_KEY
        ? "The PDF could not be processed. Try a clearer PDF with readable pages."
        : "The PDF could not be read. Add GEMINI_API_KEY for scanned PDFs, or upload a text-based PDF report.",
    };
  }

  const comparisonTexts = (
    await prisma.submission.findMany({
      where: { assignmentId: assignment.id },
      select: { extractedText: true },
    })
  ).map((item) => item.extractedText);

  const quality = buildQualityReport(extractedText, parsed.data.repositoryUrl);
  const plagiarismScore = calculatePlagiarismScore(extractedText, comparisonTexts);
  const grade = await gradeAssignment(
    extractedText,
    assignment.topic,
    assignment.rubric,
    assignment.difficulty,
    absoluteFilePath,
    file.name,
  );

  const status = plagiarismScore >= submissionThreshold.plagiarismFlag
    ? submissionStatuses.FLAGGED
    : submissionStatuses.AI_REVIEWED;

  await prisma.submission.create({
    data: {
      assignmentId: assignment.id,
      userId: student.id,
      version: nextVersion,
      repositoryUrl: parsed.data.repositoryUrl,
      reportName: file.name,
      reportPath: filePath,
      extractedText,
      qualityScore: quality.qualityScore,
      plagiarismScore,
      aiScore: grade.score,
      aiProbability: grade.aiProbability,
      aiFeedback: JSON.stringify({
        strengths: grade.strengths,
        weaknesses: grade.weaknesses,
      }),
      staticReport: JSON.stringify(quality),
      status,
    },
  });

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/assignments");
  revalidatePath("/dashboard/student/submissions");
  revalidatePath("/dashboard/faculty");
  revalidatePath("/dashboard/faculty/reviews");

  return {
    status: "success",
    message: `Submission uploaded. AI review scored ${grade.score}/100 with ${plagiarismScore}% similarity.`,
  };
}

export async function reviewSubmissionAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const faculty = await requireRole([roles.FACULTY]);

  const parsed = reviewSchema.safeParse({
    submissionId: formData.get("submissionId"),
    finalScore: formData.get("finalScore"),
    finalFeedback: formData.get("finalFeedback"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid score and feedback." };
  }

  const submission = await prisma.submission.findUnique({
    where: { id: parsed.data.submissionId },
    include: { assignment: { select: { createdById: true } } },
  });

  if (!submission || submission.assignment.createdById !== faculty.id) {
    return { status: "error", message: "Submission not found." };
  }

  await prisma.submission.update({
    where: { id: submission.id },
    data: {
      finalScore: parsed.data.finalScore,
      finalFeedback: parsed.data.finalFeedback,
      reviewedById: faculty.id,
      reviewedAt: new Date(),
      status: submissionStatuses.FINALIZED,
    },
  });

  revalidatePath("/dashboard/faculty");
  revalidatePath("/dashboard/faculty/reviews");
  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/submissions");

  return { status: "success", message: "Final review saved." };
}
