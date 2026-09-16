import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import { Alegreya, Almendra, Montserrat } from "next/font/google";
import "./globals.css";

const almendra = Almendra({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-almendra",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ["700", "900"],
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const alegreya = Alegreya({
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-alegreya",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dream Sequence",
  description: "Awaken Your Mind",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${almendra.variable} ${montserrat.variable} ${alegreya.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
