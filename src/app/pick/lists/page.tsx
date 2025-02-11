import Link from "next/link";

export default async function Page() {
  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      <Link href="/pick/lists/add">new collection</Link>
      <div className="text-red-500 text-7xl m-10">Collections </div>
      <ul>
        <li>asd</li>
      </ul>
    </div>
  );
}
