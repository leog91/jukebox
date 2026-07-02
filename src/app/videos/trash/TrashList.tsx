"use client";

import { useTransition } from "react";
import { permanentlyDeleteVideo, restoreVideo } from "../action";

type Props = {
  videos: {
    id: number;
    youtubeId: string;
    title: string;
    createdAt: string;
    visible: number;
    deletedAt: string | null;
  }[];
};

export function TrashList({ videos }: Props) {
  const [isPending, startTransition] = useTransition();

  if (videos.length === 0) {
    return <div className="text-zinc-400">Trash is empty</div>;
  }

  return (
    <div className="w-full max-w-2xl space-y-3">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex items-center justify-between bg-neutral-900 px-4 py-3 rounded-lg"
        >
          <span>{video.title}</span>
          <div className="flex gap-2">
            <button
              className={`bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPending}
              onClick={() =>
                startTransition(() => {
                  void restoreVideo(video.id);
                })
              }
            >
              Restore
            </button>
            <button
              className={`bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPending}
              onClick={() =>
                startTransition(() => {
                  void permanentlyDeleteVideo(video.id);
                })
              }
            >
              Delete forever
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
