"use client";

import { useEffect, useState } from "react";

export default function FacultySubmissionsPage() {

  const [submissions, setSubmissions] = useState<any[]>([]);

  async function fetchSubmissions() {
    const res = await fetch("/api/submissions");
    const data = await res.json();
    setSubmissions(data);
  }

  async function grade(submissionId: string) {

    const score = prompt("Enter score");
    const feedback = prompt("Enter feedback");

    if (!score) return;

    await fetch("/api/submissions/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        submissionId,
        score: Number(score),
        feedback
      })
    });

    fetchSubmissions();
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Student Submissions
      </h1>

      {submissions.map((s) => {

        const feedback = s.aiFeedback
          ? JSON.parse(s.aiFeedback)
          : null;

        return (

          <div key={s.id} className="border p-4 mb-6 rounded bg-white shadow-sm">

            <p><b>Student:</b> {s.user.name}</p>
            <p><b>Assignment:</b> {s.assignment.title}</p>

            <p className="mt-2"><b>AI Score:</b> {s.aiScore}</p>
            <p><b>AI Probability:</b> {s.aiProbability}%</p>

            {feedback && (
              <>
                <p className="mt-3 font-semibold">AI Strengths</p>
                <ul className="list-disc ml-5">
                  {feedback.strengths.map((st: string, i: number) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>

                <p className="mt-3 font-semibold">AI Weaknesses</p>
                <ul className="list-disc ml-5">
                  {feedback.weaknesses.map((wk: string, i: number) => (
                    <li key={i}>{wk}</li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-3"><b>Faculty Score:</b> {s.facultyScore ?? "Not graded yet"}</p>
            <p><b>Faculty Feedback:</b> {s.facultyFeedback ?? "-"}</p>

            <div className="mt-4">

              <a
                href={s.fileUrl}
                target="_blank"
                className="text-blue-600 underline mr-4"
              >
                View PDF
              </a>

              <button
                onClick={() => grade(s.id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Grade / Update
              </button>

            </div>

          </div>

        );

      })}

    </div>
  );
}