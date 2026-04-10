"use client";

import { useActionState } from "react";
import { submitAssignmentAction } from "@/actions/submissions";
import { initialActionState } from "@/actions/types";
import { FormMessage } from "@/components/ui/form-message";
import { SubmitButton } from "@/components/ui/submit-button";

export function SubmissionForm({ assignmentId }: { assignmentId: string }) {
  const [state, formAction] = useActionState(submitAssignmentAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="assignmentId" value={assignmentId} />

      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">Repository URL</span>
        <input
          name="repositoryUrl"
          type="url"
          placeholder="https://github.com/you/project"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm"
        />
      </label>

      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium">Project report (PDF)</span>
        <input
          name="report"
          type="file"
          accept=".pdf,application/pdf"
          className="block w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm"
        />
      </label>

      <FormMessage state={state} />
      <SubmitButton>Upload submission</SubmitButton>
    </form>
  );
}
