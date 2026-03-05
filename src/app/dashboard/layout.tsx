"use client";

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}

      <div className="w-64 bg-gray-900 text-white p-6">

        <h2 className="text-xl font-bold mb-6">
          AutoGradeX
        </h2>

        <nav className="flex flex-col gap-4">

          <Link href="/dashboard">
            Dashboard Home
          </Link>

          <Link href="/dashboard/student/assignments">
            Student Assignments
          </Link>

          <Link href="/dashboard/student/submissions">
            My Submissions
          </Link>

          <Link href="/dashboard/faculty/assignments">
            Create Assignment
          </Link>

          <Link href="/dashboard/faculty/submissions">
            Grade Submissions
          </Link>

          <Link href="/dashboard/admin">
            Admin Dashboard
          </Link>

          <Link href="/dashboard/admin/users">
            Admin Panel
          </Link>

          <Link href="/login">Logout</Link>

        </nav>

      </div>

      {/* Page Content */}

      <div className="flex-1 p-8 bg-gray-50">
        {children}
      </div>

    </div>
  );
}