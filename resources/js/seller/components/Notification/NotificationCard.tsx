import useNotification from "@seller/_hooks/useNotification";
import { RoutePath } from "@seller/seller_env";
import { NotificationType, RedirectUrlType } from "@type/notification";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDateTime, NotificationIcon } from "./NotificationIcon";

interface NotificationCardProps {
    notification: NotificationType;
    styleType?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    styleType,
}) => {
    const { singleNotification, reFetchNotifications } = useNotification();

    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
                singleNotification.submit({
                    formData: {
                        id: notification.id,
                    },
                    onSuccess: () => {
                        navigate(`${getRedirectUrl(notification)}`);
                        reFetchNotifications.submit();
                    },
                })
            }
            className={
                styleType === "card"
                    ? "flex rounded-lg my-5 px-4 py-3 bg-gray-100 dark:bg-gray-700"
                    : "cursor-pointer flex border-y px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
            }
        >
            <div className="shrink-0 relative">
                <NotificationIcon />
            </div>
            <div className="w-full pl-3">
                <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                    </span>
                    : &quot;{notification.message}&quot;
                </div>
                <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                    {formatDateTime(notification.read_at)}
                </div>
            </div>
        </div>
    );
};

export default NotificationCard;

// redirect to the targeted location after clicking on the notification
export const getRedirectUrl = (notification: RedirectUrlType) => {
    switch (notification?.data?.module) {
        case "order":
            return `${RoutePath.OrdersPage.index()}?orderUID=${
                notification?.data?.order_uuid
            }`;

        default:
            return "#";
    }
};
