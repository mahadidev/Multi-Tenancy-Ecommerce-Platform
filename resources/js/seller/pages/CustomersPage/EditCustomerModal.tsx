/* eslint-disable react-hooks/exhaustive-deps */
import { ErrorMessage } from "@seller/components";
import PasswordInput from "@seller/components/Form/PasswordInput/PasswordInput";
import RenderInput from "@seller/components/RenderInput/RenderInput";
import useCustomer from "@seller/hooks/useCustomer";
import useForm from "@seller/hooks/useForm";
import { CustomerType } from "@type/customersType";
import { Button, Label, Modal } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
    customer: CustomerType;
}

const EditCustomerModal: FC<PropsType> = ({ customer }) => {
    const [isOpen, setOpen] = useState(false);
    const { update } = useCustomer();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: update.error,
        default: customer,
    });

    // Update form state when customer changes
    useEffect(() => {
        setFormState(customer);
    }, [customer]);

    const handleSubmit = () => {
        update.submit({
            formData: {
                id: customer.id,
                name: formState["name"],
                email: formState["email"],
                phone: formState["phone"]?.toString(),
                password: formState["password"]?.toString(),
                address: formState["address"],
            },
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <>
            <Button
                size="sm"
                color="primary"
                className="p-0 whitespace-nowrap"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <HiPencilAlt className="h-5 w-5" />
                    Edit Customer
                </div>
            </Button>

            <Modal show={isOpen} onClose={() => setOpen(false)}>
                <Modal.Header>Edit Customer</Modal.Header>
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
                                required
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
                        isProcessing={update.isLoading}
                        disabled={update.isLoading}
                        processingLabel="Saving"
                        processingSpinner={
                            <AiOutlineLoading className="animate-spin" />
                        }
                    >
                        Save all
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditCustomerModal;
