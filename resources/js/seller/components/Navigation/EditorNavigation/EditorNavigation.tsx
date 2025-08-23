import { GLOBAL_APP_URL } from '@helper/global_env';
import usePage from '@seller/_hooks/usePage';
import useStore from '@seller/_hooks/useStore';
import { RoutePath } from '@seller/seller_env';
import {
    toggleIsOpenMobile,
    toggleSidebar,
} from '@seller/store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { Button, Navbar } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaCheck } from 'react-icons/fa6';
import { FiEye, FiSettings } from 'react-icons/fi';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../../_hooks/use-media-query';

export function EditorNavigation() {
	const sidebar = useAppSelector((state) => state.ui.sidebar);
	const { store } = useStore();
	const dispatch = useAppDispatch();
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const { savePage } = usePage();

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
			className="fixed top-0 z-[45] w-full border-b border-gray-800 bg-gray-900 p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-900 dark"
		>
			<div className="w-full px-3 py-0 pr-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<button
							onClick={handleToggleSidebar}
							className="mr-3 cursor-pointer rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
							<h2 className="font-semibold text-white dark:text-white">
								Page Editor
							</h2>
						</Navbar.Brand>
					</div>
					<div className="flex items-stretch lg:gap-3">
						<div className="flex items-stretch">
							<Button.Group>
								<Button
									href={RoutePath.StorePagesPage.indexUrl()}
									color="dark"
									className="rounded-none"
								>
									<FiSettings className="text-lg" />
								</Button>
								<Button
									color="dark"
									className="rounded-none"
									target="_blank"
									href={`${GLOBAL_APP_URL}/sites/${store?.slug}`}
								>
									<FiEye className="text-lg" />
								</Button>
							</Button.Group>
						</div>
					</div>
					<div className="flex items-stretch lg:gap-3">
						<div className="flex items-stretch">
							<Button.Group>
								<Button
									href={RoutePath.StorePagesPage.indexUrl()}
									color="dark"
									className="rounded-none"
								>
									<IoMdClose className="text-lg" />
								</Button>
								<Button
									color="dark"
									className="rounded-none"
									onClick={() => savePage.submit({})}
									isProcessing={savePage.isLoading}
									processingLabel="Saving"
									processingSpinner={
										<AiOutlineLoading className="animate-spin" />
									}
									disabled={savePage.isLoading}
								>
									<FaCheck className="text-lg" />
								</Button>
							</Button.Group>
						</div>
					</div>
				</div>
			</div>
		</Navbar>
	);
}
