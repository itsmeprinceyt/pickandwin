"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import HomeButton from "@/(components)/Home";
import Image from "next/image";
import confetti from "canvas-confetti";

const SpinWheel: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const namesParam = searchParams.get("names");
    const [names, setNames] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState(names.join("\n"));
    const [currentName, setCurrentName] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>();
    const lastIndexRef = useRef<number>(-1);
    const currentIndexRef = useRef<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [volume, setVolume] = useState(100);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [emoji, setEmoji] = useState("🤡");
    const emojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
        "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
        "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥳",
        "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖",
        "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯",
        "😳", "🥵", "🥶", "😶", "😐", "😑", "😬", "🙄", "😯", "😦",
        "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴",
        "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿",
        "👻", "💀", "☠️", "👽", "🤖", "💩", "🎃", "😺", "😸", "😹",
        "😻", "😼", "😽", "🙀", "😿", "😾", "❤", "💚", "💛", "💝",
        "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💖", "💘", "💗",
        "💓", "💞", "💕", "❣️", "💟", "🤡", "🥸",

        "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👏", "🙌",
        "👐", "🤲", "🤝", "🙏", "✋", "🤚", "🖐️", "🖖", "👋", "🤜",
        "🤛", "✊", "👊", "🤏", "🖕",

        "🍆", "🍑", "🍒", "🍌", "🥒", "🍉", "🍍", "🍇", "🥭", "☕",
        "🌭", "🍕", "🍔", "🥪", "🌮", "🌯", "🍗", "🍖", "🥩", "🥚",
        "🍯", "🍩", "🍪", "🍭", "🍬", "🍿", "🧂", "🧋", "🍵",

        "🚗", "🚙", "🚛", "🚜", "🏍️", "🚤", "🚁", "🚓", "🚑", "🚒",
        "🚂", "🚆", "🚡", "🛶", "🛳️", "✈️", "🚀", "🛩️", "🛻", "🚔",
        "🦽", "🦼",

        "🛸", "🦄", "🐙", "🦑", "🐍", "🐡", "🦠", "💊", "🧪", "🛁",
        "🚽", "🛎️", "🔞", "💣", "🗿", "🪑", "🎭", "🦷", "🦵", "🦶",
        "🧠", "👀", "🫦", "👅", "🫣", "🤌",

        "🩸", "💀", "🩻", "🧟", "🕳️", "🫃", "🫄", "👶", "🔪", "🦗",
        "🪳", "🪲", "🦠", "☢️", "☣️",

        "🔥"
    ];

    const [isArrowDown, setIsArrowDown] = useState(false);

    const [isChoosing, setIsChoosing] = useState<boolean>(false);
    const [angleOffset, setAngleOffset] = useState<number>(0);
    const [isIdle, setIsIdle] = useState(true);
    const idleSpeed = 0.002;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState("lastOneStanding");
    const [visualMode, setVisualMode] = useState<"text" | "emoji" | "special">("emoji");
    const specialDefaultImage = "/oie.png";
    const specialSpinImage = "/oie_loop_cropped.gif";

    const [autoRemove, setAutoRemove] = useState(false);
    const [autoRemoveText, setAutoRemoveText] = useState("Auto-Remove: OFF");
    const [timeoutDuration, setTimeoutDuration] = useState(3);
    const [toggle, setToggle] = useState(false);
    const [panelToggle, setPanelToggle] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [canvasSize, setCanvasSize] = useState(0);

    const [gradient1, setGradient1] = useState<string>(() => localStorage.getItem("gradient1") || "#9f7aea");
    const [gradient2, setGradient2] = useState<string>(() => localStorage.getItem("gradient2") || "#581c87");

    const [winner1, setWinner1] = useState<string>(() => localStorage.getItem("winner1") || "#22c55e");
    const [winner2, setWinner2] = useState<string>(() => localStorage.getItem("winner1") || "#14532d");

    const [highlightColor1, setHighlightColor1] = useState<string>(() => localStorage.getItem("highlightColor1") || "#ff0000");
    const [highlightColor2, setHighlightColor2] = useState<string>(() => localStorage.getItem("highlightColor2") || "#134dfb");
    const [highlightColor3, setHighlightColor3] = useState<string>(() => localStorage.getItem("highlightColor3") || "#13a300");
    //const [arrow, setArrow] = useState<string>(() => localStorage.getItem("arrow") || "#000000");
    const [participantsColor, setParticipantsColor] = useState<string>(() => localStorage.getItem("participantsColor") || "#FFFFFF");
    const [selectedPalette, setSelectedPalette] = useState<number | null>(null);

    const colorPalettes: Record<number, string[]> = {
        1: ["#FF5733", "#FF8D1A", "#FFC300"], // Shades of red/orange/yellow
        2: ["#3498DB", "#2980B9", "#1B4F72"], // Shades of blue
        3: ["#E100FF", "#6A00A3", "#FEB3FF"]  // Shades of purple
    };

    useEffect(() => {
        localStorage.setItem("gradient1", gradient1);
        localStorage.setItem("gradient2", gradient2);

        localStorage.setItem("winner1", winner1);
        localStorage.setItem("winner2", winner2);

        localStorage.setItem("highlightColor1", highlightColor1);
        localStorage.setItem("highlightColor2", highlightColor2);
        localStorage.setItem("highlightColor3", highlightColor3);
        //localStorage.setItem("arrow", arrow);
        localStorage.setItem("participantsColor", participantsColor);
    }, [gradient1, gradient2,winner1,winner2, highlightColor1, highlightColor2, highlightColor3, participantsColor]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setGradient1(localStorage.getItem("gradient1") || "#9f7aea");
            setGradient2(localStorage.getItem("gradient2") || "#581c87");

            setWinner1(localStorage.getItem("winner1") || "#22c55e");
            setWinner2(localStorage.getItem("winner2") || "#14532d");

            setHighlightColor1(localStorage.getItem("highlightColor1") || "#ff0000");
            setHighlightColor2(localStorage.getItem("highlightColor2") || "#134dfb");
            setHighlightColor3(localStorage.getItem("highlightColor3") || "#13a300");
            //setArrow(localStorage.getItem("arrow") || "#000000");
            setParticipantsColor(localStorage.getItem("participantsColor") || "#FFFFFF");
        }
    }, []);

    useEffect(() => {
        if (names.length === 1) {
            router.push(`/winner?name=${encodeURIComponent(names[0])}`);
        }
    }, [names, router]);

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
                newSize = 325;
            } else if (screenSize < 800) {
                newSize = 500;
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
        if (!isIdle) return;
        let idleAnimation: number;
        const animateIdle = () => {
            setAngleOffset((prevAngle) => (prevAngle + idleSpeed) % (2 * Math.PI));
            idleAnimation = requestAnimationFrame(animateIdle);
        };
        idleAnimation = requestAnimationFrame(animateIdle);
        return () => cancelAnimationFrame(idleAnimation);
    }, [isIdle]);

    useEffect(() => {
        if (!isChoosing && currentIndex !== undefined) {
            setShowPopup(true);
        }
    }, [isChoosing, currentIndex]);

    useEffect(() => {
        const audio = new Audio("/sound/tick.mp3");
        audio.load();
        audioRef.current = audio;
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

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

    const toggleSound = () => {
        setIsSoundOn((prev) => !prev);
    };

    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvasSize) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const radius = canvasSize / 2;
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;

        canvas.width = canvasSize * dpr;
        canvas.height = canvasSize * dpr;
        canvas.style.width = `${canvasSize}px`;
        canvas.style.height = `${canvasSize}px`;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, canvasSize, canvasSize);

        const numSlices = names.length;
        if (numSlices === 0) return;

        const angleStep = (2 * Math.PI) / numSlices;
        const colors = [highlightColor1, highlightColor2, highlightColor3];
        let colorIndex = 0;
        const isOdd = names.length % colors.length !== 0;
        names.forEach((name, i) => {
            const startAngle = angleOffset + i * angleStep;
            const endAngle = angleOffset + (i + 1) * angleStep;

            ctx.fillStyle = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;
            if (isOdd && i === names.length - 2) {
                colorIndex = (colorIndex + 1) % colors.length;
            }

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "transparent";
            ctx.stroke();


            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + angleStep / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = participantsColor;
            let textsize = 30;
            if (names.length >= 100) {
                textsize = 45;
            } else if (names.length >= 50) {
                textsize = 35;
            } else if (names.length >= 30) {
                textsize = 32;
            } else if (names.length >= 10) {
                textsize = 25;
            } else {
                textsize = 20;
            }
            ctx.font = `bold ${Math.max(12, canvasSize / textsize)}px Arial`;
            ctx.fillText(name, radius - 10, 5);
            ctx.restore();
        });

        //drawArrow(ctx, centerX, centerY, radius, arrow);

        // add 'arrow' in below array
    }, [names, angleOffset, canvasSize, highlightColor1, highlightColor2, highlightColor3, participantsColor]);

    /* =========================================================== */
    /* THIS WAS THE DEFAULT ARROW, IF YOU CHANGE SOMETHING USE THIS TO DEBUG THE EXACT ARROW LOCATION */
    /* =========================================================== */
    /*const drawArrow = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, arrowColor: string) => {
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
    };*/
    /* =========================================================== */

    useEffect(() => {
        drawWheel();
    }, [drawWheel]);

    const shuffleWheel = () => {
        if (isChoosing || names.length === 0) return;
        setIsIdle(false);
        setAngleOffset(0);
        setIsChoosing(true);

        const sliceAngle = (2 * Math.PI) / names.length;
        let angVel = Math.random() * 0.3 + 0.3;
        let ang = angleOffset;
        const spinTime = timeoutDuration * 1000;
        const start = performance.now();
        const animateSpin = (time: number) => {
            const elapsed = time - start;
            if (elapsed >= spinTime) {
                angVel = 0;
                ang %= 2 * Math.PI;
                setAngleOffset(ang);
                const arrowAngle = (0 - ang + 2 * Math.PI) % (2 * Math.PI);
                const selectedIndex = Math.floor(arrowAngle / sliceAngle) % names.length;
                setCurrentName(names[selectedIndex]);
                setCurrentIndex(selectedIndex);
                setIsChoosing(false);
                handleSpinEnd(selectedIndex);
                return;
            }
            const progress = elapsed / spinTime;
            const speedFactor = Math.pow(1 - progress, 4);
            const randomBoost = (1 - progress) * 0.2;
            angVel = (speedFactor * 0.8) + (progress < 0.4 ? randomBoost : 0);
            angVel = Math.max(angVel, 0);

            ang += angVel;
            ang %= 2 * Math.PI;
            setAngleOffset(ang);

            const arrowAngle = (0 - ang + 2 * Math.PI) % (2 * Math.PI);
            const newIndex = Math.floor(arrowAngle / sliceAngle) % names.length;

            if (newIndex !== lastIndexRef.current) {
                setIsArrowDown(true);
                setTimeout(() => {
                    setIsArrowDown(false);
                }, 80);

                if (isSoundOn && audioRef.current) {
                    const sound = audioRef.current.cloneNode() as HTMLAudioElement;
                    sound.volume = volume / 100;
                    sound.play().catch((err) => console.log("Sound Error:", err));
                }

                const randomIndex = Math.floor(Math.random() * emojis.length);
                setEmoji(emojis[randomIndex]);
            }

            currentIndexRef.current = newIndex;
            lastIndexRef.current = newIndex;

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
        launchConfetti();
        setCurrentIndex(selectedIndex);
        setIsChoosing(false);

        if (autoRemove) {
            removeName(selectedIndex);
        }
    };

    const resetDefaultColor = () => {
        setHighlightColor1("#ff0000");
        setHighlightColor2("#134dfb");
        setHighlightColor3("#13a300");
        //setArrow("#000000");
        setParticipantsColor("#FFFFFF");
        setSelectedPalette(null);
    }
    const resetDefaultColor2 = () => {
        setGradient1("#9f7aea");
        setGradient2("#581c87");
    }

    const resetDefaultColor3 = () => {
        setWinner1("#22c55e");
        setWinner2("#14532d");
    }

    const handleColorPallete = (paletteNumber: number) => {
        setSelectedPalette(paletteNumber);
        setHighlightColor1(colorPalettes[paletteNumber][0]);
        setHighlightColor2(colorPalettes[paletteNumber][1]);
        setHighlightColor3(colorPalettes[paletteNumber][2]);
    };

    const handleEmojiChange = () => {
        const randomIndex = Math.floor(Math.random() * emojis.length);
        setEmoji(emojis[randomIndex]);
    }
    const handlePanelOpen = () => {
        setPanelToggle((prev) => !prev);

        if (!panelToggle) {
            setInputValue(names.join("\n"));
        }
    };
    const handleUpdateName = (): void => {
        const newNames = inputValue
            .split(/[\n,]/)
            .map((name) => name.trim())
            .filter((name) => name !== "");

        const uniqueNames = Array.from(new Set(newNames));
        setNames(uniqueNames);
        setInputValue(uniqueNames.join("\n"));
        setPanelToggle(false);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    };

    const launchConfetti = () => {
        confetti({
            particleCount: 300,
            spread: 200,
            origin: { y: 0.65 },
        });
        if (visualMode === "special") {
            const audio = new Audio("/sound/oie.mp3");
            audio.volume = volume / 100;
            audio.play();
        }
    };
    return (
        <div>
            <div
                className="w-screen h-screen flex flex-col justify-center items-center relative"
                style={{
                    background: `linear-gradient(to bottom, ${gradient1}, ${gradient2})`,
                }}
            >
                <div className="top-5 left-5">
                    <HomeButton color="bg-black/30" />
                </div>
                <div className="absolute top-5 transform right-5 text-white">
                    <button
                        className="bg-black/30 rounded-full p-2"
                        onClick={() => setToggle(prev => !prev)}>
                        <Image
                            src="/settings.png"
                            height={25}
                            width={25}
                            alt="cross"
                        />
                    </button>
                </div>
                <div className="absolute top-20 transform right-5 text-white">
                    <button
                        className="bg-black/30 rounded-full p-2"
                        onClick={handlePanelOpen}>
                        <Image
                            className="invert"
                            src="/panel.png"
                            height={25}
                            width={25}
                            alt="cross"
                        />
                    </button>
                </div>

                {/* Settings */}
                {toggle && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center">
                        <div className="relative bg-purple-600 border-2 border-white/30 text-white flex flex-col justify-center gap-5 items-center p-5 py-10 md:p-8 rounded-xl shadow-xl shadow-white/20 max-w-[90vw] max-h-[90vh] overflow-y-auto">
                            {/* To Close Pop up Setting*/}
                            <button
                                onClick={() => setToggle(prev => !prev)}
                                className="absolute top-3 right-3 hover:scale-125 transition-all ease-in-out">
                                <Image src="/cross.png" width={10} height={20} alt="Close" />
                            </button>

                            <div className="overflow-y-auto scrollbar-thin scrollbar- scrollbar-track-violet-500 scrollbar-thumb-white p-2 max-h-[80vh] w-full flex flex-col gap-5">
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

                                {/* Slice Colors Container*/}
                                <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-4 relative">
                                {/* Reset to default */}
                                    <button className="absolute right-2 top-2 scale-50 hover:scale-75"
                                        onClick={resetDefaultColor}>
                                        <Image
                                            className="invert"
                                            src="/reload.png"
                                            height={25}
                                            width={25}
                                            alt="Reload"
                                        />
                                    </button>
                                    {/* Slice Colors */}
                                    <div className="text-4xl font-bold">Slice Colors</div>
                                    <div className="flex gap-4">
                                        {[highlightColor1, highlightColor2, highlightColor3].map((color, index) => (
                                            <label key={index} className="relative cursor-pointer">
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => {
                                                        setSelectedPalette(null);
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
                                        {/* Arrow Color */}
                                        {/*<div className="flex flex-col justify-center items-center text-center">
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
                                    </div>*/}

                                        <div className="flex flex-col justify-center items-center gap-5 text-center">
                                            {/* Participants Color */}
                                            <div className="flex items-center justify-center gap-5">
                                                <div className="text-sm font-bold ">Participants Color</div>
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

                                            <div className="flex gap-5">
                                                {[1, 2, 3].map((num) => (
                                                    <button
                                                        key={num}
                                                        className={`w-[50px] py-2 rounded-lg font-semibold shadow-lg transition-all duration-200`}
                                                        style={{
                                                            backgroundColor: selectedPalette === num ? colorPalettes[num][0] : "#808080",
                                                            boxShadow: selectedPalette === num ? `0px 4px 10px ${colorPalettes[num][1]}` : "0px 4px 10px rgba(0, 0, 0, 0.3)"
                                                        }}
                                                        onClick={() => handleColorPallete(num)}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Background Color Container */}
                                <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-4 relative">
                                    {/* Reset Default */}
                                    <button className="absolute right-2 top-2 scale-50 hover:scale-75"
                                        onClick={resetDefaultColor2}>
                                        <Image
                                            className="invert"
                                            src="/reload.png"
                                            height={25}
                                            width={25}
                                            alt="Reload"
                                        />
                                    </button>
                                    {/* Background Colors */}
                                    <div className="text-4xl font-bold">Background</div>
                                    <div className="flex gap-4">
                                        {[gradient1, gradient2].map((color, index) => (
                                            <label key={index} className="relative cursor-pointer">
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => index === 0 ? setGradient1(e.target.value) : setGradient2(e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <div
                                                    className="w-10 h-10 rounded-md border border-white"
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Winner Color Container */}
                                <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-4 relative">
                                    {/* Reset Default */}
                                    <button className="absolute right-2 top-2 scale-50 hover:scale-75"
                                        onClick={resetDefaultColor3}>
                                        <Image
                                            className="invert"
                                            src="/reload.png"
                                            height={25}
                                            width={25}
                                            alt="Reload"
                                        />
                                    </button>
                                    {/* Winner Colors */}
                                    <div className="text-4xl font-bold">Win Color</div>
                                    <div className="flex gap-4">
                                        {[winner1, winner2].map((color, index) => (
                                            <label key={index} className="relative cursor-pointer">
                                                <input
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => index === 0 ? setWinner1(e.target.value) : setWinner2(e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                <div
                                                    className="w-10 h-10 rounded-md border border-white"
                                                    style={{ backgroundColor: color }}
                                                ></div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Auto - Remove */}
                                <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-5">
                                    <button
                                        className={`w-[230px] py-2 rounded-lg font-semibold shadow-lg ${autoRemove
                                            ? "bg-lime-500 shadow-lime-500/30"
                                            : "bg-gray-500 shadow-gray-900/30"
                                            }`}
                                        onClick={toggleAutoRemove}
                                    >
                                        {autoRemoveText}
                                    </button>
                                </div>

                                {/* Sound ON & OFF */}
                                <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-2">
                                    <button
                                        className={`w-[230px] py-2 rounded-lg font-semibold shadow-lg ${isSoundOn
                                            ? "bg-lime-500 shadow-lime-500/30"
                                            : "bg-gray-500 shadow-gray-900/30"
                                            }`}
                                        onClick={toggleSound}
                                    >
                                        {isSoundOn ? "Sound: ON" : "Sound: OFF"}
                                    </button>

                                    <div className="text-sm font-bold mt-1">Volume: {volume}%</div>
                                    <input
                                        id="timeoutSlider"
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={volume}
                                        disabled={!isSoundOn}
                                        onChange={handleVolumeChange}
                                        className="w-[150px] h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer active:bg-purple-400"
                                    />
                                </div>

                                {/* Spin Visual */}
                                <div className="w-[320px] bg-black/30 border-2 border-purple-900 shadow-lg shadow-black/20 p-5 rounded-lg flex flex-col items-center gap-2">
                                    <div className="text-4xl font-bold">Spin Visual</div>
                                    <div className="flex flex-col items-start gap-1" id="mode-selector">
                                        <label
                                            className={`flex items-center space-x-4 text-white ${visualMode === "text" ? "animate-pulse" : ""}`}
                                            id="text-label"
                                        >
                                            <input
                                                type="radio"
                                                name="visualMode"
                                                value="text"
                                                id="text-radio"
                                                checked={visualMode === "text"}
                                                onChange={() => setVisualMode("text")}
                                                className="form-radio text-purple-500"
                                            />
                                            <span>Text</span>
                                        </label>
                                        <label
                                            className={`flex items-center space-x-4 text-white ${visualMode === "emoji" ? "animate-pulse" : ""}`}
                                            id="emoji-label"
                                        >
                                            <input
                                                type="radio"
                                                name="visualMode"
                                                value="emoji"
                                                id="emoji-radio"
                                                checked={visualMode === "emoji"}
                                                onChange={() => setVisualMode("emoji")}
                                                className="form-radio text-purple-500"
                                            />
                                            <span>Emoji</span>
                                        </label>
                                        <label
                                            className={`flex items-center space-x-4 text-white ${visualMode === "special" ? "animate-pulse" : ""}`}
                                            id="special-label"
                                        >
                                            <input
                                                type="radio"
                                                name="visualMode"
                                                value="special"
                                                id="special-radio"
                                                checked={visualMode === "special"}
                                                onChange={() => setVisualMode("special")}
                                                className="form-radio text-purple-500"
                                            />
                                            <span>Special</span>
                                        </label>
                                    </div>
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
                    </div>
                )}

                {/* Main Container */}
                <div className="h-screen flex items-center justify-center gap-2">

                    {/* Pop Up Remove */}
                    <div className="z-30">
                        {showPopup && currentIndex !== undefined && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/70">
                                <div className="p-8 rounded-lg shadow-lg text-center relative bg-white border-2 border-white/30 flex items-center flex-col gap-4">
                                    <div className="flex flex-col text-black">
                                        <p className="font-extralight ">
                                            Chosen:
                                        </p>
                                        <p className="text-4xl p-4 px-20 font-semibold">{names[currentIndex]}</p>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            className="bg-purple-600 shadow-lg shadow-purple-600/60 text-white w-[100px] px-4 py-2 rounded-md hover:scale-105"
                                            onClick={() => setShowPopup(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="bg-red-500 shadow-lg shadow-red-500/60 text-white w-[100px] px-4 py-2 rounded-md hover:scale-105"
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

                    <div className=" flex justify-center items-center gap-14 flex-col lg:flex-row">

                        {/* Wheel Div*/}
                        <div className="flex flex-col justify-center items-center gap-2">

                            {/* Top Name Counter */}
                            <div className="text-4xl font-semibold bg-black/30 p-2 px-6 rounded-lg text-center flex justify-center items-center" style={{ color: participantsColor }}>
                                {isChoosing ? names[currentIndexRef.current] : emoji}
                            </div>

                            {/* Main WHEEL */}
                            <div className="relative">

                                {/* Center Spin Button */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <button
                                        className="bg-white text-black hover:shadow-lg hover:shadow-white/30 hover:scale-105 ease-linear duration-75 w-[90px] h-[90px] font-semibold rounded-full shadow-lg shadow-black/10"
                                        onClick={shuffleWheel}
                                        disabled={isChoosing}
                                    >
                                        {visualMode === "text" && (isChoosing ? "Spinning..." : "Spin")}
                                        {visualMode === "emoji" && (isChoosing ? emoji : "Spin")}
                                        {visualMode === "special" && (
                                            <Image
                                                src={isChoosing ? specialSpinImage : specialDefaultImage}
                                                width={200}
                                                height={200}
                                                alt="Spin"
                                                className="w-full h-full object-contain scale-75"
                                            />
                                        )}
                                    </button>
                                </div>

                                {/* EMOJI */}
                                <button className="z-10 absolute top-1/2 -right-7 translate-y-[-50%] translate-x-[50%]" onClick={handleEmojiChange}>{emoji}</button>
                                {/* Arrow */}
                                <div
                                    className={`absolute top-1/2 right-0 translate-y-[-50%] translate-x-[50%] pointer-events-none transition-transform duration-150 origin-right ${isArrowDown ? "-rotate-6" : "rotate-0"
                                        }`}
                                >
                                    <Image
                                        src="/arrow-final.png"
                                        height={100}
                                        width={100}
                                        alt="Pointer Arrow"
                                    />
                                </div>
                                {/* Wheel Canvas */}
                                <canvas ref={canvasRef} className=" border-8 border-white rounded-full shadow-lg shadow-black/30" />
                            </div>
                        </div>
                        <div className="z-30">



                            {/* Input Field */}
                            {panelToggle && (
                                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 gap-2">
                                    <div className="relative bg-white border-2 border-white/30 text-white p-4 flex flex-col justify-center items-center rounded-xl shadow-xl shadow-white/20 gap-4">
                                        <div className="text-xl font-extralight text-black">Participants List</div>
                                        <div className="rounded-lg shadow-lg text-center relative bg-white border-2 border-white/30 flex items-center flex-col gap-4">
                                            <textarea
                                                className="rounded-l-xl rounded-t-xl rounded-b-xl rounded-tr-none rounded-br-none border border-purple-600 shadow-lg shadow-purple-600/30 w-[300px] h-[400px] p-2 focus:outline-none scrollbar-thin scrollbar-track-violet-500 scrollbar-thumb-white text-black "
                                                style={{ resize: "none" }}
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)} // Update state on edit
                                                placeholder="Enter names, separated by commas or new lines."
                                            />
                                        </div>
                                        <div className="flex gap-5">
                                            {/* Close button */}
                                            <button
                                                className="bg-purple-600 shadow-lg shadow-purple-600/60 text-white w-[100px] px-4 py-2 rounded-md hover:scale-105"
                                                onClick={() => setPanelToggle(false)}
                                            >
                                                Close
                                            </button>

                                            {/* Reset button */}
                                            <button className="bg-red-500 shadow-lg shadow-red-500/60 text-white w-[100px] px-4 py-2 rounded-md hover:scale-105"
                                                onClick={handleUpdateName}>
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


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
