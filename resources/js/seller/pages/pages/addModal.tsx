import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import { useCreatePageMutation } from "@/seller/store/reducers/pageApi";
import { Button, Label, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";

export default function AddPageModal() {
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
}
