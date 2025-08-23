import useAuth from "@seller/_hooks/useAuth";
import useForm from "@seller/_hooks/useForm";
import PasswordInput from "@seller/components/Form/PasswordInput/PasswordInput";
import { RoutePath } from "@seller/seller_env";
import { Button, Card, Label } from "flowbite-react";
import { FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Navigate } from "react-router-dom";
import useProfile from "../../hooks/useProfile";

const PasswordResetForm: FC = () => {
    const { updatePassword } = useProfile();
    const { logOut } = useAuth();

    // change password form
    const {
        handleChange: passwordUpdateHandleChange,
        formState: passwordUpdateFormState,
        formErrors: passwordUpdateFormErrors,
    } = useForm({
        formValidationError: updatePassword.error,
        default: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
    });
    return (
        <Card>
            <h3 className="mb-4 text-xl font-bold dark:text-white">
                Change password
            </h3>
            <form action="#">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                        <Label htmlFor="current_password">Current Password</Label>
                        <PasswordInput
                            id="current_password"
                            name="current_password"
                            placeholder="••••••••"
                            type="password"
                            value={passwordUpdateFormState["current_password"]}
                            color={
                                passwordUpdateFormErrors["current_password"]
                                    ? "failure"
                                    : "gray"
                            }
                            helperText={
                                passwordUpdateFormErrors["current_password"]
                                    ? passwordUpdateFormErrors[
                                          "current_password"
                                      ][0]
                                    : false
                            }
                            onChange={passwordUpdateHandleChange}
                        />
                    </div>{" "}
                    <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                        <Label htmlFor="old_password">New Password</Label>

                        <PasswordInput
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            value={passwordUpdateFormState["password"]}
                            color={
                                passwordUpdateFormErrors["password"]
                                    ? "failure"
                                    : "gray"
                            }
                            helperText={
                                passwordUpdateFormErrors["password"]
                                    ? passwordUpdateFormErrors["password"][0]
                                    : false
                            }
                            onChange={passwordUpdateHandleChange}
                        />
                    </div>{" "}
                    <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>

                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            placeholder="••••••••"
                            type="password"
                            value={passwordUpdateFormState["password_confirmation"]}
                            color={
                                passwordUpdateFormErrors["password_confirmation"]
                                    ? "failure"
                                    : "gray"
                            }
                            helperText={
                                passwordUpdateFormErrors["password_confirmation"]
                                    ? passwordUpdateFormErrors[
                                          "password_confirmation"
                                      ][0]
                                    : false
                            }
                            onChange={passwordUpdateHandleChange}
                        />
                    </div>
                    <div className="col-span-12 flex items-center justify-between">
                        <Button
                            color="blue"
                            isProcessing={updatePassword.isLoading}
                            processingLabel="Changing"
                            disabled={updatePassword.isLoading}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                            onClick={() =>
                                updatePassword.submit({
                                    formData: {
                                        current_password:
                                            passwordUpdateFormState?.current_password.toString(),
                                        password:
                                            passwordUpdateFormState?.password.toString(),
                                        password_confirmation:
                                            passwordUpdateFormState?.password_confirmation.toString(),
                                    },
                                })
                            }
                        >
                            Change
                        </Button>{" "}
                        <p
                            // to={`/forgot-password`}
                            className="text-right cursor-pointer text-sm text-primary-700 hover:underline dark:text-light-500"
                            onClick={() =>
                                logOut.submit({
                                    onSuccess: () => (
                                        <Navigate
                                            to={`${RoutePath.LoginPage.index()}?isShouldRedirect=true`}
                                        />
                                    ),
                                })
                            }
                        >
                            Lost Password?
                        </p>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default PasswordResetForm;
