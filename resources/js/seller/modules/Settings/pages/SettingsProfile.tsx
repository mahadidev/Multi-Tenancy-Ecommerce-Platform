import useForm from "@seller/_hooks/useForm";
import { TextInput } from "@seller/components";
import { Button, Card, FileInput, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useSettings } from "../hooks";

const SettingsProfile = () => {
    const { profileSettings, updateProfile, uploadAvatar, changePassword } = useSettings();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: updateProfile.error,
        default: {
            first_name: profileSettings.first_name,
            last_name: profileSettings.last_name,
            email: profileSettings.email,
            phone: profileSettings.phone,
            bio: profileSettings.bio,
            address: profileSettings.address,
            city: profileSettings.city,
            state: profileSettings.state,
            country: profileSettings.country,
            postal_code: profileSettings.postal_code,
        },
    });

    const {
        handleChange: handlePasswordChange,
        formState: passwordForm,
        formErrors: passwordErrors
    } = useForm({
        formValidationError: changePassword.error,
        default: {
            current_password: '',
            new_password: '',
            confirm_password: '',
        },
    });

    // Update form state when settings change
    useEffect(() => {
        setFormState({
            first_name: profileSettings.first_name,
            last_name: profileSettings.last_name,
            email: profileSettings.email,
            phone: profileSettings.phone,
            bio: profileSettings.bio,
            address: profileSettings.address,
            city: profileSettings.city,
            state: profileSettings.state,
            country: profileSettings.country,
            postal_code: profileSettings.postal_code,
        });
    }, [profileSettings, setFormState]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUploadAvatar = () => {
        if (selectedFile) {
            uploadAvatar.submit({
                formData: { file: selectedFile },
                onSuccess: () => {
                    setSelectedFile(null);
                }
            });
        }
    };

    const handleChangePassword = () => {
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            alert("Passwords don't match");
            return;
        }
        changePassword.submit({
            formData: passwordForm,
            onSuccess: () => {
                setShowPasswordForm(false);
            }
        });
    };

    return (
        <>
            <Card>
                <h3 className="mb-4 text-xl font-bold dark:text-white">
                    Profile Settings
                </h3>

                {/* Avatar Upload */}
                <div className="mb-6">
                    <div className="flex items-center gap-4">
                        {profileSettings.avatar && (
                            <img
                                src={profileSettings.avatar}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            <FileInput
                                id="avatar"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {selectedFile && (
                                <Button
                                    size="sm"
                                    className="mt-2"
                                    onClick={handleUploadAvatar}
                                    isProcessing={uploadAvatar.isLoading}
                                >
                                    Upload
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <form>
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                            <TextInput
                                name="first_name"
                                label="First Name"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter first name"
                            />
                        </div>

                        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                            <TextInput
                                name="last_name"
                                label="Last Name"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter last name"
                            />
                        </div>

                        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                            <TextInput
                                name="email"
                                label="Email Address"
                                type="email"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
                            <TextInput
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="col-span-full">
                            <TextInput
                                name="bio"
                                label="Bio"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter bio"
                            />
                        </div>

                        <div className="col-span-full">
                            <TextInput
                                name="address"
                                label="Address"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter address"
                            />
                        </div>

                        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-2">
                            <TextInput
                                name="city"
                                label="City"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter city"
                            />
                        </div>

                        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-2">
                            <TextInput
                                name="state"
                                label="State"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter state"
                            />
                        </div>

                        <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-2">
                            <TextInput
                                name="postal_code"
                                label="Postal Code"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                placeholder="Enter postal code"
                            />
                        </div>

                        <div className="col-span-6 flex gap-4">
                            <Button
                                color="blue"
                                isProcessing={updateProfile.isLoading}
                                processingLabel="Saving..."
                                disabled={updateProfile.isLoading}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                                onClick={() =>
                                    updateProfile.submit({
                                        formData: formState,
                                    })
                                }
                            >
                                Save Profile
                            </Button>

                            <Button
                                color="gray"
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                            >
                                Change Password
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Password Change Form */}
                {showPasswordForm && (
                    <div className="mt-6 pt-6 border-t">
                        <h4 className="mb-4 text-lg font-medium dark:text-white">
                            Change Password
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                            <TextInput
                                name="current_password"
                                label="Current Password"
                                type="password"
                                formState={passwordForm}
                                formErrors={passwordErrors}
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                            />
                            <TextInput
                                name="new_password"
                                label="New Password"
                                type="password"
                                formState={passwordForm}
                                formErrors={passwordErrors}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                            />
                            <TextInput
                                name="confirm_password"
                                label="Confirm Password"
                                type="password"
                                formState={passwordForm}
                                formErrors={passwordErrors}
                                onChange={handlePasswordChange}
                                placeholder="Confirm new password"
                            />
                            <div className="flex gap-4">
                                <Button
                                    color="blue"
                                    onClick={handleChangePassword}
                                    isProcessing={changePassword.isLoading}
                                >
                                    Update Password
                                </Button>
                                <Button
                                    color="gray"
                                    onClick={() => setShowPasswordForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
};

export default SettingsProfile;
