import { redirect } from "next/navigation";
import { isAdmin } from "@/src/lib/auth";
import { AlbumForm } from "./AlbumForm";

export default async function Page({ searchParams }: {
  searchParams: Promise<{ artist?: string | string[]; name?: string | string[]; cover?: string | string[] }>;
}) {
  if (!(await isAdmin())) redirect("/albums");
  const params = await searchParams;
  const single = (value: string | string[] | undefined) => typeof value === "string" ? value : "";
  return <AlbumForm initialInputs={{ artist: single(params.artist), name: single(params.name), cover: single(params.cover) }} />;
}
