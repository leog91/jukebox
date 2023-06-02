import { Mp3Player } from "@/components/Mp3Player";
import PlayList from "@/components/PlayList";
import React, { useState } from "react";

type Component = "PLAYLIST" | "MP3PLAYER";

const ShowComponent = ({
  component,
  setShowComponent,
  showingComponents,
}: {
  component: Component;
  showingComponents: Component[];
  setShowComponent: React.Dispatch<React.SetStateAction<Component[]>>;
}) => {
  return (
    <button
      className="bg-green-700 font-bold text-sm border-2 text-black hover:text-white hover:border-green-300  border-black my-3 w-16"
      onClick={() => setShowComponent([...showingComponents, component])}
    >
      SHOW
    </button>
  );
};

const HideComponent = ({
  component,
  setShowComponent,
  showingComponents,
}: {
  component: Component;
  showingComponents: Component[];
  setShowComponent: React.Dispatch<React.SetStateAction<Component[]>>;
}) => {
  return (
    <button
      className="bg-green-700 font-bold text-sm border-2 text-black hover:text-white hover:border-green-300  border-black my-3 w-16"
      onClick={() =>
        setShowComponent(showingComponents.filter((c) => c !== component))
      }
    >
      HIDE
    </button>
  );
};

export default function Mocks() {
  const [showComponent, setShowComponent] = useState<Component[]>([]);

  return (
    <div className="flex overflow-hidden pt-4 flex-col min-h-screen bg-stone-600 items-center ">
      <div className="my-4">
        <h2 className="text-black text-center mb-2 font-black">
          DIGITAL MP3 PLAYER
        </h2>
        <Mp3Player />
      </div>
      <div className="  w-full bg-stone-400 text-center text-lg font-light text-black border-y-2 border-gray-200 py-1">
        Playlist
      </div>

      {showComponent.includes("PLAYLIST") ? (
        <div className=" flex flex-col  items-center">
          <HideComponent
            component="PLAYLIST"
            setShowComponent={setShowComponent}
            showingComponents={showComponent}
          />
          <PlayList />{" "}
        </div>
      ) : (
        <ShowComponent
          component="PLAYLIST"
          setShowComponent={setShowComponent}
          showingComponents={showComponent}
        />
      )}
    </div>
  );
}
