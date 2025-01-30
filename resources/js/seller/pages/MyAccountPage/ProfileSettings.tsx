import { ErrorMessage } from "@seller/components";
import PasswordInput from "@seller/components/Form/PasswordInput/PasswordInput";
import useAuth from "@seller/hooks/useAuth";
import useForm from "@seller/hooks/useForm";
import { RoutePath } from "@seller/seller_env";
import {
    Breadcrumb,
    Button,
    Card,
    Label,
    Textarea,
    TextInput,
} from "flowbite-react";
import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiHome } from "react-icons/hi";

const ProfileSettingsPage: React.FC = () => {
    const { userProfileData: user, update, updatePassword } = useAuth();

    // update profile information form
    const {
        handleChange: profileSettingsHandleChange,
        formState: profileSettingsFormState,
        formErrors: profileSettingsFormErrors,
    } = useForm({
        formValidationError: update.error,
        default: {
            // id: user?.id,
            name: user?.name || "",
            phone: user?.phone || "",
            email: user?.email || "",
            address: user?.address || "",
        },
    });

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
        <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-2 gap-y-4 xl:gap-4">
            <div className="col-span-full mb-4 xl:mb-2">
                <Breadcrumb className="mb-5">
                    <Breadcrumb.Item href={RoutePath.DashboardPage.index()}>
                        <div className="flex items-center gap-x-3">
                            <HiHome className="text-xl" />
                            <span className="dark:text-white">Dashboard</span>
                        </div>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        My Account - Profile Settings
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="flex justify-between gap-2.5 md:gap-6 flex-wrap ">
                    <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                        Seller profile settings
                    </h1>
                </div>
            </div>

            {/* seller profile settings */}
            <Card>
                <h3 className="mb-4 text-xl font-bold dark:text-white">
                    Profile information
                </h3>
                <form action="#">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                            <Label htmlFor="name">Your Name</Label>

                            <TextInput
                                name="name"
                                id="name"
                                placeholder="Your name"
                                type="text"
                                value={profileSettingsFormState["name"]}
                                color={
                                    profileSettingsFormErrors["name"]
                                        ? "failure"
                                        : "gray"
                                }
                                helperText={
                                    profileSettingsFormErrors["name"]
                                        ? profileSettingsFormErrors["name"][0]
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    profileSettingsHandleChange(event);
                                }}
                                required
                            />
                        </div>
                        <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                            <Label htmlFor="email">Email</Label>

                            <TextInput
                                name="email"
                                id="email"
                                placeholder="Your Email"
                                type="email"
                                value={profileSettingsFormState["email"]}
                                color={
                                    profileSettingsFormErrors["email"]
                                        ? "failure"
                                        : "gray"
                                }
                                helperText={
                                    profileSettingsFormErrors["email"]
                                        ? profileSettingsFormErrors["email"][0]
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    profileSettingsHandleChange(event);
                                }}
                                required
                                disabled
                            />
                        </div>

                        <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                            <Label htmlFor="phone">Phone</Label>

                            <TextInput
                                name="phone"
                                id="phone"
                                placeholder="Your phone number"
                                type="tel"
                                value={profileSettingsFormState["phone"]}
                                color={
                                    profileSettingsFormErrors["phone"]
                                        ? "failure"
                                        : "gray"
                                }
                                helperText={
                                    profileSettingsFormErrors["phone"]
                                        ? profileSettingsFormErrors["phone"][0]
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    profileSettingsHandleChange(event);
                                }}
                                required
                            />
                        </div>
                        <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                            <Label htmlFor="store-location">Your Address</Label>

                            <Textarea
                                name="address"
                                id="address"
                                placeholder="Your street address"
                                value={profileSettingsFormState["address"]}
                                color={
                                    profileSettingsFormErrors["address"]
                                        ? "failure"
                                        : "primary"
                                }
                                helperText={
                                    profileSettingsFormErrors["address"]
                                        ? profileSettingsFormErrors[
                                              "address"
                                          ][0]
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLTextAreaElement>
                                ) => {
                                    profileSettingsHandleChange(event);
                                }}
                                required
                            ></Textarea>
                        </div>

                        {profileSettingsFormErrors["message"] && (
                            <div className="col-span-12">
                                <ErrorMessage>
                                    {profileSettingsFormErrors["message"]}
                                </ErrorMessage>
                            </div>
                        )}

                        <div className="col-span-12">
                            <Button
                                color="blue"
                                isProcessing={update.isLoading}
                                processingLabel="Saving"
                                disabled={update.isLoading}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                                onClick={() =>
                                    update.submit({
                                        formData: profileSettingsFormState,
                                    })
                                }
                            >
                                Save Info
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

            {/* seller account password changing */}
            <Card>
                <h3 className="mb-4 text-xl font-bold dark:text-white">
                    Change password
                </h3>
                <form action="#">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                            <Label htmlFor="old_password">
                                Current Password
                            </Label>
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
                                value={profileSettingsFormState["password"]}
                                color={
                                    passwordUpdateFormErrors["password"]
                                        ? "failure"
                                        : "gray"
                                }
                                helperText={
                                    passwordUpdateFormErrors["password"]
                                        ? passwordUpdateFormErrors[
                                              "password"
                                          ][0]
                                        : false
                                }
                                onChange={passwordUpdateHandleChange}
                            />
                        </div>{" "}
                        <div className="col-span-full grid grid-cols-1 gap-y-2 ">
                            <Label htmlFor="old_password">
                                Confirm Password
                            </Label>

                            <PasswordInput
                                id="confirm_password"
                                name="confirm_password"
                                placeholder="••••••••"
                                type="password"
                                value={
                                    profileSettingsFormState["confirm_password"]
                                }
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
                        {passwordUpdateFormErrors["message"] && (
                            <div className="col-span-12">
                                <ErrorMessage>
                                    {passwordUpdateFormErrors["message"]}
                                </ErrorMessage>
                            </div>
                        )}
                        <div className="col-span-12">
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
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ProfileSettingsPage;
