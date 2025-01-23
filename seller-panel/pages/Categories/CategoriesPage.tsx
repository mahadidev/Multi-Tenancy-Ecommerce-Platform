import { TableCrud } from '@seller-panel/components';
import useCategory from '@seller-panel/hooks/useCategory';
import { FC } from 'react';

const CategoriesPage: FC = function () {
	const { categories, meta, create, delete: deleteModal, update } = useCategory();

	return (
		<>
			<TableCrud
				title="All Categories"
				name="categories"
				item={{
					title: 'category',
					key: 'name',
				}}
				columns={[
					{
						label: 'Name',
						key: 'name',
					},
					{
						label: 'Slug',
						key: 'slug',
					},
					{
						label: 'Parent',
						key: 'has_parent',
						subKey: 'name',
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
						placeholder: 'Category name',
						required: true,
					},
					{
						label: 'Parent Category',
						name: 'parent_id',
						type: 'select',
						options: [
							{
								label: 'Select Category',
                                value: 0
							},
							...categories.map((category) => ({
								label: category.name,
								value: category.id,
								selectKey: "has_parent",
                                subSelectKey: "id"
							})),
						],
					},
				]}
				data={categories}
				createModal={{
					title: 'Create a new Category',
					create: create,
				}}
				editModal={{
					title: 'Edit category',
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

export default CategoriesPage;
