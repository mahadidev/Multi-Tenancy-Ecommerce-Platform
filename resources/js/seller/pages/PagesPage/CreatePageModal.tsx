import FormInput from "@seller/components/FormInput/FormInput";
import useForm from "@seller/hooks/useForm";
import usePage from "@seller/hooks/usePage";
import { PageTypeType } from "@type/pageType";
import { Button, Label, Modal, Select } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreatePageModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { create, pageTypes } = usePage();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
    });

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create Page
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new Page</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormInput
                            id="name"
                            label="Name"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                        />

                        <FormInput
                            id="title"
                            label="Page title"
                            formState={formState}
                            formErrors={formErrors}
                            handleChange={handleChange}
                        />
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="type">Type</Label>
                            <div>
                                <Select
                                    id="type"
                                    name="type"
                                    value={formState["type"]}
                                    color={
                                        formErrors["type"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["type"]
                                            ? formErrors["type"][0]
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
                                    <option value={0}>Select page type</option>
                                    {pageTypes?.map((type: PageTypeType) => (
                                        <option value={type.id} key={type.id}>
                                            {type.label}
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
                            create.submit({
                                formData: formState,
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
export default CreatePageModal;
