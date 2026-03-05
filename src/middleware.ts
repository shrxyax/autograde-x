import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const role = payload.role;
    const { pathname } = request.nextUrl;

    // Protect faculty routes
    if (pathname.startsWith("/dashboard/faculty") && role !== "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Protect student routes
    if (pathname.startsWith("/dashboard/student") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Protect admin routes
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    

    return NextResponse.next();

  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};