import { updateUserRoleAction } from "@/actions/users";
import { roles } from "@/lib/domain";

export function RoleSelectForm({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: string;
  disabled?: boolean;
}) {
  return (
    <form action={updateUserRoleAction} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        disabled={disabled}
        className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
      >
        <option value={roles.STUDENT}>Student</option>
        <option value={roles.FACULTY}>Faculty</option>
        <option value={roles.ADMIN}>Admin</option>
      </select>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-60"
      >
        Update
      </button>
    </form>
  );
}
