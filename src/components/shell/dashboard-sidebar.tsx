"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Role, roles } from "@/lib/domain";

const linksByRole: Record<Role, Array<{ href: string; label: string }>> = {
  [roles.STUDENT]: [
    { href: "/dashboard/student", label: "Overview" },
    { href: "/dashboard/student/assignments", label: "Assignments" },
    { href: "/dashboard/student/submissions", label: "Submissions" },
  ],
  [roles.FACULTY]: [
    { href: "/dashboard/faculty", label: "Overview" },
    { href: "/dashboard/faculty/assignments", label: "Assignments" },
    { href: "/dashboard/faculty/reviews", label: "Reviews" },
  ],
  [roles.ADMIN]: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/users", label: "Users" },
    { href: "/dashboard/admin/assignments", label: "Assignments" },
    { href: "/dashboard/admin/submissions", label: "Submissions" },
  ],
};

export function DashboardSidebar({
  role,
}: {
  role: string;
}) {
  const pathname = usePathname();
  const currentRole = role as Role;

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        {currentRole.toLowerCase()} workspace
      </p>
      <div className="space-y-1">
        {linksByRole[currentRole].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block rounded-2xl px-3 py-2 text-sm font-medium transition",
              pathname === link.href
                ? "bg-sky-50 text-sky-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
