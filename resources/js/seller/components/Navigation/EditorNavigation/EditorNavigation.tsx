import { IoClose } from 'react-icons/io5';

import usePage from '@seller/hooks/usePage';
import useStore from '@seller/hooks/useStore';
import { RoutePath } from '@seller/seller_env';
import {
    toggleIsOpenMobile,
    toggleSidebar,
} from '@seller/store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { Button, Navbar } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../../hooks/use-media-query';

export function EditorNavigation() {
	const sidebar = useAppSelector((state) => state.ui.sidebar);
	const dispatch = useAppDispatch();
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const { savePage } = usePage();
    const {store} = useStore()

	function handleToggleSidebar() {
		if (isDesktop) {
			dispatch(toggleSidebar());
		} else {
			dispatch(toggleIsOpenMobile());
		}
	}

	return (
		<Navbar
			fluid
			className="fixed top-0 z-40 w-full border-b border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-800"
		>
			<div className="w-full px-3 py-0 pr-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<button
							onClick={handleToggleSidebar}
							className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						>
							<span className="sr-only">Toggle sidebar</span>
							{/* mobile */}
							<div className="lg:hidden">
								{sidebar.mobile.isOpenMobile ? (
									<HiX className="h-6 w-6" />
								) : (
									<HiMenuAlt1 className="h-6 w-6" />
								)}
							</div>
							{/* desktop */}
							<div className="hidden lg:block">
								<HiMenuAlt1 className="h-6 w-6" />
							</div>
						</button>
						<Navbar.Brand as={Link} href="/" className="mr-14">
							<h2 className="font-semibold text-gray-900 dark:text-white">
								Page Editor
							</h2>
						</Navbar.Brand>
					</div>
					<div className="flex items-stretch">
						<Button
							color="primary"
							className="rounded-none"
							href={store?.domain}
							target="_blank"
						>
							View Site
						</Button>
					</div>
					<div className="flex items-stretch lg:gap-3">
						<div className="flex items-stretch">
							<div className="ml-3 flex  items-stretch">
								<Button
									color="primary"
									className="rounded-none"
									onClick={() => savePage.submit({})}
									isProcessing={savePage.isLoading}
									processingLabel="Saving"
									processingSpinner={<AiOutlineLoading />}
									disabled={savePage.isLoading}
								>
									Save Changes
								</Button>
								<Button
									href={RoutePath.StorePagesPage.indexUrl()}
									color="red"
									className="rounded-none"
								>
									<IoClose className="text-gray-800 dark:text-white text-2xl" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Navbar>
	);
}
