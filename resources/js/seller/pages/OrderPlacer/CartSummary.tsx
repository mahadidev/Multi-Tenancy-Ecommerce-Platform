import { useAppSelector } from '@seller/store/store';

const CartSummary = () => {
	const {cartItems} = useAppSelector((state) => state.orderPlacer);

	return (
		<>
			<div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				<div className="space-y-2">
					<dl className="flex items-center justify-between gap-4">
						<dt className="text-gray-500 dark:text-gray-400">Sub total</dt>
						<dd className="text-base font-medium text-gray-900 dark:text-white">
							TK{' '}
							{(cartItems.reduce(
								(sum, item) => sum + item.afterDiscountPrice,
								0
							)).toFixed(2)}
						</dd>
					</dl>

					<dl className="flex items-center justify-between gap-4">
						<dt className="text-gray-500 dark:text-gray-400">Savings</dt>
						<dd className="text-base font-medium text-green-500">
							- TK{' '}
							{(cartItems.reduce(
								(sum, item) => sum + (item.price - item.afterDiscountPrice),
								0
							)).toFixed(2)}
						</dd>
					</dl>

					<dl className="flex items-center justify-between gap-4">
						<dt className="text-gray-500 dark:text-gray-400">Tax</dt>
						<dd className="text-base font-medium text-gray-900 dark:text-white">
							TK {(cartItems.reduce((sum, item) => sum + item.taxAmount, 0)).toFixed(2)}
						</dd>
					</dl>
				</div>

				<dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
					<dt className="text-lg font-bold text-gray-900 dark:text-white">
						Total
					</dt>
					<dd className="text-lg font-bold text-gray-900 dark:text-white">
						TK {(cartItems.reduce((sum, item) => sum + item.afterTaxPrice, 0)).toFixed(2)}
					</dd>
				</dl>
			</div>
		</>
	);
};
export default CartSummary;
