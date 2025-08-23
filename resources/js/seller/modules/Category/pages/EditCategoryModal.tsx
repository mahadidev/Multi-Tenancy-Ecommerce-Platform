/* eslint-disable react-hooks/exhaustive-deps */
import useForm from "@seller/_hooks/useForm";
import useString from "@seller/_hooks/useString";
import useToast from "@seller/_hooks/useToast";
import { CategoryType } from "@type/categoryType";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";
import { useCategory } from "../hooks";

interface PropsType {
    category: CategoryType;
}

const EditCategoryModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const { update, productCategories } = useCategory();
    const { toaster } = useToast();
    const { getSlug } = useString();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: update.error,
        default: {
            ...props.category,
            category_id: props.category.has_parent?.id,
            type: "product",
            id: props?.category?.id,
        },
    });

    // reload data
    useEffect(() => {
        if (props.category) {
            setFormState(props.category);
        }
    }, [props.category]);

    return (
        <>
            <Button
                size="sm"
                color="primary"
                className="p-0 whitespace-nowrap"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <HiPencilAlt className="h-5 w-5" />
                    Edit Category
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                {" "}
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
                                        setFormState((prev: any) => ({
                                            ...prev,
                                            slug: getSlug(event.target.value),
                                        }));
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
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="parent_id">Parent Category</Label>
                            <div>
                                <Select
                                    id="parent_id"
                                    name="parent_id"
                                    value={formState["parent_id"]}
                                    color={
                                        formErrors["parent_id"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["parent_id"]
                                            ? formErrors["parent_id"][0]
                                            : false
                                    }
                                    onChange={(
                                        event: React.ChangeEvent<HTMLSelectElement>
                                    ) => {
                                        if (event.target.value === "0") {
                                            event.target.value = "null";
                                        }
                                        handleChange(event);
                                    }}
                                    required
                                >
                                    <option value={0}>
                                        Select a Parent Category
                                    </option>
                                    {productCategories
                                        .filter(
                                            (filterCategory) =>
                                                filterCategory.id !==
                                                formState.id
                                        )
                                        .map((category: CategoryType) => (
                                            <option
                                                value={category.id}
                                                key={category.id}
                                                selected={
                                                    category.id ===
                                                    props.category.has_parent
                                                        ?.id
                                                }
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                </Select>
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
                                    toaster({
                                        text: "Category has been updated",
                                        status: "success",
                                    });
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

export default EditCategoryModal;
