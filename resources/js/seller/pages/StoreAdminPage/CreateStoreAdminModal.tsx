import FormInput from "@seller/components/FormInput/FormInput";
import useForm from "@seller/hooks/useForm";
import useRolePermission from "@seller/hooks/useRolePermissions";
import useStoreAdmin from "@seller/hooks/useStoreAdmin";
import { RoleType } from "@type/rolePermissionsType";
import { Button, Label, Modal, Select } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreateStoreAdminModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { create } = useStoreAdmin();
    const { roles } = useRolePermission();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
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
                        <FormInput
                            id="name"
                            label="Name"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                        />
                        <FormInput
                            id="email"
                            label="Admin Email"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                            type="email"
                        />
                        <FormInput
                            id="phone"
                            label="Admin Phone"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                            type="tel"
                        />
                        <FormInput
                            id="address"
                            label="Admin Address"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                            type="tel"
                        />
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Select Role</Label>
                            <Select
                                id="role_id"
                                name="role_id"
                                value={formState["role_id"]}
                                color={
                                    formErrors["role_id"] ? "failure" : "gray"
                                }
                                helperText={
                                    formErrors["role_id"]
                                        ? formErrors["role_id"][0]
                                        : false
                                }
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                    if (event.target.value === "0") {
                                        event.target.value = "null";
                                    }
                                    handleChange(event);
                                }}
                                required
                            >
                                <option value={0}>Select a Role</option>
                                {roles?.map((role: RoleType) => (
                                    <option value={role.id} key={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={() => {
                            create.submit({
                                formData: formState,
                                onSuccess: () => {
                                    setOpen(false);
                                    setFormState({});
                                },
                            });
                        }}
                        isProcessing={create.isLoading}
                        disabled={create.isLoading}
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
