import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/src/db/db";
import { lists } from "@/src/db/schema";
import { ShareToggle } from "./ShareToggle";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [list] = await db
    .select()
    .from(lists)
    .where(and(eq(lists.id, id), eq(lists.ownerId, userId)));
  if (!list) notFound();

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <Link href="/me/lists" className="text-green-400 hover:underline">
          Back to My Lists
        </Link>
        <h1 className="mt-4 text-3xl font-light">{list.name}</h1>
        <p className="mt-2 text-zinc-400">This list is private unless you share it.</p>
        <ShareToggle id={list.id} isShared={list.isShared} />
      </div>
    </main>
  );
}
