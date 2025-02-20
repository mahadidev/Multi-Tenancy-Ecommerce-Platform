/* eslint-disable react-hooks/exhaustive-deps */
import useForm from "@seller/hooks/useForm";
import useRolePermission from "@seller/hooks/useRolePermissions";
import { PermissionType, RoleType } from "@type/rolePermissionsType";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
    role: RoleType;
}

const EditRoleModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const [selectAll, setSelectAll] = useState(false); // state for 'select all' checkbox
    const { updateRole, assignPermission, permissions } = useRolePermission();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: updateRole.error,
        default: {
            ...props.role,
        },
    });

    const {
        formState: permissionFormState,
        setFormState: setPermissionFormState,
    } = useForm({
        formValidationError: assignPermission.error,
        default: {
            permissions:
                props?.role?.permissions?.map(
                    (permission: PermissionType) => permission?.id
                ) || [],
        },
    });

    // reload data
    useEffect(() => {
        if (props.role) {
            setFormState(props.role);
            const updatedPermissions =
                props?.role?.permissions?.map(
                    (permission: PermissionType) => permission?.id
                ) || [];
            setPermissionFormState({ permissions: updatedPermissions });

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
            ? [...permissionFormState?.permissions, permissionId]
            : permissionFormState?.permissions?.filter(
                  (permission: any) => permission !== permissionId
              );

        setPermissionFormState({
            ...permissionFormState,
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
        setPermissionFormState({
            ...permissionFormState,
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
                <div className="flex items-center gap-x-2">
                    <HiPencilAlt className="h-5 w-5" />
                    Edit Role
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Edit Role</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Role name"
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
                            {" "}
                            <Label htmlFor="permissions">
                                Assign Permissions
                            </Label>
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
                            <div className="grid grid-cols-2 gap-2">
                                {permissions?.map((permission) => (
                                    <div
                                        key={permission?.id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={permission?.name}
                                            name={permission?.name}
                                            checked={permissionFormState?.permissions?.includes(
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
                            updateRole.submit({
                                formData: formState,
                                onSuccess: () => {
                                    setOpen(false);
                                },
                            });
                            assignPermission.submit({
                                formData: {
                                    permission_ids:
                                        permissionFormState?.permissions,
                                    role_id: props?.role?.id,
                                },
                                onSuccess: () => {
                                    setOpen(false);
                                },
                            });
                        }}
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
