import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth/service";
import { cookies } from "next/headers";

export async function GET() {
  return NextResponse.json({
    message: "Login route working. Use POST."
  });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { token, user } = await loginUser(email, password);

    // ✅ Correct way in Next 16
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(user);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}