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
      <div className="text-red-500 text-7xl m-10 underline decoration-amber-500 decoration-5 underline-offset-7">
        Remove{" "}
      </div>

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
            <div className="text-xl font-semibold">{artist.name}</div>
            <div className="text-lg font-semibold border-t-2 mt-4 border-red-500">
              {" "}
              Date added:{" "}
            </div>

            <div className="text-lg"> {artist.createdAt}</div>
            <div>
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full",
                timeStyle: "long",
              }).format(new Date(artist.createdAt))}
              {isAdmin ? <Delete artist={artist} /> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
