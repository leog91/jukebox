import { YouTubeEmbed } from "@next/third-parties/google";
import { currentUser } from "@clerk/nextjs/server";
import VideoPlayer from "@/src/components/videoPlayer";
import { getVideos } from "./action";
import Link from "next/link";
import { PlusIcon } from "@/src/components/icons/plusIcon";

async function Page() {
  const videos = await getVideos();

  const user = await currentUser();
  const isAdmin =
    process.env.ADMIN_EMAIL === user?.emailAddresses[0].emailAddress;

  return (
    <div className="min-h-screen  bg-black flex flex-col justify-center  w-full  items-center  ">
      {isAdmin ? (
        <div className="flex w-full  justify-end max-w-2xl">
          <Link
            className="bg-green-500 flex space-x-0.5 justify-center items-center   max-w-sm  text-black text-sm font-semibold  m-2  p-1.5 px-2 rounded-3xl"
            href="/videos/add"
          >
            <PlusIcon />
            <p>video</p>
          </Link>
        </div>
      ) : null}
      <VideoPlayer videos={videos} />
    </div>
  );
}

export default Page;
