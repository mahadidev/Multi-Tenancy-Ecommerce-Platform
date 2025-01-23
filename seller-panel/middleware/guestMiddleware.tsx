import { Path } from '@seller-panel/pages';
import { useAppSelector } from '@seller-panel/store/store';
import { Navigate, Outlet } from 'react-router-dom';

const GuestMiddleware = () => {
	const { user, accessToken } = useAppSelector((state) => state.auth);
	const { store } = useAppSelector((state) => state.store);

	return (
		<>
			{user && accessToken ? (
				<>
					{/* if logged */}
					{store ? (
						<Navigate to={Path.DashboardPage.index()} />
					) : (
						<Navigate to={Path.Onboard.Store.index()} />
					)}
				</>
			) : (
				<Outlet />
			)}
		</>
	);
};
export default GuestMiddleware;
