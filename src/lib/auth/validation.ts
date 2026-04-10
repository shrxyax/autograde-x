import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one number."),
  role: z.enum(["STUDENT", "FACULTY", "ADMIN"]),
});

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title is too short."),
  topic: z.string().min(3, "Topic is too short."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  rubric: z.string().min(20, "Rubric must be at least 20 characters."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  deadline: z.string().min(1, "Deadline is required."),
  maxScore: z.coerce.number().int().min(10).max(100),
});

export const submissionSchema = z.object({
  assignmentId: z.string().min(1, "Assignment is required."),
  repositoryUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => !value || /^https?:\/\//.test(value), "Use a valid repository URL."),
});

export const reviewSchema = z.object({
  submissionId: z.string().min(1),
  finalScore: z.coerce.number().int().min(0).max(100),
  finalFeedback: z.string().min(12, "Feedback must be at least 12 characters."),
});
