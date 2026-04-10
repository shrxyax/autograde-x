"use client";

import { useActionState } from "react";
import { createAssignmentAction } from "@/actions/assignments";
import { initialActionState } from "@/actions/types";
import { assignmentDifficulties } from "@/lib/constants";
import { FormMessage } from "@/components/ui/form-message";
import { InputField, TextareaField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function AssignmentForm() {
  const [state, formAction] = useActionState(createAssignmentAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Create assignment</h2>
        <p className="mt-1 text-sm text-slate-600">
          Publish a rubric-driven project brief for students.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Title" name="title" error={state.fieldErrors?.title?.[0]} required />
        <InputField label="Topic" name="topic" error={state.fieldErrors?.topic?.[0]} required />
        <InputField label="Deadline" name="deadline" type="datetime-local" error={state.fieldErrors?.deadline?.[0]} required />
        <InputField label="Max score" name="maxScore" type="number" defaultValue={100} error={state.fieldErrors?.maxScore?.[0]} required />
      </div>

      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">Difficulty</span>
        <select
          name="difficulty"
          defaultValue="Medium"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm"
        >
          {assignmentDifficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </label>

      <TextareaField
        label="Description"
        name="description"
        rows={4}
        placeholder="Describe the project scope, deliverables, and expectations."
        error={state.fieldErrors?.description?.[0]}
        required
      />

      <TextareaField
        label="Rubric"
        name="rubric"
        rows={5}
        placeholder="Example: Architecture 30%, implementation quality 30%, documentation 20%, testing 20%."
        error={state.fieldErrors?.rubric?.[0]}
        required
      />

      <FormMessage state={state} />
      <SubmitButton>Create assignment</SubmitButton>
    </form>
  );
}
