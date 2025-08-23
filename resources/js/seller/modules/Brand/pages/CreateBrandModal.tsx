import useForm from "@seller/_hooks/useForm";
import useString from "@seller/_hooks/useString";
import FormInput from "@seller/components/FormInput/FormInput";
import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";
import { useBrand } from "../hooks";

const CreateBrandModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { create } = useBrand();
    const { getSlug } = useString();

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
                    Create Brand
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new Brand</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormInput
                            id="name"
                            label="Brand Name"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={(event) => {
                                handleChange(event);
                                setFormState((prev: any) => ({
                                    ...prev,
                                    slug: getSlug(event.target.value),
                                }));
                            }}
                        />
                        <FormInput
                            id="slug"
                            label="Brand Slug"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                        />
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
export default CreateBrandModal;
