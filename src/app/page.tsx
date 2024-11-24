"use client";
import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
    <div className="bg-gradient-to-b from-purple-500 to-purple-900 h-screen flex flex-col justify-center items-center gap-3 relative">

      {/* Popup notification */}
      {popupMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-300 text-purple-950 px-6 py-2 rounded-md shadow-lg animate-pulse">
          {popupMessage}
        </div>
      )}

      <h1 className="text-8xl font-bold text-white">Pick And Win</h1>
      <h1 className="text-white w-[600px] text-center">Pick and Win helps you choose giveaway winners easily. Just enter names or paste names separated by commas and hit that Start button!</h1>
      <div className="p-5 bg-black/30 border-2 border-purple-900 rounded-2xl w-96">
        <div className="mb-4  flex">
          <input
            className="rounded-xl p-2 mr-2 flex-grow focus:outline-none"
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter User"
          />

          {/* Add button */}
          <button className="bg-purple-600  text-white rounded-full p-3 mr-2 hover:opacity-80"onClick={handleAddName}>
            <Image
              src="/addW.png"
              height={70}
              width={70}
              alt="add"
            />
          </button>

          {/* Reset button */}
          <button className="bg-pink-600 text-white font-semibold hover:opacity-80 rounded-xl w-full" onClick={handleResetList}>
            Reset List
          </button>
        </div>

        <div className="bg-purple-950/30 border-2 border-purple-900 rounded-xl p-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar- scrollbar-track-violet-500 scrollbar-thumb-white mb-4">
          <h3 className="text-white text-lg font-semibold mb-4 text-center">Participants List</h3>
          <ul className="flex gap-3 flex-col items-start">
            {nameList.map((name, index) => (
              <li className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-md flex justify-between w-full" key={index}>
                <span>{name}</span>
                <button
                  onClick={() => handleRemoveName(index)}>
                  <Image
                    src="/cross.png"
                    height={10}
                    width={10}
                    alt="cross"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <Link href={{pathname: "/start", query: { names: nameList.join(",") },}}> 
          <button className="bg-white text-black font-semibold rounded-xl w-full p-2 hover:opacity-80">
            Start
          </button>
        </Link>

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
