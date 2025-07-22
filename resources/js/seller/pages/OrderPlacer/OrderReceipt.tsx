import { OrderType } from '@type/orderType';
import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';


const OrderReceipt: React.FC<{ order: OrderType }> = ({ order }) => {
	const contentRef = React.useRef<HTMLDivElement>(null);

	const [summary, setSummary] = useState({
		subtotal: 0,
		totalDiscount: 0,
		totalTax: 0,
		grandTotal: 0,
	});

	useEffect(() => {
		const newSubtotal = order.items.reduce((sum, item) => sum + item.price, 0);
		const newTotalDiscount = order.items.reduce(
			(sum, item) => sum + (item.price - item.discount_price),
			0
		);
		const newTotalTax = order.items.reduce((sum, item) => sum + item.tax, 0);
		const newGrandTotal = newSubtotal - newTotalDiscount + newTotalTax;

		setSummary({
			subtotal: newSubtotal,
			totalDiscount: newTotalDiscount,
			totalTax: newTotalTax,
			grandTotal: newGrandTotal,
		});
	}, [order.items]);

	const handlePrint = useReactToPrint({
		contentRef,
		pageStyle: `
            @page {
                size: 80mm auto;
                margin: 0;
                padding: 0;
            }
            body {
                margin: 0 !important;
                padding: 0 !important;
                font-family: Arial, sans-serif;
            }
        `,
	});

	return (
		<div className="p-2">
			{/* Receipt Content */}
			<div
				ref={contentRef}
				style={{
					width: '80mm',
					padding: '5mm',
					fontSize: '10px',
				}}
			>
				{/* Store Header */}
				<div className="text-center mb-2">
					<h1 className="font-bold text-lg">{order.store.name}</h1>
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
						<span>{order.created_at}</span>
					</div>
				</div>

				{/* Customer Info */}
				<div className="mb-3 border-b pb-2">
					<div className="font-bold">CUSTOMER:</div>
					<div>{order.name}</div>
					{order.phone && <div>{order.phone}</div>}
					{order.address && <div>{order.address}</div>}
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
						{order.items.map((item) => (
							<tr key={item.id} className="border-b last:border-b-0">
								<td className="py-1">{item.item}</td>
								<td className="text-right">{item.qty}</td>
								<td className="text-right">{item.product.price}</td>
								<td className="text-right">{Number(item.price)}</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Totals */}
				<div className="border-t pt-2">
					<div className="flex justify-between">
						<span>Subtotal:</span>
						<span>TK {summary.subtotal}</span>
					</div>
					<div className="flex justify-between">
						<span>Discount:</span>
						<span className="text-primary-700">
							TK -{summary.totalDiscount}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Tax:</span>
						<span>TK {summary.totalTax}</span>
					</div>
					{order.shipping_cost && (
						<div className="flex justify-between">
							<span>Shipping:</span>
							<span>TK {order.shipping_cost}</span>
						</div>
					)}
					<div className="flex justify-between font-bold mt-1">
						<span>TOTAL:</span>
						<span>TK {summary.grandTotal}</span>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-4 text-xs">
					<div>Thank you for your order!</div>
					<div>Powered by Cholo Gori - POS</div>
				</div>
			</div>

			{/* Print Button */}
			<Button
				color="primary"
				size="xs"
				onClick={handlePrint}
				className="bg-blue-500 text-white p-2 mt-4 rounded mx-auto"
			>
				Print Receipt
			</Button>
		</div>
	);
};

export default OrderReceipt;
