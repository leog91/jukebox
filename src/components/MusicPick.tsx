import { useState } from "react";
import artistsdb from "../../db/artist.json";

const artists = artistsdb.sort((a, b) => {
  const nameA = a.artist.toUpperCase();
  const nameB = b.artist.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
});

const tagMap: Map<string, number> = new Map();

// Typescript doesn't keep track of the .set .get references, and the default signature of .get is T | undefined, SO => !
Array.from(artists.flatMap((a) => a.tag))
  .map((t) => t.toUpperCase())
  .forEach((t) => {
    if (tagMap.has(t)) {
      tagMap.set(t, tagMap.get(t)! + 1);
    } else {
      tagMap.set(t, 1);
    }
  });
const taggy = [...tagMap.keys()]
  .map((t) => {
    return { genre: t, qty: tagMap.get(t) };
  })
  .sort((a, b) => b.qty! - a.qty!);

export const MusicPick = () => {
  const [random, setRandom] = useState<{
    artist: string;
    tag: string[];
  } | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string[]>([]);

  //usememo
  const filteredList = () => {
    return artists.filter((m) =>
      currentFilter.every((f) => m.tag.map((t) => t.toUpperCase()).includes(f))
    );
  };

  const handleRandom = () => {
    const random = Math.floor(Math.random() * filteredList().length);

    const toSelect = filteredList()[random];
    // setHistory([...history, toSelect]);
    setRandom(toSelect);
  };

  const addFilter = (tag: string) => {
    currentFilter.includes(tag)
      ? setCurrentFilter(currentFilter.filter((f) => f !== tag))
      : setCurrentFilter([...currentFilter, tag]);
  };

  return (
    <div className="flex pt-4 sm:my-4  w-full max-w-2xl  flex-col bg-neutral-900 sm:rounded-2xl sm:p-4">
      <div className="flex my-2   w-full items-center justify-evenly">
        <button
          className="bg-green-500  hover:scale-105 text-black text-sm font-semibold p-2 rounded-3xl"
          onClick={() => handleRandom()}
        >
          Random
        </button>
        <div className="w-36 underline truncate underline-offset-4 decoration-pink-500">
          {random?.artist}
        </div>{" "}
        <button
          disabled={!random ? true : false}
          className={`  text-sm font-bold mx-1 px-2 py-1 uppercase   ${
            random
              ? "text-black bg-red-500"
              : "text-white bg-neutral-500 cursor-not-allowed"
          }`}
          onClick={() => setRandom(null)}
        >
          X
        </button>
      </div>
      <button
        className="bg-green-500 mx-4 font-semibold mt-2 text-black rounded-2xl"
        onClick={() => setCurrentFilter([])}
      >
        ClearFilter
      </button>
      <div className="flex flex-wrap justify-center  mt-2 ">
        {/* showing top 10 genres */}
        {taggy.slice(0, 10).map((t) => (
          <button
            className={` flex relative text-sm font-bold m-1 px-3 py-1 uppercase   ${
              currentFilter.includes(t.genre)
                ? "text-black bg-white"
                : "text-white bg-neutral-800"
            }`}
            key={t.genre}
            onClick={() => addFilter(t.genre)}
          >
            <div>{t.genre}</div>
            <div className="bg-red-500 -right-1.5 text-neutral-100 -top-1 absolute rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {t.qty}
            </div>
          </button>
        ))}
      </div>
      <div className="flex my-3 flex-col">
        {filteredList().map((a) => (
          <div
            className={`flex cursor-pointer justify-between hover:bg-neutral-800  px-2 py-0.5 rounded-md ${
              a === random ? "bg-neutral-800 border-l-2 rounded-l-none" : ""
            } `}
            key={a.artist}
            onClick={() => setRandom(a)}
          >
            <div>{a.artist}</div>
            <div className="flex text-neutral-400 font-light">
              {a.tag.map((t) => (
                <div className="underline underline-offset-2 mx-0.5" key={t}>
                  {t}{" "}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
