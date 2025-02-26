import FormInput from "@seller/components/FormInput/FormInput";
import useForm from "@seller/hooks/useForm";
import useRolePermission from "@seller/hooks/useRolePermissions";
import useStoreAdmin from "@seller/hooks/useStoreAdmin";
import { RoleType } from "@type/rolePermissionsType";
import { StoreAdminType } from "@type/storeAdminType";
import { Button, Label, Modal, Select } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
    admin: StoreAdminType;
}

const EditStoreAdminModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const { update } = useStoreAdmin();
    const { roles } = useRolePermission();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: update.error,
        default: {
            ...props.admin,
            role_id: roles?.find(
                (role: RoleType) => role?.name === props?.admin?.role[0]
            )?.id,
        },
    });

    // reload data
    useEffect(() => {
        if (props.admin) {
            setFormState({
                ...props.admin,
                role_id: roles?.find(
                    (role: RoleType) => role?.name === props?.admin?.role[0]
                )?.id,
            });
        }
    }, [props.admin]);

    return (
        <>
            <Button
                size="sm"
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <HiPencilAlt className="h-5 w-5" />
                    Edit Store Admin
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Edit Store Admin</Modal.Header>
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
                            update.submit({
                                formData: formState,
                                onSuccess: () => {
                                    setOpen(false);
                                },
                            });
                        }}
                        isProcessing={update.isLoading}
                        disabled={update.isLoading}
                        processingLabel="Saving"
                        processingSpinner={
                            <AiOutlineLoading className="animate-spin" />
                        }
                    >
                        Save all
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditStoreAdminModal;
