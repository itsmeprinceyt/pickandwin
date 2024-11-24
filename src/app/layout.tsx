import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pick And Win - ItsMe Prince",
  description:
    "Pick and Win helps you choose giveaway winners easily. Just add participant names, shuffle them, and pick a winner at random. It's perfect for content creators running giveaways and makes selecting a fair winner quick and simple.",
  icons: {
    icon: "/PickAndWinLogo.png",
    apple: "/PickAndWinLogo.png",
  },
  keywords:
    "spin the wheel, spin the wheel,giveaway, winner, random, contest, pick, prize, selection tool, content creator",
  openGraph: {
    title: "Pick And Win - ItsMe Prince",
    description:
      "Pick and Win helps you choose giveaway winners easily. Just add participant names, shuffle them, and pick a winner at random. It's perfect for content creators running giveaways and makes selecting a fair winner quick and simple.",
    images: [
      {
        url: "/PickAndWinLogo.png",
        width: 1200,
        height: 630,
        alt: "Pick And Win Logo",
      },
    ],
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/PickAndWinLogo.png" type="image/png" />

        <link rel="apple-touch-icon" href="/PickAndWinLogo.png" />

        <meta property="og:title" content={metadata.title as string} />
        <meta
          property="og:description"
          content={metadata.description as string}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
