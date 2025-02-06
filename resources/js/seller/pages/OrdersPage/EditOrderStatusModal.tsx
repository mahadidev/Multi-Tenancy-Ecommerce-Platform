/* eslint-disable react-hooks/exhaustive-deps */
import {
    orderStatuses,
    OrderStatusType,
} from "@seller/components/Badge/StatusBadge";
import useForm from "@seller/hooks/useForm";
import useOrders from "@seller/hooks/useOrders";
import useToast from "@seller/hooks/useToast";
import { OrderType } from "@type/orderType";
import { Button, Label, Modal, Select } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
    order: OrderType;
}

const EditOrderStatusModal: FC<PropsType> = function (props) {
    const [isOpen, setOpen] = useState(false);
    const { updateOrderStatus } = useOrders();
    const { toaster } = useToast();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: updateOrderStatus.error,
        default: {
            id: props?.order?.id,
            status: props?.order?.status,
        },
    });

    // reload data
    useEffect(() => {
        if (props.order) {
            setFormState({
                id: props?.order?.id,
                status: props?.order?.status,
            });
        }
    }, [props.order]);

    return (
        <>
            <Button
                size="sm"
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-2">
                    <HiPencilAlt className="h-5 w-5" />
                    Update Status
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                {" "}
                <Modal.Header>Update Order Status</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="slug">Status</Label>
                            <div>
                                <Select
                                    id="status"
                                    name="status"
                                    value={formState["status"]}
                                    color={
                                        formErrors["status"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["status"]
                                            ? formErrors["status"][0]
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
                                    {orderStatuses?.map(
                                        (
                                            status: OrderStatusType,
                                            idx: number
                                        ) => (
                                            <option
                                                value={status?.value}
                                                key={idx}
                                                selected={
                                                    status?.value ===
                                                    props?.order?.status
                                                }
                                            >
                                                {status?.label}
                                            </option>
                                        )
                                    )}
                                </Select>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={() => {
                            updateOrderStatus.submit({
                                formData: formState,
                                onSuccess: () => {
                                    setOpen(false);
                                    toaster({
                                        text: "Order has been updated",
                                        status: "success",
                                    });
                                },
                            });
                        }}
                        isProcessing={updateOrderStatus.isLoading}
                        disabled={updateOrderStatus.isLoading}
                        processingLabel="Saving"
                        processingSpinner={
                            <AiOutlineLoading className="animate-spin" />
                        }
                    >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditOrderStatusModal;
