import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { submit, addGenre, addArtistWithGenre } from "../../action";

import React, { useState } from "react";
import { GenreSelector } from "@/src/components/genreSelect";
import { AddArtistWithGenre } from "@/src/components/addArtistWithGenre";

export default function Page() {
  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      <form className="text-black my-3" action={submit}>
        <input
          type="text"
          placeholder="artist"
          // pattern="^[\p{Emoji}]+$"
          name="text"
          autoFocus
          // maxLength="10"
          required
        />
        <button>➕</button>
      </form>
      <div className="h-2 w-full bg-red-500"></div>
      <form className="text-black my-3" action={addGenre}>
        <input
          type="text"
          placeholder="genre(unique)"
          // pattern="^[\p{Emoji}]+$"
          name="genre"
          // maxLength="10"
          required
        />
        <button>➕</button>
      </form>

      <GenreSelector />

      <div className="h-2 w-full bg-violet-500 m-10"></div>

      <AddArtistWithGenre />

      {/* </main> */}
    </div>
  );
}
