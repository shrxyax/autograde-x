import { prisma } from "@/lib/prisma";

interface CreateAssignmentInput {
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  rubric: string;
  maxScore: number;
}

export async function createAssignment(data: CreateAssignmentInput) {
  if (!data.title || !data.description || !data.difficulty || !data.rubric || !data.maxScore) {
    throw new Error("Missing required fields");
  }

  const assignment = await prisma.assignment.create({
    data: {
      title: data.title,
      description: data.description,
      topic: data.topic,
      difficulty: data.difficulty,
      rubric: data.rubric,
      maxScore: data.maxScore
    },
  });

  return assignment;
}

export async function getAssignments() {
  return prisma.assignment.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}