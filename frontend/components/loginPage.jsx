"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../store/slices/authSlice';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading, error, user } = useSelector((state) => state.auth);
  const googleInitialized = useRef(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !googleInitialized.current && !scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        scriptLoaded.current = true;
        if (window.google?.accounts?.id && !googleInitialized.current) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false
          });

          const buttonDiv = document.getElementById('googleSignInDiv');
          if (buttonDiv) {
            window.google.accounts.id.renderButton(buttonDiv, {
              theme: 'outline',
              size: 'large'
            });
          }
          googleInitialized.current = true;
        }
      };

      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);
  const handleCredentialResponse = async (response) => {
    try {
      let result = await dispatch(loginUser(response.credential));
      if(loginUser.fulfilled.match(result)){
        if (typeof window !== "undefined") {
          localStorage.setItem("authorized",true);
        }
        router.push("/chat")
      }
    } catch (err) {
      console.error('Login failed:', err);
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    }
  };

  const handleGoogleSignIn = () => {
    window.google.accounts.id.prompt();
  };

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

      googleInitialized.current = false;
      scriptLoaded.current = false;
      await dispatch(logoutUser());
      if (typeof window !== "undefined") {
        localStorage.removeItem("authorized");
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-medium text-gray-900 mb-8">
              {isLoggedIn ? `Welcome, ${user?.username || user?.email}!` : 'Sign in'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {isLoggedIn ? (
              <div>
                <p className="text-gray-700 mb-4">You are currently logged in.</p>
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="mx-auto rounded-full w-24 h-24 mb-4"
                  />
                )}
                <p className="text-gray-700 mb-2">Email: {user?.email}</p>
                <p className="text-gray-700 mb-4">Your App User ID: {user?.userId}</p>
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Logout
                </button>
                <button
                  onClick={() => router.push("/chat")}
                  className="mt-4 w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Go to Chat
                </button>
              </div>
            ) : (
              <>
                <div id="googleSignInDiv" className="mb-4"></div>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;