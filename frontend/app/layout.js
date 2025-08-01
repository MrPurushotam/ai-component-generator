import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "../lib/Provider";

export const metadata = {
  title: "Ai-Component-Gen",
  description: "Ai powered react component generator which help you generate and render react component on the flight.",
  keywords: ["AI", "React", "Component Generator", "Code", "Web Development", "Automation"],
  authors: [{ name: "Ai-Component-Gen" }],
  openGraph: {
    title: "Ai-Component-Gen",
    description: "Ai powered react component generator which help you generate and render react component on the flight.",
    type: "website",
    siteName: "Ai-Component-Gen",
    locale: "en_US",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ai-Component-Gen",
    description: "Ai powered react component generator which help you generate and render react component on the flight.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1",
  appleWebApp: {
    title: "AI:Component-Gen",
  },
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
     <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
