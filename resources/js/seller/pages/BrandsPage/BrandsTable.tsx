import useBrand from '@seller/hooks/useBrand';
import { BrandType } from '@type/brandType';
import { Checkbox, Label, Table } from 'flowbite-react';
import DeleteBrandModal from './DeleteBrandModal';
import EditBrandModal from './EditBrandModal';

const BrandsTable = () => {
    const { brands } = useBrand();

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
				<Table.HeadCell>Name</Table.HeadCell>
				<Table.HeadCell>Slug</Table.HeadCell>
				<Table.HeadCell />
			</Table.Head>
			<Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
				{brands.map((brand: BrandType) => (
					<Table.Row
						key={brand.id}
						className="hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<Table.Cell className="w-4 p-4">
							<Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{brand.id}
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{brand.name}
						</Table.Cell>
						<Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
							{brand.slug}
						</Table.Cell>
						<Table.Cell>
							<div className="flex items-center gap-x-3 whitespace-nowrap">
								<EditBrandModal brand={brand} />
								<DeleteBrandModal brand={brand} />
							</div>
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
};
export default BrandsTable;
