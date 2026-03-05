"use client";

import Link from "next/link";

export default function AdminDashboard() {

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <Link href="/dashboard/admin/users">
          <div className="border p-6 rounded bg-white shadow cursor-pointer">
            <h2 className="font-semibold text-lg">
              Manage Users
            </h2>
            <p>View and manage all platform users</p>
          </div>
        </Link>

        <Link href="/dashboard/admin/assignments">
          <div className="border p-6 rounded bg-white shadow cursor-pointer">
            <h2 className="font-semibold text-lg">
              All Assignments
            </h2>
            <p>View assignments across the system</p>
          </div>
        </Link>

        <Link href="/dashboard/admin/submissions">
          <div className="border p-6 rounded bg-white shadow cursor-pointer">
            <h2 className="font-semibold text-lg">
              All Submissions
            </h2>
            <p>Monitor student submissions</p>
          </div>
        </Link>

      </div>

    </div>
  );
}