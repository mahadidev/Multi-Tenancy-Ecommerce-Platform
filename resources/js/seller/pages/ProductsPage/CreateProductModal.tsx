import RenderInput from "@seller/components/RenderInput/RenderInput";
import useCategory from "@seller/hooks/useCategory";
import useForm from "@seller/hooks/useForm";
import useProduct from "@seller/hooks/useProduct";
import useString from "@seller/hooks/useString";
import { CategoryType } from "@type/categoryType";
import { Button, Label, Modal, Select } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";
import { FileInput } from "../../components";
import MultipleImageUploader from "./ProductEditPage/MultipleImageUploader";

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
                        <RenderInput
                            id="name"
                            label="Product Name"
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
                        <RenderInput
                            id="slug"
                            label="Product Slug"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                        />
                        <RenderInput
                            id="sku"
                            label="Product sku"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                        />
                        <RenderInput
                            id="price"
                            label="Product Price"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                            type="number"
                        />
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
                        <MultipleImageUploader
                            attachments={attachments}
                            setAttachments={setAttachments}
                            gridStyle="grid lg:grid-cols-1 xl:grid-cols-2 gap-2"
                        />
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
