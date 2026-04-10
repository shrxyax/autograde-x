import { deleteUserAction } from "@/actions/users";

export function DeleteUserButton({ userId }: { userId: string }) {
  return (
    <form action={deleteUserAction}>
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
