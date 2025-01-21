import { ImageInput } from "@/seller/components";
import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import { useUpdateStoreMutation } from "@/seller/store/reducers/storeApi";
import { Button, Label, TextInput } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";

const StepTwo = ({
    setStep,
    setFormData,
}: {
    step: number;
    setStep: CallableFunction;
    setFormData: CallableFunction;
}) => {
    const [updateStore, { isLoading, error }] = useUpdateStoreMutation();
    const { currentStore: store } = useAppSelector((state) => state.store);

    const { formState, handleChange, formErrors } = useForm({
        errors: error,
    });

    return (
        <>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:mb-6">
                Store Branding
            </h1>
            <div>
                <div className="my-6 grid gap-5">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="filogo" value="Upload file" />
                        </div>
                        <ImageInput
                            name="logo"
                            id="logo"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                handleChange(event, setFormData);
                            }}
                        />
                    </div>
                    <div>
                        <Label
                            htmlFor="full-name"
                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Primary Color
                        </Label>
                        <TextInput
                            name="primaryColor"
                            id="full-name"
                            type="color"
                            required
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                handleChange(event, setFormData);
                            }}
                            color={
                                formErrors["primaryColor"] ? "failure" : "gray"
                            }
                            helperText={
                                formErrors["primaryColor"] ? formErrors : false
                            }
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
                            name="secondaryColor"
                            id="full-name"
                            type="color"
                            required
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                handleChange(event, setFormData);
                            }}
                            color={
                                formErrors["secondaryColor"] || error
                                    ? "failure"
                                    : "gray"
                            }
                            helperText={
                                formErrors["secondaryColor"] || error
                                    ? formErrors["secondaryColor"]
                                        ? formErrors["secondaryColor"][0]
                                        : error && "message" in error
                                        ? error.message
                                        : false
                                    : false
                            }
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
                        Prev: Basic Info
                    </Button>
                    <Button
                        size="xl"
                        type="submit"
                        color={"blue"}
                        className="md:w-1/2 [&>span]:text-sm"
                        onClick={() => {
                            updateStore({
                                storeId: store?.id,
                                formData: formState,
                            }).then((response: any) => {
                                if (response.data.status === 200) {
                                    setStep(3);
                                } else {
                                    setStep(1);
                                }
                            });
                        }}
                        isProcessing={isLoading}
                        processingLabel="Processing"
                        disabled={isLoading}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        Next: Theme Selection
                    </Button>
                </div>
            </div>
        </>
    );
};

export default StepTwo;
