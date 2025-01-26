import {
    setIsOpenMobile,
    setSidebarCollapsed,
} from '@seller/store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';


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
				'fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r border-gray-200 pt-16 duration-75 lg:flex dark:border-gray-700',
				isCollapsed && 'hidden w-16'
			)}
			id="sidebar"
		>
			<div className="flex h-full flex-col justify-between">
				<div className="py-2"></div>
			</div>
		</Sidebar>
	);
}

function MobileSidebar() {
	const dispatch = useAppDispatch();
	const { isOpenMobile: isOpen } = useAppSelector(
		(state) => state.ui.sidebar.mobile
	);
	function close() {
		dispatch(setIsOpenMobile(false));
	}

	if (!isOpen) return null;

	return (
		<>
			<Sidebar
				aria-label="Sidebar with multi-level dropdown example"
				className={twMerge(
					'fixed inset-y-0 left-0 z-20 hidden h-full shrink-0 flex-col border-r border-gray-200 pt-16 lg:flex dark:border-gray-700',
					isOpen && 'flex'
				)}
				id="sidebar"
			>
				<div className="flex h-full flex-col justify-between">
					<div className="py-2"></div>
				</div>
			</Sidebar>
			<div
				onClick={close}
				aria-hidden="true"
				className="fixed inset-0 z-10 h-full w-full bg-gray-900/50 pt-16 dark:bg-gray-900/90"
			/>
		</>
	);
}

