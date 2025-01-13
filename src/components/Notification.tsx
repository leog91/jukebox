import { useState } from "react";

export default function Notification({ message }: { message: string }) {
  //   const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={` 
            
            //   p-2 top-1/3 absolute  font-semibold text-black  bg-amber-100`}
    >
      {/* <button
        className="absolute right-1 -top-0.5 h-3 w-3  text-center items-center justify-center flex bg-red-500 "
        onClick={() => setIsOpen(false)}
      >
        X{" "}
      </button> */}
      {message}
    </div>
  );
}
