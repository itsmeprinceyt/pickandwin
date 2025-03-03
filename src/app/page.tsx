"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MadeByMe from "@/(components)/MadeByMe"

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
        .split(/[\n,]/)
        .map((name) => name.trim())
        .filter((name) => name !== "");

      setNameList((prevList) => {
        const uniqueNames = Array.from(new Set([...prevList, ...newNames]));
        return uniqueNames;
      });

      const uniqueNewNames = newNames.filter(
        (name, index, self) =>
          self.indexOf(name) === index && !nameList.includes(name)
      );

      setInputValue("");

      const message =
        uniqueNewNames.length > 1
          ? `New participants ${uniqueNewNames.slice(0, 3).join(", ")}${uniqueNewNames.length > 3 ? ", and more" : ""
          } have been added!`
          : uniqueNewNames.length === 1
            ? `New participant ${uniqueNewNames[0]} has been added!`
            : "No new participants were added (all names are duplicates).";

      setPopupMessage(message);
    }
  };


  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      handleAddName();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-[10px] md:text-xs lg:text-md bg-purple-300 text-purple-950 px-6 py-2 rounded-md shadow-lg animate-pulse">
          {popupMessage}
        </div>
      )}

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black to-purple-950">
        Pick And Win
      </h1>

      <h1 className="w-[300px] md:w-[400px] lg:w-[600px] text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-950 to-purple-950">
        Pick and Win helps you choose giveaway winners easily. Just
        <span className=" text-black m-1">
          enter names
        </span>
        or paste
        <span className=" text-black m-1">
          names separated by commas
        </span>
        and hit that
        <span className=" text-black m-1">
          Start
        </span>
        button!</h1>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">

        {/* Participants Container */}
        <div className="p-5 bg-black/30 border-2 border-purple-900 rounded-2xl w-96 shadow-lg shadow-black/20">
          <div className="bg-purple-950/30 border-2 border-purple-900 rounded-xl p-4 max-h-44 md:max-h-96 overflow-y-auto scrollbar-thin scrollbar- scrollbar-track-violet-500 scrollbar-thumb-white">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">
              {nameList.length === 0 ? (
                <>
                  Participants List
                </>
              ) : (
                <>
                  Participants: <span className="animate-pulse">{nameList.length}</span>
                </>
              )}
            </h3>
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
        </div>

        {/* Adding Names*/}
        <div className="relative p-5 bg-black/30 border-2 border-purple-900 rounded-2xl w-96 shadow-lg shadow-black/20">
          {nameList.length === 0 && (
            <div className="absolute bottom-20 left-7 animate-bounce bg-purple-500 shadow-lg shadow-purple-800/30 p-1 px-2 rounded-md text-purple-200 text-[12px] w-[325px] text-center pointer-events-none">
              Press &apos;Shift+Enter&apos; to Submit
            </div>
          )}
          <div className="mb-4 flex justify-between items-center">
            <textarea
              className="rounded-xl p-2 w-full h-80 max-h-44 md:max-h-80 focus:outline-none scrollbar-thin scrollbar- scrollbar-track-violet-500 scrollbar-thumb-white"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter names, separated by commas or new lines."
            />

          </div>
          <div className="flex justify-between">
            {/* Add button */}
            <button className="bg-purple-500  text-white rounded-full h-[40px] w-[40px] p-3 hover:shadow-lg hover:shadow-purple-600/30 hover:scale-105 ease-linear duration-75" onClick={handleAddName}>
              <Image
                src="/addW.png"
                height={70}
                width={70}
                alt="add"
              />
            </button>
            {/* Reset button */}
            <button className={`bg-pink-500 w-[100px] h-10 text-white font-semibold rounded-xl ${nameList.length < 1 ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105 ease-linear duration-75"}`} onClick={handleResetList} disabled={nameList.length < 1}>
              Reset List
            </button>

            {/* Shuffle */}
            <Link href={{pathname: "/shuffle",query: { names: nameList.join(",") },}}>
              <button className={`bg-white text-black font-semibold rounded-xl w-[90px] p-2 ${nameList.length < 2 ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-white/30 hover:scale-105 ease-linear duration-75"}`}disabled={nameList.length < 2}>
                Shuffle
              </button>
            </Link>
            {/* Spin the Wheel */}
            <Link href={{pathname: "/spin",query: { names: nameList.join(",") },}}>
              <button className={`bg-white text-black font-semibold rounded-xl w-[90px] p-2 ${nameList.length < 2 ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-white/30 hover:scale-105 ease-linear duration-75"}`}disabled={nameList.length < 2}>
                Wheel
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bottom-4 w-[250px]">
        <MadeByMe />
      </div>
    </div>
  );
}