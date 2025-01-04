import { BASE_IMAGE_URL } from "@/env";
import { BlockBreadcrumb } from "@/seller/components/blocks/block-breadcrumb";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiLockOpen } from "react-icons/hi";
import { Link } from "react-router-dom";
import { ChooseAccountTypeUserOnboarding } from "./account-type";
import StepOne from "./stepOne";
import StepThree from "./stepThree";
import StepTwo from "./stepTwo";

export default function StoreCreatePage() {
    const [step, setStep] = useState<number>(1);

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
                className="w-full sm:max-w-screen-sm md:max-w-screen-md md:flex-row"
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
                    <ol className="mb-6 flex justify-center items-center text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base lg:mb-12">
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
                                    Basic{" "}
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
                                    Store{" "}
                                    <span className="hidden sm:inline-flex">
                                        Branding
                                    </span>
                                </span>
                            </div>
                        </li>
                        <li className="flex items-center sm:block">
                            <div className="mr-2 sm:mx-auto sm:mb-2">3</div>
                            Theme
                        </li>
                    </ol>
                    <>
                        {step === 1 && (
                            <StepOne step={step} setStep={setStep} />
                        )}
                        {step === 2 && (
                            <StepTwo step={step} setStep={setStep} />
                        )}
                        {step === 3 && (
                            <StepThree step={step} setStep={setStep} />
                        )}
                    </>
                </div>
            </Card>
        </div>
    );
}
