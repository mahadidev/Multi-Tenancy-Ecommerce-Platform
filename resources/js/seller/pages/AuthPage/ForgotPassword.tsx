import useAuth from "@seller/hooks/useAuth";
import useForm from "@seller/hooks/useForm";
import { RoutePath } from "@seller/seller_env";
import { Button, Card, Label, TextInput } from "flowbite-react";
import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
    const { forgotPasswordRequest } = useAuth();
    const { formState, formErrors, handleChange } = useForm({
        default: {
            email: "",
        },
        formValidationError: forgotPasswordRequest.error,
    });

    return (
        <>
            <div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
                <Card
                    horizontal
                    className="w-full md:max-w-screen-lg *:object-cover"
                    theme={{
                        root: {
                            children:
                                "my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16",
                        },
                        img: {
                            horizontal: {
                                on: "hidden w-2/3 rounded-l-lg md:w-96 md:p-0 lg:block !object-cover",
                            },
                        },
                    }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                        Send request to reset password
                    </h2>
                    <div className="mt-8 space-y-6">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="email">Your email</Label>
                            <TextInput
                                id="email"
                                name="email"
                                placeholder="name@gmail.com"
                                type="email"
                                value={formState["email"]}
                                color={formErrors["email"] ? "failure" : "gray"}
                                helperText={
                                    formErrors["email"]
                                        ? formErrors["email"][0]
                                        : false
                                }
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-6">
                            <Button
                                type="button"
                                size="lg"
                                color="primary"
                                theme={{ inner: { base: "px-5 py-3" } }}
                                className="w-full px-0 py-px sm:w-auto"
                                onClick={() => {
                                    forgotPasswordRequest.submit({
                                        formData: formState,
                                    });
                                }}
                                isProcessing={forgotPasswordRequest.isLoading}
                                disabled={forgotPasswordRequest.isLoading}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                            >
                                Continue
                            </Button>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-light-400">
                            Go back to?&nbsp;
                            <Link
                                to={RoutePath.LoginPage.index()}
                                className="text-primary-700 hover:underline dark:text-light-500"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default ForgotPassword;
