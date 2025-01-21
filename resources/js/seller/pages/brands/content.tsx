import {
    Breadcrumb,
    Button,
    Checkbox,
    Label,
    Modal,
    Table,
    TextInput,
} from "flowbite-react";

import { RoutePath } from "@/seller/env";
import type { FC } from "react";
import { useState } from "react";
import {
    HiChevronLeft,
    HiChevronRight,
    HiDocumentDownload,
    HiHome,
    HiOutlineExclamationCircle,
    HiPencilAlt,
    HiPlus,
    HiTrash,
} from "react-icons/hi";

import { ImageInput } from "@/seller/components/";
import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import {
    useDeleteBrandMutation,
    useStoreBrandMutation,
    useUpdateBrandMutation,
} from "@/seller/store/reducers/brandApi";
import { MetaType } from "@/seller/types";
import { BrandType } from "@/seller/types/store";
import { AiOutlineLoading } from "react-icons/ai";
import { Link } from "react-router-dom";

const BrandsListPageContent: FC = function () {
    const { brandsMeta } = useAppSelector((state) => state.brand);
    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 w-full">
                    <div className="mb-4">
                        <Breadcrumb className="mb-5">
                            <Breadcrumb.Item href={RoutePath.dashboard}>
                                <div className="flex items-center gap-x-3">
                                    <HiHome className="text-xl" />
                                    <span>Dashboard</span>
                                </div>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Brands</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            All Brands
                        </h1>
                    </div>
                    <div className="sm:flex">
                        <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
                            <form className="lg:pr-3">
                                <Label
                                    htmlFor="brands-search"
                                    className="sr-only"
                                >
                                    Search
                                </Label>
                                <div className="relative mt-1 lg:w-64 xl:w-96">
                                    <TextInput
                                        id="brands-search"
                                        name="brands-search"
                                        placeholder="Search for brands"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                            <AddBrandModal />
                            <Button className="p-0" color="gray">
                                <div className="flex items-center gap-x-3">
                                    <HiDocumentDownload className="text-xl" />
                                    <span>Export</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <AllBrandsTable />
                        </div>
                    </div>
                </div>
            </div>
            {brandsMeta && <Pagination meta={brandsMeta} />}
        </>
    );
};

const AddBrandModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const [createBrand, { isLoading, error }] = useStoreBrandMutation();
    const { handleChange, formState, formErrors } = useForm({
        errors: error,
    });

    return (
        <>
            <Button color="blue" className="p-0" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create brand
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new brand</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Brand name"
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
                                    placeholder="Brand Slug"
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
                            <Label htmlFor="image">Image</Label>
                            <div>
                                <ImageInput
                                    id="image"
                                    name="image"
                                    placeholder="click to upload image"
                                    color={
                                        formErrors["image"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["image"]
                                            ? formErrors["image"][0]
                                            : false
                                    }
                                    value={formState["image"]}
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
                        color="blue"
                        onClick={() => {
                            createBrand({
                                formData: formState,
                            }).then((response: any) => {
                                if (response.data.status === 200) {
                                    setOpen(false);
                                }
                            });
                        }}
                        isProcessing={isLoading}
                        processingLabel="Creating"
                        processingSpinner={<AiOutlineLoading />}
                        disabled={isLoading}
                    >
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const AllBrandsTable: FC = function () {
    const { brands } = useAppSelector((state) => state.brand);

    return (
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <Table.Head
                className="bg-gray-100 dark:bg-gray-700"
                theme={{
                    cell: {
                        base: "p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400",
                    },
                }}
            >
                <Table.HeadCell className="p-4">
                    <Label htmlFor="select-all" className="sr-only">
                        Select all
                    </Label>
                    <Checkbox id="select-all" name="select-all" />
                </Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Slug</Table.HeadCell>
                <Table.HeadCell />
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {brands.map((brand: BrandType) => (
                    <Table.Row
                        key={brand.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Table.Cell className="w-4 p-4">
                            <Checkbox
                                aria-describedby="checkbox-1"
                                id="checkbox-1"
                            />
                        </Table.Cell>
                        <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                            <img
                                alt=""
                                src={brand.image}
                                className="w-10 h-10 rounded-full aspect-square object-cover"
                            />
                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                <div className="text-base font-semibold text-gray-900 dark:text-white">
                                    {brand.name}
                                </div>
                                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    10 products
                                </div>
                            </div>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {brand.slug}
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditBrandModal brand={brand} />
                                <DeleteBrandModal brand={brand} />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

const EditBrandModal: FC<{ brand: BrandType }> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const [updateBrand, { isLoading, error }] = useUpdateBrandMutation();
    const { handleChange, formState, formErrors } = useForm({
        errors: error,
        defaultState: {
            ...props.brand,
        },
    });

    return (
        <>
            <Button
                size="sm"
                color="blue"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <HiPencilAlt className="h-5 w-5" />
                    Edit brand
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Edit brand</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Brand name"
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
                                    placeholder="Brand Slug"
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
                            <Label htmlFor="image">Image</Label>
                            <div>
                                <ImageInput
                                    id="image"
                                    name="image"
                                    placeholder="click to upload image"
                                    color={
                                        formErrors["image"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["image"]
                                            ? formErrors["image"][0]
                                            : false
                                    }
                                    value={formState["image"]}
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
                        color="blue"
                        onClick={() => {
                            updateBrand({
                                formData: formState,
                                brandId: props.brand.id,
                            }).then((response: any) => {
                                if (response.data.status === 200) {
                                    setOpen(false);
                                }
                            });
                        }}
                        isProcessing={isLoading}
                        processingLabel="Saving"
                        processingSpinner={<AiOutlineLoading />}
                        disabled={isLoading}
                    >
                        Save all
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const DeleteBrandModal: FC<{ brand: BrandType }> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const [deleteBrand, { isLoading }] = useDeleteBrandMutation();
    return (
        <>
            <Button
                size="sm"
                color="failure"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <HiTrash className="h-5 w-5" />
                    Delete brand
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="border-none p-2">
                    <span className="sr-only">Delete brnad</span>
                </Modal.Header>
                <Modal.Body className="px-6 pb-6 pt-0">
                    <div className="flex flex-col items-center gap-y-6 text-center">
                        <HiOutlineExclamationCircle className="mx-auto h-20 w-20 text-red-600" />
                        <p className="text-xl font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this{" "}
                            {props.brand.name}?
                        </p>
                        <div className="flex items-center gap-x-3">
                            <Button
                                color="failure"
                                theme={{ base: "px-0" }}
                                onClick={() => {
                                    deleteBrand({
                                        brandId: props.brand.id,
                                    }).then((response: any) => {
                                        if (response.data.status === 200) {
                                            setOpen(false);
                                        }
                                    });
                                }}
                                isProcessing={isLoading}
                                processingLabel="Deleting"
                                processingSpinner={<AiOutlineLoading />}
                                disabled={isLoading}
                            >
                                <span className="text-base font-medium">
                                    Yes, I'm sure
                                </span>
                            </Button>
                            <Button
                                color="gray"
                                theme={{ base: "px-0" }}
                                onClick={() => setOpen(false)}
                            >
                                <span className="text-base font-medium">
                                    No, cancel
                                </span>
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

const Pagination: FC<{ meta: MetaType }> = function ({ meta }) {
    const [page, setPage] = useState(0);
    const numPages = meta.total;

    const previousPage = () => {
        setPage(page > 0 ? page - 1 : page);
    };

    const nextPage = () => {
        setPage(page < numPages - 1 ? page + 1 : page);
    };

    return (
        <div className="sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-white p-4 sm:flex sm:justify-between dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center sm:mb-0">
                <button
                    onClick={previousPage}
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <span className="sr-only">Previous page</span>
                    <HiChevronLeft className="h-7 w-7" />
                </button>
                <button
                    onClick={nextPage}
                    className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <span className="sr-only">Next page</span>
                    <HiChevronRight className="h-7 w-7" />
                </button>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing&nbsp;
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {meta.current_page}-{meta.last_page}
                    </span>
                    &nbsp;of&nbsp;
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {meta.total}
                    </span>
                </span>
            </div>
            <div className="flex items-center space-x-3">
                <Link
                    to="#"
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    <HiChevronLeft className="-ml-1 mr-1 h-5 w-5" />
                    Previous
                </Link>
                <Link
                    to="#"
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    Next
                    <HiChevronRight className="-mr-1 ml-1 h-5 w-5" />
                </Link>
            </div>
        </div>
    );
};

export default BrandsListPageContent;
