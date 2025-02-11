import useCustomer from "@seller/hooks/useCustomer";
import { CustomerType } from "@type/customersType";
import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";

interface PropsType {
    customer: CustomerType;
}

const DeleteCustomerModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const { delete: deleteCustomer } = useCustomer();

    return (
        <>
            <Button
                size="sm"
                color="gray"
                className="p-0 whitespace-nowrap"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <HiTrash className="h-5 w-5" />
                    Delete Customer
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
                <Modal.Header className="border-none p-2">
                    <span className="sr-only">Delete Customer</span>
                </Modal.Header>
                <Modal.Body className="px-6 pb-6 pt-0">
                    <div className="flex flex-col items-center gap-y-6 text-center">
                        <HiOutlineExclamationCircle className="mx-auto h-20 w-20 text-red-600" />
                        <p className="text-xl font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this{" "}
                            {props.customer.name}?
                        </p>
                        <div className="flex items-center gap-x-3">
                            <Button
                                color="gray"
                                theme={{ base: "px-0" }}
                                onClick={() => {
                                    deleteCustomer.submit({
                                        formData: {
                                            id: props.customer.id!,
                                        },
                                        onSuccess: () => {
                                            setOpen(false);
                                        },
                                    });
                                }}
                                isProcessing={deleteCustomer.isLoading}
                                disabled={deleteCustomer.isLoading}
                                processingLabel="Deleting"
                                processingSpinner={
                                    <AiOutlineLoading className="animate-spin" />
                                }
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
export default DeleteCustomerModal;
