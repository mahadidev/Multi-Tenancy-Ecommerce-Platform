import { useAppSelector } from '@seller/store/store';
import { Button } from 'flowbite-react';
import React from 'react';
import { OrderReceiptType } from '../types';

interface OrderReceiptProps {
	order: OrderReceiptType;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({ order }) => {
	const { store } = useAppSelector((state) => state.store);
	const contentRef = React.useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		if (contentRef.current) {
			const printWindow = window.open('', '_blank');
			if (printWindow) {
				printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Order Receipt</title>
                        <style>
                            @page {
                                size: 80mm auto;
                                margin: 0;
                                padding: 0;
                            }
                            body {
                                margin: 0 !important;
                                padding: 0 !important;
                                font-family: Arial, sans-serif;
                                font-size: 10px;
                            }
                        </style>
                    </head>
                    <body>
                        ৳{printContent.innerHTML}
                    </body>
                    </html>
                `);
				printWindow.document.close();
				printWindow.print();
			}
		}
	};

	const totalDiscount =
		order?.items?.reduce(
			(sum, item) => sum + (item.price - (item.discount_price ?? 0) || 0),
			0
		) || 0;

	const totalTax =
		order?.items?.reduce((sum, item) => sum + (item.tax || 0), 0) || 0;

	const totalShipping = order?.items?.reduce((sum, _item) => sum + 0, 0) || 0;

	return (
		<div className="p-2">
			<div
				ref={contentRef}
				style={{
					width: '80mm',
					padding: '5mm',
					fontSize: '10px',
				}}
				className="mx-auto"
			>
				{/* Store Header */}
				<div className="text-center mb-2">
					<h1 className="font-bold text-lg">{store?.name}</h1>
					<div className="text-xs">-----------------------------</div>
				</div>

				{/* Order Info */}
				<div className="mb-3">
					<div className="flex justify-between">
						<span className="font-bold">Order #:</span>
						<span>{order.id}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-bold">Date:</span>
						<span>{new Date(order.created_at).toLocaleString()}</span>
					</div>
				</div>

				{/* Customer Info */}
				<div className="mb-3 border-b pb-2">
					<div className="font-bold">CUSTOMER:</div>
					<div>{order?.name}</div>
					{order?.phone && <div>{order?.phone}</div>}
					{order?.address && <div>{order?.address}</div>}
				</div>

				{/* Items Table */}
				<table className="w-full mb-3">
					<thead>
						<tr className="border-b">
							<th className="text-left">ITEM</th>
							<th className="text-right">QTY</th>
							<th className="text-right">PRICE</th>
							<th className="text-right">TOTAL</th>
						</tr>
					</thead>
					<tbody>
						{order?.items?.map((item) => {
							const quantity = item.qty || 1;
							const unitPrice = item.price / quantity;

							return (
								<tr key={item.id} className="border-b last:border-b-0">
									<td className="py-1">
										<div>{item.product.name}</div>
									</td>
									<td className="text-right">{quantity}</td>
									<td className="text-right">
										<div>৳{unitPrice.toFixed(2)}</div>
									</td>
									<td className="text-right">
										<div>৳{item.price.toFixed(2)}</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* Totals */}
				<div className="border-t pt-2">
					<div className="flex justify-between">
						<span>Subtotal:</span>
						<span>৳{(order.total + totalDiscount).toFixed(2)}</span>
					</div>
					{totalDiscount > 0 && (
						<div className="flex justify-between">
							<span>Discount:</span>
							<span className="text-green-600">
								{/* The toFixed(2) ensures it has two decimal places */}
								-৳{totalDiscount.toFixed(2)}
							</span>
						</div>
					)}
					<div className="flex justify-between">
						<span>Tax:</span>
						<span>৳{totalTax.toFixed(2)}</span>
					</div>
					<div className="flex justify-between">
						<span>Shipping:</span>
						<span>৳{totalShipping.toFixed(2)}</span>
					</div>
					<div className="flex justify-between font-bold mt-1">
						<span>TOTAL:</span>
						<span>৳{order?.total?.toFixed(2)}</span>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-4 text-xs">
					<div>Thank you for your order!</div>
					<div>Powered by Cholo Gori - POS</div>
				</div>
			</div>

			<div className="flex justify-center mt-4">
				<Button color="blue" size="sm" onClick={handlePrint}>
					Print Receipt
				</Button>
			</div>
		</div>
	);
};

export default OrderReceipt;
