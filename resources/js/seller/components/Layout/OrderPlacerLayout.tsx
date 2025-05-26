import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import BaseLayout from './BaseLayout';

type OrderPlacerLayoutProps = object;

const OrderPlacerLayout: FC<OrderPlacerLayoutProps> = function () {
	return (
		<BaseLayout>
			<Outlet />
		</BaseLayout>
	);
};

export default OrderPlacerLayout;
