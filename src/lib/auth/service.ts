import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "SUPER_SECRET_KEY"; // later move to env

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string
) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  console.log("USER ROLE DURING LOGIN:", user.role);

  const payload = {
    userId: user.id,
    role: user.role.toUpperCase(),
  };

  console.log("TOKEN PAYLOAD BEING SIGNED:", payload);

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });

  console.log("GENERATED TOKEN:", token);

  return { token, user };
}