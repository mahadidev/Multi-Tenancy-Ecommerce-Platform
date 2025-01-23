import { Path } from '@seller-panel/pages';
import { useAppSelector } from '@seller-panel/store/store';
import { Navigate, Outlet } from 'react-router-dom';

const DashboardMiddleware = () => {
	const { user, accessToken } = useAppSelector((state) => state.auth);
	const { store } = useAppSelector((state) => state.store);

	return (
		<>
			{user && accessToken ? (
				<>
					{/* if logged */}
					{store ? (
						<Outlet />
					) : (
						<Navigate to={Path.Onboard.Store.index()} />
					)}
				</>
			) : (
				<Navigate to={Path.LoginPage.index()} />
			)}
		</>
	);
};
export default DashboardMiddleware;
