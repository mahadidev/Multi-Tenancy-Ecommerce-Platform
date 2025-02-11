import React from "react";

interface BadgeProps {
    status: string;
}
const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
    return (
        <span
            className={`capitalize text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ${getBadgeStyle(
                status
            )}`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;

const getBadgeStyle = (status: string) => {
    switch (status) {
        case "pending":
            return "bg-[#f59e0b] text-black dark:bg-[#f59e0b] dark:text-black";
        case "shipping":
            return "bg-[#3b82f6] text-white dark:bg-[#3b82f6] dark:text-white";
        case "confirmed":
            return "bg-[#10b981] text-black dark:bg-[#10b981] dark:text-black";
        case "canceled":
            return "bg-[#ef4444] text-white dark:bg-[#ef4444] dark:text-white";
        case "processing":
            return "bg-[#8b5cf6] text-black dark:bg-[#8b5cf6] dark:text-black";
        case "refunded":
            return "bg-[#ec4899] text-white dark:bg-[#ec4899] dark:text-white";
        case "delivered":
            return "bg-[#22c55e] text-black dark:bg-[#22c55e] dark:text-black";
        case "failed":
            return "bg-[#b91c1c] text-white dark:bg-[#b91c1c] dark:text-white";
        case "returned":
            return "bg-[#f43f5e] text-white dark:bg-[#f43f5e] dark:text-white";
        case "completed":
            return "bg-[#0ea5e9] text-white dark:bg-[#0ea5e9] dark:text-white";

        default:
            return "bg-orange-500 !text-lg text-black";
    }
};

export type OrderStatusType = {
    label: string;
    value: string;
};

export const orderStatuses: OrderStatusType[] = [
    { label: "Pending", value: "pending" },
    { label: "Shipping", value: "shipping" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Canceled", value: "canceled" },
    { label: "Processing", value: "processing" },
    { label: "Refunded", value: "refunded" },
    { label: "Delivered", value: "delivered" },
    { label: "Failed", value: "failed" },
    { label: "Returned", value: "returned" },
    { label: "Completed", value: "completed" },
];

{
    /* <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">Default</span>
<span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">Dark</span>
<span class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">Red</span>
<span class="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300">Green</span>
<span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">Yellow</span>
<span class="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">Indigo</span>
<span class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-purple-900 dark:text-purple-300">Purple</span>
<span class="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-pink-900 dark:text-pink-300">Pink</span> */
}
