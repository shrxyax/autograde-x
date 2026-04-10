import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type SessionPayload = {
  userId: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
};

function getSecret() {
  return process.env.JWT_SECRET ?? "autogradex-dev-secret";
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("autogradex_session")?.value;
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const payload = jwt.verify(token, getSecret()) as SessionPayload;

    if (pathname.startsWith("/dashboard/student") && payload.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/dashboard/faculty") && payload.role !== "FACULTY") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/dashboard/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("autogradex_session");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
