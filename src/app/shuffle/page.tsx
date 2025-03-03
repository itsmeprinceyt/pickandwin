"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import MadeByMe from "@/(components)/MadeByMe"
import HomeButton from "@/(components)/Home";

const Shuffle = () => {
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
  const [mode, setMode] = useState("lastOneStanding");
  const [textColor, setTextColor] = useState("white");

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

  useEffect(() => {
    if (mode === "randomWinner" && chosenName) {
      router.push(`/winner?name=${encodeURIComponent(chosenName)}`);
    }
  }, [mode, chosenName, router]);


  useEffect(() => {
    setTextColor(isBrightColor(highlightColor) ? "black" : "white");
  }, [highlightColor]);

  const handleStart = () => {
    if (names.length === 0 || isChoosing) return;
    setIsChoosing(true);
    const totalTime = timeoutDuration * 1000; // Total time in milliseconds
    const fastTime = totalTime * 0.8;

    let timeElapsed = 0;

    const fastInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setCurrentName(names[randomIndex]); // Name is selected every interval

      timeElapsed += 70; // To keep increasing the timeElapsed until it has reached above fastTime
      if (timeElapsed >= fastTime) { // When fastTime shuffle is done, clear the fast shuffle and move to slow shuffle
        clearInterval(fastInterval);
        startSlowShuffle();
      }
    }, 70);

    const startSlowShuffle = () => {
      const slowInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * names.length); // Name is selected every interval
        setCurrentName(names[randomIndex]);

        timeElapsed += 400; // You can increase this to make the slow shuffle even longer
        if (timeElapsed >= totalTime) { // When the total time is above timeoutDuration
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
      }, 400); // You can increase this to make the slow shuffle even longer
    };
  };


  const handleRemove = async () => { // Removing the name from button
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

  const handleRemoveName = (index: number): void => { // Removing the name from Participants List
    setNames((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleModeChange = (selectedMode: string) => {
    setMode(selectedMode);
  };

  const isBrightColor = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186;
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
          <div className="relative bg-purple-600 border-2 border-white/30 text-white flex flex-col justify-center gap-5 items-center p-5 py-10 md:p-8 rounded-xl shadow-xl shadow-white/20">

            {/* To Close Pop up Setting*/}
            <button
              onClick={handleSettings}
              className="absolute top-3 right-3 hover:scale-125 transition-all ease-in-out">
              <Image src="/cross.png" width={10} height={20} alt="Close" />
            </button>

            {/* Slider for Shuffle Duration duration */}
            <div className="w-[320px] bg-black/30 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-2">
              <div className="text-4xl font-bold">Shuffle Time</div>
              <div className="flex flex-col items-center">
                <label htmlFor="timeoutSlider" className="text-white font-bold mb-2"> {timeoutDuration} seconds
                </label>
                <input
                  id="timeoutSlider"
                  type="range"
                  min="1"
                  max="120"
                  value={timeoutDuration}
                  onChange={(e) => setTimeoutDuration(Number(e.target.value))}
                  className="w-[150px] h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer active:bg-purple-400"
                />
              </div>
            </div>

            {/* Color Picker */}
            <div className="w-[320px] bg-black/30 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-2">
              <div className="text-4xl font-bold">Highlight Color</div>
              <label htmlFor="colorPicker" className="text-white font-semibold mb-2">{highlightColor}</label>
              <input
                id="colorPicker"
                type="color"
                value={highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-[150px] rounded-md bg-white px-1"
              />
            </div>

            {/* Mode Selector */}
            <div className="w-[320px] bg-black/30 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-2">
              <div className="text-4xl font-bold">Choose Mode</div>
              <div className="flex flex-col items-start gap-1" id="mode-selector">
                <label
                  className={`flex items-center space-x-4 text-white ${mode === "lastOneStanding" ? "animate-pulse" : ""}`}
                  id="last-one-standing-label"
                >
                  <input
                    type="radio"
                    name="mode"
                    value="lastOneStanding"
                    id="last-one-standing-radio"
                    checked={mode === "lastOneStanding"}
                    onChange={(e) => handleModeChange(e.target.value)}
                    className="form-radio text-purple-500"
                  />
                  <span>Last One Standing</span>
                </label>
                <label
                  className={`flex items-center space-x-4 text-white ${mode === "randomWinner" ? "animate-pulse" : ""}`}
                  id="random-winner-label"
                >
                  <input
                    type="radio"
                    name="mode"
                    value="randomWinner"
                    id="random-winner-radio"
                    checked={mode === "randomWinner"}
                    onChange={(e) => handleModeChange(e.target.value)}
                    className="form-radio text-purple-500"
                  />
                  <span>Random Winner</span>
                </label>
              </div>
            </div>

          </div>
        </div>
      )}

      <h2 className="text-lg font-bold text-white mb-6">
        {isChoosing ? "Drumroll, please!" : `Here we go!`}
      </h2>

      {/* Shuffle Container */}
      <div className="w-full flex justify-center items-center">
        <div
          className="font-bold text-2xl px-8 py-4 rounded-md pointer-events-none"
          style={{
            backgroundColor: highlightColor,
            color: textColor, // Dynamically apply the text color
            boxShadow: `0 4px 10px ${highlightColor}60`,
          }}
        >
          {currentName || "Who Will Be Chosen?"}
        </div>
      </div>

      {/* Shuffle & Remove Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-white hover:shadow-lg hover:shadow-white/30 hover:scale-105 ease-linear duration-75 w-[125px] text-black font-semibold rounded-full px-8 py-3 shadow-lg shadow-black/10"
          onClick={handleStart}
          disabled={isChoosing || names.length === 0}
        >
          Shuffle
        </button>
        {chosenName && (
          <button
            className="bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105 ease-linear duration-75 w-[125px] text-white font-semibold rounded-full px-8 py-3 shadow-lg shadow-black/10"
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
          {names.map((name, index) => {
            const isCurrent = currentName === name;
            const textColor = isCurrent ? (isBrightColor(highlightColor) ? "black" : "white") : "white"; // We set which text color to set
            const crossIcon = textColor === "white" ? "/cross.png" : "/cross2.png"; // We decide which icon will be displayed based on text color
            return (
              <span
                key={index}
                className={`px-5 py-2 rounded-md font-semibold transition-all duration-300 ${isCurrent ? "scale-125" : "bg-purple-600 text-white"
                  }`}
                style={{
                  backgroundColor: isCurrent ? highlightColor : "",
                  color: textColor,
                }}
              >
                {name}
                <button
                  className="ml-3"
                  onClick={() => handleRemoveName(index)}
                >
                  <Image
                    src={crossIcon}
                    height={10}
                    width={10}
                    alt="cross"
                  />
                </button>
              </span>
            );
          })}
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
      <Shuffle />
    </Suspense>
  );
};

export default StartWithSuspense;