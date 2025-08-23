import { RoutePath } from '@seller/seller_env';
import { useAppSelector } from '@seller/store/store';
import { Navigate, Outlet } from 'react-router-dom';

const GuestMiddleware = () => {
	const { user, accessToken } = useAppSelector((state) => state.auth);
	const { store } = useAppSelector((state) => state.store);

	return (
		<>
			{user && accessToken ? (
				<>
					{/* if logged */}
					{store?.store_subscription_status === 'Expired' ? (
						<Navigate to={RoutePath.SubscriptionPage.index()} />
					) : (
						<>
							{store ? (
								<Navigate to={RoutePath.DashboardPage.index()} />
							) : (
								<Navigate to={RoutePath.Onboard.Store.index()} />
							)}
						</>
					)}
				</>
			) : (
				<Outlet />
			)}
		</>
	);
};
export default GuestMiddleware;
