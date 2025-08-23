import {
    removeCartItem,
    updateCartItem,
} from '@seller/store/slices/orderPlacerSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import {
    OrderPlacerCartItemType,
} from '@type/orderPlacer';
import { Table } from 'flowbite-react';

const CartProducts = () => {
	const { cartItems } = useAppSelector((state) => state.orderPlacer);
	const dispatch = useAppDispatch();

	const onRemoveCartItem = (item: OrderPlacerCartItemType) => {
		dispatch(
			removeCartItem({
				uniqueID: item.uniqueID,
			})
		);
	};

	const onChangeItemPrice = (
		item: OrderPlacerCartItemType,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		dispatch(
			updateCartItem({
				...item,
				uniqueID: item.uniqueID,
				discount_price: Number(event.target.value),
			})
		);
	};

	return (
		<>
			<div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
				<Table
					hoverable
					className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
				>
					<Table.Head>
						<Table.HeadCell>Product</Table.HeadCell>
						<Table.HeadCell>Variant</Table.HeadCell>
						<Table.HeadCell>Qty</Table.HeadCell>
						<Table.HeadCell>Price</Table.HeadCell>
						<Table.HeadCell>Action</Table.HeadCell>
					</Table.Head>
					<Table.Body className="divide-y">
						{cartItems.map((item: OrderPlacerCartItemType) => (
							<Table.Row
								key={item.uniqueID}
								className="bg-white dark:bg-gray-800"
							>
								<Table.Cell>
									<div className="flex items-center space-x-4">
										<div className="relative w-10 h-10 shrink-0">
											<img
												src={item.product.thumbnail}
												alt={item.product.name}
												className="rounded-sm w-full h-full object-cover"
											/>
											{item.product.has_discount ? (
												<div className="absolute -top-2 -right-2 bg-blue-700 text-white text-xs px-2 py-1 rounded-full">
													{item.stock.discount_amount}
													{item.product.discount_type === 'flat' ? 'tk' : '%'}
												</div>
											) : (
												<></>
											)}
										</div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{item.product.name}
											</p>
										</div>
									</div>
								</Table.Cell>
								<Table.Cell>
									{item.product.has_variants ? (
										item.stock.stock_items?.map((stockItem, index) => (
											<span
												key={index}
												className="inline-block text-sm mr-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded"
											>
												{stockItem.variant_option?.label}
											</span>
										))
									) : (
										<></>
									)}
								</Table.Cell>
								<Table.Cell>
									<span className="text-gray-900 dark:text-white">
										x{item.qty}
									</span>
								</Table.Cell>
								<Table.Cell>
									<div className="flex items-center space-x-1">
										{item.price !== item.discount_price && (
											<span className="line-through text-sm text-gray-500">
												{item.price}
											</span>
										)}
										<input
											type="number"
											min={0}
											value={item.discount_price}
											className="bg-transparent border-none focus:ring-0 w-[80px] text-gray-900 dark:text-white p-0"
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												onChangeItemPrice(item, event)
											}
										/>
									</div>
								</Table.Cell>
								<Table.Cell>
									<button
										onClick={() => onRemoveCartItem(item)}
										className="text-red-600 hover:underline"
									>
										Remove
									</button>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</div>
		</>
	);
};
export default CartProducts;
