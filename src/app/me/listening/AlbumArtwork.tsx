"use client";

import { useState } from "react";

export function AlbumArtwork({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-neutral-800">
      {src && !failed ? (
        // Load covers directly from Last.fm, without Vercel image optimization.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${name} cover`}
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-3 text-center text-sm text-zinc-500">No artwork</div>
      )}
    </div>
  );
}
