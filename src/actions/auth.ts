"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, requireUser } from "@/lib/auth/session";
import { loginSchema, registerSchema } from "@/lib/auth/validation";
import { ActionState } from "@/actions/types";
import { Role } from "@/lib/domain";

function toFieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return error.flatten().fieldErrors;
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user) {
    return { status: "error", message: "No account found for that email address." };
  }

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.password);

  if (!passwordMatches) {
    return { status: "error", message: "Incorrect password. Try again." };
  }

  await createSession(user.id, user.role);
  revalidatePath("/");

  return {
    status: "success",
    message: "Welcome back.",
    redirectTo: `/dashboard/${user.role.toLowerCase()}`,
  };
}

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (existingUser) {
    return { status: "error", message: "An account with this email already exists." };
  }

  const password = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      password,
      role: parsed.data.role as Role,
    },
  });

  await createSession(user.id, user.role);
  revalidatePath("/");

  return {
    status: "success",
    message: "Account created successfully.",
    redirectTo: `/dashboard/${user.role.toLowerCase()}`,
  };
}

export async function logoutAction() {
  await destroySession();
  revalidatePath("/");
}

export async function updateProfileAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();

  if (name.length < 2) {
    return { status: "error", message: "Name must be at least 2 characters long." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  revalidatePath("/dashboard");

  return { status: "success", message: "Profile updated." };
}
