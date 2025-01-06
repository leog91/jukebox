// "use client";

import { auth } from "@clerk/nextjs/server";

import { UserButton } from "@clerk/nextjs";
import { MusicPick } from "@/src/components/MusicPick";
import React from "react";
import Link from "next/link";
import { Result } from "@/src/components/result";

async function Pick(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { userId } = await auth();

  let p = "1";
  if (searchParams.page) {
    p = searchParams.page[0];
  }

  return (
    <div className="min-h-screen bg-black flex flex-col m-auto max-w-2xl  items-center ">
      <div className="bg-black w-full flex justify-end m-2 h-12  pt-4">
        {userId ? (
          <UserButton
            appearance={{
              elements: { userButtonAvatarBox: "w-12 h-12" },
            }}
          />
        ) : (
          <div>
            <Link
              href="/sign-in"
              className="bg-white text-black rounded-full  p-3 font-semibold hover:bg-gray-300"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
      <Result page={p} />

      {userId ? (
        <div className="flex w-full  justify-end max-w-2xl">
          <Link
            className="bg-green-500    max-w-sm  text-black text-sm font-semibold  m-2  p-1.5 px-2 rounded-3xl"
            href="/pick/add"
          >
            add artist
          </Link>
        </div>
      ) : null}

      <MusicPick />
    </div>
  );
}

export default Pick;
