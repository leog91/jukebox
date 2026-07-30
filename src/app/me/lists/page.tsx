import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/src/db/db";
import { lists } from "@/src/db/schema";
import { CreateListForm } from "./CreateListForm";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/me/lists");

  const userLists = await db
    .select()
    .from(lists)
    .where(eq(lists.ownerId, userId))
    .orderBy(lists.createdAt);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-6 text-3xl font-light">My Lists</h1>
        <CreateListForm />
        {userLists.length === 0 ? (
          <p className="text-zinc-400">Create your first private list.</p>
        ) : (
          <ul className="space-y-2">
            {userLists.map((list) => (
              <li key={list.id}>
                <Link
                  href={`/me/lists/${list.id}`}
                  className="flex items-center justify-between rounded-lg bg-neutral-900 px-4 py-3 hover:bg-neutral-800"
                >
                  <span>{list.name}</span>
                  <span className="text-sm text-zinc-400">
                    {list.isShared ? "Shared" : "Private"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
