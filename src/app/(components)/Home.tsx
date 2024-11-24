import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="absolute top-4 transform left-5 text-white">
            <Link href="/">
                <button>
                    <Image
                        src="/home.png"
                        height={15}
                        width={20}
                        alt="cross"
                    />
                </button>
            </Link>
        </div>
    );
}