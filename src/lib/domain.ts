export const roles = {
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof roles)[keyof typeof roles];

export const assignmentStatuses = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED",
} as const;

export type AssignmentStatus = (typeof assignmentStatuses)[keyof typeof assignmentStatuses];

export const submissionStatuses = {
  SUBMITTED: "SUBMITTED",
  AI_REVIEWED: "AI_REVIEWED",
  FINALIZED: "FINALIZED",
  FLAGGED: "FLAGGED",
} as const;

export type SubmissionStatus = (typeof submissionStatuses)[keyof typeof submissionStatuses];
