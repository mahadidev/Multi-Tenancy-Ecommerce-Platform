import { FormErrorType, FormStateType } from "@seller/_hooks/useForm";
import useStore from "@seller/_hooks/useStore";
import { ErrorMessage } from "@seller/components";
import { RoutePath } from "@seller/seller_env";
import { Button } from "flowbite-react";
import { ChangeEventHandler, FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Navigate } from "react-router-dom";

interface PropsType {
    stepNum: number;
    setStepNum: CallableFunction;
    formState: FormStateType | any;
    formErrors: FormErrorType;
    handleChange: ChangeEventHandler<any>;
    setFormState: CallableFunction;
}

const StoreStepThree: FC<PropsType> = function (props) {
    const { create } = useStore();

    return (
        <div
            className={`space-y-8  ${props.stepNum === 3 ? "block" : "hidden"}`}
        >
            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                Complete Setup
            </h2>

            <div className="mt-8 space-y-6">
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Theme system has been removed. You can proceed to complete your store setup.
                    </p>
                </div>

                {props.formErrors["message"] && (
                    <ErrorMessage>{props.formErrors["message"]}</ErrorMessage>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <Button
                        type="button"
                        size="lg"
                        color="primary"
                        theme={{ inner: { base: "px-5 py-3" } }}
                        className="w-full px-0 py-px sm:w-auto"
                        onClick={() => {
                            props.setStepNum(2);
                        }}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        Prev: Store branding
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        color="primary"
                        theme={{ inner: { base: "px-5 py-3" } }}
                        className="w-full px-0 py-px sm:w-auto"
                        onClick={() => {
                            if (
                                "name" in props.formState &&
                                "domain" in props.formState
                            ) {
                                create.submit({
                                    formData: props.formState,
                                    onSuccess: () => {
                                        return (
                                            <Navigate
                                                to={RoutePath.DashboardPage.index()}
                                            />
                                        );
                                    },
                                });
                            }
                        }}
                        isProcessing={create.isLoading}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        Next: Complete
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default StoreStepThree;
