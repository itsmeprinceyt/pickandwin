"use client";
import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [nameList, setNameList] = useState<string[]>([]);
  const [popupMessage, setPopupMessage] = useState<string>("");

  useEffect(() => {
    const storedNames = localStorage.getItem("nameList");
    if (storedNames) {
      setNameList(JSON.parse(storedNames));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("nameList", JSON.stringify(nameList));
  }, [nameList]);
  
  const handleAddName = (): void => {
    if (inputValue.trim() !== "") {
      const newNames = inputValue
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "");

      setNameList((prevList) => [...prevList, ...newNames]);
      setInputValue("");

      const message =
        newNames.length > 1
          ? `New participants ${newNames.slice(0, 3).join(", ")} and more have been added!`
          : `New participant ${newNames[0]} has been added!`;

      setPopupMessage(message);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      handleAddName();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage("");
      }, 3000); // Hide After: 3 Seconds
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  const handleRemoveName = (index: number): void => {
    setNameList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const handleResetList = (): void => {
    setNameList([]);
    setPopupMessage("Name list has been reset!");
  };

  return (
    <div className="bg-gradient-to-b from-purple-500 to-purple-900 h-screen flex flex-col justify-center items-center gap-5 relative">

      {/* Popup notification */}
      {popupMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-300 text-purple-950 px-6 py-2 rounded-md shadow-lg animate-pulse">
          {popupMessage}
        </div>
      )}

      <h1 className="text-8xl font-bold text-white">Pick And Win</h1>
      <h1 className="text-white w-[600px] text-center">Pick and Win is a simple tool for selecting giveaway winners.</h1>
      <div className="p-4 bg-green-700 w-96">
        <div className="mb-4 bg-red-300 flex">
          {/* Input for names */}
          <input
            className="border-2 border-black rounded-full p-2 mr-2 flex-grow"
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter names separated by commas"
          />

          {/* Add button */}
          <button
            className="bg-blue-500 text-white rounded-full p-2 mr-2"
            onClick={handleAddName}
          >
            Add
          </button>

          {/* Start button with navigation */}
          <Link
            href={{
              pathname: "/start",
              query: { names: nameList.join(",") }, // Pass nameList as a query parameter
            }}
          >
            <button className="bg-yellow-500 text-white rounded-full p-2">
              Start
            </button>
          </Link>
        </div>

        <div className="bg-red-500 p-4 max-h-[300px] overflow-y-auto">
          <h3 className="text-lg font-bold mb-2">Name List:</h3>
          {/* Render the names as a list */}
          <ul className="list-disc pl-6 flex gap-3 flex-col items-start">
            {nameList.map((name, index) => (
              <li
                className="bg-blue-500 text-white font-semibold px-5 py-2 rounded-md flex justify-between w-full"
                key={index}
              >
                <span>{name}</span>
                <button
                  className="ml-4 bg-red-600 text-white px-2 py-1 rounded-md"
                  onClick={() => handleRemoveName(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Reset button */}
        <button
          className="bg-red-600 text-white px-4 py-2 mt-4 rounded-md w-full"
          onClick={handleResetList}
        >
          Reset List
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white animate-pulse">
        Made by💜
        <Link href="https://www.youtube.com/channel/UC9UQVp8grhcVatbMcf0sa5w"
          target="_blank">
          <button className="hover:animate-bounce">
            @itsmeprinceyt
          </button>
        </Link>
      </div>
    </div>
  );
}
