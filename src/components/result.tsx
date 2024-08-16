import React from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { getArtists } from "../app/action";

export async function Result({ page }: { page: string }) {
  const { userId } = auth();

  const res = await getArtists(Number(page) - 1);
  return (
    <div>
      {res.map((r) => (
        <div className="flex justify-between" key={r.id}>
          <div>{r.name} </div>
          {userId ? (
            <Link
              className="bg-green-500    max-w-sm  text-black text-sm font-semibold  m-2  p-1.5 px-2 rounded-3xl"
              href={`/pick/artist/${r.name.replaceAll(" ", "_")}`}
            >
              edit
            </Link>
          ) : (
            <div>nope</div>
          )}
        </div>

        //pick/artist/
      ))}
      <div className="flex justify-evenly">
        <Link
          className={`${
            Number(page) > 1 ? "bg-green-500" : "bg-gray-500"
          }  text-2xl   max-w-sm  text-black  font-semibold   px-2 rounded-3xl`}
          href={`/pick?page=${Number(page) - 1}`}
        >
          {"<"}
        </Link>

        <Link
          className="bg-green-500  text-2xl   max-w-sm  text-black  font-semibold  px-2 rounded-3xl"
          href={`/pick?page=${Number(page) + 1}`}
        >
          {">"}
        </Link>
      </div>
    </div>
  );
}
