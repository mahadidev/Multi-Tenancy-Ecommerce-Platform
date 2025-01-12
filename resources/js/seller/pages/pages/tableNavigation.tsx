import { Button } from "flowbite-react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function TableNavigation() {
    return (
        <div className="sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-white p-4 sm:flex sm:justify-between dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center sm:mb-0">
                <a
                    href="#"
                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <HiChevronLeft className="h-7 w-7" />
                </a>
                <a
                    href="#"
                    className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    <HiChevronRight className="h-7 w-7" />
                </a>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                        1-20
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                        2290
                    </span>
                </span>
            </div>
            <div className="flex items-center space-x-3">
                <Button color="blue" size="sm">
                    <HiChevronLeft className="-ml-1 mr-1 h-5 w-5" />
                    Previous
                </Button>
                <Button color="blue" size="sm">
                    Next
                    <HiChevronRight className="-mr-1 ml-1 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
