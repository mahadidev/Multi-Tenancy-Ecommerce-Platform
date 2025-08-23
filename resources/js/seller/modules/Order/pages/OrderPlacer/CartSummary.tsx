import { useAppSelector } from '@seller/store/store';
import { useEffect, useState } from 'react';

const CartSummary = () => {
	const { cartItems } = useAppSelector((state) => state.orderPlacer);
	const [summary, setSummary] = useState({
		subtotal: 0,
		totalDiscount: 0,
		totalTax: 0,
		grandTotal: 0,
	});

	useEffect(() => {
		const newSubtotal = cartItems.reduce(
			(sum, item) => sum + (item.price),
			0
		);
		const newTotalDiscount = cartItems.reduce(
			(sum, item) => sum + (item.price - item.discount_price),
			0
		);
		const newTotalTax = cartItems.reduce(
			(sum, item) => sum + (item.tax),
			0
		);
		const newGrandTotal = newSubtotal - newTotalDiscount + newTotalTax;

		setSummary({
			subtotal: newSubtotal,
			totalDiscount: newTotalDiscount,
			totalTax: newTotalTax,
			grandTotal: newGrandTotal,
		});

		console.log('New calculations:', {
			subtotal: newSubtotal,
			totalDiscount: newTotalDiscount,
			totalTax: newTotalTax,
			grandTotal: newGrandTotal,
		});
	}, [cartItems]);

	return (
		<div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<div className="space-y-2">
				<dl className="flex items-center justify-between gap-4">
					<dt className="text-gray-500 dark:text-gray-400">Sub total</dt>
					<dd className="text-base font-medium text-gray-900 dark:text-white">
						TK {summary.subtotal.toFixed(2)}
					</dd>
				</dl>

				<dl className="flex items-center justify-between gap-4">
					<dt className="text-gray-500 dark:text-gray-400">Savings</dt>
					<dd className="text-base font-medium text-green-500">
						- TK {summary.totalDiscount.toFixed(2)}
					</dd>
				</dl>

				<dl className="flex items-center justify-between gap-4">
					<dt className="text-gray-500 dark:text-gray-400">Tax</dt>
					<dd className="text-base font-medium text-gray-900 dark:text-white">
						TK {summary.totalTax.toFixed(2)}
					</dd>
				</dl>
			</div>

			<dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
				<dt className="text-lg font-bold text-gray-900 dark:text-white">
					Total
				</dt>
				<dd className="text-lg font-bold text-gray-900 dark:text-white">
					TK {summary.grandTotal.toFixed(2)}
				</dd>
			</dl>
		</div>
	);
};

export default CartSummary;
