"use client";

import { useEffect, useState } from "react";

interface Assignment {
  id: string;
  title: string;
  description: string;
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [fileMap, setFileMap] = useState<Record<string, File | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function fetchAssignments() {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    setAssignments(data);
  }

  async function handleSubmit(assignmentId: string) {
    setError(null);
    setSuccess(null);

    const file = fileMap[assignmentId];

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);

    try {
      setLoadingId(assignmentId);

     const res = await fetch("/api/submissions", {
  method: "POST",
  body: formData,
  credentials: "include",
});

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }

      setSuccess("Uploaded successfully!");
      setFileMap((prev) => ({ ...prev, [assignmentId]: null }));

    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoadingId(null);
    }
  }

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Available Assignments</h1>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">
          {success}
        </div>
      )}

      {assignments.map((a) => (
        <div key={a.id} className="border rounded p-4 mb-6 shadow-sm grid gap-6">
          <h2 className="font-semibold text-lg">{a.title}</h2>
          <p className="mb-3 text-gray-600">{a.description}</p>

          <input
            type="file"
            accept="application/pdf"
            className="block mb-3"
            onChange={(e) =>
              setFileMap((prev) => ({
                ...prev,
                [a.id]: e.target.files?.[0] || null,
              }))
            }
          />

          <button
            onClick={() => handleSubmit(a.id)}
            disabled={loadingId === a.id}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingId === a.id ? "Uploading..." : "Submit PDF"}
          </button>
        </div>
      ))}
    </div>
  );
}