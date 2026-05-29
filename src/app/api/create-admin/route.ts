// src/app/api/create-admin/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Using your project's active, fully-configured Prisma client

export async function GET() {
  try {
    console.log("🚀 Initializing internal API framework handshake...");

    const adminUser = await prisma.user.upsert({
      where: { 
        email: "admin@novamarket.com" 
      },
      update: {}, 
      create: {
        email: "admin@novamarket.com",
        passwordHash: "admin123", // Plain text string matching auth.ts
        role: "ADMIN",                         // All-caps validation bypass
        name: "System Administrator",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin user successfully established!", 
      user: adminUser 
    });

  } catch (error: any) {
    console.error("❌ API Seed Pipeline Crash:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Database connection error." 
    }, { status: 500 });
  }
}