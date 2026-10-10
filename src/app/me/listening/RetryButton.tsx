"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RetryButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <button disabled={pending} onClick={() => startTransition(() => router.refresh())}
    className="mt-2 underline disabled:opacity-50">{pending ? "Retrying…" : "Try again"}</button>;
}
