import useForm from "@seller/hooks/useForm";
import useRolePermission from "@seller/hooks/useRolePermissions";
import useStoreAdmin from "@seller/hooks/useStoreAdmin";
import { RoleType } from "@type/rolePermissionsType";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
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
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Admin name"
                                    value={formState["name"]}
                                    color={
                                        formErrors["name"] ? "failure" : "gray"
                                    }
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
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Email</Label>
                            <div>
                                <TextInput
                                    id="email"
                                    name="email"
                                    placeholder="Admin email"
                                    value={formState["email"]}
                                    color={
                                        formErrors["email"] ? "failure" : "gray"
                                    }
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
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Phone</Label>
                            <div>
                                <TextInput
                                    id="phone"
                                    name="phone"
                                    placeholder="Admin phone"
                                    value={formState["phone"]}
                                    color={
                                        formErrors["phone"] ? "failure" : "gray"
                                    }
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
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Address</Label>
                            <div>
                                <TextInput
                                    id="address"
                                    name="address"
                                    placeholder="Admin address"
                                    value={formState["address"]}
                                    color={
                                        formErrors["address"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["address"]
                                            ? formErrors["address"][0]
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
                        </div>
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
                                },
                            });
                            setFormState({});
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
