import { musicList } from "@/db/songList";
import React from "react";

export default function PlayList() {
  return (
    <div className=" w-full xl:max-w-6xl bg-neutral-800 ">
      <h2 className="text-2xl my-3 ">PlayList</h2>
      {musicList.map((s, i) => (
        //}
        <div key={s.src} className={` items-center flex py-2`}>
          <div
            className={`h-9 mr-1 w-1 ${i % 5 === 1 ? "bg-white" : ""} `}
          ></div>
          <div className="flex  items-center rounded-md  cursor-pointer hover:bg-neutral-500  ">
            {/* <div className="mr-2 rounded-full  bg-neutral-200 w-4 h-4 animate-[ping_2s_ease-in-out_infinite]"></div> */}
            <picture>
              <img
                loading="lazy"
                className="w-14"
                alt={s.title}
                src={`https://i.ytimg.com/vi_webp/${s.src}/default.webp`}
              />
            </picture>
            <div className="ml-4"> {s.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const asd = `asdsdd`;
