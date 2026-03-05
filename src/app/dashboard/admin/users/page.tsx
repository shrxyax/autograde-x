"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {

  const [users, setUsers] = useState<any[]>([]);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  }

  async function deleteUser(id: string) {

    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    fetchUsers();
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Manage Users
      </h1>

      {users.map((u) => (

        <div key={u.id} className="border p-4 mb-3 rounded bg-white shadow">

          <p><b>Name:</b> {u.name}</p>
          <p><b>Email:</b> {u.email}</p>
          <p><b>Role:</b> {u.role}</p>

          <button
            onClick={() => deleteUser(u.id)}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}