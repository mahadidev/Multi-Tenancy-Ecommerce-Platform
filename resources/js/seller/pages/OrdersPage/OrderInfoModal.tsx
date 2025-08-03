/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import { OrderType } from '@type/orderType';
import { Button, Modal } from 'flowbite-react';
import { FC, useEffect, useState } from 'react';
import { HiEye } from 'react-icons/hi';
import { useSearchParams } from 'react-router-dom';
import OrderSummary from './OrderSummary';

interface PropsType {
	order: OrderType;
}

const OrderInfoModal: FC<PropsType> = function (props) {
	const [isOpen, setOpen] = useState(false);

	const [searchParams] = useSearchParams(); // get search params

	const orderUID = searchParams.get('orderUID') ?? ''; // order uid

	// show the modal
	useEffect(() => {
		if (props.order.order_uuid) {
			props.order.order_uuid == orderUID ? setOpen(true) : setOpen(false);
		}
	}, [orderUID]);

	return (
		<>
			<Button
				size="sm"
				color="primary"
				className="p-0"
				onClick={() => setOpen(true)}
			>
				<div className="flex items-center gap-x-2">
					<HiEye className="h-5 w-5" />
					Order Info
				</div>
			</Button>
			<Modal size="5xl" onClose={() => setOpen(false)} show={isOpen}>
				{' '}
				<Modal.Header>Order Information</Modal.Header>
				<Modal.Body>
					<div>
						<OrderSummary order={props?.order} />
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default OrderInfoModal;
