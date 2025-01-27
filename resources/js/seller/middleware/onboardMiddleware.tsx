import { RoutePath } from '@seller/seller_env';
import { useAppSelector } from '@seller/store/store';
import { Navigate, Outlet } from 'react-router-dom';

const OnboardMiddleware = () => {
	const { user, accessToken } = useAppSelector((state) => state.auth);
	const { store } = useAppSelector((state) => state.store);

	return (
		<>
			{user && accessToken ? (
				<>
					{/* if logged */}
					{store ? <Navigate to={RoutePath.DashboardPage.index()} /> : <Outlet />}
				</>
			) : (
				<Navigate to={RoutePath.LoginPage.index()} />
			)}
		</>
	);
};
export default OnboardMiddleware;
