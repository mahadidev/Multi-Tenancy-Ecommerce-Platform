import { BASE_IMAGE_URL, RoutePath } from '@seller/seller_env';
import {
    toggleIsOpenMobile,
    toggleSidebar,
} from '@seller/store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import {
    Avatar,
    DarkThemeToggle,
    Dropdown,
    Label,
    Navbar,
    TextInput,
    Tooltip,
} from 'flowbite-react';
import {
    HiArchive,
    HiBell,
    HiCog,
    HiCurrencyDollar,
    HiEye,
    HiInbox,
    HiLogout,
    HiMenuAlt1,
    HiOutlineTicket,
    HiSearch,
    HiShoppingBag,
    HiUserCircle,
    HiUsers,
    HiViewGrid,
    HiX,
} from 'react-icons/hi';
import { Link, Navigate } from 'react-router-dom';
import { useMediaQuery } from '../../../hooks/use-media-query';
import useAuth from '../../../hooks/useAuth';
import useStore from '../../../hooks/useStore';

export function EditorNavigation() {
	const sidebar = useAppSelector((state) => state.ui.sidebar);
	const { store } = useStore();
	const dispatch = useAppDispatch();
	const isDesktop = useMediaQuery('(min-width: 1024px)');

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
			className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-800"
		>
			<div className="w-full p-3 pr-4">
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
								{store?.name}
							</h2>
						</Navbar.Brand>
					</div>
					<div className="flex items-center lg:gap-3">
						<div className="flex items-center">
							<div className="ml-3 flex items-center">
								<UserDropdown />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Navbar>
	);
}

export function UserDropdown() {
	const { user } = useAppSelector((state) => state.auth);
	const { logOut } = useAuth();

	return (
		<Dropdown
			className="rounded"
			arrowIcon={false}
			inline
			label={
				<span>
					<span className="sr-only">User menu</span>
					<Avatar
						alt=""
						placeholderInitials={user?.name.slice(0, 1)}
						rounded
						size="sm"
						className="w-max"
					/>
				</span>
			}
		>
			<Dropdown.Header className="px-4 py-3">
				<span className="block text-sm">{user?.name}</span>
				<span className="block truncate text-sm font-medium">
					{user?.email}
				</span>
			</Dropdown.Header>
			<Dropdown.Divider />
			<Dropdown.Item
				onClick={() =>
					logOut.submit({
						onSuccess: () => <Navigate to={RoutePath.LoginPage.index()} />,
					})
				}
			>
				Sign out
			</Dropdown.Item>
		</Dropdown>
	);
}
