"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/session";
import { assignmentStatuses, roles, submissionStatuses } from "@/lib/domain";

export async function deleteUserAction(formData: FormData) {
  const admin = await requireRole([roles.ADMIN]);
  const userId = String(formData.get("userId") ?? "");

  if (!userId || userId === admin.id) {
    return;
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/users");
}

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireRole([roles.ADMIN]);
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!userId || userId === admin.id || !Object.values(roles).includes(role as never)) {
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/users");
}

export async function adminUpdateAssignmentStatusAction(formData: FormData) {
  await requireRole([roles.ADMIN]);
  const assignmentId = String(formData.get("assignmentId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!assignmentId || !Object.values(assignmentStatuses).includes(status as never)) {
    return;
  }

  await prisma.assignment.update({
    where: { id: assignmentId },
    data: { status },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/assignments");
  revalidatePath("/dashboard/faculty");
  revalidatePath("/dashboard/student/assignments");
}

export async function adminUpdateSubmissionStatusAction(formData: FormData) {
  await requireRole([roles.ADMIN]);
  const submissionId = String(formData.get("submissionId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!submissionId || !Object.values(submissionStatuses).includes(status as never)) {
    return;
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/submissions");
  revalidatePath("/dashboard/faculty/reviews");
  revalidatePath("/dashboard/student/submissions");
}
