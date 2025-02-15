/* eslint-disable react-hooks/exhaustive-deps */
import { ErrorMessage } from "@seller/components";
import PasswordInput from "@seller/components/Form/PasswordInput/PasswordInput";
import useCustomer from "@seller/hooks/useCustomer";
import useForm from "@seller/hooks/useForm";
import { CustomerType } from "@type/customersType";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
    customer: CustomerType;
}

const EditCustomerModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const { update } = useCustomer();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: update.error,
        default: {
            ...props.customer,
            id: props?.customer?.id,
        },
    });

    // reload data
    useEffect(() => {
        if (props.customer) {
            setFormState(props.customer);
        }
    }, [props.customer]);
    console.log(props.customer);
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
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                {" "}
                <Modal.Header>Edit Customer</Modal.Header>
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
                        {/* <div className="flex flex-col gap-2">
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
                            <Label htmlFor="confirm_password">
                                Confirm Password
                            </Label>
                            <div>
                                <PasswordInput
                                    id="confirm_password"
                                    name="confirm_password"
                                    placeholder="••••••••"
                                    value={formState["confirm_password"]}
                                    color={
                                        formErrors["confirm_password"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["confirm_password"]
                                            ? formErrors["confirm_password"][0]
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
                        </div> */}
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
                            update.submit({
                                formData: {
                                    id: props?.customer?.id,
                                    name: formState["name"],
                                    email: formState["email"],
                                    phone: formState["phone"].toString(),
                                    password: formState["password"].toString(),
                                    address: formState["address"],
                                },
                                onSuccess: () => {
                                    setOpen(false);
                                },
                            });
                        }}
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
