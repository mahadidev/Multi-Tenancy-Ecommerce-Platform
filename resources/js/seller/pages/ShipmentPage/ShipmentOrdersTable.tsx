import { DataTable } from "@seller/components";
import StatusBadge from "@seller/components/Badge/StatusBadge";
import useOrders from "@seller/hooks/useOrders";
import useToast from "@seller/hooks/useToast";
import { ShipmentOrderType } from "@type/shipmentOrdersType";
import { Button, Table } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";

const ShipmentOrdersTable = () => {
    // get the orders
    const { shipmentOrders, syncShipmentOrders } = useOrders();
    const { toaster } = useToast();
    return (
        <>
            <DataTable
                columns={[
                    {
                        label: "Invoice ID",
                        key: "invoice",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.invoice}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Customer Name",
                        key: "recipient_name",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.recipient_name}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Customer Phone",
                        key: "recipient_phone",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.recipient_phone}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },

                    {
                        label: "Consignment ID",
                        key: "consignment_id",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.consignment_id}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Tracking Code",
                        key: "tracking_code",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.tracking_code}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Order Id",
                        key: "order_id",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.order_id}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Store Id",
                        key: "store_id",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row?.store_id}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="capitalize whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                <StatusBadge status={row?.status} />
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    {
                        label: "Created At",
                        key: "created_at",
                        render: (row: ShipmentOrderType) => (
                            <Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
                                {row.created_at}
                            </Table.Cell>
                        ),
                        sortable: true,
                    },
                    // {
                    //     render: (row: OrderType) => (
                    //         <Table.Cell>
                    //             <div className="flex items-center gap-x-3 whitespace-nowrap">
                    //                 <UpdateOrderStatusModal order={row} />
                    //                 <OrderInfoModal order={row} />
                    //             </div>
                    //         </Table.Cell>
                    //     ),
                    // },
                ]}
                search={{
                    placeholder: "Search for shipment...",
                    columns: [
                        "invoice",
                        "recipient_name",
                        "recipient_phone",
                        "tracking_code",
                    ],
                }}
                head={{
                    render: () => (
                        <>
                            <Button
                                size="md"
                                color="primary"
                                className="p-0"
                                onClick={() =>
                                    syncShipmentOrders.submit({
                                        formData: {},
                                        onSuccess: () => {
                                            toaster({
                                                text: "Orders have been synchronized",
                                                status: "success",
                                            });
                                        },
                                    })
                                }
                                isProcessing={syncShipmentOrders.isLoading}
                                disabled={syncShipmentOrders.isLoading}
                                processingLabel="Syncing..."
                                processingSpinner={
                                    <AiOutlineLoading className="animate-spin" />
                                }
                            >
                                <div className="flex items-center gap-x-2">
                                    Sync Shipment
                                </div>
                            </Button>
                        </>
                    ),
                }}
                data={shipmentOrders!}
                exportable={true}
                filename="shipmentOrders"
            />
        </>
    );
};
export default ShipmentOrdersTable;
