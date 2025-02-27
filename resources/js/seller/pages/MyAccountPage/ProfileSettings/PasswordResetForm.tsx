import PasswordInput from "@seller/components/Form/PasswordInput/PasswordInput";
import useAuth from "@seller/hooks/useAuth";
import useForm from "@seller/hooks/useForm";
import { RoutePath } from "@seller/seller_env";
import { Button, Card, Label } from "flowbite-react";
import { FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Navigate } from "react-router-dom";

const PasswordResetForm: FC = () => {
    const { updatePassword } = useAuth();
    const { logOut } = useAuth();

    // change password form
    const {
        handleChange: passwordUpdateHandleChange,
        formState: passwordUpdateFormState,
        formErrors: passwordUpdateFormErrors,
    } = useForm({
        formValidationError: updatePassword.error,
        default: {
            // id: user?.id,
            old_password: "",
            password: "",
            confirm_password: "",
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
                        <Label htmlFor="old_password">Current Password</Label>
                        <PasswordInput
                            id="old_password"
                            name="old_password"
                            placeholder="••••••••"
                            type="password"
                            value={passwordUpdateFormState["old_password"]}
                            color={
                                passwordUpdateFormErrors["old_password"]
                                    ? "failure"
                                    : "gray"
                            }
                            helperText={
                                passwordUpdateFormErrors["old_password"]
                                    ? passwordUpdateFormErrors[
                                          "old_password"
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
                        <Label htmlFor="old_password">Confirm Password</Label>

                        <PasswordInput
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="••••••••"
                            type="password"
                            value={passwordUpdateFormState["confirm_password"]}
                            color={
                                passwordUpdateFormErrors["confirm_password"]
                                    ? "failure"
                                    : "gray"
                            }
                            helperText={
                                passwordUpdateFormErrors["confirm_password"]
                                    ? passwordUpdateFormErrors[
                                          "confirm_password"
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
                                        old_password:
                                            passwordUpdateFormState?.old_password.toString(),
                                        password:
                                            passwordUpdateFormState?.password.toString(),
                                        confirm_password:
                                            passwordUpdateFormState?.confirm_password.toString(),
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
