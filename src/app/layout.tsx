import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pick And Win - ItsMe Prince",
  description: "Pick and Win helps you choose giveaway winners easily. Just add participant names, shuffle them, and pick a winner at random. It's perfect for content creators running giveaways and makes selecting a fair winner quick and simple.",
  icons: {
    icon: "/PickAndWinLogo.png",
  },
  keywords: "spin the wheel, spin the wheel,giveaway, winner, random, contest, pick, prize, selection tool, content creator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
