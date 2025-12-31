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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Context>
          {children}
        </Context>
      </body>
    </html>
  );
}
