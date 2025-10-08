import { UserButton } from "@clerk/nextjs";
import { HomeIcon } from "./icons/homeIcon";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export async function Header() {
  const { userId } = await auth();

  return (
    <div className="flex py-5 items-center  mx-auto justify-around  max-w-2xl  ">
      <div>
        <Link href="/">
          <HomeIcon />
        </Link>
      </div>

      <div>
        <Link
          className="bg-white text-black rounded-full  p-3 font-semibold hover:bg-gray-300"
          href="/videos"
        >
          Videos
        </Link>
      </div>

      <div>
        <Link
          className="bg-white text-black rounded-full  p-3 font-semibold hover:bg-gray-300"
          href="/albums"
        >
          Albums
        </Link>
      </div>

      <div>
        <Link
          className="bg-white text-black rounded-full  p-3 font-semibold hover:bg-gray-300"
          href="/pick"
        >
          Pick
        </Link>
      </div>

      <div className="flex items-center  justify-center">
        {userId ? (
          <UserButton
            appearance={{
              elements: { userButtonAvatarBox: "w-12 h-12" },
            }}
          />
        ) : (
          <div>
            <Link
              href="/sign-in"
              className="bg-white text-black rounded-full  p-3 font-semibold hover:bg-gray-300"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
