"use client"
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'
import { ReduxStore } from '../store/index.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { usePathname } from "next/navigation.js";

const StoreProvider = ({ children }) => {
    const pathname = usePathname();
    const isChatPath = pathname === "/chat" || pathname.startsWith("/chat/");
    const shouldRenderNavbar = !isChatPath;
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <Provider store={ReduxStore}>
                <div className="flex flex-col h-screen">
                    {shouldRenderNavbar && <Navbar />}
                    <main className="flex-1">
                        {children}
                    </main>
                    {shouldRenderNavbar && <Footer />}
                </div>
            </Provider>
        </GoogleOAuthProvider>
    )
}

export default StoreProvider
