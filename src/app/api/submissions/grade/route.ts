import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { submissionId, score, feedback } = await req.json();

  const updated = await prisma.submission.update({
    where: {
      id: submissionId
    },
    data: {
      facultyScore: score,
      facultyFeedback: feedback
    }
  });

  return NextResponse.json(updated);
}