import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Context from "./AppContext/Context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VacaGest",
  description: "VacaGest - Gestion des enseignants vacataires",
  openGraph: {
    title: "VacaGest",
    description: "VacaGest - Gestion des enseignants vacataires",
    url: "https://vacagest.netlify.app/",
    images: [
      {
        url: "https://vacagest.netlify.app/VacaGest-Meta.png",
        width: 1366,
        height: 768,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VacaGest",
    description:
      "VacaGest - Gestion des enseignants vacataires",
    creator: "@mahdii_Dz",
    image: ["https://vacagest.netlify.app/VacaGest-Meta.png",],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Context>
          {children}
        </Context>
      </body>
    </html>
  );
}
