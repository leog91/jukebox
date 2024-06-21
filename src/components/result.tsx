import React from "react";
import { getArtists } from "../app/action";

export async function Result() {
  const res = await getArtists();
  return (
    <div>
      result
      {res.map((r) => (
        <div key={r.id}>{r.name}</div>
      ))}
    </div>
  );
}
