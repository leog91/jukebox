"use client";

import { useActionState } from "react";
import { submitArtist } from "./action";

import type { ActionResponse } from "./action";
import Notification from "@/src/components/Notification";

import React from "react";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function Page() {
  const [state, action, isPending] = useActionState(submitArtist, initialState);
  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      {state.message !== "" && <Notification message={state.message} />}

      <form className="text-pink-500 my-3 bg-stone-400" action={action}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          autoFocus
          placeholder="Metallica"
          defaultValue={state?.inputs?.name}
          required
          minLength={1}
          maxLength={40}
          aria-describedby="name-error"
          className={state?.errors?.name ? "border-red-500" : ""}
        />
        <div>
          {state?.errors?.name && (
            <p id="name-error" className="text-sm text-yellow-500">
              {state.errors.name[0]}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-red-500 text-white p-2 rounded-sm"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Add Artist"}
        </button>
      </form>
      <div className="h-2 w-full bg-red-500"></div>
    </div>
  );
}
