"use client";

import { useActionState } from "react";
import { submitVideo } from "./action";

import type { ActionResponse } from "./action";
import { CloseIcon } from "@/src/components/icons/closeIcon";
import Link from "next/link";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export default function Page() {
  const [state, action, isPending] = useActionState(submitVideo, initialState);
  return (
    <div className="min-h-screen  text-white justify-center bg-black flex flex-col  items-center ">
      <div className="bg-zinc-800 rounded-2xl w-full max-w-xl p-6">
        <div className="flex justify-end">
          <Link className=" " href="/albums">
            <CloseIcon />
          </Link>
        </div>
        <div className="text-white my-2  font-light text-4xl text-center ">
          Video{" "}
        </div>
        <form action={action} className="flex flex-col space-y-4 ">
          <div className="flex flex-col space-y-1">
            <label className="text-zinc-300" htmlFor="youtubeId">
              YoutubeId
            </label>
            <input
              id="youtubeId"
              name="youtubeId"
              placeholder="Add a youtubeId"
              defaultValue={state?.inputs?.youtubeId}
              required
              minLength={1}
              maxLength={100}
              aria-describedby="youtubeId-error"
              className={`${
                state?.errors?.youtubeId ? "border-red-500" : ""
              } bg-neutral-700 text-white placeholder-neutral-400 pl-2`}
            />
            {state?.errors?.youtubeId && (
              <p id="artist-error" className="text-sm text-red-500">
                {state.errors.youtubeId[0]}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-zinc-300" htmlFor="title">
              title
            </label>
            <input
              id="title"
              name="title"
              placeholder="Add a title"
              defaultValue={state?.inputs?.title}
              required
              minLength={1}
              maxLength={100}
              aria-describedby="title-error"
              className={`${
                state?.errors?.title ? "border-red-500" : ""
              } bg-neutral-700 text-white placeholder-neutral-400 pl-2`}
            />
            {state?.errors?.title && (
              <p id="title-error" className="text-sm text-red-500">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-black p-2 rounded-full cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
