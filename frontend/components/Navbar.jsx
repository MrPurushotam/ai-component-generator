"use client"
import { fetchUserThunk, logoutUser } from '../store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Navbar = () => {
    const { isLoggedIn, isLoading, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [isAuth, setIsAuth] = React.useState(false);

    useEffect(() => {
        setIsAuth(localStorage.getItem("authorized") === "true");
    }, []);


    useEffect(() => {
        if (isAuth && !isLoading) {
            dispatch(fetchUserThunk());
        }
    }, [dispatch, isAuth, isLoggedIn]);

    const handleLogout = async () => {
        try {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.disableAutoSelect();
                if (user?.googleId) {
                    window.google.accounts.id.revoke(user.googleId, (done) => {
                        console.log('Google account access revoked:', done);
                    });
                }
            }

            // Dispatch logout action
            await dispatch(logoutUser());

            // Redirect to home/login page
            router.push("/");
        } catch (error) {
            console.error('Logout error:', error);
            // Fallback redirect
            router.push("/");
        }
    };
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-semibold text-gray-900 italic">
                            Ai-Component-Gen
                        </h1>
                    </div>

                    <div className="flex space-x-8">
                        <Link
                            href="/chat"
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Chat
                        </Link>
                        <Link
                            href="/history"
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            History
                        </Link>
                        {!isLoggedIn ? (
                            <Link
                                href="/login"
                                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Login
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-4">
                                {user && (
                                    <span className="text-gray-700 text-sm">
                                        Welcome, {user.username}
                                    </span>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-red-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
