import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
    return (
        <>
            <nav className="py-4 md:py-7 relative top-0 w-full z-30 transition-all duration-300">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-6 items-center">
                        <div className="col-span-1 flex items-center gap-4">
                            <button className="md:hidden">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 9h16.5m-16.5 6.75h16.5"
                                    />
                                </svg>
                            </button>
                            <Link
                                to="/"
                                className="text-primary text-lg font-medium"
                            >
                                Food Hue
                            </Link>
                        </div>
                        <div className="col-span-4 hidden md:block">
                            <div className="flex justify-center gap-8 flex-wrap font-medium">
                                <a className="text-primary">Categories</a>
                                <a className="text-primary">Discover App</a>
                                <a className="text-primary">Delivery</a>
                            </div>
                        </div>
                        <div className="col-span-1 flex justify-end">
                            <a
                                href="/login"
                                className="bg-primary text-white text-sm sm:text-base px-5 sm:px-6 py-1.5 sm:py-2.5 rounded-full font-medium"
                            >
                                Get App
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navigation;
