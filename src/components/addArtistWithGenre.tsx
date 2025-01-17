"use client";

import React, { useState } from "react";
import { addArtistWithGenre } from "../app/action";

export function AddArtistWithGenre() {
  const [genres, setGenres] = useState<number[]>([]);

  return (
    <form
      className="text-black my-3 border-orange-500 p-2 border-4 flex flex-col space-y-1"
      action={addArtistWithGenre}
    >
      <input
        type="text"
        placeholder="artist"
        name="name"
        // maxLength="10"
        required
      />
      {genres.map((g) => (
        <div key={g}>
          <input
            type="text"
            placeholder="genre(unique)"
            name="genre"
            // maxLength="10"
            required
          />
          <button
            className="bg-red-500"
            onClick={() => setGenres(genres.filter((genre) => genre !== g!))}
          >
            X
          </button>
        </div>
      ))}
      <button
        className="bg-gray-500"
        onClick={() =>
          setGenres([...genres, Math.floor(Math.random() * 10000000)])
        }
      >
        add genre
      </button>

      <button>➕</button>
    </form>
  );
}
