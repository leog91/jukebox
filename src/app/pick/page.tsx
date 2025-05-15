import React from "react";
import Link from "next/link";
import { Result } from "@/src/components/result";
import { currentUser } from "@clerk/nextjs/server";
import { PlusIcon } from "@/src/components/icons/plusIcon";

async function Pick(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const user = await currentUser();
  const isAdmin =
    process.env.ADMIN_EMAIL === user?.emailAddresses[0].emailAddress;

  let p = "1";
  if (searchParams.page) {
    p = searchParams.page[0];
  }

  return (
    <div className="min-h-screen bg-black flex flex-col m-auto max-w-2xl  items-center ">
      {isAdmin ? (
        <div className="flex w-full  justify-end max-w-2xl">
          <Link
            className="bg-green-500 flex space-x-0.5 justify-center items-center   max-w-sm  text-black text-sm font-semibold  m-2  p-1.5 px-2 rounded-3xl"
            href="/pick/add"
          >
            <PlusIcon />
            <p>artist</p>
          </Link>
        </div>
      ) : null}
      <Result page={p} />

      {/* <MusicPick /> */}
    </div>
  );
}

export default Pick;
