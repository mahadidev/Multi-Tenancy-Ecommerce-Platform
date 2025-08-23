import { Checkbox, Label, Table } from 'flowbite-react';
import usePlaceholders from '../hooks/usePlaceholders';
import EditPlaceholderModal from './EditPlaceholderModal';
import DeletePlaceholderModal from './DeletePlaceholderModal';
import { Placeholder } from '../types';

const PlaceholdersTable = () => {
    const { placeholders } = usePlaceholders();

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
				<Table.HeadCell>Name</Table.HeadCell>
				<Table.HeadCell>Key</Table.HeadCell>
				<Table.HeadCell>Type</Table.HeadCell>
				<Table.HeadCell>Status</Table.HeadCell>
				<Table.HeadCell>Actions</Table.HeadCell>
			</Table.Head>
			<Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
				{placeholders.map((placeholder: Placeholder) => (
                    <Table.Row
                        key={placeholder.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Table.Cell className="w-4 p-4">
                            <Checkbox
                                aria-describedby={`checkbox-${placeholder.id}`}
                                id={`checkbox-${placeholder.id}`}
                            />
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {placeholder.name}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-500 dark:text-gray-400">
                            {placeholder.key}
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-500 dark:text-gray-400">
                            <span className="capitalize">{placeholder.type}</span>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                placeholder.is_active 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            }`}>
                                {placeholder.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditPlaceholderModal placeholder={placeholder} />
                                <DeletePlaceholderModal placeholder={placeholder} />
                            </div>
                        </Table.Cell>
                    </Table.Row>
			    ))}
			</Table.Body>
		</Table>
	);
};
export default PlaceholdersTable;
