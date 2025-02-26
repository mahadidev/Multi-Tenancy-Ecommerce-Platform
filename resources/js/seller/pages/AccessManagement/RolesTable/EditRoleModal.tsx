import useForm from "@seller/hooks/useForm";
import useRolePermission from "@seller/hooks/useRolePermissions";
import { RoleType } from "@type/rolePermissionsType";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";
import { AssignPermissions } from "./AssignPermission";

interface PropsType {
    role: RoleType;
}

const EditRoleModal: FC<PropsType> = ({ role }) => {
    const [isOpen, setOpen] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const { updateRole, assignPermission, permissions } = useRolePermission();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: updateRole.error,
        default: { ...role },
    });

    const {
        formState: permissionFormState,
        setFormState: setPermissionFormState,
    } = useForm({
        formValidationError: assignPermission.error,
        default: { permissions: role?.permissions?.map((p) => p.id) || [] },
    });

    useEffect(() => {
        if (role) {
            setFormState(role);
            const updatedPermissions =
                role?.permissions?.map((p) => p.id) || [];
            setPermissionFormState({ permissions: updatedPermissions });
            setSelectAll(updatedPermissions.length === permissions.length);
        }
    }, [role, permissions]);

    const handleSave = () => {
        updateRole.submit({
            formData: formState,
            onSuccess: () => setOpen(false),
        });
        assignPermission.submit({
            formData: {
                permission_ids: permissionFormState.permissions,
                role_id: role.id,
            },
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <HiPencilAlt className="h-5 w-5" />
                    Edit Role
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Edit Role</Modal.Header>
                <Modal.Body>
                    <div className="grid gap-6">
                        <div>
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
                        onClick={handleSave}
                        isProcessing={
                            updateRole.isLoading || assignPermission.isLoading
                        }
                        disabled={
                            updateRole.isLoading || assignPermission.isLoading
                        }
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

export default EditRoleModal;
