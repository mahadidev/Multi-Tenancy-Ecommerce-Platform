import { RoutePath } from "@/seller/env";
import useForm from "@/seller/hooks/useForm";
import { useAppDispatch, useAppSelector } from "@/seller/store";
import { useUpdateStoreMutation } from "@/seller/store/reducers/storeApi";
import { clearOnboard } from "@/seller/store/slices/storeOnboardSlice";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const StepThree = ({
    setStep,
    setFormData,
}: {
    step: number;
    setStep: CallableFunction;
    setFormData: CallableFunction;
}) => {
    const { themes } = useAppSelector((state) => state.theme);
    const [updateStore, { isLoading, error }] = useUpdateStoreMutation();
    const { currentStore: store } = useAppSelector((state) => state.store);
    const { formState, handleChange } = useForm({
        errors: error,
        defaultState: {
            theme_id: themes[0] ? themes[0].id : 1,
        },
    });

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    return (
        <>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:mb-6">
                Select a Theme
            </h1>
            <div>
                <div className="my-6 grid gap-5">
                    <ul className="grid w-full gap-6 md:grid-cols-3">
                        {themes.map((item: any, index: number) => (
                            <li key={index}>
                                <input
                                    name="theme_id"
                                    type="radio"
                                    id={item.slug}
                                    value={item.id}
                                    className="hidden peer"
                                    required
                                    defaultChecked={
                                        (themes[0] &&
                                            themes[0].id == item.id) ||
                                        formState["theme_id"] == item.id
                                    }
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        handleChange(event, setFormData);
                                    }}
                                />
                                <label
                                    htmlFor={item.slug}
                                    className="inline-flex items-center justify-between w-full text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600
                                        peer-checked:bg-gray-50
                                        peer-checked:dark:bg-gray-700
                                        hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden"
                                >
                                    <div className="block w-full">
                                        <img
                                            className="w-full block"
                                            src={item.thumbnail}
                                            alt={item.name}
                                        />
                                        <div className="w-full p-2.5">
                                            <p className="text-center">
                                                {item.name}
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                    <Button
                        color="gray"
                        href="#"
                        onClick={() => setStep(2)}
                        className="hover:bg-gray-100 hover:text-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white md:w-1/2 [&>span]:py-3 [&>span]:text-sm"
                    >
                        Prev: Branding
                    </Button>
                    <Button
                        size="xl"
                        type="submit"
                        className="md:w-1/2 [&>span]:text-sm"
                        onClick={() => {
                            updateStore({
                                storeId: store?.id,
                                formData: formState,
                            }).then((response: any) => {
                                if (response.data.status === 200) {
                                    dispatch(clearOnboard());
                                    navigate(RoutePath.dashboard);
                                } else {
                                    setStep(1);
                                }
                            });
                        }}
                        color={formState["theme_id"] ? "blue" : "gray"}
                        isProcessing={isLoading}
                        processingLabel="Processing"
                        disabled={isLoading}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        Next: Dashboard
                    </Button>
                </div>
            </div>
        </>
    );
};

export default StepThree;
