import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = checkAuth(request);
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get("auth")?.value;
  if (token) {
    console.log("Token exists", token);
    return true;
  }

  return false;
}

export const config = {
  matcher: "/home",
};
