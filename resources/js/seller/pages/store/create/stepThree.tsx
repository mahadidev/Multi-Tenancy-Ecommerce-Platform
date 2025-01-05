import { Button, Label, TextInput } from "flowbite-react";

const StepThree = ({
    step,
    setStep,
}: {
    step: number;
    setStep: CallableFunction;
}) => {
    return (
        <>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:mb-6">
                Store Branding {step}
            </h1>
            <div>
                <div className="my-6 grid gap-5">
                    <div>
                        <Label
                            htmlFor="dropzone-file"
                            className="mb-2 block dark:text-white"
                        >
                            Logo
                        </Label>
                        <div className="flex w-full items-center justify-center">
                            <Label
                                htmlFor="dropzone-file"
                                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                    <svg
                                        aria-hidden
                                        className="mb-3 h-10 w-10 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                            Click to upload
                                        </span>
                                        &nbsp;or drag and drop
                                    </p>
                                    <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                                        Max. File Size: 30MB
                                    </p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                />
                            </Label>
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="full-name"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Primary Color
                        </Label>
                        <TextInput
                            name="full-name"
                            id="full-name"
                            type="color"
                            required
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="full-name"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Secondary Color
                        </Label>
                        <TextInput
                            name="full-name"
                            id="full-name"
                            type="color"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                    <Button
                        color="gray"
                        href="#"
                        onClick={() => setStep(1)}
                        className="hover:bg-gray-100 hover:text-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white md:w-1/2 [&>span]:py-3 [&>span]:text-sm"
                    >
                        Prev: Branding
                    </Button>
                    <Button
                        size="xl"
                        type="submit"
                        color="blue"
                        className="md:w-1/2 [&>span]:text-sm"
                        onClick={() => setStep(2)}
                    >
                        Next: Sucessful
                    </Button>
                </div>
            </div>
        </>
    );
};

export default StepThree;
