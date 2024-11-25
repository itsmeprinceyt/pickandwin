import Link from "next/link";

export default function MadeByMe() {
    return (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white animate-pulse">
            Made by💜
            <Link href="https://www.youtube.com/channel/UC9UQVp8grhcVatbMcf0sa5w"
                target="_blank">
                <button className="hover:animate-bounce underline">
                    @itsmeprinceyt
                </button>
            </Link>
        </div>
    );
}