import useCategory from "@seller/hooks/useCategory";
import useForm from "@seller/hooks/useForm";
import useProduct from "@seller/hooks/useProduct";
import useString from "@seller/hooks/useString";
import { CategoryType } from "@type/categoryType";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";
import { FileInput } from "../../components";

const CreateProductModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { create } = useProduct();
    const { productCategories } = useCategory();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
    });
    const { getSlug } = useString();
    const [attachments, setAttachments] = useState<string[]>([""]);

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create Product
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new Product</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Product name"
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
                                    placeholder="Product slug"
                                    value={formState["slug"]}
                                    color={
                                        formErrors["slug"] ? "failure" : "gray"
                                    }
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
                            <Label htmlFor="sku">SKU</Label>
                            <div>
                                <TextInput
                                    id="sku"
                                    name="sku"
                                    placeholder="Product sku"
                                    value={formState["sku"]}
                                    color={
                                        formErrors["sku"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["sku"]
                                            ? formErrors["sku"][0]
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
                            <Label htmlFor="price">Price</Label>
                            <div>
                                <TextInput
                                    id="price"
                                    name="price"
                                    placeholder="Product price"
                                    value={formState["price"]}
                                    color={
                                        formErrors["price"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["price"]
                                            ? formErrors["price"][0]
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
                            <Label htmlFor="category_id">Category</Label>
                            <div>
                                <Select
                                    id="category_id"
                                    name="category_id"
                                    value={formState["category_id"]}
                                    color={
                                        formErrors["category_id"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["category_id"]
                                            ? formErrors["category_id"][0]
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
                                    <option value={0}>Select a Category</option>
                                    {productCategories?.map(
                                        (category: CategoryType) => (
                                            <option
                                                value={category.id}
                                                key={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        )
                                    )}
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 col-span-full">
                            <Label htmlFor="thumbnail">Thumbnail</Label>
                            <div>
                                <FileInput
                                    id="thumbnail"
                                    name="thumbnail"
                                    placeholder="Click to upload thumbnail"
                                    value={formState["thumbnail"]}
                                    color={
                                        formErrors["thumbnail"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["thumbnail"]
                                            ? formErrors["thumbnail"][0]
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
                        <div className="flex flex-col gap-2 col-span-full">
                            <Label htmlFor="thumbnail">Images</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {" "}
                                {attachments?.map((_, idx: number) => (
                                    <div key={idx} className="relative">
                                        <FileInput
                                            id={`attachment-${idx}`}
                                            name="attachments"
                                            placeholder="Click to upload image"
                                            value={attachments[idx]}
                                            onChange={(
                                                event: React.ChangeEvent<HTMLInputElement>
                                            ) => {
                                                setAttachments(
                                                    attachments.map((item, i) =>
                                                        i === idx
                                                            ? event?.target
                                                                  ?.value
                                                            : item
                                                    )
                                                );
                                            }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAttachments(
                                                    attachments.filter(
                                                        (_, i) => i !== idx
                                                    )
                                                );
                                            }}
                                            className="bg-red-500 text-white px-2 py-1 rounded absolute bottom-2 right-2 z-[99999999]"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2">
                                <Button
                                    size="sm"
                                    color="primary"
                                    onClick={() =>
                                        setAttachments((prev: string[]) => [
                                            ...prev,
                                            "",
                                        ])
                                    }
                                >
                                    <FaPlus /> &nbsp;&nbsp; Add image
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={() => {
                            create.submit({
                                formData: {
                                    ...formState,
                                    attachments,
                                },
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
export default CreateProductModal;
