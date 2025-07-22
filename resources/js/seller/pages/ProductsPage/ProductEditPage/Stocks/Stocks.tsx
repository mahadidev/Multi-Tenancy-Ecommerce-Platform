import { DataTable } from '@seller/components';
import useProductStock from '@seller/hooks/useProductStock';
import { ProductStockType } from '@type/productType';
import { Table } from 'flowbite-react';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import CreateStockModal from './CreateStockModal';
import DeleteStockModal from './DeleteStockModal';
import EditStockModal from './EditStockModal';

interface Props {
	formState: any;
	setFormState: React.Dispatch<any>;
	formErrors: any;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | any>,
		onChange?: CallableFunction
	) => void;
}

const Stocks: FC<Props> = () => {
	const { id } = useParams();
	const { productStocks } = useProductStock(id ?? 0);

	return (
		<>
			<div className="flex justify-between items-center gap-2.5 py-2.5">
				<h2 className="text-lg font-medium">Product Stocks</h2>
				<CreateStockModal />
			</div>

			<DataTable
				disablePagination
				disableSl
				columns={[
					{
						sortable: true,
						label: 'Variant',
						key: 'label',
						render: (row: ProductStockType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row.stock_items?.map((item) => (
									<span
										className="border-r-2 border-primary pr-2 mr-2 last:pr-0 last:mr-0 last:border-r-0"
										key={item.id}
									>
										{item.variant_option?.label}
									</span>
								))}
							</Table.Cell>
						),
					},
					{
						label: 'Qty',
						key: 'qty',
						sortable: true,
						render: (row: ProductStockType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row.qty}
							</Table.Cell>
						),
					},
					{
						label: 'Price',
						key: 'price',
						sortable: true,
						render: (row: ProductStockType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row.price}
							</Table.Cell>
						),
					},
					{
						label: 'Date',
                        key: 'updated_at',
						render: (row: ProductStockType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row.updated_at}
							</Table.Cell>
						),
					},
					{
						label: 'Action',
						render: (row: ProductStockType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								<EditStockModal stock={row} />
								<DeleteStockModal stock={row} />
							</Table.Cell>
						),
					},
				]}
				data={productStocks ?? []}
				bodyClassName="bg-gray-50"
				tableWrapperClassName="rounded-md overflow-hidden"
			/>
		</>
	);
};
export default Stocks;
