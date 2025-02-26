import { ErrorMessage } from "@seller/components";
import PasswordInput from "@seller/components/Form/PasswordInput/PasswordInput";
import RenderInput from "@seller/components/RenderInput/RenderInput";
import useCustomer from "@seller/hooks/useCustomer";
import useForm from "@seller/hooks/useForm";
import { Button, Label, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreateCustomerModal: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const { create } = useCustomer();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
    });

    const handleSubmit = () => {
        create.submit({
            formData: {
                name: formState["name"],
                email: formState["email"],
                password: formState["password"]?.toString(),
                phone: formState["phone"]?.toString(),
                address: formState["address"],
            },
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
                    Create Customer
                </div>
            </Button>

            <Modal show={isOpen} onClose={() => setOpen(false)}>
                <Modal.Header>Create a new Customer</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <RenderInput
                            id="name"
                            label="Name"
                            formErrors={formErrors}
                            handleChange={handleChange}
                            formState={formState}
                        />
                        <RenderInput
                            id="email"
                            label="Email"
                            formErrors={formErrors}
                            handleChange={handleChange}
                            formState={formState}
                        />{" "}
                        <RenderInput
                            id="phone"
                            label="Phone"
                            formErrors={formErrors}
                            handleChange={handleChange}
                            formState={formState}
                        />
                        <RenderInput
                            id="address"
                            label="Address"
                            formErrors={formErrors}
                            handleChange={handleChange}
                            formState={formState}
                        />
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formState["password"] || ""}
                                color={
                                    formErrors["password"] ? "failure" : "gray"
                                }
                                helperText={formErrors["password"]?.[0] || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {formErrors["message"] && (
                        <ErrorMessage>{formErrors["message"]}</ErrorMessage>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={handleSubmit}
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

export default CreateCustomerModal;
