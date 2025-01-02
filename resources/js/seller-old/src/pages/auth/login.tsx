import { BASE_URL } from "@/env";
import React from "react";

const LoginPage = () => {
    return (
        <>
            <main className="bg-primary-100 dark:bg-gray-900">
                <div className="flex flex-col justify-center items-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
                    <a
                        href="../../"
                        className="flex justify-center items-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
                    >
                        <img
                            src={`${BASE_URL}/images/logos/logo-black.png`}
                            className="mr-4 h-11"
                            alt="FlowBite Logo"
                        />
                    </a>

                    <div className="justify-center items-center w-full bg-white rounded-lg shadow lg:flex md:mt-0 lg:max-w-screen-lg 2xl:max:max-w-screen-lg xl:p-0 dark:bg-gray-800">
                        <div className="hidden w-2/3 lg:flex">
                            <img
                                className="rounded-l-lg"
                                src={`${BASE_URL}/images/seller/login.jpg`}
                                alt="login image"
                            />
                        </div>
                        <div className="p-6 space-y-8 w-full sm:p-8 lg:p-16 lg:py-0">
                            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                                Sign in to platform
                            </h2>
                            <form className="mt-8 space-y-6" action="#">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Your email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Your password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        required
                                    />
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            name="remember"
                                            type="checkbox"
                                            className="w-4 h-4 bg-gray-50 rounded border-gray-300 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                            required
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="font-medium text-gray-900 dark:text-white"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
                                    >
                                        Lost Password?
                                    </a>
                                </div>
                                <button
                                    type="submit"
                                    className="py-3 px-5 w-full text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Login to your account
                                </button>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Not registered?{" "}
                                    <a className="text-primary-700 hover:underline dark:text-primary-500">
                                        Create account
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default LoginPage;
