"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MadeByMe from "@/app/(components)/MadeByMe";
import HomeButton from "@/app/(components)/Home";

export default function Start() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const namesParam = searchParams.get("names");

  const [names, setNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [isChoosing, setIsChoosing] = useState(false);
  const [chosenName, setChosenName] = useState<string | null>(null);
  const [timeoutDuration, setTimeoutDuration] = useState(3);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (namesParam) { // will run only if there are names
      setNames(decodeURIComponent(namesParam).split(","));
    } else { // will redirect to home page if there are no names
      router.push("/");
    }
  }, [namesParam, router]);

  useEffect(() => {
    if (names.length === 1) {
      router.push(`/winner?name=${encodeURIComponent(names[0])}`);

    }
  }, [names, router]);
  


  const handleStart = () => {
    if (names.length === 0 || isChoosing) return;
  
    setIsChoosing(true);
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setCurrentName(names[randomIndex]);
    }, 20);
  
    setTimeout(() => {
      clearInterval(interval);
      const randomIndex = Math.floor(Math.random() * names.length);
      const selectedName = names[randomIndex];
  
      setChosenName(selectedName);
      setCurrentName(selectedName);
      setIsChoosing(false);
  
      if (names.length === 2) {
        // Remove the chosen name if there are only 2 names left
        setNames((prevNames) => prevNames.filter((name) => name !== selectedName));
        setChosenName(null); // Reset chosenName
        setCurrentName(null); // Reset currentName
      }
    }, timeoutDuration * 1000); // Use slider in the website to change time duration of shuffling.
  };

  const handleRemove = () => {
    if (!chosenName) return;
    setNames((prevNames) => prevNames.filter((name) => name !== chosenName));
    setChosenName(null);
    setCurrentName(null);
  };

  const handleSettings = () => {
    if (toggle) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }
  return (
    <div className="bg-gradient-to-b from-purple-500 to-purple-900 w-screen h-screen flex flex-col justify-center items-center relative">
      
      <HomeButton/>
      <div className="absolute top-4 transform right-5 text-white">
            <button onClick={handleSettings}>
                <Image
                    src="/settings.png"
                    height={20}
                    width={20}
                    alt="cross"
                />
            </button>
        </div>

      {/* Settings */}
      {toggle && (
        <div className="absolute z-20 left-0 right-0 bg-black/90 min-h-screen flex justify-center items-center">
          <div className="relative bg-purple-600 border-2 border-white/30 text-white flex flex-col justify-center items-center p-10  rounded-xl shadow-xl shadow-white/20">
            {/* To Close Pop up Setting*/}
            <button
              onClick={handleSettings}
              className="absolute top-5 right-5 hover:scale-125 transition-all ease-in-out">
              <Image src="/cross.png" width={10} height={20} alt="Close" />
            </button>
            <div className="text-4xl font-bold">Change Shuffle Time</div>
            {/* Slider for timeout duration */}
            <div className="mt-4 flex flex-col items-center">
              <label htmlFor="timeoutSlider" className="text-white font-bold mb-2"> {timeoutDuration} seconds
              </label>
              <input
                id="timeoutSlider"
                type="range"
                min="0"
                max="59"
                value={timeoutDuration}
                onChange={(e) => setTimeoutDuration(Number(e.target.value))}
                className="w-full h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer active:bg-purple-400"
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold text-white mb-6">Shall We Begin?</h2>

      {/* Display the current name */}
      <div className="w-full flex justify-center items-center">
        <div className="bg-red-600 text-white font-bold text-2xl px-8 py-4 rounded-md">
          {currentName || "Click Start to Begin"}
        </div>
      </div>



      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-white w-[125px] text-black font-semibold rounded-full px-8 py-3"
          onClick={handleStart}
          disabled={isChoosing || names.length === 0}
        >
          Start
        </button>
        {chosenName && (
          <button
            className="bg-pink-600 w-[125px] text-white font-semibold rounded-full px-8 py-3"
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>

      {/* Remaining names */}
      {/* Remaining participants counter */}
      <div className="p-5 bg-black/30 mt-6 text-center rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-2">
          Remaining Participants: {names.length}
        </h3>
        <div className="p-3 flex flex-wrap gap-3 justify-center w-[500px] bg-purple-950/10 max-h-80 overflow-y-auto scrollbar-thin scrollbar- scrollbar-track-violet-500 scrollbar-thumb-white  rounded-md">
          {names.map((name, index) => (
            <span
              key={index}
              className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-md"
            >
              {name}
            </span>
          ))}
        </div>
      </div>


      {/* Winner display */}
      {names.length === 1 && (
        <div className="mt-4 text-center flex flex-col gap-6 items-center">
          <h3 className="text-8xl font-bold text-white">Winner:</h3>
          <div className=" bg-green-500 text-green-950 text-4xl font-semibold px-8 py-3 rounded-md">
            {names[0]}
          </div>
          <Link
            href={{
              pathname: "/winner",
              query: { name: names[0] }, // Pass winner's name as query
            }}
          >
            <button className="bg-white text-black font-semibold rounded-xl p-3 hover:opacity-80">
              View Full-Screen Winner
            </button>
          </Link>
        </div>
      )}


      <MadeByMe/>
    </div>
  );
}
