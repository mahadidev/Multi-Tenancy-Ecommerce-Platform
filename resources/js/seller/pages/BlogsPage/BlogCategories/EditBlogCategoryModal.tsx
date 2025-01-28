import useCategory from "@seller/hooks/useCategory";
import useForm from "@seller/hooks/useForm";
import { CategoryType } from "@type/categoryType";
import { Button, Label, Modal,  TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
    category: CategoryType;
}

const EditBlogCategoryModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const { update } = useCategory();
    const { handleChange, formState, formErrors } = useForm({
        formValidationError: update.error,
        default: {
            ...props.category,
            category_id: props.category.has_parent?.id,
            type: "post",
        },
    });

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
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Category name"
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
                            <Label htmlFor="slug">Slug</Label>
                            <div>
                                <TextInput
                                    id="slug"
                                    name="slug"
                                    value={formState["slug"]}
                                    color={
                                        formErrors["slug"] ? "failure" : "gray"
                                    }
                                    placeholder="Category slug"
                                    helperText={
                                        formErrors["slug"]
                                            ? formErrors["slug"][0]
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
                        processingSpinner={<AiOutlineLoading />}
                    >
                        Save all
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditBlogCategoryModal;
