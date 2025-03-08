import { RoutePath } from "@seller/seller_env";
import { Breadcrumb } from "flowbite-react";
import { FC } from "react";
import { HiHome } from "react-icons/hi";

interface PageBreadcrumbProps {
    title?: string;
    items: string[];
}

export const PageBreadCrumb: FC<PageBreadcrumbProps> = ({ title, items }) => (
    <div className="p-4">
        <Breadcrumb className="mb-5">
            <Breadcrumb.Item href={RoutePath.DashboardPage.index()}>
                <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span>Dashboard</span>
                </div>
            </Breadcrumb.Item>
            {items?.map((item: string, idx: number) => (
                <Breadcrumb.Item key={idx}>{item}</Breadcrumb.Item>
            ))}
        </Breadcrumb>
        {title && (
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {title}
            </h1>
        )}
    </div>
);
