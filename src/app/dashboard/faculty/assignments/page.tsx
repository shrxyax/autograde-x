"use client";

import { useEffect, useState } from "react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function FacultyAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [rubric, setRubric] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  

  async function fetchAssignments() {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    setAssignments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  title,
  description,
  topic,
  difficulty,
  rubric,
  maxScore
}),
    });

    setTitle("");
    setDescription("");
    fetchAssignments();
  }

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create Assignment</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
        className="border p-2 w-full"
  placeholder="Topic"
  value={topic}
  onChange={(e) => setTopic(e.target.value)}
/>

<select
  className="border p-2 w-full"
  value={difficulty}
  onChange={(e) => setDifficulty(e.target.value)}
>
  <option>Easy</option>
  <option>Medium</option>
  <option>Hard</option>
</select>

<textarea
  className="border p-2 w-full"
  placeholder="Rubric (e.g. Architecture 30, Testing 20)"
  value={rubric}
  onChange={(e) => setRubric(e.target.value)}
/>

<input
  className="border p-2 w-full"
  placeholder="Max Score"
  type="number"
  value={maxScore}
  onChange={(e) => setMaxScore(Number(e.target.value))}
/>



        <button className="bg-blue-500 text-white px-4 py-2">
          Create
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Assignments</h2>

      <ul className="space-y-3">
        {assignments.map((a) => (
          <li key={a.id} className="border p-4">
            <h3 className="font-semibold">{a.title}</h3>
            <p>{a.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}