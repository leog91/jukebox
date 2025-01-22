"use client";

import { useActionState } from "react";
import { submitAlbum } from "./action";

import type { ActionResponse } from "./action";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function Page() {
  const [state, action, isPending] = useActionState(submitAlbum, initialState);
  return (
    <div className="min-h-screen text-pink-500 justify-center bg-black flex flex-col  items-center ">
      <div className="text-red-500 text-7xl m-10">Add </div>
      <form action={action} className="flex flex-col space-y-4 ">
        <label htmlFor="artist">Artist</label>
        <input
          id="artist"
          name="artist"
          placeholder="Metallica"
          defaultValue={state?.inputs?.artist}
          required
          minLength={1}
          maxLength={100}
          aria-describedby="artist-error"
          className={state?.errors?.artist ? "border-red-500" : ""}
        />
        {state?.errors?.artist && (
          <p id="artist-error" className="text-sm text-red-500">
            {state.errors.artist[0]}
          </p>
        )}

        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          placeholder="Master of Puppets"
          defaultValue={state?.inputs?.name}
          required
          minLength={1}
          maxLength={100}
          aria-describedby="name-error"
          className={state?.errors?.name ? "border-red-500" : ""}
        />
        {state?.errors?.name && (
          <p id="name-error" className="text-sm text-red-500">
            {state.errors.name[0]}
          </p>
        )}

        <label htmlFor="cover">Cover url</label>
        <input
          id="cover"
          name="cover"
          placeholder="www.example.jpg"
          minLength={1}
          maxLength={100}
          aria-describedby="cover-error"
          className={state?.errors?.cover ? "border-red-500" : ""}
        />
        {state?.errors?.cover && (
          <p id="artist-error" className="text-sm text-red-500">
            {state.errors.cover[0]}
          </p>
        )}

        <button
          type="submit"
          className="bg-red-500 text-white p-2 rounded"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Album"}
        </button>
      </form>
    </div>
  );
}
