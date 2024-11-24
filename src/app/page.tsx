"use client";
import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [inputValue, setInputValue] = useState<string>(""); // Input state
  const [nameList, setNameList] = useState<string[]>([]); // Name list state
  const [popupMessage, setPopupMessage] = useState<string>(""); // Popup message state

  // Load names from localStorage on page load
  useEffect(() => {
    const storedNames = localStorage.getItem("nameList");
    if (storedNames) {
      setNameList(JSON.parse(storedNames)); // Load the list from localStorage
    }
  }, []);

  // Save the name list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("nameList", JSON.stringify(nameList));
  }, [nameList]);

  // Add new names from the input
  const handleAddName = (): void => {
    if (inputValue.trim() !== "") {
      // Split input by commas, trim each part, and filter out empty names
      const newNames = inputValue
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "");

      setNameList((prevList) => [...prevList, ...newNames]); // Add new names to the list
      setInputValue(""); // Clear input

      // Show popup for added names
      const message =
        newNames.length > 1
          ? `New participants ${newNames.slice(0, 3).join(", ")} and more have been added!`
          : `New participant ${newNames[0]} has been added!`;

      setPopupMessage(message); // Set popup message
    }
  };

  // Handle the "Enter" key press to add names
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      handleAddName();
    }
  };

  // Handle input field changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  // Hide popup after 3 seconds
  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage(""); // Hide popup
      }, 3000);
      return () => clearTimeout(timer); // Clear the timer on unmount
    }
  }, [popupMessage]);

  // Remove a specific name from the list
  const handleRemoveName = (index: number): void => {
    setNameList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Reset the entire name list
  const handleResetList = (): void => {
    setNameList([]);
    setPopupMessage("Name list has been reset!");
  };

  return (
    <div className="bg-slate-900 h-screen flex justify-center items-center relative">
      {/* Popup notification */}
      {popupMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-md shadow-lg">
          {popupMessage}
        </div>
      )}

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
    </div>
  );
}
