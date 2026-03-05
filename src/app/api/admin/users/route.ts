import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(users);
}

export async function DELETE(req: Request) {

  const { id } = await req.json();

  await prisma.user.delete({
    where: {
      id
    }
  });

  return NextResponse.json({ message: "User deleted" });
}