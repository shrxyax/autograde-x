import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/dashboard/logout-button";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-700 text-sm font-bold text-white">
            AX
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">AutoGradeX</p>
            <p className="text-xs text-slate-500">AI-assisted project evaluation</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/#features">Features</Link>
          <Link href="/#workflow">Workflow</Link>
          <Link href="/dashboard">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={`/dashboard/${user.role.toLowerCase()}`}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {user.role.toLowerCase()} dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="text-sm font-medium text-slate-600" href="/auth/login">
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
