import { useMediaQuery } from "@seller/hooks/use-media-query";
import useAuth from "@seller/hooks/useAuth";
import useNotification from "@seller/hooks/useNotification";
import useStore from "@seller/hooks/useStore";
import { RoutePath } from "@seller/seller_env";
import {
    toggleIsOpenMobile,
    toggleSidebar,
} from "@seller/store/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@seller/store/store";
import { NotificationType } from "@type/notification";
import { Store } from "@type/orderType";
import {
    Avatar,
    DarkThemeToggle,
    Dropdown,
    Label,
    Navbar,
    TextInput,
    Tooltip,
} from "flowbite-react";
import { FaArrowUp } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
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
} from "react-icons/hi";
import { Link, Navigate } from "react-router-dom";

export function DashboardNavigation() {
    const sidebar = useAppSelector((state) => state.ui.sidebar);
    const dispatch = useAppDispatch();
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const { store } = useStore();
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
            className="fixed top-0 z-[45] w-full border-b border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-800"
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
                        <form className="hidden lg:block lg:pl-2">
                            <Label htmlFor="search" className="sr-only">
                                Search
                            </Label>
                            <TextInput
                                className="w-full lg:w-96"
                                icon={HiSearch}
                                id="search"
                                name="search"
                                placeholder="Search"
                                required
                                type="search"
                            />
                        </form>
                    </div>
                    <div className="flex items-center lg:gap-3">
                        <div className="flex items-center">
                            <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700">
                                <span className="sr-only">Search</span>
                                <HiSearch className="h-6 w-6" />
                            </button>
                            <NotificationBellDropdown />
                            <AppDrawerDropdown />
                            <div className="hidden dark:block">
                                <Tooltip content="Toggle light mode">
                                    <DarkThemeToggle />
                                </Tooltip>
                            </div>

                            <div className="dark:hidden">
                                <Tooltip content="Toggle dark mode">
                                    <DarkThemeToggle />
                                </Tooltip>
                            </div>
                            <div className="ml-3 flex items-center">
                                <UserDropdown />
                            </div>
                            <div className="hidden dark:block">
                                <StoresDropdown />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Navbar>
    );
}

export function NotificationBellDropdown() {
    const { notifications } = useNotification();
    return (
        <Dropdown
            className="rounded"
            arrowIcon={false}
            inline
            label={
                <span className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Notifications</span>
                    <HiBell className="h-6 w-6" />
                </span>
            }
            theme={{ content: "py-0" }}
        >
            <div className="max-w-sm">
                <div className="block rounded-t-xl bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    Notifications
                </div>
                <div>
                    {notifications?.map(
                        (notification: NotificationType, idx: number) => (
                            <Link
                                to="#"
                                className="flex border-y px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                                key={idx}
                            >
                                <div className="shrink-0">
                                    <img
                                        alt=""
                                        height={44}
                                        src="/images/users/bonnie-green.png"
                                        width={44}
                                        className="rounded-full"
                                    />
                                    <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-primary-700 dark:border-gray-700">
                                        <svg
                                            className="h-3 w-3 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                                            <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-full pl-3">
                                    <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                                        {/* New message from&nbsp; */}
                                        {notification?.title}
                                        <span className="font-semibold text-gray-900 dark:text-white"></span>
                                        : &quot;{notification?.message}
                                    </div>
                                    <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                                        {notification?.read_at}
                                    </div>
                                </div>
                            </Link>
                        )
                    )}
                </div>
                <Link
                    to={"/notifications"}
                    className="block rounded-b-xl border-t border-gray-200 bg-gray-50 py-2 text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:underline"
                >
                    <div className="inline-flex items-center gap-x-2">
                        <HiEye className="h-5 w-5" />
                        <span>View all</span>
                    </div>
                </Link>
            </div>
        </Dropdown>
    );
}

export function StoresDropdown() {
    const { stores, store: currentStore, switchStore } = useStore();
    return (
        <Dropdown
            className="rounded"
            arrowIcon={false}
            inline
            label={
                <span className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white flex gap-2 mx-2">
                    <span className="sr-only">Stores</span>
                    {currentStore?.name} &nbsp;{" "}
                    <FaArrowUp className="h-6 w-6" />
                </span>
            }
            theme={{ content: "py-0" }}
        >
            <div className="max-w-sm">
                {stores?.map((store: Store, idx: number) => (
                    <div
                        key={idx}
                        className="w-[300px] flex gap-2 items-center cursor-pointer px-8 py-3 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() =>
                            switchStore.submit({
                                formData: {
                                    store_id: store.id,
                                },
                            })
                        }
                    >
                        {store?.id === currentStore?.id && (
                            <FiCheck size={20} />
                        )}{" "}
                        <p>{store?.name}</p>
                    </div>
                ))}
            </div>
        </Dropdown>
    );
}

export function AppDrawerDropdown() {
    return (
        <Dropdown
            className="rounded"
            arrowIcon={false}
            inline
            label={
                <span className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Apps</span>
                    <HiViewGrid className="h-6 w-6" />
                </span>
            }
            theme={{ content: "py-0" }}
        >
            <div className="block border-b bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700 dark:text-gray-400">
                Apps
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiShoppingBag className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Sales
                    </div>
                </Link>
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiUsers className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Users
                    </div>
                </Link>
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiInbox className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Inbox
                    </div>
                </Link>
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiUserCircle className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Profile
                    </div>
                </Link>
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiCog className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Settings
                    </div>
                </Link>
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiArchive className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Products
                    </div>
                </Link>
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiCurrencyDollar className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Pricing
                    </div>
                </Link>
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiOutlineTicket className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Billing
                    </div>
                </Link>
                <Link
                    to="#"
                    className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                    <HiLogout className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Logout
                    </div>
                </Link>
            </div>
        </Dropdown>
    );
}

export function UserDropdown() {
    const { user } = useAppSelector((state) => state.auth);
    const { logOut } = useAuth();
    const { stores } = useStore();
    console.log({ stores });
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
            <Link to={RoutePath.MyAccountPage.ProfileSettings.index()}>
                <Dropdown.Item>Profile Setting</Dropdown.Item>
            </Link>
            <Dropdown.Item
                onClick={() =>
                    logOut.submit({
                        onSuccess: () => (
                            <Navigate to={RoutePath.LoginPage.index()} />
                        ),
                    })
                }
            >
                Sign out
            </Dropdown.Item>
        </Dropdown>
    );
}
