import { BASE_IMAGE_URL } from "@/env";
import { useAppDispatch, useAppSelector } from "@/seller/store";
import {
    setFormData as setOnboardFormData,
    setStep as setStepOnboard,
} from "@/seller/store/slices/storeOnboardSlice";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import StepOne from "./stepOne";
import StepThree from "./stepThree";
import StepTwo from "./stepTwo";
import Steper from "./steper";

export default function StoreCreatePage() {
    const { step } = useAppSelector((state) => state.storeOnboard);
    const dispatch = useAppDispatch();

    const setStep = (value: number) => {
        dispatch(setStepOnboard(value));
    };

    const setFormData = (props: { name: string; value: string }) => {
        dispatch(setOnboardFormData(props));
    };

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
                    <Steper />
                    <>
                        {step === 1 && (
                            <StepOne
                                setFormData={setFormData}
                                step={step}
                                setStep={setStep}
                            />
                        )}
                        {step === 2 && (
                            <StepTwo
                                step={step}
                                setStep={setStep}
                                setFormData={setFormData}
                            />
                        )}
                        {step === 3 && (
                            <StepThree
                                step={step}
                                setStep={setStep}
                                setFormData={setFormData}
                            />
                        )}
                    </>
                </div>
            </Card>
        </div>
    );
}
