"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import MadeByMe from "@/app/(components)/MadeByMe";
import HomeButton from "@/app/(components)/Home";

const Winner = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const winnerName = searchParams.get("name"); 

    useEffect(() => {
        if (!winnerName) {
            router.push("/");
        }
    }, [winnerName, router]);

    return (
        <div className="w-screen h-screen bg-gradient-to-b from-green-500 to-green-900 flex justify-center items-center">
            <HomeButton color="bg-green-800" />

            <div className="text-center animate-bounce">
                <h1 className="text-white text-4xl md:text-6xl font-bold mb-6">🥳 The Winner is 🎉</h1>
                <div className="bg-white text-green-900 text-3xl md:text-5xl lg:text-8xl font-extrabold p-8 rounded-xl shadow-lg">
                    {winnerName}
                </div>
            </div>

            <MadeByMe />
        </div>
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
