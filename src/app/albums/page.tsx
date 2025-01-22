import React from "react";

import { currentUser } from "@clerk/nextjs/server";
//remove ?
import Link from "next/link";

import { getAlbums } from "./action";

async function Page() {
  const albums = await getAlbums();
  const user = await currentUser();
  const isAdmin =
    process.env.ADMIN_EMAIL === user?.emailAddresses[0].emailAddress;

  return (
    <div className="min-h-screen bg-black flex flex-col   w-full  items-center  ">
      {isAdmin ? (
        <div className="flex w-full  justify-end max-w-2xl">
          <Link
            className="bg-green-500    max-w-sm  text-black text-sm font-semibold  m-2  p-1.5 px-2 rounded-3xl"
            href="/albums/add"
          >
            add album
          </Link>
        </div>
      ) : null}
      <div className=" bg-black flex  flex-wrap p-4      ">
        {albums.map((album) => (
          <a
            href={`https://open.spotify.com/search/${
              album.artist + " " + album.name
            }`}
            target="_blank"
          >
            <div className="hover:bg-zinc-700 p-3 rounded-lg">
              <img
                className="w-36 md:w-48 rounded-lg"
                src={album.coverUrl ?? undefined}
                alt={album.name}
              />
              <div className="font-medium text-lg overflow-clip md:w-48 w-36">
                {album.name}
              </div>
              <div className=" font-medium text-gray-300">{album.artist}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Page;
