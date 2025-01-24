import { Checkbox, Label, Table } from 'flowbite-react';
import { FC } from 'react';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import { TableCrudPropsType } from './TableCrud';

const DataTable: FC<TableCrudPropsType> = function (props) {
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
				{props.columns?.map((column, index: number) => (
					<Table.HeadCell key={index}>{column.label}</Table.HeadCell>
				))}
				<Table.HeadCell />
			</Table.Head>
			<Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
				{props.data?.map((item: { [Key: string]: string } | any) => (
					<Table.Row
						key={item['id']}
						className="hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<Table.Cell className="w-4 p-4">
							<Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
						</Table.Cell>
						{props.columns?.map((column, index: number) => (
							<Table.Cell
								key={index}
								className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white"
							>
								{column.type === 'image' ? (
									<>
										<img
											alt=""
											src={item[column.key]}
											className="w-10 h-10 rounded-full aspect-square object-cover"
										/>
									</>
								) : (
									<>
										{column.subKey && item[column.key] ? (
											<>
												{column.subKey in item[column.key] &&
													item[column.key][column.subKey]}
											</>
										) : (
											item[column.key]
										)}
									</>
								)}
							</Table.Cell>
						))}
						<Table.Cell>
							<div className="flex items-center gap-x-3 whitespace-nowrap">
								<EditModal {...props} cell={item} />
								<DeleteModal {...props} cell={item} />
							</div>
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
};
export default DataTable;
