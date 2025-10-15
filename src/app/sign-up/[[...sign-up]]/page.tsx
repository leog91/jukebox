"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") ?? "/";

  return (
    <div className="min-h-screen justify-center bg-black flex flex-col m-auto max-w-2xl  items-center ">
      <SignUp forceRedirectUrl={redirectUrl} />
    </div>
  );
}
