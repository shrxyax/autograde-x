import { prisma } from "@/lib/prisma";

interface CreateSubmissionInput {
  assignmentId: string;
  githubUrl: string;
  userId: string;
}

export async function createSubmission(data: CreateSubmissionInput) {
  const existing = await prisma.submission.findFirst({
    where: {
      userId: data.userId,
      assignmentId: data.assignmentId,
    },
  });

  if (existing) {
    throw new Error("You have already submitted this assignment.");
  }

  return prisma.submission.create({
    data,
  });
}

export async function getSubmissions() {
  return prisma.submission.findMany({
    include: {
      assignment: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

