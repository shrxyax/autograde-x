import { adminUpdateSubmissionStatusAction } from "@/actions/users";
import { submissionStatuses } from "@/lib/domain";

export function SubmissionStatusForm({
  submissionId,
  currentStatus,
}: {
  submissionId: string;
  currentStatus: string;
}) {
  return (
    <form action={adminUpdateSubmissionStatusAction} className="flex items-center gap-2">
      <input type="hidden" name="submissionId" value={submissionId} />
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
      >
        <option value={submissionStatuses.SUBMITTED}>Submitted</option>
        <option value={submissionStatuses.AI_REVIEWED}>AI Reviewed</option>
        <option value={submissionStatuses.FLAGGED}>Flagged</option>
        <option value={submissionStatuses.FINALIZED}>Finalized</option>
      </select>
      <button
        type="submit"
        className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
      >
        Save
      </button>
    </form>
  );
}
