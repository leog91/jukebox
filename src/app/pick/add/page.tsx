"use client";

import { useActionState } from "react";
import { submitArtist } from "./action";

import type { ActionResponse } from "./action";
import Notification from "@/src/components/Notification";

import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { submit, addGenre, addArtistWithGenre } from "../../action";

import React, { useState } from "react";
import { GenreSelector } from "@/src/components/genreSelect";
import { AddArtistWithGenre } from "@/src/components/addArtistWithGenre";

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
          {/* {state?.message !== "" && state.message} */}

          {state?.errors?.name && (
            <p id="name-error" className="text-sm text-yellow-500">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-red-500 text-white p-2 rounded"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Album"}
        </button>
      </form>
      <div className="h-2 w-full bg-red-500"></div>
      {/* <form className="text-black my-3" action={addGenre}>
        <input
          type="text"
          placeholder="genre(unique)"
          // pattern="^[\p{Emoji}]+$"
          name="genre"
          // maxLength="10"
          required
        />
        <button>➕</button>
      </form> */}

      {/* <GenreSelector />

      <div className="h-2 w-full bg-violet-500 m-10"></div>

      <AddArtistWithGenre />
 */}
      {/* </main> */}
    </div>
  );
}
