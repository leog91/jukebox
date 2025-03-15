"use client";

import { buttonStyle } from "@/src/components/button";
import { deleteArtist } from "./action";

import { Artist } from "./action";

//add Feedback

export function Delete({ artist }: { artist: Artist }) {
  return (
    <div>
      <button className={buttonStyle} onClick={() => deleteArtist(artist)}>
        Delete
      </button>
    </div>
  );
}
