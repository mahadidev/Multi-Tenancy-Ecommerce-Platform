import useRolePermission from "@seller/hooks/useRolePermissions";
import { RoleType } from "@type/rolePermissionsType";
import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";

interface PropsType {
    role: RoleType;
}

const DeleteRoleModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const { deleteRole } = useRolePermission();
    return (
        <>
            <Button color="gray" className="p-0" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-x-2">
                    <HiTrash className="h-5 w-5" />
                    Delete Role
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="border-none p-2">
                    <span className="sr-only">Delete Role</span>
                </Modal.Header>
                <Modal.Body className="px-6 pb-6 pt-0">
                    <div className="flex flex-col items-center gap-y-6 text-center">
                        <HiOutlineExclamationCircle className="mx-auto h-20 w-20 text-red-600" />
                        <p className="text-xl font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this{" "}
                            {props.role.name}?
                        </p>
                        <div className="flex items-center gap-x-3">
                            <Button
                                color="gray"
                                theme={{ base: "px-0" }}
                                onClick={() => {
                                    deleteRole.submit({
                                        formData: {
                                            id: props.role.id,
                                        },
                                        onSuccess: () => {
                                            setOpen(false);
                                        },
                                    });
                                }}
                                isProcessing={deleteRole.isLoading}
                                disabled={deleteRole.isLoading}
                                processingLabel="Deleting"
                                processingSpinner={
                                    <AiOutlineLoading className="animate-spin" />
                                }
                            >
                                <span className="text-base font-medium">
                                    Yes, I'm sure
                                </span>
                            </Button>
                            <Button
                                color="gray"
                                theme={{ base: "px-0" }}
                                onClick={() => setOpen(false)}
                            >
                                <span className="text-base font-medium">
                                    No, cancel
                                </span>
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default DeleteRoleModal;
