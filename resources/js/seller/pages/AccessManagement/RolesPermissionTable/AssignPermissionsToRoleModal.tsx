/* eslint-disable react-hooks/exhaustive-deps */
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
    const { assignPermission, permissions } = useRolePermission();
    const { handleChange, formState, formErrors, setFormState } = useForm({
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
            setFormState({
                permissions:
                    props?.role?.permissions?.map(
                        (permission: PermissionType) => permission?.id
                    ) || [],
            });
        }
    }, [props.role]);

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
                            <div className="flex flex-col gap-2">
                                {permissions?.map((permission) => (
                                    <div>
                                        <Checkbox
                                            key={permission?.id}
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
                                        &nbsp;&nbsp;{" "}
                                        <Label>{permission?.name}</Label>
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
