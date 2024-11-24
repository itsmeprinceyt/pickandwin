"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Start() {
  const searchParams = useSearchParams(); // Get the search parameters
  const router = useRouter(); // For redirection
  const namesParam = searchParams.get("names"); // Retrieve the "names" parameter

  const [names, setNames] = useState<string[]>([]); // Track the names list
  const [currentName, setCurrentName] = useState<string | null>(null); // Current name being displayed
  const [isChoosing, setIsChoosing] = useState(false); // Whether the random selection is happening
  const [chosenName, setChosenName] = useState<string | null>(null); // Chosen name to be removed
  const [timeoutDuration, setTimeoutDuration] = useState(3); // Timeout duration in seconds

  // Load initial names
  useEffect(() => {
    if (namesParam) {
      setNames(decodeURIComponent(namesParam).split(","));
    } else {
      router.push("/"); // Redirect to home page if no names found
    }
  }, [namesParam, router]);

  // Start the random name choosing process
  const handleStart = () => {
    if (names.length === 0 || isChoosing) return;

    setIsChoosing(true); // Start the random name process
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setCurrentName(names[randomIndex]); // Show random names
    }, 50); // Change the name every 50 milliseconds

    // Stop the random name process after the selected duration
    setTimeout(() => {
      clearInterval(interval); // Stop the interval
      const randomIndex = Math.floor(Math.random() * names.length); // Choose the final name
      setChosenName(names[randomIndex]);
      setCurrentName(names[randomIndex]); // Display the chosen name
      setIsChoosing(false); // Allow restarting
    }, timeoutDuration * 1000); // Convert to milliseconds
  };

  // Remove the chosen name from the list
  const handleRemove = () => {
    if (!chosenName) return;
    setNames((prevNames) => prevNames.filter((name) => name !== chosenName));
    setChosenName(null); // Reset the chosen name
    setCurrentName(null); // Reset the displayed name
  };

  return (
    <div className="p-4 bg-green-700 w-screen h-screen flex flex-col justify-center items-center relative">
      <Link href="/">
        <button className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-md">
          Home
        </button>
      </Link>

      <h2 className="text-lg font-bold text-white mb-6">Game</h2>

      {/* Display the current name */}
      <div className="w-full flex justify-center items-center">
        <div className="bg-blue-500 text-white font-bold text-2xl px-8 py-4 rounded-md">
          {currentName || "Click Start to Begin"}
        </div>
      </div>

      {/* Slider for timeout duration */}
      <div className="mt-4 flex flex-col items-center">
        <label htmlFor="timeoutSlider" className="text-white font-bold mb-2">
          Set Timeout Duration: {timeoutDuration} seconds
        </label>
        <input
          id="timeoutSlider"
          type="range"
          min="0"
          max="30"
          value={timeoutDuration}
          onChange={(e) => setTimeoutDuration(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-yellow-500 text-white rounded-full px-8 py-3"
          onClick={handleStart}
          disabled={isChoosing || names.length === 0}
        >
          Start
        </button>
        {chosenName && (
          <button
            className="bg-red-500 text-white rounded-full px-8 py-3"
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>

      {/* Remaining names */}
      {/* Remaining participants counter */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">
          Remaining Participants: {names.length}
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {names.map((name, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white font-semibold px-5 py-2 rounded-md"
            >
              {name}
            </span>
          ))}
        </div>
      </div>


      {/* Winner display */}
      {names.length === 1 && (
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold text-white">Winner:</h3>
          <span className="bg-green-500 text-black font-semibold px-5 py-2 rounded-md">
            {names[0]}
          </span>
        </div>
      )}
    </div>
  );
}
