import { BASE_IMAGE_URL } from "@/env";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import React from "react";
import { HiLockOpen } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function StoreCreatePage() {
    return (
        <div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
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
                <div className="flex space-x-4">
                    <img
                        alt=""
                        width={32}
                        height={32}
                        src="/images/users/bonnie-green.png"
                        className="h-8 w-8 rounded-full"
                    />
                    <h2 className="mb-3 text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                        Bonnie Green
                    </h2>
                </div>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Better to be safe than sorry.
                </p>
                <form className="mt-8 space-y-6">
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="password">Your password</Label>
                        <TextInput
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                        />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Checkbox id="acceptTerms" name="acceptTerms" />
                        <Label htmlFor="acceptTerms">
                            I accept the&nbsp;
                            <Link
                                to="#"
                                className="text-primary-700 hover:underline dark:text-primary-500"
                            >
                                Terms and Conditions
                            </Link>
                        </Label>
                    </div>
                    <div>
                        <Button
                            size="lg"
                            color="blue"
                            type="submit"
                            theme={{
                                inner: { base: "flex items-center px-5 py-3" },
                            }}
                            className="w-full px-0 py-px sm:w-auto"
                        >
                            <HiLockOpen className="mr-2 text-xl" />
                            Unlock
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
