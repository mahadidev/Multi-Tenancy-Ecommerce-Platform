import { Card } from "flowbite-react";
import { FC } from "react";

interface StatCardProps {
    title: string;
    tagline: string;
    percentage: string;
    className?: string;
    children: React.ReactNode;
}

export const StatCard: FC<StatCardProps> = ({
    title,
    tagline,
    percentage,
    className = "",
    children,
}) => (
    <Card className={`rounded-lg dark:bg-gray-800 ${className}`}>
        <div className="flex items-center mb-4">
            <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
                <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                    {tagline}
                </span>
            </div>
            <div className="ml-5 flex flex-1 justify-end text-base font-bold text-green-500 dark:text-green-400">
                {percentage}
                <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
        {children}
    </Card>
);
