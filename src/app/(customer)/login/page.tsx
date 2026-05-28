// Inside your inner LoginForm component file:
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// ... inside the LoginForm logic block:
const searchParams = useSearchParams();
const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';

const handleSecureLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const result = await signIn("credentials", {
    email: "admin@novamarket.com", // Bind these parameters to form input field hook strings
    password: "secure_password_string",
    redirect: true,
    callbackUrl: callbackUrl,
  });
};