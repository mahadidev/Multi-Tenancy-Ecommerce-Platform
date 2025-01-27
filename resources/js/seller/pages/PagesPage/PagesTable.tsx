import usePage from '@seller/hooks/usePage';
import { RoutePath } from '@seller/seller_env';
import { PageType } from '@type/pageType';
import { Button, Checkbox, Label, Table } from 'flowbite-react';
import { HiPencilAlt } from 'react-icons/hi';
import DeletePageModal from './DeletePageModal';

const PagesTable = () => {
    const { pages } = usePage();

	return (
		<Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
			<Table.Head
				className="bg-gray-100 dark:bg-gray-700"
				theme={{
					cell: {
						base: 'p-4 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400',
					},
				}}
			>
				<Table.HeadCell className="p-4">
					<Label htmlFor="select-all" className="sr-only">
						Select all
					</Label>
					<Checkbox id="select-all" name="select-all" />
				</Table.HeadCell>
				<Table.HeadCell>ID</Table.HeadCell>
				<Table.HeadCell>Title</Table.HeadCell>
				<Table.HeadCell>Type</Table.HeadCell>
				<Table.HeadCell>Name</Table.HeadCell>
				<Table.HeadCell>Last Update</Table.HeadCell>
				<Table.HeadCell>Created At</Table.HeadCell>
				<Table.HeadCell />
			</Table.Head>
			<Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
				{pages.map((page: PageType) => (
					<Table.Row
						key={page.id}
						className="hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<Table.Cell className="w-4 p-4">
							<Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{page.id}
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{page.title}
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{page.type.label}
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{page.name}
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{page.updated_at}
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{page.created_at}
						</Table.Cell>
						<Table.Cell>
							<div className="flex items-center gap-x-3 whitespace-nowrap">
								<Button href={RoutePath.StorePagesPage.editUrl(page.id)} size="sm" color="primary" className="p-0">
									<div className="flex items-center gap-x-2">
										<HiPencilAlt className="h-5 w-5" />
										Edit Page
									</div>
								</Button>
								<DeletePageModal page={page} />
							</div>
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
};
export default PagesTable;
