/* eslint-disable react-hooks/exhaustive-deps */
import { SidebarProvider } from '@seller/contexts/sidebar-context';
import useStore from '@seller/hooks/useStore';
import { useAppSelector } from '@seller/store/store';
import useColor from '@themes/_helper/hooks/useColor';
import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { EditorNavigation } from '../../Navigation/EditorNavigation/EditorNavigation';
import { EditorSidebar } from '../../Sidebar/EditorSidebar/EditorSidebar';
import BaseLayout from '../BaseLayout';

const EditorLayout: FC = function () {
	const { sidebar } = useAppSelector((state) => state.ui);
    const {store} = useStore();
    const {setColorShade} = useColor();

	useEffect(() => {
		if (store && store.theme) {
			setColorShade({
				name: 'primary',
				color: store.primary_color ?? store.theme.primary_color,
			});
		}
	}, [store]);

	return (
		<BaseLayout>
			<SidebarProvider initialCollapsed={sidebar.desktop.isCollapsed}>
				<EditorNavigation />
				<div className="mt-10 flex items-start dark">
					<EditorSidebar />
					<div
						id="main-content"
						className={twMerge(
							'relative h-full w-full overflow-y-auto bg-white dark:bg-gray-900',
							sidebar.desktop.isCollapsed ? 'lg:ml-0' : 'lg:ml-64'
						)}
					>
						<Outlet />
					</div>
				</div>
			</SidebarProvider>
		</BaseLayout>
	);
};
export default EditorLayout;
