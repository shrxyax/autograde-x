"use client";

import { useEffect, useState } from "react";

export default function StudentSubmissionsPage() {

  const [submissions, setSubmissions] = useState<any[]>([]);

  async function fetchSubmissions() {
    const res = await fetch("/api/submissions/student");
    const data = await res.json();
    setSubmissions(data);
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        My Submissions
      </h1>

      {submissions.map((s) => {

        const feedback = s.aiFeedback
          ? JSON.parse(s.aiFeedback)
          : null;

        return (

          <div key={s.id} className="border p-4 mb-4">

            <p><b>Assignment:</b> {s.assignment.title}</p>

            <p><b>AI Score:</b> {s.aiScore}</p>

            {feedback && (
              <>
                <p className="font-semibold mt-2">Strengths</p>
                <ul className="list-disc ml-5">
                  {feedback.strengths.map((st: string, i: number) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>

                <p className="font-semibold mt-2">Weaknesses</p>
                <ul className="list-disc ml-5">
                  {feedback.weaknesses.map((wk: string, i: number) => (
                    <li key={i}>{wk}</li>
                  ))}
                </ul>
              </>
            )}

            <p className="mt-2"><b>Faculty Score:</b> {s.facultyScore ?? "Pending"}</p>

            <p><b>Faculty Feedback:</b> {s.facultyFeedback ?? "-"}</p>

          </div>

        );

      })}

    </div>
  );
}