import useForm from "@seller/hooks/useForm";
import useRolePermission from "@seller/hooks/useRolePermissions";
import { PermissionType, RoleType } from "@type/rolePermissionsType";
import { Button, Checkbox, Label, Modal } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface PropsType {
    role: RoleType;
}

const AssignPermissionsToRoleModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const [selectAll, setSelectAll] = useState(false); // New state for 'select all' checkbox
    const { assignPermission, permissions } = useRolePermission();
    const { formState, setFormState } = useForm({
        formValidationError: assignPermission.error,
        default: {
            permissions:
                props?.role?.permissions?.map(
                    (permission: PermissionType) => permission?.id
                ) || [],
        },
    });

    // Reload data when role changes
    useEffect(() => {
        if (props.role) {
            const updatedPermissions =
                props?.role?.permissions?.map(
                    (permission: PermissionType) => permission?.id
                ) || [];
            setFormState({ permissions: updatedPermissions });

            // Update 'selectAll' state based on permissions
            setSelectAll(updatedPermissions.length === permissions.length);
        }
    }, [props.role, permissions]);

    // Handle the change for a single permission
    const handlePermissionChange = (
        permissionId: number,
        isChecked: boolean
    ) => {
        const updatedPermissions = isChecked
            ? [...formState?.permissions, permissionId]
            : formState?.permissions?.filter(
                  (permission: any) => permission !== permissionId
              );

        setFormState({
            ...formState,
            permissions: updatedPermissions,
        });

        // Update 'selectAll' state if all permissions are checked
        setSelectAll(updatedPermissions.length === permissions.length);
    };

    // Handle the 'select all' checkbox change
    const handleSelectAllChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        setFormState({
            ...formState,
            permissions: isChecked
                ? permissions.map((permission) => permission?.id)
                : [],
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
                    Assign Permission
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="5xl">
                <Modal.Header>Assign Permission</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="select-all"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                />
                                <Label htmlFor={"select-all"}>
                                    Select All Permissions
                                </Label>
                            </div>
                            <div className="flex flex-col gap-2">
                                {permissions?.map((permission) => (
                                    <div
                                        key={permission?.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={permission?.name}
                                            name={permission?.name}
                                            checked={formState?.permissions?.includes(
                                                permission?.id
                                            )}
                                            onChange={(event) =>
                                                handlePermissionChange(
                                                    permission?.id,
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        <Label htmlFor={permission?.name}>
                                            {permission?.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={() => {
                            assignPermission.submit({
                                formData: {
                                    permission_ids: formState?.permissions,
                                    role_id: props?.role?.id,
                                },
                                onSuccess: () => {
                                    setOpen(false);
                                },
                            });
                        }}
                        isProcessing={assignPermission.isLoading}
                        disabled={assignPermission.isLoading}
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

export default AssignPermissionsToRoleModal;
