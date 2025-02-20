"use client";

import { useActionState } from "react";
import { submitAlbum } from "./action";

import type { ActionResponse } from "./action";
import { CloseIcon } from "@/src/components/icons/closeIcon";
import Link from "next/link";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function Page() {
  const [state, action, isPending] = useActionState(submitAlbum, initialState);
  return (
    <div className="min-h-screen  text-white justify-center bg-black flex flex-col  items-center ">
      <div className="bg-zinc-800 rounded-2xl w-full max-w-xl p-6">
        <div className="flex justify-end">
          <Link className=" " href="/albums">
            <CloseIcon />
          </Link>
        </div>
        <div className="text-white my-2  font-light text-4xl text-center ">
          Album{" "}
        </div>
        <form action={action} className="flex flex-col space-y-4 ">
          <div className="flex flex-col space-y-1">
            <label className="text-zinc-300" htmlFor="artist">
              Artist
            </label>
            <input
              id="artist"
              name="artist"
              placeholder="Add an artist"
              defaultValue={state?.inputs?.artist}
              required
              minLength={1}
              maxLength={100}
              aria-describedby="artist-error"
              className={`${
                state?.errors?.artist ? "border-red-500" : ""
              } bg-neutral-700 text-white placeholder-neutral-400 pl-2`}
            />
            {state?.errors?.artist && (
              <p id="artist-error" className="text-sm text-red-500">
                {state.errors.artist[0]}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-zinc-300" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Add a name"
              defaultValue={state?.inputs?.name}
              required
              minLength={1}
              maxLength={100}
              aria-describedby="name-error"
              className={`${
                state?.errors?.name ? "border-red-500" : ""
              } bg-neutral-700 text-white placeholder-neutral-400 pl-2`}
            />
            {state?.errors?.name && (
              <p id="name-error" className="text-sm text-red-500">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-zinc-300" htmlFor="cover">
              Cover url
            </label>
            <input
              id="cover"
              name="cover"
              placeholder="www.example.jpg"
              minLength={1}
              maxLength={100}
              aria-describedby="cover-error"
              className={`${
                state?.errors?.cover ? "border-red-500" : ""
              } bg-neutral-700 text-white placeholder-neutral-400 pl-2`}
            />
            {state?.errors?.cover && (
              <p id="artist-error" className="text-sm text-red-500">
                {state.errors.cover[0]}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-black p-2 rounded-full cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Album"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
