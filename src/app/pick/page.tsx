import React from "react";
import Link from "next/link";
import { Result } from "@/src/components/result";
import { PlusIcon } from "@/src/components/icons/plusIcon";
import { isAdmin } from "@/src/lib/auth";

async function Pick(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const hasAdminAccess = await isAdmin();

  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const pageNumber = Number(pageParam);
  const p =
    Number.isInteger(pageNumber) && pageNumber > 0 ? String(pageNumber) : "1";

  return (
    <div className="min-h-screen bg-black flex flex-col m-auto max-w-2xl  items-center ">
      {hasAdminAccess ? (
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
