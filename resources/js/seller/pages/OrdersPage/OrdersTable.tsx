import { DataTable } from "@seller/components";
import StatusBadge from "@seller/components/Badge/StatusBadge";
import useOrders from "@seller/hooks/useOrders";
import useToast from "@seller/hooks/useToast";
import { OrderType } from "@type/orderType";
import { Button, Checkbox, Label, Table } from "flowbite-react";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import OrderInfoModal from "./OrderInfoModal";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";

const OrdersTable = () => {
    // get the orders
    const { orders, bulkShipmentOrders } = useOrders({});
    const { toaster } = useToast();
    const [orderIds, setOrderIds] = useState<number[]>([]);

    return (
			<>
				<DataTable
					columns={[
						{
							label: (
								<>
									{' '}
									<Label htmlFor="select-all" className="sr-only">
										Select all
									</Label>
									<Checkbox disabled id="select-all" name="select-all" />{' '}
								</>
							),
							key: 'id',
							render: (row: OrderType) => (
								<Table.Cell className="w-4 p-4">
									<Checkbox
										aria-describedby="checkbox-1"
										id="checkbox-1"
										onChange={() =>
											setOrderIds(
												(prev) =>
													prev.includes(row?.id)
														? prev.filter((id) => id !== row?.id) // Remove if exists
														: [...prev, row?.id] // Add if not exists
											)
										}
										defaultChecked={row?.status === 'shipping' && false}
										disabled={row?.status === 'shipping'}
									/>
								</Table.Cell>
							),
						},
						{
							label: 'Product',
							render: (row: OrderType) => (
								<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
									{row.items.map((item, index: number) => (
										<span key={item.id}>{item.item} {index + 1 < row.items.length && " | "}</span>
									))}
								</Table.Cell>
							),
							sortable: true,
						},
						{
							label: 'Customer Name',
							key: 'user_name',
							render: (row: OrderType) => (
								<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
									{row?.user?.name}
								</Table.Cell>
							),
							sortable: false,
						},
						{
							label: 'Total',
							key: 'total',
							render: (row: OrderType) => (
								<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
									{row?.total ?? 0.0}BDT
								</Table.Cell>
							),
							sortable: true,
						},
						{
							label: 'Payment Method',
							key: 'payment_method',
							render: (row: OrderType) => (
								<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
									{row?.payment_method}
								</Table.Cell>
							),
							sortable: true,
						},
						{
							label: 'Status',
							key: 'status',
							render: (row: OrderType) => (
								<Table.Cell className="capitalize whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
									<StatusBadge status={row?.status} />
								</Table.Cell>
							),
							sortable: true,
						},
						{
							label: 'Created At',
							key: 'created_at',
							render: (row: OrderType) => (
								<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
									{row.created_at}
								</Table.Cell>
							),
							sortable: true,
						},
						{
							render: (row: OrderType) => (
								<Table.Cell>
									<div className="flex items-center gap-x-3 whitespace-nowrap">
										<UpdateOrderStatusModal order={row} />
										<OrderInfoModal order={row} />
									</div>
								</Table.Cell>
							),
						},
					]}
					search={{
						placeholder: 'Search for order...',
						columns: [
							'order_uuid',
							'user_name',
							'user_email',
							'total',
							'created_at',
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
										bulkShipmentOrders.submit({
											formData: { orders: orderIds },
											onSuccess: () => {
												toaster({
													text: 'Orders have been shipped',
													status: 'success',
												});
												setOrderIds([]);
											},
										})
									}
									isProcessing={bulkShipmentOrders.isLoading}
									disabled={bulkShipmentOrders.isLoading || !orderIds?.length}
									processingLabel="Shipping..."
									processingSpinner={
										<AiOutlineLoading className="animate-spin" />
									}
								>
									<div className="flex items-center gap-x-2">Bulk Shipment</div>
								</Button>
								<Button
									as={Link}
									to={`/orders/create`}
									size="md"
									color="primary"
									className="p-0"
								>
									<div className="flex items-center gap-x-2">
										<HiPlus className="h-5 w-5" />
										Create Order
									</div>
								</Button>
							</>
						),
					}}
					data={orders!}
					exportable={true}
					filename="orders"
				/>
			</>
		);
};
export default OrdersTable;
