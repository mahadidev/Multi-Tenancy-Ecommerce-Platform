import FormInput from "@seller/components/FormInput/FormInput";
import useCategory from "@seller/hooks/useCategory";
import useForm from "@seller/hooks/useForm";
import useString from "@seller/hooks/useString";

import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreateBlogCategoryModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { create } = useCategory();
    const { getSlug } = useString();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
        default: {
            type: "post",
        },
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
                    Create Category
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new blog category</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormInput
                            id="name"
                            label="Category Name"
                            formErrors={formErrors}
                            handleChange={(event) => {
                                handleChange(event);
                                setFormState((prev: any) => ({
                                    ...prev,
                                    slug: getSlug(event.target.value),
                                }));
                            }}
                            formState={formState}
                        />
                        <FormInput
                            id="slug"
                            label="Slug"
                            formErrors={formErrors}
                            handleChange={handleChange}
                            formState={formState}
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
                                    setFormState({});
                                },
                            });
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
export default CreateBlogCategoryModal;
