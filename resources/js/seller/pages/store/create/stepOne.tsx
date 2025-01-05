import { Button, Label, Select, TextInput } from "flowbite-react";

const StepOne = ({ setStep }: { step: number; setStep: CallableFunction }) => {
    return (
        <>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:mb-6">
                Store Details
            </h1>
            <div>
                <div className="my-6 grid gap-5">
                    <div>
                        <Label
                            htmlFor="country"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Type
                        </Label>
                        <Select id="country">
                            <option selected value="1">
                                E-commerce
                            </option>
                            <option value="2" disabled>
                                Personal Portfolio
                            </option>
                            <option value="2" disabled>
                                Agency
                            </option>
                        </Select>
                    </div>
                    <div>
                        <Label
                            htmlFor="full-name"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Store Name
                        </Label>
                        <TextInput
                            name="full-name"
                            id="full-name"
                            placeholder="Ghorer Bazar"
                            required
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="full-name"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Store URL
                        </Label>
                        <TextInput
                            name="full-name"
                            id="full-name"
                            placeholder="ghorer-bazar"
                            addon="https://chologori.com/stores/"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                    <Button
                        size="xl"
                        type="submit"
                        color="blue"
                        className="md:w-1/2 [&>span]:text-sm ml-auto"
                        onClick={() => setStep(2)}
                    >
                        Next: Branding
                    </Button>
                </div>
            </div>
        </>
    );
};

export default StepOne;
