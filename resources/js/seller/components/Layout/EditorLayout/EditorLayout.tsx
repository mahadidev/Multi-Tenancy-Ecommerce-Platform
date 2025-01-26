import { SidebarProvider } from '@seller/contexts/sidebar-context';
import { useAppSelector } from '@seller/store/store';
import { FC } from 'react';
import { EditorNavigation } from '../../Navigation/EditorNavigation/EditorNavigation';
import { EditorSidebar } from '../../Sidebar/EditorSidebar/EditorSidebar';
import BaseLayout from '../BaseLayout';

const EditorLayout: FC = function () {
	const { sidebar } = useAppSelector((state) => state.ui);

	return (
		<BaseLayout>
			<SidebarProvider initialCollapsed={sidebar.desktop.isCollapsed}>
				<EditorNavigation />
                	<div className="mt-16 flex items-start">
                        <EditorSidebar />
                    </div>
			</SidebarProvider>
		</BaseLayout>
	);
};
export default EditorLayout;
