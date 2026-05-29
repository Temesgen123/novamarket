// src/proxy.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// Pull out NextAuth's native execution loop
const { auth: proxyAuth } = NextAuth(authConfig);

export default proxyAuth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/login";

  // Route protection guardrail
  if (isAdminRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallback = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallback}`, nextUrl));
  }

  if (isLoginRoute && isLoggedIn) {
    // Fixed: Pull the custom string property directly from your typed session user object
    const role = req.auth?.user?.role || "CUSTOMER";
    const target = role === "ADMIN" ? "/admin/dashboard" : "/products";
    return NextResponse.redirect(new URL(target, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};