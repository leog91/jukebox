"use client";

import { useState, ReactNode, useRef } from "react";

import { createPortal } from "react-dom";

import { Inter } from "next/font/google";

import { Tags } from "@/db/db";

import { Media, Tag, musicList } from "@/db/songList";

import { radioList, Radio } from "@/db/radio";
import Link from "next/link";

//check Imports

const inter = Inter({ subsets: ["latin"] });

// CHECK @ts-ignore

//video/audio MODE

//album, to set/long

// "https://www.youtube-nocookie.com/embed/"
// "https://www.youtube.com/embed/

const Radio = () => {
  const [tuned, setTuned] = useState<Radio | null>(null);

  return (
    <>
      {/* channge, to singleton, only 1 player */}
      {radioList.map((r) => (
        <div
          className="my-1 flex w-full cursor-pointer justify-between bg-slate-600  px-2"
          onClick={() => {
            setTuned(null);
            setTimeout(() => {
              console.log("interval -> audio element");
              //"hack"
              setTuned(r);
            }, 100);
          }}
          key={r.name}
        >
          {" "}
          {r.name}
        </div>
      ))}
      {/* <div>player</div> */}
      {tuned && (
        <div className=" flex w-full flex-col items-center ">
          <CustomIframe title="A custom made iframe">
            <p
              style={{
                fontWeight: "900",
                fontFamily: "sans-serif",
                color: "rgb(203 213 225",
              }}
              className="  text-white "
            >
              {tuned.name}
            </p>
            <audio style={{ width: "100%" }} controls autoPlay>
              {tuned.src.map((url, i) => (
                <source key={url + i} src={url} type="audio/mpeg" />
              ))}
            </audio>
          </CustomIframe>
          <button
            className="-mt-5  w-24 border-2 border-slate-400 bg-slate-800 p-2 text-slate-300 hover:border-slate-200 hover:text-slate-100"
            onClick={() => setTuned(null)}
          >
            Clear{" "}
          </button>
        </div>
      )}
    </>
  );
};

// const playListType: Tag[] = () => Object.entries(T).map((e) => e[0]) as const;

// @ts-ignore
const CustomIframe = ({ children, ...props }) => {
  const [contentRef, setContentRef] = useState(null);

  // @ts-ignore
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <iframe
      scrolling="no"
      className=" -mr-2 w-full"
      {...props}
      // @ts-ignore
      ref={setContentRef}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};

const Youtube = () => {
  const [selected, setSelected] = useState<Media | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Tag[]>([]);
  // const [history, setHistory] = useState([]);

  const playerRef = useRef<null | HTMLDivElement>(null);

  const handleRandom = () => {
    const random = Math.floor(Math.random() * musicList.length);

    // const random = Math.floor(Math.random() * filteredList().length);
    //random with filter

    const toSelect = filteredList()[random];
    // setHistory([...history, toSelect]);
    setSelected(toSelect);

    playerRef.current?.scrollIntoView();
  };

  const addFilter = (tag: Tag) => {
    currentFilter.includes(tag)
      ? setCurrentFilter(currentFilter.filter((f) => f !== tag))
      : setCurrentFilter([...currentFilter, tag]);
  };

  //usememo
  const filteredList = () => {
    return musicList.filter((m) =>
      currentFilter.every((f) => m.tags.includes(f))
    );
  };

  // checkDuplicate
  return (
    <>
      <div className=" m-2 space-x-2">
        {/* <button
          disabled={history.length === 0}
          className="border-2 border-slate-400 bg-slate-800 p-2 text-slate-300 hover:border-slate-200 hover:text-slate-100 disabled:border-slate-400 disabled:bg-slate-500  disabled:text-slate-300"
          onClick={() => handlePrevious()}
        >
          ⏮<span className="hidden sm:inline-block">Previous</span>
        </button> */}
        <button
          className="border-2 border-slate-400 bg-slate-800 p-2 text-slate-300 hover:border-slate-200 hover:text-slate-100"
          onClick={() => handleRandom()}
        >
          🔀<span className="hidden sm:inline-block">Random</span>
        </button>
        {/* <button
          disabled={history.length === 0}
          className="border-2 border-slate-400 bg-slate-800 p-2 text-slate-300 hover:border-slate-200 hover:text-slate-100 disabled:border-slate-400 disabled:bg-slate-500  disabled:text-slate-300"
          onClick={() => handleNext()}
        >
          ⏭<span className="hidden sm:inline-block">Next</span>
        </button> */}

        {/* <button
          className="border-2 border-slate-400 bg-slate-800 p-2 text-slate-300 hover:border-slate-200 hover:text-slate-100"
          onClick={() => console.log("todo")}
        >
          Autoplay
        </button> */}
        <button
          onClick={() => setSelected(null)}
          className={` border-2  border-slate-400 p-2  ${
            selected
              ? " bg-slate-800 hover:border-slate-200 hover:text-slate-100"
              : " bg-slate-500 text-slate-300"
          }`}
          disabled={!selected}
        >
          Clear
        </button>
      </div>

      <div className="flex flex-wrap justify-center">
        {Tags.map((tag) => {
          return (
            <button
              key={tag}
              onClick={() => addFilter(tag)}
              className={`m-1  rounded-sm bg-slate-300 px-1 text-sm font-semibold text-black hover:cursor-pointer ${
                currentFilter.includes(tag)
                  ? "border-2 border-green-700 text-green-700"
                  : "border-2 border-slate-800"
              }`}
            >
              {tag}
            </button>
          );
        })}
        <button
          onClick={() => setCurrentFilter([])}
          className="m-1 rounded-sm border-2 border-slate-800 bg-slate-300 px-1 text-sm font-extrabold text-red-700 hover:cursor-pointer"
        >
          X
        </button>
      </div>

      <div className="my-4 w-full ">
        {filteredList().map((m) => (
          <div
            onClick={() => {
              setSelected(m);
              playerRef.current?.scrollIntoView();
            }}
            className={`my-1 flex cursor-pointer   justify-between   hover:bg-gray-800   hover:text-white ${
              selected && m.src === selected.src
                ? "border-l-4 border-white bg-gray-800 text-white"
                : "bg-gray-900 text-gray-300"
            } `}
            key={m.src}
          >
            {" "}
            <div className="px-2  "> {m.title} </div>{" "}
            {/* <div>
              {" "}
              {m.tags.map((t) => (
                <div className="ml-3" key={t}>
                  {t}
                </div>
              ))}{" "}
            </div>{" "} */}
          </div>
        ))}
      </div>
      <div ref={playerRef} className=" mb-4 w-full  ">
        {selected && (
          <iframe
            className=" h-56 w-full sm:h-80"
            // src={`https://www.youtube.com/embed/${selected.src}`}
            src={`https://www.youtube-nocookie.com/embed/${selected.src}`}
            allowFullScreen
            frameBorder="0"
          ></iframe>
        )}
      </div>
    </>
  );
};

export default function Jukebox() {
  const [youtube, setYoutube] = useState(true);
  const [radio, setRadio] = useState(true);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between  ${inter.className}`}
    >
      <div className="h-screen  py-1   bg-slate-700">
        <div className="flex relative flex-col items-center bg-slate-700 text-white">
          <p className="mb-2 w-full border-b-4 border-b-slate-400  text-center text-3xl  font-black">
            JUKEBOX
          </p>

          <Link
            className="bg-green-500  absolute  left-0 text-black text-sm font-semibold  ml-2 p-1.5 px-2 rounded-3xl"
            href="/pick"
          >
            Pick
          </Link>

          <div className=" relative  mb-10 flex w-full max-w-2xl flex-col items-center ">
            <div className="mb-4 flex w-full justify-evenly text-center">
              <button
                onClick={() => setRadio(!radio)}
                className={`w-1/2  ${
                  radio
                    ? "bg-slate-400 shadow-md shadow-slate-900"
                    : "bg-slate-300"
                } py-1 px-6 font-bold text-black`}
              >
                Radio
              </button>
              <div className="w-1 bg-black"></div>

              <button
                onClick={() => setYoutube(!youtube)}
                className={`w-1/2  ${
                  youtube
                    ? "bg-slate-400 shadow-md shadow-slate-900"
                    : "bg-slate-300"
                } py-1 px-6 font-bold text-black`}
              >
                Youtube
              </button>
            </div>

            {radio && <Radio />}

            {youtube && radio && (
              <div
                className=" mt-4 w-full  
              border-t-4 border-t-slate-400  py-2 text-center text-xl  font-bold text-slate-300
            "
              >
                YOUTUBE
              </div>
            )}

            {youtube && <Youtube />}

            {/* <div>contact form</div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
