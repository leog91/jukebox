"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  type ActionResponse,
  permanentlyDeleteVideo,
  restoreVideo,
} from "../action";

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
  const [feedback, setFeedback] = useState<ActionResponse | null>(null);
  const router = useRouter();

  const runVideoAction = (action: () => Promise<ActionResponse>) => {
    startTransition(async () => {
      const response = await action();
      setFeedback(response);

      if (response.success) router.refresh();
    });
  };

  if (videos.length === 0) {
    return (
      <div>
        <div className="text-zinc-400">Trash is empty</div>
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
              onClick={() => runVideoAction(() => restoreVideo(video.id))}
            >
              Restore
            </button>
            <button
              className={`bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isPending}
              onClick={() =>
                runVideoAction(() => permanentlyDeleteVideo(video.id))
              }
            >
              Delete forever
            </button>
          </div>
        </div>
      ))}
      {feedback ? (
        <p
          aria-live="polite"
          className={`text-sm ${
            feedback.success ? "text-green-400" : "text-red-400"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
