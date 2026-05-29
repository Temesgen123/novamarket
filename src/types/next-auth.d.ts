// src/types/next-auth.d.ts
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the root session payload shape
   */
  interface Session {
    user: {
      id: string;
      role: string; // <-- Explicitly tells the compiler session.user.role exists!
    } & DefaultSession["user"];
  }

  /**
   * Extends the baseline user profile record properties
   */
  interface User {
    id?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}