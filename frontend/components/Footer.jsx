"use client"
import Link from 'next/link';
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Copyright */}
                    <div className="text-sm text-gray-600 mb-4 md:mb-0">
                        © 2025 Multi Component Generator. All rights reserved.
                    </div>

                    {/* Footer Links */}
                    <div className="flex space-x-6">
                        <Link
                            href="#"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
