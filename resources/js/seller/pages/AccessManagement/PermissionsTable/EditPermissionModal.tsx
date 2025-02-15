/* eslint-disable react-hooks/exhaustive-deps */
import useBrand from "@seller/hooks/useBrand";
import useForm from "@seller/hooks/useForm";
import { PermissionType } from "@type/rolePermissionsType";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
    permission: PermissionType;
}

const EditPermissionModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const { update } = useBrand();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: update.error,
        default: {
            ...props.permission,
        },
    });

    // reload data
    useEffect(() => {
        if (props.permission) {
            setFormState(props.permission);
        }
    }, [props.permission]);

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
                    Edit Permission
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Edit Permission</Modal.Header>
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

export default EditPermissionModal;
