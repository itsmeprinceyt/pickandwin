"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import MadeByMe from "@/(components)/MadeByMe"
import HomeButton from "@/(components)/Home";

const Start = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const namesParam = searchParams.get("names");

  const [names, setNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [isChoosing, setIsChoosing] = useState(false);
  const [chosenName, setChosenName] = useState<string | null>(null);
  const [timeoutDuration, setTimeoutDuration] = useState(3);
  const [toggle, setToggle] = useState(false);
  const [highlightColor, setHighlightColor] = useState("#ff0000");


  useEffect(() => {
    if (namesParam) { // If state will run only if there are names
      setNames(decodeURIComponent(namesParam).split(","));
    } else { // Otherwise it will redirect to home page if there are no names
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
    const totalTime = timeoutDuration * 1000; // Total time in milliseconds
    const fastTime = totalTime * 0.8;

    let timeElapsed = 0;

    const fastInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setCurrentName(names[randomIndex]);

      timeElapsed += 70; //
      if (timeElapsed >= fastTime) {
        clearInterval(fastInterval);
        startSlowShuffle();
      }
    }, 70);

    const startSlowShuffle = () => {
      const slowInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * names.length);
        setCurrentName(names[randomIndex]);

        timeElapsed += 400;
        if (timeElapsed >= totalTime) {
          clearInterval(slowInterval);
          const randomIndex = Math.floor(Math.random() * names.length);
          const selectedName = names[randomIndex];

          setChosenName(selectedName);
          setCurrentName(selectedName);
          setIsChoosing(false);

          if (names.length === 2) {
            setNames((prevNames) => prevNames.filter((name) => name !== selectedName));
            setChosenName(null);
            setCurrentName(null);
          }
        }
      }, 400);
    };
  };


  const handleRemove = async () => {
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

  const handleRemoveName = (index: number): void => {
    setNames((prevList) => prevList.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gradient-to-b from-purple-500 to-purple-900 w-screen h-screen flex flex-col justify-center items-center relative">

      <div className="top-5 left-5">
        <HomeButton color="bg-purple-800" />
      </div>
      <div className="absolute top-5 transform right-5 text-white">
        <button
          className="bg-purple-800 rounded-full p-2"
          onClick={handleSettings}>
          <Image
            src="/settings.png"
            height={25}
            width={25}
            alt="cross"
          />
        </button>
      </div>

      {/* Settings */}
      {toggle && (
        <div className="absolute z-20 left-0 right-0 bg-black/90 min-h-screen flex justify-center items-center">
          <div className="relative bg-purple-600 border-2 border-white/30 text-white flex flex-col justify-center items-center p-5 py-10 md:p-10 rounded-xl shadow-xl shadow-white/20">
            {/* To Close Pop up Setting*/}
            <button
              onClick={handleSettings}
              className="absolute top-5 right-5 hover:scale-125 transition-all ease-in-out">
              <Image src="/cross.png" width={10} height={20} alt="Close" />
            </button>
            <div className="text-4xl font-bold">Shuffle Time</div>
            {/* Slider for timeout duration */}
            <div className="mt-4 flex flex-col items-center">
              <label htmlFor="timeoutSlider" className="text-white font-bold mb-2"> {timeoutDuration} seconds
              </label>
              <input
                id="timeoutSlider"
                type="range"
                min="1"
                max="60"
                value={timeoutDuration}
                onChange={(e) => setTimeoutDuration(Number(e.target.value))}
                className="w-full h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer active:bg-purple-400"
              />
            </div>
            <div className="mt-8 mb-3 text-4xl font-bold">Highlight Color</div>
            {/* Color Picker */}
            <label htmlFor="colorPicker" className="text-white font-semibold mb-2">{highlightColor}</label>
            <input
              id="colorPicker"
              type="color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="w-[150px] rounded-md bg-white px-1"
            />
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold text-white mb-6">Shall We Begin?</h2>

      {/* Shuffle Container */}
      <div className="w-full flex justify-center items-center">
        <div className="text-white font-bold text-2xl px-8 py-4 rounded-md shadow-lg shadow-black/20 pointer-events-none"
          style={{ backgroundColor: highlightColor }}>
          {currentName || "Who Will Be Chosen?"}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-white w-[125px] text-black font-semibold rounded-full px-8 py-3 shadow-lg shadow-black/10"
          onClick={handleStart}
          disabled={isChoosing || names.length === 0}
        >
          Shuffle
        </button>
        {chosenName && (
          <button
            className="bg-pink-600 w-[125px] text-white font-semibold rounded-full px-8 py-3 shadow-lg shadow-black/10"
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>

      {/* Remaining names Container */}
      <div className="p-5 bg-black/30 mt-6 text-center rounded-2xl shadow-lg shadow-black/20">
        <h3 className="text-lg font-bold text-white mb-2">
          Remaining Participants: <span className="animate-pulse">{names.length}</span>
        </h3>
        <div className="p-3 flex flex-wrap gap-3 justify-center w-[300px] md:w-[500px] bg-purple-950/10 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-violet-500 scrollbar-thumb-white rounded-md">
          {names.map((name, index) => (
            <span
              key={index}
              className={` px-5 py-2 rounded-md font-semibold text-white transition-all duration-300 ${currentName === name
                ? `scale-125`
                : "bg-purple-600"
                }`}
              style={{ backgroundColor: currentName === name ? highlightColor : '' }}
            >
              {name}
              <button
                className="ml-3"
                onClick={() => handleRemoveName(index)}>
                <Image
                  src="/cross.png"
                  height={10}
                  width={10}
                  alt="cross"
                />
              </button>
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
              query: { name: names[0] },
            }}
          >
            <button className="bg-white text-black font-semibold rounded-xl p-3 hover:opacity-80">
              View on Full-Screen
            </button>
          </Link>
        </div>
      )}
      <div className="bottom-4 w-[250px]">
        <MadeByMe />
      </div>
    </div>
  );
}

const StartWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Start />
    </Suspense>
  );
};

export default StartWithSuspense;