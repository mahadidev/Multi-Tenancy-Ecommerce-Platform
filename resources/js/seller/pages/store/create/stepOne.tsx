import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import { useCreateStoreMutation } from "@/seller/store/reducers/storeApi";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const StepOne = ({
    setStep,
    setFormData,
}: {
    step: number;
    setStep: CallableFunction;
    setFormData: CallableFunction;
}) => {
    const [createStore, { isLoading, error }] = useCreateStoreMutation();

    const { formState, handleChange, formErrors, setFormState } = useForm({
        errors: error,
    });

    const { formData, store } = useAppSelector((state) => state.storeOnboard);

    useEffect(() => {
        if (formData) {
            setFormState(formData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

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
                            name="name"
                            id="store-name"
                            placeholder="Ghorer Bazar"
                            type="text"
                            value={formState["name"]}
                            color={formErrors["name"] ? "failure" : "gray"}
                            helperText={
                                formErrors["name"]
                                    ? formErrors["name"][0]
                                    : false
                            }
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                handleChange(event, setFormData);
                            }}
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
                            name="domain"
                            id="domain"
                            placeholder="ghorer-bazar"
                            addon="https://chologori.com/stores/"
                            value={formState["domain"]}
                            color={formErrors["domain"] ? "failure" : "gray"}
                            helperText={
                                formErrors["domain"] || error
                                    ? formErrors["domain"]
                                        ? formErrors["domain"][0]
                                        : error && "message" in error
                                        ? error.message
                                        : false
                                    : false
                            }
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                handleChange(event, setFormData);
                            }}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                    <Button
                        size="xl"
                        type="submit"
                        color={
                            formState["name"] && formState["domain"]
                                ? "blue"
                                : "gray"
                        }
                        className="md:w-1/2 [&>span]:text-sm ml-auto"
                        onClick={() => {
                            if (store.id) {
                                setStep(2);
                            } else {
                                createStore(formState).then((response: any) => {
                                    if (response.data.status === 200) {
                                        setStep(2);
                                    }
                                });
                            }
                        }}
                        isProcessing={isLoading}
                        processingLabel="Processing"
                        disabled={
                            !formState["name"] ||
                            !formState["domain"] ||
                            isLoading
                        }
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        Next: Branding
                    </Button>
                </div>
            </div>
        </>
    );
};

export default StepOne;
