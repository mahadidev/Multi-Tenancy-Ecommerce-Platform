import { DataTable } from '@seller/components';
import useProductVariant from '@seller/hooks/useProductVariant';
import { ProductVariantType } from '@type/productType';
import { Table } from 'flowbite-react';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CreateAttributeModal from './CreateAttributeModal';
import DeleteAttributeModal from './DeleteAttributeModal';
import EditAttributeModal from './EditAttributeModal';

interface Props {
	formState: any;
	setFormState: React.Dispatch<any>;
	formErrors: any;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | any>,
		onChange?: CallableFunction
	) => void;
}

const Variants: FC<Props> = () => {
	const { id } = useParams();
	const { productVariants } = useProductVariant(id ?? 0);


	return (
		<>
			<div className="flex justify-between items-center gap-2.5 py-2.5">
				<h2 className="text-lg font-medium">Product Variants</h2>
				<CreateAttributeModal />
			</div>

			<DataTable
				disablePagination
				disableSl
				columns={[
					{
						sortable: true,
						label: 'Label',
						key: 'label',
						render: (row: ProductVariantType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row.label}
							</Table.Cell>
						),
					},
					{
						label: 'Options',
						render: (row: ProductVariantType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								{row.options.map((option) => (
									<span
										className="border-r-2 border-primary pr-2 mr-2 last:pr-0 last:mr-0 last:border-r-0"
										key={option.id}
									>
										{option.label}
									</span>
								))}
							</Table.Cell>
						),
					},
					{
						label: 'Action',
						render: (row: ProductVariantType) => (
							<Table.Cell className="whitespace-nowrap p-4 font-medium text-gray-900 dark:text-white">
								<EditAttributeModal variant={row} />
								<DeleteAttributeModal variant={row} />
							</Table.Cell>
						),
					},
				]}
				data={productVariants}
				bodyClassName="bg-gray-50"
				tableWrapperClassName="rounded-md overflow-hidden"
			/>
		</>
	);
};
export default Variants;
