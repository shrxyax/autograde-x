import "server-only";

import { prisma } from "@/lib/prisma";
import { assignmentStatuses, roles, submissionStatuses } from "@/lib/domain";

function latestByAssignment<T extends { assignmentId: string; version: number }>(items: T[]) {
  const latest = new Map<string, T>();

  for (const item of items) {
    const current = latest.get(item.assignmentId);
    if (!current || item.version > current.version) {
      latest.set(item.assignmentId, item);
    }
  }

  return Array.from(latest.values());
}

export async function getHomePageData() {
  const [students, faculty, assignments, submissions] = await Promise.all([
    prisma.user.count({ where: { role: roles.STUDENT } }),
    prisma.user.count({ where: { role: roles.FACULTY } }),
    prisma.assignment.count({ where: { status: assignmentStatuses.PUBLISHED } }),
    prisma.submission.count(),
  ]);

  return { students, faculty, assignments, submissions };
}

export async function getStudentDashboardData(userId: string) {
  const [assignments, allSubmissions] = await Promise.all([
    prisma.assignment.findMany({
      where: { status: assignmentStatuses.PUBLISHED },
      include: {
        createdBy: { select: { name: true } },
      },
      orderBy: { deadline: "asc" },
    }),
    prisma.submission.findMany({
      where: { userId },
      include: { assignment: true },
      orderBy: [{ assignmentId: "asc" }, { version: "desc" }],
    }),
  ]);

  const latestSubmissions = latestByAssignment(allSubmissions);

  return {
    assignments,
    submissions: latestSubmissions,
    stats: {
      activeAssignments: assignments.length,
      submittedAssignments: latestSubmissions.length,
      finalizedReviews: latestSubmissions.filter((item) => item.status === submissionStatuses.FINALIZED).length,
    },
  };
}

export async function getFacultyDashboardData(userId: string) {
  const [assignments, submissions] = await Promise.all([
    prisma.assignment.findMany({
      where: { createdById: userId },
      include: { _count: { select: { submissions: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.findMany({
      where: { assignment: { createdById: userId } },
      include: {
        user: { select: { name: true, email: true } },
        assignment: { select: { title: true, topic: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const latestSubmissions = latestByAssignment(submissions);

  return {
    assignments,
    submissions: latestSubmissions,
    stats: {
      assignments: assignments.length,
      pendingReviews: latestSubmissions.filter((item) => item.status !== submissionStatuses.FINALIZED).length,
      flaggedSubmissions: latestSubmissions.filter((item) => item.plagiarismScore >= 65).length,
    },
  };
}

export async function getAdminDashboardData() {
  const [users, assignments, submissions] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            submissions: true,
            assignmentsCreated: true,
          },
        },
      },
    }),
    prisma.assignment.findMany({
      include: {
        createdBy: { select: { name: true } },
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.findMany({
      include: {
        user: { select: { name: true } },
        assignment: {
          select: {
            title: true,
            createdBy: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    users,
    assignments,
    submissions,
    stats: {
      users: users.length,
      assignments: assignments.length,
      submissions: submissions.length,
      flaggedSubmissions: submissions.filter((item) => item.status === submissionStatuses.FLAGGED || item.plagiarismScore >= 65).length,
    },
  };
}
