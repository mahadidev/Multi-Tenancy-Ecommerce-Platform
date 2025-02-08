import {
    setIsOpenMobile,
    setSidebarCollapsed,
} from '@seller/store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';

import useWidget from '@seller/hooks/useWidget';
import { twMerge } from 'tailwind-merge';
import PageEditor from './PageEditor/PageEditor';
import WidgetEditor from './WidgetEditor/WidgetEditor';


export function EditorSidebar() {
	return (
		<>
			<div className="lg:hidden">
				<MobileSidebar />
			</div>
			<div className="hidden lg:block">
				<DesktopSidebar />
			</div>
		</>
	);
}

function DesktopSidebar() {
	const dispatch = useAppDispatch();
	const { isCollapsed } = useAppSelector((state) => state.ui.sidebar.desktop);
	function setCollapsed(value: boolean) {
		dispatch(setSidebarCollapsed(value));
	}
	const [isPreview, setIsPreview] = useState(isCollapsed);
    const { widget } = useWidget();

	useEffect(() => {
		if (isCollapsed) setIsPreview(false);
	}, [isCollapsed]);

	const preview = {
		enable() {
			if (!isCollapsed) return;

			setIsPreview(true);
			setCollapsed(false);
		},
		disable() {
			if (!isPreview) return;

			setCollapsed(true);
		},
	};

	return (
		<Sidebar
			onMouseEnter={preview.enable}
			onMouseLeave={preview.disable}
			aria-label="Sidebar with multi-level dropdown example"
			collapsed={isCollapsed}
			className={twMerge(
				'fixed inset-y-0 left-0 z-40 flex h-full shrink-0 flex-col border-r border-gray-200 pt-10 duration-75 lg:flex dark:border-gray-700 dark',
				isCollapsed && 'hidden !w-0 overflow-hidden'
			)}
			id="sidebar"
			theme={{
				root: {
					base: 'bg-gray-900',
					inner: 'bg-gray-900 px-2.5',
				},
			}}
		>
			<div className="flex h-full flex-col justify-between">
				{widget ? <WidgetEditor /> : <PageEditor />}
			</div>
		</Sidebar>
	);
}

function MobileSidebar() {
	const dispatch = useAppDispatch();
	const { isOpenMobile: isOpen } = useAppSelector(
		(state) => state.ui.sidebar.mobile
	);
    const {widget} = useWidget()
	function close() {
		dispatch(setIsOpenMobile(false));
	}

	if (!isOpen) return null;

	return (
		<>
			<Sidebar
				aria-label="Sidebar with multi-level dropdown example"
				className={twMerge(
					'fixed inset-y-0 left-0 z-40 hidden h-full shrink-0 flex-col border-r border-gray-200 pt-10 lg:flex dark:border-gray-700 dark',
					isOpen && 'flex'
				)}
				id="sidebar"
				theme={{
					root: {
						base: 'bg-gray-900',
						inner: 'bg-gray-900 px-2.5',
					},
				}}
			>
				<div className="flex h-full flex-col justify-between">
					{widget ? <WidgetEditor /> : <PageEditor />}
				</div>
			</Sidebar>
			<div
				onClick={close}
				aria-hidden="true"
				className="fixed inset-0 z-30 h-full w-full bg-gray-900/50 pt-16 dark:bg-gray-900/90"
			/>
		</>
	);
}
