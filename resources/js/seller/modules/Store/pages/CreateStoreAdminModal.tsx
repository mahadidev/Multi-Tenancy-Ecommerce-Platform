import useForm from "@seller/_hooks/useForm";
import useRolePermission from "@seller/_hooks/useRolePermissions";
import TextInput from "@seller/components/Form/TextInput/TextInput";
import { RoleType } from "@type/rolePermissionsType";
import { Button, Label, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";
import { useStore } from "../hooks";

const CreateStoreAdminModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { createAdmin } = useStore();
    const { roles } = useRolePermission();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: createAdmin.error,
        default: {
            role_ids: []
        }
    });

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create Store Admin
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new Store Admin</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextInput
                            name="phone"
                            label="Admin Phone"
                            formState={formState}
                            formErrors={formErrors}
                            onChange={handleChange}
                            type="tel"
                        />
                        <TextInput
                            name="address"
                            label="Admin Address"
                            formState={formState}
                            formErrors={formErrors}
                            onChange={handleChange}
                        />
                        <TextInput
                            name="name"
                            label="Name"
                            formState={formState}
                            formErrors={formErrors}
                            onChange={handleChange}
                            required
                        />
                        <TextInput
                            name="email"
                            label="Admin Email"
                            formState={formState}
                            formErrors={formErrors}
                            onChange={handleChange}
                            type="email"
                            required
                        />
                        <TextInput
                            name="password"
                            label="Password"
                            formState={formState}
                            formErrors={formErrors}
                            onChange={handleChange}
                            type="password"
                            required
                        />
                        <TextInput
                            name="password_confirmation"
                            label="Confirm Password"
                            formState={formState}
                            formErrors={formErrors}
                            onChange={handleChange}
                            type="password"
                            required
                        />
                        <div className="sm:col-span-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="role_ids">Select Roles</Label>
                                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                    {roles?.map((role: RoleType) => (
                                        <label key={role.id} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={role.id}
                                                checked={Array.isArray(formState["role_ids"]) && formState["role_ids"].includes(role.id)}
                                                onChange={(e) => {
                                                    const currentRoles = Array.isArray(formState["role_ids"]) ? formState["role_ids"] : [];
                                                    let newRoles;

                                                    if (e.target.checked) {
                                                        newRoles = [...currentRoles, parseInt(e.target.value)];
                                                    } else {
                                                        newRoles = currentRoles.filter((id: number) => id !== parseInt(e.target.value));
                                                    }

                                                    // Update form state directly to avoid useForm's processing
                                                    setFormState((prev: any) => ({
                                                        ...prev,
                                                        role_ids: newRoles
                                                    }));
                                                }}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {formErrors["role_ids"] && (
                                    <p className="text-sm text-red-600">{formErrors["role_ids"][0]}</p>
                                )}
                                {Array.isArray(formState["role_ids"]) && formState["role_ids"].length > 0 && (
                                    <p className="text-sm text-blue-600">
                                        Selected roles: {formState["role_ids"].length}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={() => {
                            createAdmin.submit({
                                formData: formState,
                                onSuccess: () => {
                                    setOpen(false);
                                    setFormState({});
                                },
                            });
                        }}
                        isProcessing={createAdmin.isLoading}
                        disabled={createAdmin.isLoading}
                        processingLabel="Creating"
                        processingSpinner={
                            <AiOutlineLoading className="animate-spin" />
                        }
                    >
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default CreateStoreAdminModal;
