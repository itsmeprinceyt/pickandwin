
import Image from "next/image";

interface HomeProps {
    color: string;
}

export default function Home({ color }: HomeProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = "/";
    };

    return (
        <div className="absolute top-5 transform left-5 text-white">
            <button className={`rounded-full p-2 ${color}`} onClick={handleClick}>
                <Image src="/home2.png" height={25} width={25} alt="home icon" />
            </button>
        </div>
    );
}
