import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import { SELLER_PREFIX } from "@/seller/store/env";
import {
    useCreatePageMutation,
    useFetchPagesQuery,
} from "@/seller/store/reducers/pageApi";
import {
    Breadcrumb,
    Button,
    Checkbox,
    Label,
    Modal,
    Table,
    TextInput,
    ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { HiHome } from "react-icons/hi";

const AddPageModal = function () {
    const [isOpen, setOpen] = useState(false);
    const { currentStore: store } = useAppSelector((state) => state.store);
    const [createPage, { error, isLoading }] = useCreatePageMutation();

    const { formState, handleChange, formErrors, setFormState } = useForm({
        errors: error,
    });

    useEffect(() => {
        setFormState((prev: any) => ({
            ...prev,
            is_active: 1,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Button color="blue" onClick={() => setOpen(!isOpen)}>
                <FaPlus className="mr-3 text-sm" />
                Add page
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
                    Add page
                </Modal.Header>
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
                                            ? "Store active"
                                            : "Store deactive"
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
                            }).then((response: any) => {
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

const PagesPage = () => {
    const { currentStore: store } = useAppSelector((state) => state.store);
    const { data: pagesResponse, isLoading } = useFetchPagesQuery(store.id);

    useEffect(() => {
        if (pagesResponse) {
            console.log(pagesResponse.data.pages);
        }
    }, [isLoading, pagesResponse]);
    return (
        <>
            <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 w-full">
                    <div className="mb-4">
                        <Breadcrumb className="mb-5">
                            <Breadcrumb.Item href={`${SELLER_PREFIX}`}>
                                <div className="flex items-center gap-x-3">
                                    <HiHome className="text-xl" />
                                    <span className="dark:text-white">
                                        Dashboard
                                    </span>
                                </div>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Pages</Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            All pages
                        </h1>
                    </div>

                    <div className="block items-center sm:flex">
                        <div className="flex w-full items-center sm:justify-end">
                            <AddPageModal />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow">
                            <Table
                                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
                                theme={{
                                    head: {
                                        base: "bg-gray-100 dark:bg-gray-700",
                                        cell: {
                                            base: "p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400",
                                        },
                                    },
                                    body: {
                                        cell: {
                                            base: "rounded-none",
                                        },
                                    },
                                }}
                            >
                                <Table.Head className="bg-gray-100 dark:bg-gray-700">
                                    {" "}
                                    <Table.HeadCell>
                                        <span className="sr-only">
                                            Toggle selected
                                        </span>
                                        <Checkbox />
                                    </Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>Title</Table.HeadCell>
                                    <Table.HeadCell>Status</Table.HeadCell>
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {pagesResponse?.data.pages.map(
                                        (item: any, index: number) => (
                                            <Table.Row
                                                key={index}
                                                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <Table.Cell className="w-4 p-4">
                                                    <Checkbox />
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    {item.name}
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    {item.title}
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    {item.is_active == 1
                                                        ? "Active"
                                                        : "Deactive"}
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                                                    w
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PagesPage;
