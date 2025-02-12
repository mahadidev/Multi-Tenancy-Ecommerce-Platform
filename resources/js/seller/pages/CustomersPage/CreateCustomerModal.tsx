import { ErrorMessage } from "@seller/components";
import PasswordInput from "@seller/components/Form/PasswordInput/PasswordInput";
import useCustomer from "@seller/hooks/useCustomer";
import useForm from "@seller/hooks/useForm";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreateCustomerModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { create } = useCustomer();

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
                    Create Customer
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new Customer</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Customer name"
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
                            <Label htmlFor="email">Email</Label>
                            <div>
                                <TextInput
                                    id="email"
                                    name="email"
                                    placeholder="Customer email"
                                    value={formState["email"]}
                                    color={
                                        formErrors["email"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["email"]
                                            ? formErrors["email"][0]
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
                            <Label htmlFor="password">Password</Label>
                            <div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formState["password"]}
                                    color={
                                        formErrors["password"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["password"]
                                            ? formErrors["password"][0]
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
                        </div>{" "}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <div>
                                <TextInput
                                    id="phone"
                                    name="phone"
                                    placeholder="Customer Phone"
                                    value={formState["phone"]}
                                    color={
                                        formErrors["phone"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["phone"]
                                            ? formErrors["phone"][0]
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
                            <Label htmlFor="phone">Address</Label>
                            <div>
                                <TextInput
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={formState["address"]}
                                    color={
                                        formErrors["address"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["address"]
                                            ? formErrors["address"][0]
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
                    </div>
                    {formErrors["message"] && (
                        <ErrorMessage>{formErrors["message"]}</ErrorMessage>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={() => {
                            create.submit({
                                formData: {
                                    name: formState["name"],
                                    email: formState["email"],
                                    password: formState["password"].toString(),

                                    phone: formState["phone"].toString(),
                                    address: formState["address"],
                                },
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
export default CreateCustomerModal;
