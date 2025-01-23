import { Checkbox, Label, Table } from 'flowbite-react';

const PlaceholdersTable = () => {
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
				<Table.HeadCell>YOUR_HEAD_CELL</Table.HeadCell>
				<Table.HeadCell />
			</Table.Head>
			<Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
				{/* {YOUR_DATA_ARRAY.map((YOUR_DATA_ITEM: PlaceholderType) => (
                    <Table.Row
                        key={placeholder.id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <Table.Cell className="w-4 p-4">
                            <Checkbox
                                aria-describedby="checkbox-1"
                                id="checkbox-1"
                            />
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                            {placeholder.id}
                        </Table.Cell>
                        <Table.Cell>
                            <div className="flex items-center gap-x-3 whitespace-nowrap">
                                <EditPlaceholderModal placeholder={placeholder} />
                                <DeletePlaceholderModal placeholder={placeholder} />
                            </div>
                        </Table.Cell>
                    </Table.Row>
			    ))} */}
			</Table.Body>
		</Table>
	);
};
export default PlaceholdersTable;
