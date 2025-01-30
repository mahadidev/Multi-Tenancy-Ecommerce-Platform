import PasswordInput from "@seller/components/Form/PasswordInput/PasswordInput";
import useAuth from "@seller/hooks/useAuth";
import useForm from "@seller/hooks/useForm";
import { RoutePath } from "@seller/seller_env";
import { Button, Card, Label } from "flowbite-react";
import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Link, useSearchParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
    //  get page query params
    const [searchParams] = useSearchParams();

    // get query parameters
    const email = searchParams.get("email"); // email
    const token = searchParams.get("token"); // token

    // reset password hook
    const { resetPassword } = useAuth();

    // reset password form handler
    const { formState, formErrors, handleChange } = useForm({
        formValidationError: resetPassword.error,
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
                        Reset password
                    </h2>
                    <div className="mt-8 space-y-6">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type="password"
                                value={formState["password"]}
                                color={
                                    formErrors["password"] ? "failure" : "gray"
                                }
                                helperText={
                                    formErrors["password"]
                                        ? formErrors["password"][0]
                                        : false
                                }
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="password">Confirm Password</Label>
                            <PasswordInput
                                id="confirm_password"
                                name="confirm_password"
                                placeholder="••••••••"
                                type="password"
                                value={formState["confirm_password"]}
                                color={
                                    formErrors["confirm_password"]
                                        ? "failure"
                                        : "gray"
                                }
                                helperText={
                                    formErrors["confirm_password"]
                                        ? formErrors["confirm_password"][0]
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
                                    resetPassword.submit({
                                        formData: {
                                            ...formState,
                                            email,
                                            token,
                                        },
                                    });
                                }}
                                isProcessing={resetPassword.isLoading}
                                disabled={resetPassword.isLoading}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                            >
                                Reset Now
                            </Button>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-light-400">
                            Go back to?&nbsp;
                            <Link
                                to={RoutePath.ForgotPasswordPage.index()}
                                className="text-primary-700 hover:underline dark:text-light-500"
                            >
                                Forgot Password
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default ResetPassword;
