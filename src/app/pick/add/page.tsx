"use client";

import { useActionState } from "react";
import { submitArtist } from "./action";

import type { ActionResponse } from "./action";
import Notification from "@/src/components/Notification";

import React from "react";
import { buttonStyle } from "@/src/components/button";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function Page() {
  const [state, action, isPending] = useActionState(submitArtist, initialState);
  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      {state.message !== "" && <Notification message={state.message} />}

      <form
        className=" my-3 bg-neutral-900 rounded-md space-x-2 p-2 "
        action={action}
      >
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
          className={
            state?.errors?.name
              ? "border-red-500"
              : "bg-zinc-800 rounded-sm pl-0.5"
          }
        />
        <div>
          {state?.errors?.name && (
            <p id="name-error" className="text-sm text-yellow-500">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        <button type="submit" className={buttonStyle} disabled={isPending}>
          {isPending ? "Saving..." : "Add Artist"}
        </button>
      </form>
      <div className="h-2 w-full bg-red-500"></div>
    </div>
  );
}
