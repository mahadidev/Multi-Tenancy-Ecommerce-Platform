import { Outlet } from 'react-router-dom';
import AppNavigation from '../Navigations/AppNavigation/AppNavigation';


const AppLayout = () => {
	return (
		<>
			<AppNavigation />
			<main className="light bg-gray-100">
				<Outlet />
			</main>
		</>
	);
};
export default AppLayout;
