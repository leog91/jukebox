"use client";

import { YouTubeEmbed } from "@next/third-parties/google";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  type ActionResponse,
  softDeleteVideo,
  toggleVideoVisibility,
} from "../app/videos/action";

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
  const [feedback, setFeedback] = useState<ActionResponse | null>(null);

  const playerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const filteredVideos = isAdmin
    ? videos
    : videos.filter((v) => v.visible === 1);

  const handleVideoClick = (id: string) => {
    setPlayerId(id);
    playerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const runVideoAction = (action: () => Promise<ActionResponse>) => {
    startTransition(async () => {
      const response = await action();
      setFeedback(response);

      if (response.success) router.refresh();
    });
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
              {isAdmin ? (
                <div className="flex gap-1">
                  <button
                    className={`cursor-pointer flex-1 py-2 font-semibold ${
                      video.visible ? "bg-red-500" : "bg-green-500"
                    } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isPending}
                    onClick={() =>
                        runVideoAction(() =>
                          toggleVideoVisibility(
                            video.id,
                            video.visible === 0
                          )
                        )
                    }
                  >
                    {isPending
                      ? "Processing..."
                      : video.visible
                      ? "Hide"
                      : "Show"}
                  </button>
                  <button
                    className={`cursor-pointer flex-1 py-2 font-semibold bg-zinc-600 hover:bg-zinc-500 text-white ${
                      isPending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isPending}
                    onClick={() =>
                        runVideoAction(() => softDeleteVideo(video.id))
                    }
                  >
                    {isPending ? "Processing..." : "Trash"}
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {feedback ? (
        <p
          aria-live="polite"
          className={`mt-3 text-sm ${
            feedback.success ? "text-green-400" : "text-red-400"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
