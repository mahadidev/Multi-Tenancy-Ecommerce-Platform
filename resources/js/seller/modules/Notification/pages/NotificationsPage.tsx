import NotificationCard from "@seller/components/Notification/NotificationCard";
import { useNotification } from "../hooks";
import { NotificationType } from "../types";
import { Card } from "flowbite-react";
import React from "react";

const NotificationsPage: React.FC = () => {
    const { notifications } = useNotification();

    return (
        <div className="dark:text-white flex justify-center">
            <Card className="lg:w-6/12 dark:bg-gray-800 bg-white mt-8 rounded-lg">
                <h3 className="text-xl font-bold dark:text-white mb-5">
                    All Notifications
                </h3>
                <div>
                    {notifications.length > 0 ? (
                        notifications?.map(
                            (notification: NotificationType, idx: number) => (
                                <NotificationCard
                                    key={idx}
                                    notification={notification}
                                    styleType={"card"}
                                />
                            )
                        )
                    ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            No notifications to show.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default NotificationsPage;