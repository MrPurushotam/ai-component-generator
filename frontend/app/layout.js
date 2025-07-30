import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "../lib/Provider";

export const metadata = {
  title: "Ai-Component-Gen",
  description: "Ai powered react component generator which help you generate and render react component on the flight.",
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
