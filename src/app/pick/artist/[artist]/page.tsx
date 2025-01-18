import { getArtist } from "../../../action";
import { currentUser } from "@clerk/nextjs/server";
import { Delete } from "./delete";
import { Artist } from "./action";

export default async function Page(props: {
  params: Promise<{ artist: string }>;
}) {
  const params = await props.params;
  const artist: Artist = (
    await getArtist(params.artist.replaceAll("_", " "))
  )[0];

  const user = await currentUser();
  const isAdmin =
    process.env.ADMIN_EMAIL === user?.emailAddresses[0].emailAddress;

  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      <div className="text-red-500 text-7xl m-10">Edit </div>

      {!artist ? (
        <div>
          <div className="text-pink-500 text-lg font-semibold">
            {params.artist}
          </div>{" "}
          not found
        </div>
      ) : (
        <div>
          <div>
            <div>{artist.name}</div>
            <div> {artist.createdAt}</div>
            <div>genres . . .</div>
            {isAdmin ? <Delete artist={artist} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}
