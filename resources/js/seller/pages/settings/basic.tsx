import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import { Label, TextInput } from "flowbite-react";
import React from "react";

const Basic = () => {
    const { currentStore: store } = useAppSelector((state) => state.store);
    const { handleChange, formState } = useForm({});
    return (
        <>
            {" "}
            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="shrink-0">
                        <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-2xl">
                            Basic Branding
                        </span>
                        <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
                            Please watch tutorial if you feel any issue.
                        </h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <div className="col-span-full">
                        <div className="w-[200px] h-[200px] rounded-full bg-gray-100  dark:bg-gray-900 border border-gray-200 dark:border-white flex justify-center items-center relative  duration-150 ease-in mx-auto">
                            {store.logo ? (
                                <img
                                    className="w-full h-full object-cover object-center overflow-hidden rounded-full"
                                    src={store.logo}
                                    alt="Store Logo"
                                />
                            ) : (
                                <svg
                                    className="w-12 h-12 text-gray-800 dark:text-white "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z"
                                        clip-rule="evenodd"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                    <div className="">
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
                </div>
            </div>
        </>
    );
};

export default Basic;
