import { removeCartItem } from '@seller/store/slices/orderPlacerSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { OrderPlacerCartItemType } from '@type/orderPlacer';

const CartProducts = () => {
    const {cartItems} = useAppSelector((state) => state.orderPlacer)
    const dispatch = useAppDispatch();

    const onRemoveCartItem = (item: OrderPlacerCartItemType) => {
        dispatch(removeCartItem({
            uniqueID: item.uniqueID
        }))
    }

  return (
		<>
			<div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
				{cartItems.map((item: OrderPlacerCartItemType) => (
					<div
						className="flex flex-wrap items-center space-y-4 p-6 sm:gap-6 sm:space-y-0 md:justify-between"
						key={item.uniqueID}
					>
						<div className="w-full items-center space-y-4 sm:flex sm:space-x-6 sm:space-y-0 md:max-w-md">
							<a
								href="#"
								className="block aspect-square w-20 shrink-0 relative"
							>
								<img
									className="h-full w-full rounded-sm"
									src={item.product.thumbnail}
									alt="imac dark"
								/>
								<div className="absolute -top-4 -right-5 rounded-full px-2 py-1 flex justify-center items-center bg-blue-700 text-white text-sm">
									{item.product.discount_amount}%
								</div>
							</a>
							<div className="w-full md:max-w-sm">
								<a
									href="#"
									className="font-medium text-gray-900 hover:underline dark:text-white"
								>
									{item.product.name}
								</a>
							</div>
						</div>
						<div className="w-8 shrink-0">
							<p className="text-base font-normal text-gray-900 dark:text-white">
								x{item.qty}
							</p>
						</div>
						<div className=" md:text-right flex items-center gap-6">
							<p className="text-base font-bold text-gray-900 dark:text-white">
								TK{' '}
								{item.discount > 0 && (
									<>
										<span className="line-through opacity-70">
											{item.price}
										</span>{' '}
									</>
								)}
								{item.afterDiscountPrice}
							</p>

							<button
								className="text-red-600"
								onClick={() => onRemoveCartItem(item)}
							>
								Remove
							</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
export default CartProducts
