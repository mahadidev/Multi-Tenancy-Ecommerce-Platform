import { MetaType } from '@type/tableType';
import { Button } from 'flowbite-react';
import { FC, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const BlogCategoriesTablePagination: FC<{ meta: MetaType }> = function ({ meta }) {
	const [page, setPage] = useState(0);
	const numPages = meta.total;

	const previousPage = () => {
		setPage(page > 0 ? page - 1 : page);
	};

	const nextPage = () => {
		setPage(page < numPages - 1 ? page + 1 : page);
	};

	return (
		<div className="sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-white p-4 sm:flex sm:justify-between dark:border-gray-700 dark:bg-gray-800">
			<div className="mb-4 flex items-center sm:mb-0">
				<button
					onClick={previousPage}
					className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				>
					<span className="sr-only">Previous page</span>
					<HiChevronLeft className="h-7 w-7" />
				</button>
				<button
					onClick={nextPage}
					className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				>
					<span className="sr-only">Next page</span>
					<HiChevronRight className="h-7 w-7" />
				</button>
				<span className="text-sm font-normal text-gray-500 dark:text-gray-400">
					Showing&nbsp;
					<span className="font-semibold text-gray-900 dark:text-white">
						{meta.current_page}-{meta.last_page}
					</span>
					&nbsp;of&nbsp;
					<span className="font-semibold text-gray-900 dark:text-white">
						{meta.total}
					</span>
				</span>
			</div>
			<div className="flex items-center space-x-3">
				<Button size="xs" className="items-center" color="primary">
					<HiChevronLeft className="-ml-1 mr-1 h-5 w-5" />
					Previous
				</Button>

				<Button size="xs" className="items-center" color="primary">
					Next
					<HiChevronRight className="-mr-1 ml-1 h-5 w-5" />
				</Button>
			</div>
		</div>
	);
};
export default BlogCategoriesTablePagination;
