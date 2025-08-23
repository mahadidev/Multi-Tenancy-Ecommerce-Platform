import { RoutePath } from '@seller/seller_env';
import { useAppSelector } from '@seller/store/store';
import { Navigate, Outlet } from 'react-router-dom';

const DashboardMiddleware = () => {
	const { user, accessToken } = useAppSelector((state) => state.auth);
	const { store } = useAppSelector((state) => state.store);
	console.log({ store });
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
								<Outlet />
							) : (
								<Navigate to={RoutePath.Onboard.Store.index()} />
							)}
						</>
					)}
				</>
			) : (
				<Navigate to={RoutePath.LoginPage.index()} />
			)}
		</>
	);
};
export default DashboardMiddleware;
