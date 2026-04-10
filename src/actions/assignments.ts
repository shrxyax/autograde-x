"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { assignmentSchema } from "@/lib/auth/validation";
import { ActionState } from "@/actions/types";
import { AssignmentStatus, assignmentStatuses, roles } from "@/lib/domain";

function toFieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors;
}

export async function createAssignmentAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const faculty = await requireRole([roles.FACULTY]);

  const parsed = assignmentSchema.safeParse({
    title: formData.get("title"),
    topic: formData.get("topic"),
    description: formData.get("description"),
    rubric: formData.get("rubric"),
    difficulty: formData.get("difficulty"),
    deadline: formData.get("deadline"),
    maxScore: formData.get("maxScore"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the assignment details and try again.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  await prisma.assignment.create({
    data: {
      ...parsed.data,
      deadline: new Date(parsed.data.deadline),
      createdById: faculty.id,
      status: assignmentStatuses.PUBLISHED,
    },
  });

  revalidatePath("/dashboard/faculty");
  revalidatePath("/dashboard/student/assignments");

  return { status: "success", message: "Assignment published successfully." };
}

export async function updateAssignmentStatusAction(formData: FormData) {
  const faculty = await requireRole([roles.FACULTY]);
  const assignmentId = String(formData.get("assignmentId") ?? "");
  const status = String(formData.get("status") ?? "") as AssignmentStatus;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { createdById: true },
  });

  if (!assignment || assignment.createdById !== faculty.id) {
    return;
  }

  await prisma.assignment.update({
    where: { id: assignmentId },
    data: { status },
  });

  revalidatePath("/dashboard/faculty");
  revalidatePath("/dashboard/student/assignments");
}

export async function deleteAssignmentAction(formData: FormData) {
  const faculty = await requireRole([roles.FACULTY]);
  const assignmentId = String(formData.get("assignmentId") ?? "");

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { createdById: true },
  });

  if (!assignment || assignment.createdById !== faculty.id) {
    return;
  }

  await prisma.assignment.delete({
    where: { id: assignmentId },
  });

  revalidatePath("/dashboard/faculty");
  revalidatePath("/dashboard/student/assignments");
}
