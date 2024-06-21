import { UserButton, auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { addGenre, getArtist, submit } from "../../../action";

import React from "react";

export default async function Page({ params }: { params: { artist: string } }) {
  const res = await getArtist(params.artist);

  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      <div className="text-red-500 text-7xl m-10">ADD genre</div>
      <form className="text-red" action={addGenre}>
        {JSON.stringify(params.artist)}

        {JSON.stringify(res)}

        <input
          className="text-black"
          type="text"
          placeholder="🫡 (only emojis allowed)"
          // pattern="^[\p{Emoji}]+$"
          name="text"
          autoFocus
          // maxLength="10"
          required
        />
        <button>➕</button>
      </form>
      {/* </main> */}
    </div>
  );
}
