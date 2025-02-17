import useForm from "@seller/hooks/useForm";
import useRolePermission from "@seller/hooks/useRolePermissions";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreatePermissionModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { createPermission } = useRolePermission();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: createPermission.error,
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
                    Create Permission
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new Permission</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Permission name"
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
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={() => {
                            createPermission.submit({
                                formData: formState,
                                onSuccess: () => {
                                    setOpen(false);
                                },
                            });
                            setFormState({});
                        }}
                        isProcessing={createPermission.isLoading}
                        disabled={createPermission.isLoading}
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
export default CreatePermissionModal;
