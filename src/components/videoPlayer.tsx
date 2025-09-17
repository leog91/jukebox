"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useRef, useState } from "react";

type Props = {
  videos: { youtubeId: string; title: string }[];
};

export default function VideoPlayer({ videos }: Props) {
  const [playerId, setPlayerId] = useState(videos[0]?.youtubeId);
  const playerRef = useRef<HTMLDivElement>(null);

  const handleVideoClick = (id: string) => {
    setPlayerId(id);
    playerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex  flex-col">
      <div
        ref={playerRef}
        className="rounded-lg overflow-hidden  py-6 shadow-lg"
      >
        <YouTubeEmbed videoid={playerId} />
      </div>

      <div className="flex flex-col bg-neutral-900 mt-6  rounded-lg divide-y divide-gray-00 shadow-inner">
        {videos.map((video) => {
          const isActive = playerId === video.youtubeId;

          return (
            <div
              key={video.youtubeId}
              onClick={() => handleVideoClick(video.youtubeId)}
              className={`cursor-pointer px-4 py-3 transition-colors ${
                isActive
                  ? "border-l-4 border-white bg-green-800 text-white font-semibold"
                  : "hover:bg-green-700"
              }`}
            >
              {video.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
