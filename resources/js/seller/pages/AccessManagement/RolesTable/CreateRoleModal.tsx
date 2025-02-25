import useForm from "@seller/hooks/useForm";
import useRolePermission from "@seller/hooks/useRolePermissions";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";
import { AssignPermissions } from "./AssignPermission";

const CreateRoleModal: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const { createRole, assignPermission, permissions } = useRolePermission();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: createRole.error,
    });

    const {
        formState: permissionFormState,
        setFormState: setPermissionFormState,
    } = useForm({
        formValidationError: assignPermission.error,
        default: { permissions: [] },
    });

    const handleSubmit = () => {
        createRole.submit({
            formData: { name: formState.name },
            onSuccess: (res: any) => {
                assignPermission.submit({
                    formData: {
                        permission_ids: permissionFormState.permissions,
                        role_id: res.role.id,
                    },
                    onSuccess: () => setOpen(false),
                });
                setFormState({});
            },
        });
    };

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create Role
                </div>
            </Button>

            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new Role</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Role name"
                                value={formState.name}
                                color={formErrors.name ? "failure" : "gray"}
                                helperText={formErrors.name?.[0] || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <AssignPermissions
                            permissions={permissions}
                            permissionFormState={permissionFormState}
                            setPermissionFormState={setPermissionFormState}
                            selectAll={selectAll}
                            setSelectAll={setSelectAll}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={handleSubmit}
                        isProcessing={
                            createRole.isLoading || assignPermission.isLoading
                        }
                        disabled={
                            createRole.isLoading || assignPermission.isLoading
                        }
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

export default CreateRoleModal;
