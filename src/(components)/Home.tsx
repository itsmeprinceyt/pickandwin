import Link from "next/link";
import Image from "next/image";

interface HomeProps {
    color: string;
}

export default function Home({ color }: HomeProps) {
    return (
        <div className="absolute top-5 transform left-5 text-white">
            <Link href="/">
                <button
                    className={`rounded-full p-2 ${color}`}
                >
                    <Image
                        src="/home2.png"
                        height={25}
                        width={25}
                        alt="cross"
                    />
                </button>
            </Link>
        </div>
    );
}