"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import MadeByMe from "@/(components)/MadeByMe"
import HomeButton from "@/(components)/Home";
import confetti from "canvas-confetti";

const Winner = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const winnerName = searchParams.get("name");

    const [winner1, setWinner1] = useState<string>(() => localStorage.getItem("winner1") || "#22c55e");
    const [winner2, setWinner2] = useState<string>(() => localStorage.getItem("winner1") || "#14532d");

    useEffect(() => {
        localStorage.setItem("winner1", winner1);
        localStorage.setItem("winner2", winner2);
    }, [winner1, winner2]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWinner1(localStorage.getItem("winner1") || "#22c55e");
            setWinner2(localStorage.getItem("winner2") || "#14532d");
        }
    }, []);

    useEffect(() => {
        if (!winnerName) {
            router.push("/");
            return;
        }
        let confettiTimeout: NodeJS.Timeout;
        const launchConfetti = () => {
            confetti({
                particleCount: 300,
                spread: 200,
                origin: { y: 0.65 },
            });
            confettiTimeout = setTimeout(launchConfetti, Math.random() * (4000 - 2000) + 2000);
        };
        launchConfetti();
        return () => {
            clearTimeout(confettiTimeout);
        };
    }, [winnerName, router]);


    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center"
                style={{
                    background: `linear-gradient(to bottom, ${winner1}, ${winner2})`,
                }}>
                <div className="top-5 left-5">
                    <HomeButton color="bg-green-800" />
                </div>
                <div className="text-center animate-bounce pointer-events-none">
                    <h1 className="text-white text-4xl md:text-6xl font-bold mb-6">🥳 The Winner is 🎉</h1>
                    <div className="bg-white text-green-900 text-3xl md:text-5xl lg:text-8xl font-extrabold p-8 rounded-xl shadow-lg">
                        {winnerName}
                    </div>
                </div>
            </div>
            <div className="bottom-4 w-[250px]">
                <MadeByMe />
            </div>
        </>
    );
};

const WinnerPageWithSuspense = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Winner />
        </Suspense>
    );
};

export default WinnerPageWithSuspense;