import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pick And Win - ItsMe Prince",
  description: "Pick and Win is a simple tool for selecting giveaway winners. It allows you to input participant names, shuffle them, and randomly pick a winner. Perfect for content creators hosting giveaways, Pick and Win streamlines the process of selecting a fair winner quickly and easily.",
  icons: {
    icon: "/PickAndWinLogo.png",
  },
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
