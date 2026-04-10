import { adminUpdateAssignmentStatusAction } from "@/actions/users";
import { assignmentStatuses } from "@/lib/domain";

export function AssignmentStatusForm({
  assignmentId,
  currentStatus,
}: {
  assignmentId: string;
  currentStatus: string;
}) {
  return (
    <form action={adminUpdateAssignmentStatusAction} className="flex items-center gap-2">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
      >
        <option value={assignmentStatuses.DRAFT}>Draft</option>
        <option value={assignmentStatuses.PUBLISHED}>Published</option>
        <option value={assignmentStatuses.CLOSED}>Closed</option>
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
