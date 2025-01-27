import useAuth from "@/seller/hooks/useAuth";
import useForm from "@/seller/hooks/useForm";
import { RoutePath } from "@/seller/seller_env";
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
    const { userProfileData: user, update } = useAuth();

    const { handleChange, formState, formErrors } = useForm({
        formValidationError: update.error,
        default: {
            // id: user?.id,
            name: user?.name,
            phone: user?.phone,
            email: user?.email,
            address: user?.address,
        },
    });

    return (
        <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-2 xl:gap-4">
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
                                    handleChange(event);
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
                                value={formState["email"]}
                                color={formErrors["email"] ? "failure" : "gray"}
                                helperText={
                                    formErrors["email"]
                                        ? formErrors["email"][0]
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    handleChange(event);
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
                                value={formState["phone"]}
                                color={formErrors["phone"] ? "failure" : "gray"}
                                helperText={
                                    formErrors["phone"]
                                        ? formErrors["phone"][0]
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    handleChange(event);
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
                                value={formState["address"]}
                                color={
                                    formErrors["address"]
                                        ? "failure"
                                        : "primary"
                                }
                                helperText={
                                    formErrors["address"]
                                        ? formErrors["address"][0]
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLTextAreaElement>
                                ) => {
                                    handleChange(event);
                                }}
                                required
                            ></Textarea>
                        </div>

                        <div className="col-span-6">
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
                                        formData: formState,
                                    })
                                }
                            >
                                Save Info
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ProfileSettingsPage;
