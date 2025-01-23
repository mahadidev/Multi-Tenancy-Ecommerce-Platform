import { TableCrud } from '@seller-panel/components';
import useCategory from '@seller-panel/hooks/useCategory';
import useProduct from '@seller-panel/hooks/useProduct';
import { FC } from 'react';

const ProductsPage: FC = function () {
	const { products, meta, create, delete: deleteModal, update } = useProduct();
    const {categories} = useCategory()

	return (
		<>
			<TableCrud
				title="All Products"
				name="products"
				item={{
					title: 'product',
					key: 'name',
				}}
				columns={[
					{
						label: 'Thumbnail',
						key: 'thumbnail',
						type: 'image',
					},
					{
						label: 'Name',
						key: 'name',
					},
					{
						label: 'Slug',
						key: 'slug',
					},
					{
						label: 'Created At',
						key: 'created_at',
					},
				]}
				form={[
					{
						label: 'Name',
						name: 'name',
						type: 'text',
						placeholder: 'Product name',
						required: true,
					},
					{
						label: 'Slug',
						name: 'slug',
						type: 'text',
						placeholder: 'Product slug',
						required: true,
					},
					{
						label: 'SKU',
						name: 'sku',
						type: 'text',
						placeholder: 'Product sku',
						required: true,
					},
					{
						label: 'Category',
						name: 'category_id',
						type: 'select',
						required: true,
						options: [
							{
								label: 'Select Category',
								value: 0,
							},
							...categories.map((category) => ({
								label: category.name,
								value: category.id,
								selectKey: 'category',
								subSelectKey: 'id',
							})),
						],
					},
					{
						label: 'price',
						name: 'price',
						type: 'number',
						placeholder: 'Product price',
						required: true,
					},
					{
						label: 'Thumbnail',
						name: 'thumbnail',
						type: 'image',
						placeholder: 'Click to Upload thumbnail',
						required: true,
					},
				]}
				data={products}
				createModal={{
					title: 'Create a new product',
					create: create,
				}}
				editModal={{
					title: 'Edit product',
					update: update,
				}}
				deleteModal={{
					delete: deleteModal,
				}}
				meta={meta}
			/>
		</>
	);
};

export default ProductsPage;
