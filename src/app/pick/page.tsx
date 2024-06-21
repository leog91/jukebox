// "use client";

import { auth } from "@clerk/nextjs";

import { UserButton } from "@clerk/nextjs";
import { MusicPick } from "@/src/components/MusicPick";
import React from "react";
import Link from "next/link";
import { Result } from "@/src/components/result";

async function Pick() {
  const { userId } = auth();

  return (
    <div className="min-h-screen bg-black flex flex-col   items-center ">
      <div className="bg-blue-200 h-10 w-10">
        <UserButton />
      </div>
      <Result />

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
