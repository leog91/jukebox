import React from "react";

export const Mp3Player = () => {
  const menuOptionShadow = (
    <div className="bg-black absolute rounded-md w-7 left-px top-px h-[50px]"></div>
  );

  return (
    <div className="flex flex-col  bg-black py-1 border-2 border-red-600 px-8  rounded-full items-center">
      <div className="p-1 font-semibold text-sm">DIGITAL MP3 PLAYER</div>
      <div className="flex  items-center ">
        <div className="p-3  font-bold">
          <div>MP3</div>
        </div>
        <div className="bg-teal-600 text-black text-center gap-2 p-2 flex ">
          <div className="relative flex flex-col w-7 h-[50px] border-2 border-black rounded-md">
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              🎵
            </div>
            <div className="text-xs relative bg-teal-600">MSC</div>
          </div>

          <div className="relative flex flex-col w-7 h-[50px] border-2 border-black rounded-md ">
            {menuOptionShadow}
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              🎤
            </div>
            <div className="text-xs relative bg-teal-600">REC</div>
          </div>
          <div className="relative flex flex-col w-7 h-[50px] border-2 border-black rounded-md ">
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              🗣️
            </div>
            <div className="text-xs relative bg-teal-600">RPL</div>
          </div>
          <div className="relative flex flex-col w-7 h-[50px] border-2 border-black rounded-md ">
            <div className="border-b-2 relative bg-teal-600 text-lg bg border-black">
              📻
            </div>
            <div className="text-xs relative bg-teal-600">FM</div>
          </div>
          <div className="relative flex flex-col w-7 h-[50px] border-2 border-black rounded-md ">
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
