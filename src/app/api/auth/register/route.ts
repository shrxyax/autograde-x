import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth/service";

export async function GET() {
  return Response.json({ message: "Register route works" });
}
export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    const user = await registerUser(name, email, password, role);

    return NextResponse.json(user, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}