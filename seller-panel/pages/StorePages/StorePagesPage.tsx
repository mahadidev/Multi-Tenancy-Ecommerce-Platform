import { TableCrud } from '@seller-panel/components';
import useCategory from '@seller-panel/hooks/useCategory';
import usePage from '@seller-panel/hooks/usePage';
import { FC } from 'react';

const StorePages: FC = function () {
	const { pages, meta, create, delete: deleteModal, update } = usePage();
	const { categories } = useCategory();

	return (
		<>
			<TableCrud
				title="All Pages"
				name="pages"
				item={{
					title: 'page',
					key: 'title',
				}}
				columns={[
					{
						label: 'title',
						key: 'title',
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
				data={pages}
				createModal={{
					title: 'Create a new page',
					create: create,
				}}
				editModal={{
					title: 'Edit page',
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

export default StorePages;
