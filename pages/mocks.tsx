import { Mp3Player } from "@/components/Mp3Player";
import PlayList from "@/components/PlayList";
import React from "react";

export default function Mocks() {
  return (
    <div className="flex overflow-hidden pt-4 flex-col min-h-screen bg-stone-600 items-center ">
      <div className="my-4">
        <h2 className="text-black text-center mb-2 font-black">
          DIGITAL MP3 PLAYER
        </h2>
        <Mp3Player />
      </div>
      <div className="h-6 w-full bg-stone-400"></div>
      <PlayList />
    </div>
  );
}
