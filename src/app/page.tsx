import VideoPlayer from "@/src/components/videoPlayer";
import { getVideos } from "./videos/action";
import Link from "next/link";
import { PlusIcon } from "@/src/components/icons/plusIcon";
import { isAdmin } from "@/src/lib/auth";

async function Page() {
  const hasAdminAccess = await isAdmin();
  const videos = await getVideos(hasAdminAccess);

  return (
    <div className="min-h-screen  bg-black flex flex-col justify-center  w-full  items-center  ">
      {hasAdminAccess ? (
        <div className="flex w-full justify-end gap-2 max-w-2xl">
          <Link
            className="bg-red-600 flex space-x-0.5 justify-center items-center max-w-sm text-white text-sm font-semibold m-2 p-1.5 px-2 rounded-3xl"
            href="/videos/trash"
          >
            <p>Trash</p>
          </Link>
          <Link
            className="bg-green-500 flex space-x-0.5 justify-center items-center   max-w-sm  text-black text-sm font-semibold  m-2  p-1.5 px-2 rounded-3xl"
            href="/videos/add"
          >
            <PlusIcon />
            <p>video</p>
          </Link>
        </div>
      ) : null}
      <VideoPlayer isAdmin={hasAdminAccess} videos={videos} />
    </div>
  );
}

export default Page;
