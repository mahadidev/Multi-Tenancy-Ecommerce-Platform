import {
    Breadcrumb,
    Button,
    Checkbox,
    Label,
    Modal,
    Select,
    Table,
    TextInput,
    ToggleSwitch,
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

import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import {
    useCreatePageMutation,
    useDeletePageMutation,
} from "@/seller/store/reducers/pageApi";
import { MetaType, PageTypeType, StorePageType } from "@/seller/types";
import { AiOutlineLoading } from "react-icons/ai";
import { Link } from "react-router-dom";

const PagesContent: FC = function () {
    const { pagesMeta } = useAppSelector((state) => state.page);
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
                            <Breadcrumb.Item>Pages</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            All Pages
                        </h1>
                    </div>
                    <div className="sm:flex">
                        <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
                            <form className="lg:pr-3">
                                <Label
                                    htmlFor="pages-search"
                                    className="sr-only"
                                >
                                    Search
                                </Label>
                                <div className="relative mt-1 lg:w-64 xl:w-96">
                                    <TextInput
                                        id="pages-search"
                                        name="pages-search"
                                        placeholder="Search for pages"
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                            <AddPageModal />
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
                            <AllPagesTable />
                        </div>
                    </div>
                </div>
            </div>
            {pagesMeta && <Pagination meta={pagesMeta} />}
        </>
    );
};

const AddPageModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { currentStore: store } = useAppSelector((state) => state.store);
    const [createPage, { error, isLoading }] = useCreatePageMutation();
    const { pageTypes } = useAppSelector((state) => state.page);
    const { formState, handleChange, formErrors, setFormState } = useForm({
        errors: error,
        defaultState: {
            is_active: 1,
            type: pageTypes[0] ? pageTypes[0].id : 0,
        },
    });

    return (
        <>
            <Button color="blue" className="p-0" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create page
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new page</Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <Label
                                    htmlFor="page-name"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Page Name
                                </Label>
                                <TextInput
                                    name="name"
                                    id="page-name"
                                    placeholder="Page name"
                                    type="text"
                                    value={formState["name"]}
                                    color={
                                        formErrors["name"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["name"]
                                            ? formErrors["name"][0]
                                            : false
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="page-slug"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Page Slug
                                </Label>
                                <TextInput
                                    name="slug"
                                    id="page-slug"
                                    placeholder="Page slug"
                                    type="text"
                                    value={formState["slug"]}
                                    color={
                                        formErrors["slug"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["slug"]
                                            ? formErrors["slug"][0]
                                            : false
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-full">
                                <Label
                                    htmlFor="page-title"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Page Title
                                </Label>
                                <TextInput
                                    name="title"
                                    id="page-title"
                                    placeholder="Page title"
                                    type="text"
                                    value={formState["title"]}
                                    color={
                                        formErrors["title"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["title"]
                                            ? formErrors["title"][0]
                                            : false
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-span-full">
                                <Label
                                    htmlFor="page-type"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Page Type
                                </Label>
                                <Select
                                    name="type"
                                    id="page-type"
                                    value={formState["type"]}
                                    color={
                                        formErrors["type"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["type"]
                                            ? formErrors["type"][0]
                                            : false
                                    }
                                    onChange={handleChange}
                                    required
                                >
                                    {pageTypes.map(
                                        (type: PageTypeType, index: number) => (
                                            <option value={type.id} key={index}>
                                                {type.label}
                                            </option>
                                        )
                                    )}
                                </Select>
                            </div>

                            <div>
                                <ToggleSwitch
                                    color="blue"
                                    sizing="md"
                                    checked={
                                        formState["is_active"] === 1
                                            ? true
                                            : false
                                    }
                                    id="company-news"
                                    label={
                                        formState["is_active"] === 1
                                            ? "Page active"
                                            : "Page deactive"
                                    }
                                    name="company-news"
                                    onChange={() =>
                                        setFormState((prev: any) => ({
                                            ...prev,
                                            is_active:
                                                prev.is_active === 1 ? 0 : 1,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color={
                            formState["name"] &&
                            formState["slug"] &&
                            formState["title"]
                                ? "blue"
                                : "gray"
                        }
                        className="md:w-1/2 [&>span]:text-sm ml-auto"
                        isProcessing={isLoading}
                        processingLabel="Creating"
                        disabled={
                            !formState["name"] ||
                            !formState["slug"] ||
                            !formState["title"] ||
                            isLoading
                        }
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                        onClick={() =>
                            createPage({
                                storeId: store.id,
                                formData: formState,
                            }).then((response) => {
                                if (response.data.status === 200) {
                                    setOpen(false);
                                }
                            })
                        }
                    >
                        Add page
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const AllPagesTable: FC = function () {
    const { pages } = useAppSelector((state) => state.page);

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
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Type</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Last Update</Table.HeadCell>
                <Table.HeadCell />
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {pages.map((page: StorePageType) => (
                    <Table.Row
                        key={page.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Table.Cell className="w-4 p-4">
                            <Checkbox />
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {page.name}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {page.title}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {page.type.label}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {page.is_active == 1 ? "Active" : "Deactive"}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {page.updated_at}
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <Button
                                    className="w-max"
                                    size="sm"
                                    color="blue"
                                    to={RoutePath.pages.edit(page.id)}
                                    as={Link}
                                >
                                    <HiPencilAlt className="mr-2 h-5 w-5" />
                                    Edit Page
                                </Button>
                                <DeletePageModal page={page} />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

const DeletePageModal: FC<{ page: StorePageType }> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const [deletePage, { isLoading }] = useDeletePageMutation();
    const { currentStore: store } = useAppSelector((state) => state.store);
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
                    Delete page
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="border-none p-2">
                    <span className="sr-only">Delete page</span>
                </Modal.Header>
                <Modal.Body className="px-6 pb-6 pt-0">
                    <div className="flex flex-col items-center gap-y-6 text-center">
                        <HiOutlineExclamationCircle className="mx-auto h-20 w-20 text-red-600" />
                        <p className="text-xl font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this{" "}
                            {props.page.name}?
                        </p>
                        <div className="flex items-center gap-x-3">
                            <Button
                                color="failure"
                                theme={{ base: "px-0" }}
                                onClick={() => {
                                    deletePage({
                                        storeId: store.id,
                                        pageId: props.page.id,
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

export default PagesContent;
