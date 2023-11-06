import React, { useState } from "react";

type Mode = "MSC" | "REC" | "RPL" | "FM" | "SYS";

export const Mp3Player = () => {
  const [mode, setMode] = useState<Mode>("MSC");

  const menuOptionShadow = (
    <div className="bg-black absolute rounded-md w-8 left-px top-px h-[50px]"></div>
  );

  return (
    <div className="flex flex-col  bg-black py-1 border-2 border-red-600 px-8  rounded-full items-center">
      <div className="p-1 font-semibold text-sm">DIGITAL MP3 PLAYER</div>
      <div className="flex  items-center ">
        <div className="p-3  font-bold">
          <div>MP3</div>
        </div>
        <div className="bg-teal-600 text-black text-center gap-2 p-2 flex ">
          <div
            className="cursor-pointer relative flex flex-col w-8 h-[50px] border-2 border-black rounded-md"
            onClick={() => setMode("MSC")}
          >
            {mode === "MSC" && menuOptionShadow}
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              🎵
            </div>
            <div className="text-xs relative bg-teal-600">MSC</div>
          </div>

          <div
            className="cursor-pointer relative flex flex-col w-8 h-[50px] border-2 border-black rounded-md "
            onClick={() => setMode("REC")}
          >
            {mode === "REC" && menuOptionShadow}
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              🎤
            </div>
            <div className="text-xs relative bg-teal-600">REC</div>
          </div>
          <div
            className="cursor-pointer relative flex flex-col w-8 h-[50px] border-2 border-black rounded-md "
            onClick={() => setMode("RPL")}
          >
            {mode === "RPL" && menuOptionShadow}
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              🗣️
            </div>
            <div className="text-xs relative bg-teal-600">RPL</div>
          </div>
          <div
            className="cursor-pointer relative flex flex-col w-8 h-[50px] border-2 border-black rounded-md "
            onClick={() => setMode("FM")}
          >
            {mode === "FM" && menuOptionShadow}
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              📻
            </div>
            <div className="text-xs relative bg-teal-600">FM</div>
          </div>
          <div
            className="cursor-pointer relative flex flex-col w-8 h-[50px] border-2 border-black rounded-md "
            onClick={() => setMode("SYS")}
          >
            {mode === "SYS" && menuOptionShadow}
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              ⚙️
            </div>
            <div className="text-xs relative bg-teal-600">SYS</div>
          </div>
        </div>
        <div className="p-3 font-bold">USB</div>
      </div>
      <div className="p-1 font-semibold text-sm">MP3/WMA/REC</div>
    </div>
  );
};
