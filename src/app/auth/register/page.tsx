import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentUser } from "@/lib/auth/session";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(`/dashboard/${user.role.toLowerCase()}`);
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_480px] lg:items-center">
      <div className="space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Onboarding</p>
        <h1 className="text-5xl font-semibold tracking-tight text-slate-950">Set up a portfolio-ready evaluation workflow in minutes.</h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600">
          Each role gets its own dashboard and protected actions, with Prisma-backed persistence from the start.
        </p>
      </div>
      <AuthForm mode="register" />
    </div>
  );
}
