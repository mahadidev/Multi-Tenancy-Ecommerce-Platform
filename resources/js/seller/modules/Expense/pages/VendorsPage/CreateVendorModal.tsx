import useForm from "@seller/_hooks/useForm";
import useVendor from "@seller/_hooks/useVendor";
import TextInput from "@seller/components/Form/TextInput/TextInput";
import { Button, Label, Modal, Textarea } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreateVendorModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { create } = useVendor();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        create.submit({
            formData: formState,
            onSuccess: () => {
                setOpen(false);
                setFormState({});
            },
        });
    };

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create Vendor
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="2xl">
                <Modal.Header>Create a new Vendor</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <TextInput
                                name="name"
                                label="Vendor Name"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                                required={true}
                            />
                            <TextInput
                                name="contact_person"
                                label="Contact Person"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                            <TextInput
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                            />
                            <TextInput
                                name="email"
                                label="Email Address"
                                type="email"
                                formState={formState}
                                formErrors={formErrors}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="address" value="Address" />
                            <Textarea
                                id="address"
                                name="address"
                                value={formState.address || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter vendor address"
                            />
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="description" value="Description" />
                            <Textarea
                                id="description"
                                name="description"
                                value={formState.description || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter vendor description or notes"
                            />
                        </div>

                        <div className="flex items-center gap-x-3 pt-6">
                            <Button
                                color="primary"
                                type="submit"
                                disabled={create.isLoading}
                            >
                                {create.isLoading && (
                                    <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Vendor
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreateVendorModal;
