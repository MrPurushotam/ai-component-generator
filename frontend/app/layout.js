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
      <head>
        <meta name="apple-mobile-web-app-title" content="AI:Component-Gen" />
        <meta name="google-site-verification" content="Hyq7_rXCrzF3ib_AhDf781L1pYQmFT7oZilFhKZVWCY" />
        <meta name="description" content="Ai powered react component generator which help you generate and render react component on the flight." />
        <meta name="keywords" content="AI, React, Component Generator, Code, Web Development, Automation" />
        <meta name="author" content="Ai-Component-Gen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Ai-Component-Gen" />
        <meta property="og:description" content="Ai powered react component generator which help you generate and render react component on the flight." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ai-Component-Gen" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ai-Component-Gen" />
        <meta name="twitter:description" content="Ai powered react component generator which help you generate and render react component on the flight." />
        <link rel="icon" href="/favicon.ico" />
      </head>
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
