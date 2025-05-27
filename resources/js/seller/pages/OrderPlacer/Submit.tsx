import useOrders from '@seller/hooks/useOrders';
import { clearCart } from '@seller/store/slices/orderPlacerSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { Button, Modal } from 'flowbite-react';
import { useRef } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import OrderReceipt from './OrderReceipt';

const Submit = () => {
	const { placeOrderNonUser } = useOrders();
	const { customer, cartItems, status, paymentMethod } = useAppSelector(
		(state) => state.orderPlacer
	);
	const dispatch = useAppDispatch();
	const contentRef = useRef<HTMLDivElement>(null);

	const handleSubmit = () => {
		placeOrderNonUser.submit({
			formData: {
				...customer,
				items: cartItems.map((item) => {
					return {
						qty: item.qty,
						discount: item.discount,
						product_id: item.product.id,
					};
				}),
				payment_method: paymentMethod,
				status: status,
			},
		});
	};

	return (
		<>
			<Modal
				show={placeOrderNonUser.isSuccess}
				onClose={() => placeOrderNonUser.reset()}
			>
				<Modal.Header>Order Placed Successfully</Modal.Header>
				<Modal.Body className="flex justify-center items-center bg-white">
					<div
						className="flex-col gap-0.5"
						ref={contentRef}
						style={{
							width: '100%',
							height: 'auto',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: 0,
							margin: 0,
						}}
					>
						<OrderReceipt order={placeOrderNonUser.data?.data.order} />
					</div>
				</Modal.Body>
			</Modal>

			<div className="flex justify-between gap-4">
				<Button
					type="button"
					color="dark"
					className="w-full"
					onClick={() => dispatch(clearCart())}
				>
					Clear Order
				</Button>

				<Button
					color="blue"
					type="submit"
					className="w-full"
					onClick={handleSubmit}
					isProcessing={placeOrderNonUser.isLoading}
					disabled={placeOrderNonUser.isLoading}
					processingLabel="Creating"
					processingSpinner={<AiOutlineLoading className="animate-spin" />}
				>
					Send the order
				</Button>
			</div>
		</>
	);
};
export default Submit;
