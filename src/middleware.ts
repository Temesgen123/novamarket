// src/proxy.ts (or src/middleware.ts)
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth: authMiddleware } = NextAuth(authConfig);

export default authMiddleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/login";

  // Case A: Unauthenticated user targets protected administrative dash space
  if (isAdminRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    
    const encodedCallback = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallback}`, nextUrl));
  }

  // Case B: User with valid session lands back on login page -> instantly skip ahead
  if (isLoginRoute && isLoggedIn) {
    const role = req.auth?.token?.role || "CUSTOMER";
    const target = role === "ADMIN" ? "/admin/dashboard" : "/products";
    return NextResponse.redirect(new URL(target, nextUrl));
  }

  return NextResponse.next();
});

// Avoid executing auth cycles against structural media payloads, static assets, or images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};