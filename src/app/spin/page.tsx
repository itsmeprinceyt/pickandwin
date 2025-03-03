"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import HomeButton from "@/(components)/Home";
import Image from "next/image";

const SpinWheel: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const namesParam = searchParams.get("names");

    const [names, setNames] = useState<string[]>([]);
    const [currentName, setCurrentName] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>();
    const [isChoosing, setIsChoosing] = useState<boolean>(false);
    const [angleOffset, setAngleOffset] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mode, setMode] = useState("lastOneStanding");
    const [autoRemove, setAutoRemove] = useState(false);
    const [autoRemoveText, setAutoRemoveText] = useState("Auto-Remove: OFF");
    const [timeoutDuration, setTimeoutDuration] = useState(3);
    const [toggle, setToggle] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    useEffect(() => {
        if (!isChoosing && currentIndex !== undefined) {
            setShowPopup(true); // Show popup when spinning stops
        }
    }, [isChoosing, currentIndex]);

    const [canvasSize, setCanvasSize] = useState(0);

    const [highlightColor1, setHighlightColor1] = useState<string>(() => localStorage.getItem("highlightColor1") || "#ff0000");
    const [highlightColor2, setHighlightColor2] = useState<string>(() => localStorage.getItem("highlightColor2") || "#134dfb");
    const [highlightColor3, setHighlightColor3] = useState<string>(() => localStorage.getItem("highlightColor3") || "#13a300");
    const [arrow, setArrow] = useState<string>(() => localStorage.getItem("arrow") || "#000000");
    const [participantsColor, setParticipantsColor] = useState<string>(() => localStorage.getItem("participantsColor") || "#FFFFFF");

    useEffect(() => {
        localStorage.setItem("highlightColor1", highlightColor1);
        localStorage.setItem("highlightColor2", highlightColor2);
        localStorage.setItem("highlightColor3", highlightColor3);
        localStorage.setItem("arrow", arrow);
        localStorage.setItem("participantsColor", participantsColor);
    }, [highlightColor1, highlightColor2, highlightColor3, arrow, participantsColor]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setHighlightColor1(localStorage.getItem("highlightColor1") || "#ff0000");
            setHighlightColor2(localStorage.getItem("highlightColor2") || "#134dfb");
            setHighlightColor3(localStorage.getItem("highlightColor3") || "#13a300");
            setArrow(localStorage.getItem("arrow") || "#000000");
            setParticipantsColor(localStorage.getItem("participantsColor") || "#FFFFFF");
        }
    }, []);

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
        if (mode === "randomWinner" && currentName) {
            router.push(`/winner?name=${encodeURIComponent(currentName)}`);
        } else if (mode === "lastOneStanding" && names.length === 2 && currentName) {
            setNames((prevNames) => prevNames.filter((name) => name !== currentName));
            setCurrentName(null);
        }
    }, [mode, currentName, names, router]);

    useEffect(() => {
        const updateCanvasSize = () => {
            const screenSize = window.innerWidth;
            let newSize;
            if (screenSize < 600) {
                newSize = 250;
            } else if (screenSize < 800) {
                newSize = 400;
            } else {
                newSize = Math.min(750, screenSize * 0.8);
            }
            setCanvasSize(newSize);
        };
        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
        return () => {
            window.removeEventListener("resize", updateCanvasSize);
        };
    }, []);

    useEffect(() => {
        if (namesParam) {
            const decodedNames = decodeURIComponent(namesParam).split(",");
            setNames(decodedNames);
        } else {
            router.push("/");
        }
    }, [namesParam, router]);

    useEffect(() => {
        if (names.length === 1) {
            router.push(`/winner?name=${encodeURIComponent(names[0])}`);
        }
    }, [names, router]);

    const handleSettings = () => {
        if (toggle) {
            setToggle(false);
        } else {
            setToggle(true);
        }
    }

    const handleModeChange = (selectedMode: string) => {
        if (selectedMode === "randomWinner") {
            setAutoRemove(true);
            setAutoRemoveText("Random Winner is Activated");
        } else if (selectedMode === "lastOneStanding") {
            setAutoRemove(false);
            setAutoRemoveText("Auto-Remove: OFF");
        }
        setMode(selectedMode);
    };

    const toggleAutoRemove = () => {
        if (mode !== "randomWinner") {
            setAutoRemove((prev) => {
                const newAutoRemove = !prev;
                setAutoRemoveText(newAutoRemove ? "Auto-Remove: ON" : "Auto-Remove: OFF");
                return newAutoRemove;
            });
        }
    };

    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvasSize) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const radius = canvasSize / 2;
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        ctx.clearRect(0, 0, canvasSize, canvasSize);

        const numSlices = names.length;
        if (numSlices === 0) return;

        const angleStep = (2 * Math.PI) / numSlices;
        const colors = [highlightColor1, highlightColor2, highlightColor3];
        let colorIndex = 0;
        names.forEach((name, i) => {
            const startAngle = angleOffset + i * angleStep;
            const endAngle = angleOffset + (i + 1) * angleStep;


            ctx.fillStyle = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.stroke();


            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + angleStep / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = participantsColor;
            ctx.font = `${Math.max(12, canvasSize / 50)}px Arial`;
            ctx.fillText(name, radius - 10, 5);
            ctx.restore();
        });

        drawArrow(ctx, centerX, centerY, radius, arrow);
    }, [names, angleOffset, canvasSize, highlightColor1, highlightColor2, highlightColor3, arrow, participantsColor]);

    const drawArrow = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, arrowColor: string) => {
        const arrowOffset = 10;
        const arrowX = centerX + radius - arrowOffset;
        const arrowY = centerY;

        ctx.beginPath();

        ctx.fillStyle = arrowColor;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 20, arrowY - 10);
        ctx.lineTo(arrowX + 20, arrowY + 10);
        ctx.closePath();
        ctx.fill();
    };

    useEffect(() => {
        drawWheel();
    }, [drawWheel]);

    const shuffleWheel = () => {
        if (isChoosing || names.length === 0) return;
        setIsChoosing(true);

        const sliceAngle = (2 * Math.PI) / names.length;
        let angVel = Math.random() * 0.3 + 0.3;
        let ang = angleOffset;
        const spinTime = timeoutDuration * 1000;
        const friction = Math.pow(0.99, 3 / timeoutDuration);
        const start = performance.now();

        const animateSpin = (time: number) => {
            const elapsed = time - start;
            const progress = elapsed / spinTime;
            angVel *= friction - progress * 0.01;
            angVel *= friction;
            if (angVel < 0.002) angVel = 0;
            ang += angVel;
            ang %= 2 * Math.PI;
            setAngleOffset(ang);
            if (angVel > 0) {
                requestAnimationFrame(animateSpin);
            } else if (mode === "randomWinner") {
                setTimeout(() => {
                    const arrowAngle = (0 - ang + 2 * Math.PI) % (2 * Math.PI);
                    const selectedIndex = Math.floor(arrowAngle / sliceAngle) % names.length;
                    setCurrentName(names[selectedIndex]);
                    setCurrentIndex(selectedIndex);
                    setIsChoosing(false);
                    handleSpinEnd(selectedIndex);
                }, 400);
                return;
            } else {
                setTimeout(() => {
                    const arrowAngle = (0 - ang + 2 * Math.PI) % (2 * Math.PI);
                    const selectedIndex = Math.floor(arrowAngle / sliceAngle) % names.length;
                    handleSpinEnd(selectedIndex);
                }, 400);
            }
        };

        requestAnimationFrame(animateSpin);
    };

    const removeName = (index: number) => {
        setNames((prevNames) => prevNames.filter((_, i) => i !== index));
        setIsChoosing(false);
        setCurrentIndex(undefined);
    };

    const handleSpinEnd = (selectedIndex: number) => {
        setCurrentIndex(selectedIndex);
        setIsChoosing(false);

        if (autoRemove) {
            removeName(selectedIndex);
        }
    };

    return (
        <div>
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

                            {/* Spin duration */}
                            <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-2">
                                <div className="text-4xl font-bold">Spin Time</div>
                                <div className="flex flex-col items-center">
                                    <label htmlFor="timeoutSlider" className="text-white font-bold mb-2"> {timeoutDuration} seconds
                                    </label>
                                    <input
                                        id="timeoutSlider"
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={timeoutDuration}
                                        onChange={(e) => setTimeoutDuration(Number(e.target.value))}
                                        className="w-[150px] h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer active:bg-purple-400"
                                    />
                                </div>
                            </div>


                            <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-4">
                                {/* Slice Colors */}
                                <div className="text-4xl font-bold">Slice Colors</div>
                                <div className="flex gap-4">
                                    {[highlightColor1, highlightColor2, highlightColor3].map((color, index) => (
                                        <label key={index} className="relative cursor-pointer">
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => {
                                                    if (index === 0) setHighlightColor1(e.target.value);
                                                    if (index === 1) setHighlightColor2(e.target.value);
                                                    if (index === 2) setHighlightColor3(e.target.value);
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="w-10 h-10 rounded-md border border-white" style={{ backgroundColor: color }}></div>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex justify-center items-center text-2xl">
                                    <div className="flex flex-col justify-center items-center text-center">
                                        {/* Pointer color */}
                                        <div className="text-xl font-bold mt-4">Pointer Color</div>
                                        <label className="relative cursor-pointer">
                                            <input
                                                type="color"
                                                value={arrow}
                                                onChange={(e) => setArrow(e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="w-10 h-10 rounded-md border border-white" style={{ backgroundColor: arrow }}></div>
                                        </label>
                                    </div>

                                    <div className="flex flex-col justify-center items-center text-center">
                                        {/* Participants Color */}
                                        <div className="text-xl font-bold mt-4">Participants Color</div>
                                        <label className="relative cursor-pointer">
                                            <input
                                                type="color"
                                                value={participantsColor}
                                                onChange={(e) => setParticipantsColor(e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="w-10 h-10 rounded-md border border-white" style={{ backgroundColor: participantsColor }}></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Auto - Remove */}
                            <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center ">
                                <button
                                    className={`px-4 py-2 rounded-lg font-semibold shadow-lg ${autoRemove
                                        ? "bg-lime-500 shadow-lime-500/30"
                                        : "bg-gray-500 shadow-gray-900/30"
                                        }`}
                                    onClick={toggleAutoRemove}
                                >
                                    {autoRemoveText}
                                </button>
                            </div>

                            {/* Mode Selector */}
                            <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-2">
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
                {/* Main Container */}
                <div className="flex flex-col items-center gap-5">

                    <div className="z-10">
                        {showPopup && currentIndex !== undefined && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                                <div className="p-8 rounded-lg shadow-lg text-center relative bg-black/90 border-2 border-black shadow-black/50 flex items-center flex-col gap-4">
                                    <div className="flex flex-col text-white">
                                        <p className="font-extralight ">
                                            Selected user is:
                                        </p>
                                        <p className="text-2xl font-semibold">{names[currentIndex]}</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            className="bg-white shadow-lg shadow-white/30 px-4 py-2 rounded-md hover:scale-105"
                                            onClick={() => setShowPopup(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="bg-red-500 shadow-lg shadow-red-500/30 text-white px-4 py-2 rounded-md hover:scale-105"
                                            onClick={() => {
                                                removeName(currentIndex);
                                                setShowPopup(false);
                                            }}
                                        >Remove</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Wheel */}
                    <div className="relative">

                        {/* Center Image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <button
                                className="bg-white text-black hover:shadow-lg hover:shadow-white/30 hover:scale-105 ease-linear duration-75 w-[90px] h-[90px]  font-semibold rounded-full  shadow-lg shadow-black/10"
                                onClick={shuffleWheel}
                                disabled={isChoosing}
                            >
                                {isChoosing ? "Spinning" : "Spin"}
                            </button>
                        </div>
                        <canvas ref={canvasRef} className=" border border-white rounded-full shadow-lg shadow-black/30" />
                    </div>
                </div>
            </div>
        </div >
    );
};

const StartWheelWithSuspense = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SpinWheel />
        </Suspense>
    );
};

export default StartWheelWithSuspense;
