/* eslint-disable react-hooks/exhaustive-deps */
import { FileInput } from "@seller/components";
import LoadingOverlay from "@seller/components/LoadingOverlay/LoadingOverlay";
import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import useBrand from "@seller/hooks/useBrand";
import useCategory from "@seller/hooks/useCategory";
import useForm from "@seller/hooks/useForm";
import useProduct from "@seller/hooks/useProduct";
import useString from "@seller/hooks/useString";
import useToast from "@seller/hooks/useToast";
import { BrandType } from "@type/brandType";
import { CategoryType } from "@type/categoryType";
import {
    Button,
    Label,
    Select,
    Table,
    Textarea,
    TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CreateVariantModal from "./CreateVariantModal";

const ProductEditPage = () => {
    const { id } = useParams();
    const { productCategories } = useCategory();
    const { update, product, fetchProduct, removeVariant } = useProduct();
    const { brands } = useBrand();
    const { getSlug } = useString();
    const [attachments, setAttachments] = useState<string[]>([""]);
    const { handleChange, formState, formErrors, setFormState } = useForm({
        default: {
            id: product?.id || "",
            name: product?.name || "",
            slug: product?.slug || "",
            sku: product?.sku || "",
            category_id: product?.category?.id || "",
            brand: product?.brand?.id || "",
            price: product?.price,
            discount_amount: product?.discount_amount,
            stock: product?.stock,
            description: product?.description,
            short_description: product?.short_description,
            variants: product?.variants,
            attachments: product?.attachments || [],
        },
    });
    const { toaster } = useToast();

    useEffect(() => {
        if (id) {
            fetchProduct.submit({
                formData: {
                    id: id,
                },
            });
        }
    }, [id]);

    useEffect(() => {
        if (product) {
            setAttachments(product?.attachments || []);
            setFormState({
                id: product?.id || "",
                name: product?.name || "",
                slug: product?.slug || "",
                sku: product?.sku || "",
                category_id: product?.category?.id || "",
                brand_id: product?.brand?.id || "",
                price: product?.price,
                discount_amount: product?.discount_amount,
                stock: product?.stock,
                description: product?.description,
                short_description: product?.short_description,
                variants: product?.variants,
                attachments: product?.attachments || [],
            });
        }
    }, [product]);

    return (
        <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 relative">
            <PageBreadCrumb title="Edit Product" items={["Product", "Edit"]} />

            <section className="p-4">
                <div className="">
                    <div>
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full ">
                                <div className="flex flex-col col-span-full gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        placeholder="Product name"
                                        value={formState["name"]}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFormState((prev: any) => ({
                                                ...prev,
                                                slug: getSlug(e.target.value),
                                            }));
                                        }}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <TextInput
                                        id="slug"
                                        name="slug"
                                        placeholder="Product slug"
                                        value={formState["slug"]}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFormState((prev: any) => ({
                                                ...prev,
                                                slug: getSlug(e.target.value),
                                            }));
                                        }}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <TextInput
                                        id="sku"
                                        name="sku"
                                        placeholder="Product sku"
                                        value={formState["sku"]}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="category_id">
                                        Category
                                    </Label>
                                    <Select
                                        id="category_id"
                                        name="category_id"
                                        value={formState["category_id"]}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value={0}>
                                            Select a Category
                                        </option>
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
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="brand_id">Brand</Label>
                                    <Select
                                        id="brand_id"
                                        name="brand_id"
                                        value={formState["brand_id"]}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value={0}>
                                            Select a brand
                                        </option>
                                        {brands.map((brand: BrandType) => (
                                            <option
                                                value={brand.id}
                                                key={brand.id}
                                            >
                                                {brand.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <TextInput
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="Enter price"
                                        value={formState["price"]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="discount_amount">
                                        Discount amount
                                    </Label>
                                    <TextInput
                                        id="discount_amount"
                                        name="discount_amount"
                                        type="number"
                                        placeholder="Enter discount amount"
                                        value={formState["discount_amount"]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <TextInput
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        placeholder="Enter stock"
                                        value={formState["stock"]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2 col-span-full">
                                    <Label htmlFor="short_description">
                                        Sort Description
                                    </Label>
                                    <Textarea
                                        id="short_description"
                                        name="short_description"
                                        placeholder="Enter product short description"
                                        rows={5}
                                        value={formState["short_description"]}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 col-span-full">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Enter product description"
                                        rows={5}
                                        value={formState["description"]}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 col-span-full">
                                    <Label>Variants</Label>
                                    {product?.variants?.map((variant) => (
                                        <div
                                            className="dark:bg-[#374151] bg-[#F9FAFB] p-2.5 rounded-md  border border-solid border-slate-300"
                                            key={variant.id}
                                        >
                                            <div className="flex justify-between gap-2.5 dark:text-white">
                                                {variant.label}

                                                <p
                                                    className="cursor-pointer underline text-red-700"
                                                    onClick={() =>
                                                        removeVariant.submit({
                                                            formData: variant,
                                                        })
                                                    }
                                                >
                                                    Remove
                                                </p>
                                            </div>
                                            <div className="mt-2.5">
                                                <Table>
                                                    <Table.Head>
                                                        <Table.HeadCell>
                                                            Label
                                                        </Table.HeadCell>
                                                        <Table.HeadCell>
                                                            Price
                                                        </Table.HeadCell>
                                                        <Table.HeadCell>
                                                            Stock
                                                        </Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body>
                                                        {variant.options.map(
                                                            (option) => (
                                                                <Table.Row
                                                                    className="dark:text-white text-dark"
                                                                    key={
                                                                        option.id
                                                                    }
                                                                >
                                                                    <Table.Cell>
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {
                                                                            option.price
                                                                        }
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {
                                                                            option.qty_stock
                                                                        }
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            )
                                                        )}
                                                    </Table.Body>
                                                </Table>
                                            </div>
                                        </div>
                                    ))}
                                    <CreateVariantModal />
                                </div>
                                <div className="flex flex-col gap-6 col-span-full">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="thumbnail">
                                            Thumbnail
                                        </Label>
                                        <div>
                                            <FileInput
                                                id="thumbnail"
                                                name="thumbnail"
                                                placeholder="Click to upload thumbnail"
                                                value={
                                                    formState["thumbnail"] ??
                                                    product?.thumbnail
                                                }
                                                color={
                                                    formErrors["thumbnail"]
                                                        ? "failure"
                                                        : "gray"
                                                }
                                                helperText={
                                                    formErrors["thumbnail"]
                                                        ? formErrors[
                                                              "thumbnail"
                                                          ][0]
                                                        : false
                                                }
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    handleChange(event);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 col-span-full">
                                    <Label htmlFor="thumbnail">Images</Label>
                                    <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                                                            attachments.map(
                                                                (item, i) =>
                                                                    i === idx
                                                                        ? event
                                                                              ?.target
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
                                                                (_, i) =>
                                                                    i !== idx
                                                            )
                                                        );
                                                    }}
                                                    className="bg-red-500 text-white px-2 py-1 rounded absolute bottom-2 right-2 z-[50]"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-[200px]">
                                        <Button
                                            size="sm"
                                            color="primary"
                                            onClick={() =>
                                                setAttachments(
                                                    (prev: string[]) => [
                                                        ...prev,
                                                        "",
                                                    ]
                                                )
                                            }
                                        >
                                            <FaPlus /> &nbsp;&nbsp; Add image
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <LoadingOverlay
                    isLoading={fetchProduct.isLoading}
                    position="fixed"
                />
                <div className="flex justify-end mt-6">
                    <Button
                        color="primary"
                        onClick={() => {
                            update.submit({
                                formData: {
                                    ...formState,
                                    variants: product?.variants,
                                    attachments,
                                },
                                onSuccess: () => {
                                    toaster({
                                        text: "Product has been updated",
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
                </div>
            </section>
        </div>
    );
};

export default ProductEditPage;
