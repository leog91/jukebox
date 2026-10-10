"use client";

import { useActionState } from "react";
import { saveLastfmUsername } from "./actions";

export function UsernameForm({ username }: { username?: string }) {
  const [state, action, pending] = useActionState(saveLastfmUsername, { success: false, message: "" });
  return (
    <form action={action} className="mb-6 rounded-xl bg-neutral-900 p-4">
      <label htmlFor="lastfm-username" className="mb-2 block text-zinc-300">Last.fm username</label>
      <div className="flex flex-wrap gap-3">
        <input id="lastfm-username" name="username" defaultValue={username} required maxLength={15}
          autoComplete="off" spellCheck={false} placeholder="Your Last.fm username"
          className="min-w-0 flex-1 rounded-lg bg-neutral-700 px-3 py-2 text-white" />
        <button disabled={pending} className="rounded-full bg-white px-4 py-2 text-black hover:bg-gray-200 disabled:opacity-50">
          {pending ? "Saving…" : username ? "Update username" : "Connect Last.fm"}
        </button>
      </div>
      <p className="mt-2 text-sm text-zinc-400">Uses public listening history. No Last.fm password or authorization needed.</p>
      {state.message && <p role="status" className={`mt-2 text-sm ${state.success ? "text-green-400" : "text-red-400"}`}>{state.message}</p>}
    </form>
  );
}
