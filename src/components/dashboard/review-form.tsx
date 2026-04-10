"use client";

import { useActionState } from "react";
import { reviewSubmissionAction } from "@/actions/submissions";
import { initialActionState } from "@/actions/types";
import { FormMessage } from "@/components/ui/form-message";
import { InputField, TextareaField } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function ReviewForm({
  submissionId,
  suggestedScore,
}: {
  submissionId: string;
  suggestedScore: number;
}) {
  const [state, formAction] = useActionState(reviewSubmissionAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name="submissionId" value={submissionId} />
      <InputField
        label="Final score"
        name="finalScore"
        type="number"
        defaultValue={suggestedScore}
        error={state.fieldErrors?.finalScore?.[0]}
        required
      />
      <TextareaField
        label="Faculty feedback"
        name="finalFeedback"
        rows={4}
        error={state.fieldErrors?.finalFeedback?.[0]}
        required
      />
      <FormMessage state={state} />
      <SubmitButton>Finalize review</SubmitButton>
    </form>
  );
}
