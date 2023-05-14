import { Mp3Player } from "@/components/Mp3Player";
import React from "react";

export default function Mocks() {
  return (
    <div className="flex overflow-hidden pt-4 flex-col min-h-screen bg-stone-600 items-center ">
      <h2 className="text-black font-black">DIGITAL MP3 PLAYER</h2>
      <Mp3Player />
    </div>
  );
}
