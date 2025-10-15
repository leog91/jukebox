"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInLink() {
  const pathname = usePathname();
  const redirectUrl = encodeURIComponent(pathname);

  return (
    <Link
      href={`/sign-in?redirect_url=${redirectUrl}`}
      className="bg-white text-black rounded-full p-3 font-semibold hover:bg-gray-300"
    >
      Log in
    </Link>
  );
}
