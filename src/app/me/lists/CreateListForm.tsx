"use client";

import { useActionState } from "react";
import Notification from "@/src/components/Notification";
import { createList, type ListActionState } from "./actions";

const initialState: ListActionState = { success: false, message: "" };

export function CreateListForm() {
  const [state, action, isPending] = useActionState(createList, initialState);

  return (
    <form action={action} className="mb-6 flex flex-col gap-2">
      {state.message ? (
        <Notification message={state.message} success={state.success} />
      ) : null}
      <label htmlFor="name" className="text-sm text-zinc-300">
        New list name
      </label>
      <div className="flex gap-2">
        <input
          id="name"
          name="name"
          required
          maxLength={80}
          className="min-w-0 flex-1 rounded bg-zinc-800 px-3 py-2"
          placeholder="Weekend discoveries"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-green-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
