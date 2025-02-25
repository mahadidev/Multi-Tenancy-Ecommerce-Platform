import useAuth from "@seller/hooks/useAuth";
import useForm from "@seller/hooks/useForm";
import { Button, Card, Label, Textarea, TextInput } from "flowbite-react";
import React, { FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const GeneralSettings: FC = () => {
    const { userProfileData: user, update } = useAuth();

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

    return (
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
                                    ? profileSettingsFormErrors["address"][0]
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
    );
};

export default GeneralSettings;
