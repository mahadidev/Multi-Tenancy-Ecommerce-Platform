import StatusBadge from "@seller/components/Badge/StatusBadge";
import { OrderType } from "@type/orderType";
import { Card, Table } from "flowbite-react";

interface OrderSummaryProps {
    order: OrderType;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
    const { items } = order; // items

    return (
			<div className="overflow-x-auto mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 transition-colors">
				<div className="grid md:grid-cols-2 gap-6 mb-8">
					{/* Customer Details */}
					<Card className="bg-white dark:bg-gray-800 transition-colors">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Customer Details
						</h2>
						<p className="text-gray-900 dark:text-gray-300">
							<strong>Name:</strong> {order?.name}
						</p>
						<p className="text-gray-900 dark:text-gray-300">
							<strong>Email:</strong> {order?.email}
						</p>
						<p className="text-gray-900 dark:text-gray-300">
							<strong>Phone:</strong> {order?.phone}
						</p>
						<p className="text-gray-900 dark:text-gray-300">
							<strong>Address:</strong> {order?.address}
						</p>
					</Card>

					{/* Order Details */}
					<Card className="bg-white dark:bg-gray-800 transition-colors">
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">
							Order Details
						</h2>
						<p className="text-gray-900 dark:text-gray-300">
							<strong>Order No:</strong> {order?.order_uuid}
						</p>
						<p className="text-gray-900 dark:text-gray-300">
							<strong>Order Date:</strong> {order?.created_at}
						</p>
						<p className="text-gray-900 dark:text-gray-300">
							<strong>Status:</strong> <StatusBadge status={order?.status} />
						</p>
						<p className="text-gray-900 dark:text-gray-300">
							<strong>Payment Method:</strong>{' '}
							<span className="text-green-500">{order?.payment_method}</span>
						</p>
						{/* <p className="text-gray-900 dark:text-gray-300">
                        <strong>Notes:</strong> {order?.}
                    </p> */}
					</Card>
				</div>

				<div>
					<h2 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white">
						Order Summary
					</h2>
					<div className="overflow-x-auto">
						<Table hoverable>
							<Table.Head className="bg-gray-100 dark:bg-gray-800">
								<Table.HeadCell className="text-gray-900 dark:text-gray-300">
									Item Description
								</Table.HeadCell>
								<Table.HeadCell className="text-gray-900 dark:text-gray-300">
									Quantity
								</Table.HeadCell>
								<Table.HeadCell className="text-gray-900 dark:text-gray-300">
									Unit Price
								</Table.HeadCell>
								<Table.HeadCell className="text-gray-900 dark:text-gray-300">
									Discount
								</Table.HeadCell>
								<Table.HeadCell className="text-gray-900 dark:text-gray-300">
									Total
								</Table.HeadCell>
							</Table.Head>
							<Table.Body className="divide-y dark:divide-gray-700">
								{items.map((item, index) => (
									<Table.Row
										key={index}
										className="bg-gray-50 dark:bg-gray-800"
									>
										<Table.Cell className="font-medium text-gray-900 dark:text-gray-300">
											{item.product?.name}
										</Table.Cell>
										<Table.Cell className="text-gray-900 dark:text-gray-300">
											{item?.qty}
										</Table.Cell>
										<Table.Cell className="text-gray-900 dark:text-gray-300">
											{item.price?.toFixed(2)} BDT
										</Table.Cell>
										<Table.Cell className="text-gray-900 dark:text-gray-300">
											{item.price - item.discount_price} BDT
										</Table.Cell>
										<Table.Cell className="text-gray-900 dark:text-gray-300">
											{item.total.toFixed(2)} BDT
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</div>
					<div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 font-bold text-lg flex justify-between rounded-lg">
						<span className="text-gray-900 dark:text-gray-300">
							Total Amount
						</span>
						<span className="text-green-600 dark:text-green-400">
							{order.total} BDT
						</span>
					</div>
				</div>
			</div>
		);
};

export default OrderSummary;
