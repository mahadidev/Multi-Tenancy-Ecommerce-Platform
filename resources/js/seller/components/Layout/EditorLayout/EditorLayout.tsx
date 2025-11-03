/* eslint-disable react-hooks/exhaustive-deps */
import useStore from '@seller/_hooks/useStore';
import { SidebarProvider } from '@seller/contexts/sidebar-context';
import { useAppSelector } from '@seller/store/store';
import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { EditorNavigation } from '../../Navigation/EditorNavigation/EditorNavigation';
import { EditorSidebar } from '../../Sidebar/EditorSidebar/EditorSidebar';
import BaseLayout from '../BaseLayout';

const EditorLayout: FC = function () {
	const { sidebar } = useAppSelector((state) => state.ui);

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
