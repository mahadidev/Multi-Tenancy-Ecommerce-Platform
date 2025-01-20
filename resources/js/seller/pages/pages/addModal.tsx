import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import {
    useCreatePageMutation,
    useFetchPageTypesQuery,
} from "@/seller/store/reducers/pageApi";
import { PageTypeType } from "@/seller/types";
import {
    Button,
    Label,
    Modal,
    Select,
    TextInput,
    ToggleSwitch,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";

export default function AddPageModal() {
    const [isOpen, setOpen] = useState(false);
    const { currentStore: store } = useAppSelector((state) => state.store);
    const [createPage, { error, isLoading }] = useCreatePageMutation();
    const { formState, handleChange, formErrors, setFormState } = useForm({
        errors: error,
        defaultState: {
            is_active: 1,
        },
    });
    const { data: pageTypeResponse } = useFetchPageTypesQuery();
    // default page value
    useEffect(() => {
        if (pageTypeResponse) {
            setFormState((prev: any) => ({
                ...prev,
                type: pageTypeResponse.data[0].id,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageTypeResponse]);

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
                                    {pageTypeResponse?.data.map(
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
}
