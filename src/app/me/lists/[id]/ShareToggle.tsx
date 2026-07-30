"use client";

import { useActionState } from "react";
import Link from "next/link";
import Notification from "@/src/components/Notification";
import { type ListActionState, updateListSharing } from "../actions";

const initialState: ListActionState = { success: false, message: "" };

export function ShareToggle({ id, isShared }: { id: number; isShared: boolean }) {
  const [state, action, isPending] = useActionState(
    updateListSharing,
    initialState
  );

  return (
    <section className="mt-8 rounded-lg bg-neutral-900 p-4">
      <h2 className="text-lg font-semibold">Sharing</h2>
      <form action={action} className="mt-3 flex flex-wrap items-center gap-3">
        <input type="hidden" name="id" value={id} />
        <label className="flex items-center gap-2">
          <input name="isShared" type="checkbox" defaultChecked={isShared} />
          Make this list public
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-black disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </form>
      {state.message ? (
        <div className="mt-3">
          <Notification message={state.message} success={state.success} />
        </div>
      ) : null}
      {isShared ? (
        <Link href={`/lists/${id}`} className="mt-3 inline-block text-green-400 hover:underline">
          Open shared link
        </Link>
      ) : null}
    </section>
  );
}
