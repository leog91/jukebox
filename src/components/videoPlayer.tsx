"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useRef, useState, useTransition } from "react";
import { toggleVideoVisibility } from "../app/videos/action";

type Props = {
  videos: {
    id: number;
    youtubeId: string;
    title: string;
    createdAt: string;
    visible: number;
  }[];
  isAdmin: boolean;
};

export default function VideoPlayer({ videos, isAdmin }: Props) {
  const [playerId, setPlayerId] = useState(
    videos.filter((v) => v.visible === 1)[0]?.youtubeId
  );

  const playerRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();

  const filteredVideos = isAdmin
    ? videos
    : videos.filter((v) => v.visible === 1);

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
        {filteredVideos.map((video) => {
          const isActive = playerId === video.youtubeId;

          return (
            <div key={video.youtubeId}>
              <div
                onClick={() => handleVideoClick(video.youtubeId)}
                className={`cursor-pointer px-4 py-3 transition-colors ${
                  isActive
                    ? "border-l-4 border-white bg-green-800 text-white font-semibold"
                    : "hover:bg-green-700"
                }`}
              >
                {video.title}
              </div>
              <div>
                {isAdmin ? (
                  <button
                    className={`cursor-pointer w-full py-2 font-semibold ${
                      video.visible ? "bg-red-500" : "bg-green-500"
                    } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => {
                        void toggleVideoVisibility(
                          video.id,
                          video.visible === 0
                        );
                      })
                    }
                  >
                    {isPending
                      ? "Processing..."
                      : video.visible
                      ? "Hide"
                      : "Show"}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
