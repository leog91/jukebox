import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { addGenre, getArtist, submit } from "../../../action";

import React from "react";

export default async function Page({ params }: { params: { artist: string } }) {
  const artist = (await getArtist(params.artist.replaceAll("_", " ")))[0];

  console.log(params.artist.replaceAll("%20", " "));

  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      <div className="text-red-500 text-7xl m-10">Edit </div>

      {!artist ? (
        <div>
          <div className="text-pink-500 text-lg font-semibold">
            {params.artist}
          </div>{" "}
          not found
        </div>
      ) : (
        <div>
          <div>
            <div>{artist.name}</div>
            <div> {artist.createdAt}</div>
            <div>genres . . .</div>
          </div>
        </div>
      )}
    </div>
  );
}
