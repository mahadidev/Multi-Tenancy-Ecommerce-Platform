import { SidebarProvider } from '@seller-panel/contexts/sidebar-context';
import { useAppSelector } from '@seller-panel/store/store';
import { customTheme } from '@seller-panel/theme';
import { Flowbite } from 'flowbite-react';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { DashboardNavigation } from '../Navigation/DashboardNavigation/DashboardNavigation';
import { DashboardSidebar } from '../Sidebar/DashboardSidebar/DashboardSidebar';

const DashboardLayout: FC = function() {
	const { sidebar } = useAppSelector((state) => state.ui);

	return (
		<Flowbite theme={{ theme: customTheme }}>
			<SidebarProvider initialCollapsed={sidebar.desktop.isCollapsed}>
				<DashboardNavigation />
				<div className="mt-16 flex items-start">
					<DashboardSidebar />
					<div
						id="main-content"
						className={twMerge(
							'relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900',
							sidebar.desktop.isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
						)}
					>
						<Outlet />
					</div>
				</div>
			</SidebarProvider>
		</Flowbite>
	);
}

export default DashboardLayout;
