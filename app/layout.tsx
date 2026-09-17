import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import ViewportGuard from "@/components/ViewportGuard";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                var p = window.location.pathname;
                var gameLevels = ['/reality', '/level-1', '/level-2', '/level-3', '/limbo', '/victory', '/level-1-return', '/level-2-return'];
                if (gameLevels.some(function(level) { return p.startsWith(level); })) {
                  window.location.href = '/computer-view';
                }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ViewportGuard />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
