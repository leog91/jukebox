import Link from "next/link";
import { redirect } from "next/navigation";
import { getTrashedVideos } from "../action";
import { TrashList } from "./TrashList";
import { isAdmin } from "@/src/lib/auth";

export default async function TrashPage() {
  const hasAdminAccess = await isAdmin();

  if (!hasAdminAccess) {
    redirect("/");
  }

  const trashedVideos = await getTrashedVideos();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-light">Deleted videos</h1>
        <Link href="/" className="text-green-500 hover:underline">
          Back
        </Link>
      </div>
      <TrashList videos={trashedVideos} />
    </div>
  );
}
