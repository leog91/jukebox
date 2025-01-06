import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen justify-center bg-black flex flex-col m-auto max-w-2xl  items-center ">
      <SignUp />
    </div>
  );
}
