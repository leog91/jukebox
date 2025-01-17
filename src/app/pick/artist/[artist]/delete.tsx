"use client";

import { deleteArtist } from "./action";

import { Artist } from "./action";

//add Feedback

export function Delete({ artist }: { artist: Artist }) {
  return (
    <div>
      <button
        className="bg-red-500 text-white p-2 rounded"
        onClick={() => deleteArtist(artist)}
      >
        Delete
      </button>
    </div>
  );
}
