import React from "react";
import { getGenres } from "../app/action";

export async function GenreSelector() {
  const res = await getGenres();
  return (
    <div className="bg-green-500 text-black">
      <select name="genres">
        {res.map((r) => (
          <option key={r.id}>{r.name}</option>
        ))}
      </select>
    </div>
  );
}
