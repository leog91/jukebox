import { PlusIcon } from "@/src/components/icons/plusIcon";
import { SearchIcon } from "@/src/components/icons/searchIcon";
import { SpotIcon } from "@/src/components/icons/spotIcon";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      <div className="flex space-x-1  ">
        <SearchIcon />
        <input className="  bg-zinc-800 rounded-sm" />
        <Link href="/pick/lists/add">
          <PlusIcon />
        </Link>
      </div>
      <div>
        <div className="text-red-500 text-7xl m-10">Collections </div>
        <ul>
          <a href="/pick/lists/1">
            <li className="flex space-x-2 hover:bg-zinc-800 p-2 rounded-sm">
              <div className="size-12 rounded-sm text-2xl font-light text-black bg-yellow-500  flex items-center justify-center">
                25
              </div>
              <div className="">
                <div className="text-base font-semibold">&apos; breeze</div>
                <div className="text-zinc-400 font-semibold text-sm">
                  Playlists
                </div>
              </div>
            </li>
          </a>
          <a href="/pick/lists/2">
            <li className="flex space-x-2 hover:bg-zinc-800 p-2 rounded-sm">
              <div className="size-12 rounded-sm text-2xl font-light text-black bg-yellow-500  flex items-center justify-center">
                tr
              </div>
              <div className="">
                <div className="text-base font-semibold">trance</div>
                <div className="text-zinc-400 font-semibold text-sm">
                  Artists
                </div>
              </div>
            </li>
          </a>
          <a href="/pick/lists/2">
            <li className="flex space-x-2  hover:bg-zinc-800 p-2 rounded-sm">
              <div className="size-12 rounded-sm  relative text-2xl font-light text-black bg-yellow-500  flex items-center justify-center">
                MF
                <div className="size-6 absolute bg-black rounded-full  -bottom-1.5 -right-1.5">
                  <SpotIcon />
                </div>
              </div>

              <div className="">
                <div className="text-base font-semibold">Mindfulness</div>
                <div className="flex space-x-1">
                  <div className="text-zinc-400 font-semibold text-sm">
                    Podcasts
                  </div>
                </div>
              </div>
            </li>
          </a>
        </ul>
      </div>
    </div>
  );
}
