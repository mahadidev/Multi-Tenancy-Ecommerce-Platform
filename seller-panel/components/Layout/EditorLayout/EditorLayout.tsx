import { EditorNavigation } from '@seller-panel/components/Navigation/EditorNavigation/EditorNavigation';
import { EditorSidebar } from '@seller-panel/components/Sidebar/EditorSidebar/EditorSidebar';
import { SidebarProvider } from '@seller-panel/contexts/sidebar-context';
import { useAppSelector } from '@seller-panel/store/store';
import { FC } from 'react';
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
