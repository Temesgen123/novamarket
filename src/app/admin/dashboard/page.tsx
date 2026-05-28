// src/app/admin/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  // Bulletproof fallback verification rule
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome back, {session.user?.name}</h1>
      <p>Secure Identity Account: {session.user?.email}</p>
    </div>
  );
}