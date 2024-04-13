import { UserButton, auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { submit } from "../../action";

import React from "react";

export default async function Page() {
  return (
    <div className="min-h-screen justify-center bg-black flex flex-col  items-center ">
      <form className="text-black" action={submit}>
        <input
          type="text"
          placeholder="🫡 (only emojis allowed)"
          // pattern="^[\p{Emoji}]+$"
          name="text"
          autoFocus
          // maxLength="10"
          required
        />
        <button>➕</button>
      </form>
      {/* </main> */}
    </div>
  );
}
