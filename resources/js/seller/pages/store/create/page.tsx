import { BASE_IMAGE_URL } from "@/env";
import { BlockBreadcrumb } from "@/seller/components/blocks/block-breadcrumb";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import React from "react";
import { HiLockOpen } from "react-icons/hi";
import { Link } from "react-router-dom";
import { ChooseAccountTypeUserOnboarding } from "./account-type";

export default function StoreCreatePage() {
    return (
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:min-h-screen">
            <Link
                to="/"
                className="mb-8 flex items-center justify-center text-2xl font-semibold lg:mb-10 dark:text-white"
            >
                <img
                    alt=""
                    src={`${BASE_IMAGE_URL}/logos/logo-black.png`}
                    width={43}
                    height={44}
                    className="mr-4 h-11 w-auto dark:hidden"
                />
                <img
                    alt=""
                    src={`${BASE_IMAGE_URL}/logos/logo-white.png`}
                    width={43}
                    height={44}
                    className="mr-4 h-11 w-auto hidden dark:block"
                />
            </Link>
            <Card
                className="w-full sm:max-w-screen-sm md:max-w-screen-sm md:flex-row"
                theme={{ root: { children: "w-full p-6 sm:p-8 md:p-16" } }}
            >
                <div className="w-full">
                    <div className="mb-8 flex items-center justify-center space-x-4 lg:hidden">
                        <a
                            href="#"
                            className="flex items-center text-2xl font-semibold"
                        >
                            <img
                                alt=""
                                className="mr-2 h-8 w-8"
                                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                            />
                            <span className="text-gray-900 dark:text-white">
                                Flowbite
                            </span>
                        </a>
                    </div>
                    <ol className="mb-6 flex items-center text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base lg:mb-12">
                        <li className="flex items-center text-primary-600 after:mx-6 after:hidden after:h-1 after:w-12 after:border-b after:border-gray-200 dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] xl:after:mx-10">
                            <div className="flex items-center after:mx-2 after:after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden md:flex-col">
                                <svg
                                    className="mr-2 h-4 w-4 shrink-0 sm:mx-auto sm:mb-2 sm:h-6 sm:w-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>
                                    Personal{" "}
                                    <span className="hidden sm:inline-flex">
                                        Info
                                    </span>
                                </span>
                            </div>
                        </li>
                        <li className="flex items-center text-primary-600 after:mx-6 after:hidden after:h-1 after:w-12 after:border-b after:border-gray-200 after:content-[''] dark:text-primary-500 dark:after:border-gray-700 sm:after:inline-block xl:after:mx-10">
                            <div className="flex items-center after:mx-2 after:after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden md:flex-col">
                                <svg
                                    className="mr-2 h-4 w-4 shrink-0 sm:mx-auto sm:mb-2 sm:h-6 sm:w-6"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>
                                    Account{" "}
                                    <span className="hidden sm:inline-flex">
                                        Info
                                    </span>
                                </span>
                            </div>
                        </li>
                        <li className="flex items-center sm:block">
                            <div className="mr-2 sm:mx-auto sm:mb-2">3</div>
                            Confirmation
                        </li>
                    </ol>
                    <h1 className="mb-2 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
                        Verify your email address
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        We emailed you a six-digit code to&nbsp;
                        <span className="font-medium text-gray-900 dark:text-white">
                            name@company.com
                        </span>
                        . Enter the code below to confirm your email address.
                    </p>
                    <form action="#">
                        <div className="my-4 flex space-x-2 sm:space-x-4 md:my-6">
                            <div>
                                <label htmlFor="code-1" className="sr-only">
                                    First code
                                </label>
                                <input
                                    id="code-1"
                                    maxLength={1}
                                    onKeyUp={() =>
                                        (
                                            document.querySelector(
                                                "#code-2"
                                            ) as HTMLInputElement
                                        )?.focus()
                                    }
                                    required
                                    type="text"
                                    className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                                />
                            </div>
                            <div>
                                <label htmlFor="code-2" className="sr-only">
                                    Second code
                                </label>
                                <input
                                    id="code-2"
                                    maxLength={1}
                                    onKeyUp={() =>
                                        (
                                            document.querySelector(
                                                "#code-3"
                                            ) as HTMLInputElement
                                        )?.focus()
                                    }
                                    type="text"
                                    required
                                    className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                                />
                            </div>
                            <div>
                                <label htmlFor="code-3" className="sr-only">
                                    Third code
                                </label>
                                <input
                                    type="text"
                                    maxLength={1}
                                    id="code-3"
                                    onKeyUp={() =>
                                        (
                                            document.querySelector(
                                                "#code-4"
                                            ) as HTMLInputElement
                                        )?.focus()
                                    }
                                    className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="code-4" className="sr-only">
                                    Fourth code
                                </label>
                                <input
                                    id="code-4"
                                    maxLength={1}
                                    onKeyUp={() =>
                                        (
                                            document.querySelector(
                                                "#code-5"
                                            ) as HTMLInputElement
                                        )?.focus()
                                    }
                                    required
                                    type="text"
                                    className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                                />
                            </div>
                            <div>
                                <label htmlFor="code-5" className="sr-only">
                                    Fifth code
                                </label>
                                <input
                                    id="code-5"
                                    maxLength={1}
                                    onKeyUp={() =>
                                        (
                                            document.querySelector(
                                                "#code-6"
                                            ) as HTMLInputElement
                                        )?.focus()
                                    }
                                    required
                                    type="text"
                                    className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                                />
                            </div>
                            <div>
                                <label htmlFor="code-6" className="sr-only">
                                    Sixth code
                                </label>
                                <input
                                    type="text"
                                    maxLength={1}
                                    id="code-6"
                                    className="block h-12 w-12 rounded-lg border border-gray-300 bg-white py-3 text-center text-2xl font-extrabold text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:h-16 sm:w-16 sm:py-4 sm:text-4xl"
                                    required
                                />
                            </div>
                        </div>
                        <p className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400 md:mb-6">
                            Make sure to keep this window open while checking
                            your inbox.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                color="gray"
                                href="#"
                                size="xl"
                                className="hover:bg-gray-100 hover:text-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white [&>span]:py-4 [&>span]:text-sm"
                            >
                                Prev: Account Info
                            </Button>
                            <Button
                                type="submit"
                                size="xl"
                                className="[&>span]:text-sm"
                            >
                                Verify account
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
}
