import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { getArtists } from "../app/action";

export async function Result({ page }: { page: string }) {
  const user = await currentUser();
  const isAdmin =
    process.env.ADMIN_EMAIL === user?.emailAddresses[0].emailAddress;

  const res = await getArtists(Number(page) - 1);

  return (
    <div className="bg-neutral-900 mt-4 sm:rounded-2xl sm:p-4 pt-4 sm:my-4  w-full max-w-2xl">
      {res.map((r) => (
        <div
          className="flex  justify-between hover:bg-neutral-800  px-2 py-0.5 rounded-md"
          key={r.id}
        >
          <div>{r.name} </div>
          <div className="flex space-x-2">
            {isAdmin ? (
              <Link
                className="bg-yellow-500    max-w-sm  text-black text-sm font-semibold   rounded-3xl"
                href={`/pick/artist/${r.name.replaceAll(" ", "_")}`}
              >
                {/* edit */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Link>
            ) : null}
            <a
              href={`https://open.spotify.com/search/${r.name}`}
              target="_blank"
            >
              <div className="flex items-center text-black rounded-full text-sm font-bold uppercase bg-green-500 justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path
                    fill="currentColor"
                    stroke="none"
                    d="M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4z"
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>

        //pick/artist/
      ))}
      <div className="flex justify-evenly">
        <Link
          className={`${
            Number(page) > 1 ? "bg-green-500" : "bg-gray-500"
          }  text-2xl   max-w-sm  text-black  font-semibold   px-1 rounded-3xl`}
          href={`/pick?page=${Number(page) - 1}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>

        <Link
          className="bg-green-500  text-2xl   max-w-sm  text-black  font-semibold  px-1 rounded-3xl"
          href={`/pick?page=${Number(page) + 1}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
