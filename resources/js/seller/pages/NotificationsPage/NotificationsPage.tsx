import useNotification from "@seller/hooks/useNotification";
import { NotificationType } from "@type/notification";
import { Card } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const NotificationsPage: React.FC = () => {
    const { notifications, singleNotification } = useNotification();

    return (
        <div className="dark:text-white flex justify-center">
            <Card className="lg:w-6/12 dark:bg-gray-800 bg-white mt-8 rounded-lg">
                <h3 className="text-xl font-bold dark:text-white mb-5">
                    All Notifications
                </h3>

                <div>
                    {notifications?.map(
                        (notification: NotificationType, idx: number) => (
                            <Link
                                to="#"
                                className="flex rounded-lg my-5 px-4 py-3 bg-gray-100 dark:bg-gray-700"
                                key={idx}
                                onClick={() =>
                                    singleNotification.submit({
                                        formData: {
                                            id: notification.id,
                                        },
                                    })
                                }
                            >
                                <div className="shrink-0">
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
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {notification?.title}
                                        </span>
                                        : &quot;{notification?.message}
                                    </div>
                                    <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                                        {notification?.read_at
                                            ? new Date(
                                                  notification?.read_at
                                              ).toDateString() +
                                              " " +
                                              new Date(
                                                  notification?.read_at
                                              ).toLocaleTimeString()
                                            : null}
                                    </div>
                                </div>
                            </Link>
                        )
                    )}

                    {notifications?.length === 0 && (
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
