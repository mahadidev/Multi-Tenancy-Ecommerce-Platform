import { SidebarProvider } from "@/seller/contexts/sidebar-context";
import { useAppDispatch, useAppSelector } from "@/seller/store";
import { useFetchBrandsQuery } from "@/seller/store/reducers/brandApi";
import { useFetchCategoriesQuery } from "@/seller/store/reducers/categoryApi";
import {
    useFetchPagesQuery,
    useFetchPageTypesQuery,
} from "@/seller/store/reducers/pageApi";
import { useFetchProductsQuery } from "@/seller/store/reducers/productApi";
import { useFetchSocialMediasQuery } from "@/seller/store/reducers/socialMediaApi";
import { clearOnboard } from "@/seller/store/slices/storeOnboardSlice";
import { Flowbite } from "flowbite-react";
import { Outlet } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { customTheme } from "../theme";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";

export default function DashboardLayout() {
    const { sidebar } = useAppSelector((state) => state.base);
    const { currentStore: store } = useAppSelector((state) => state.store);
    const dispatch = useAppDispatch();
    dispatch(clearOnboard());

    // fetch all data
    useFetchPagesQuery({ storeId: store.id });
    useFetchPageTypesQuery();
    useFetchCategoriesQuery();
    useFetchBrandsQuery();
    useFetchProductsQuery();
    useFetchSocialMediasQuery();

    return (
        <Flowbite theme={{ theme: customTheme }}>
            <SidebarProvider initialCollapsed={sidebar.desktop.isCollapsed}>
                <DashboardNavbar />
                <div className="mt-16 flex items-start">
                    <DashboardSidebar />
                    <div
                        id="main-content"
                        className={twMerge(
                            "relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900",
                            sidebar.desktop.isCollapsed
                                ? "lg:ml-16"
                                : "lg:ml-64"
                        )}
                    >
                        <Outlet />
                    </div>
                </div>
            </SidebarProvider>
        </Flowbite>
    );
}
