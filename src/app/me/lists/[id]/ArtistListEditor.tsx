"use client";

import { useActionState } from "react";
import Notification from "@/src/components/Notification";
import {
  addArtistToList,
  type ListActionState,
  removeArtistFromList,
} from "../actions";

type Artist = { id: number; name: string };

const initialState: ListActionState = { success: false, message: "" };

export function ArtistListEditor({
  listId,
  artists,
  availableArtists,
}: {
  listId: number;
  artists: Artist[];
  availableArtists: Artist[];
}) {
  const [addState, addAction, isAdding] = useActionState(
    addArtistToList,
    initialState
  );
  const [removeState, removeAction, isRemoving] = useActionState(
    removeArtistFromList,
    initialState
  );
  const feedback = removeState.message ? removeState : addState;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">Artists</h2>
      {availableArtists.length > 0 ? (
        <form action={addAction} className="mt-3 flex gap-2">
          <input type="hidden" name="listId" value={listId} />
          <select
            name="artistId"
            defaultValue=""
            required
            className="min-w-0 flex-1 rounded bg-zinc-800 px-3 py-2"
          >
            <option value="" disabled>
              Add an artist
            </option>
            {availableArtists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isAdding}
            className="rounded-full bg-green-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
          >
            {isAdding ? "Adding..." : "Add"}
          </button>
        </form>
      ) : null}

      {artists.length === 0 ? (
        <p className="mt-4 text-zinc-400">No artists in this list yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-800 rounded-lg bg-neutral-900">
          {artists.map((artist) => (
            <li key={artist.id} className="flex items-center justify-between px-4 py-3">
              <span>{artist.name}</span>
              <form action={removeAction}>
                <input type="hidden" name="listId" value={listId} />
                <input type="hidden" name="artistId" value={artist.id} />
                <button
                  type="submit"
                  disabled={isRemoving}
                  className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {feedback.message ? (
        <div className="mt-3">
          <Notification message={feedback.message} success={feedback.success} />
        </div>
      ) : null}
    </section>
  );
}
