import RenderInput from "@seller/components/RenderInput/RenderInput";
import useCategory from "@seller/hooks/useCategory";
import useForm from "@seller/hooks/useForm";
import useString from "@seller/hooks/useString";
import { CategoryType } from "@type/categoryType";
import { Button, Modal } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
    category: CategoryType;
}

const EditBlogCategoryModal: FC<PropsType> = function ({ category }) {
    const [isOpen, setOpen] = useState(false);
    const { update } = useCategory();
    const { getSlug } = useString();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: update.error,
        default: {
            ...category,
            category_id: category.has_parent?.id,
            type: "post",
        },
    });

    // reload data
    useEffect(() => {
        if (category) {
            setFormState(category);
        }
    }, [category]);
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
                    Edit Category
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Edit Category</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <RenderInput
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
                        <RenderInput
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

export default EditBlogCategoryModal;
