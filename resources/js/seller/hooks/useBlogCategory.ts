
import { CreateCategoryPayloadType, DeleteCategoryPayloadType, UpdateCategoryPayloadType, useCreateBlogCategoryMutation, useDeleteBlogCategoryMutation, useFetchBlogCategoriesQuery, useUpdateBlogCategoryMutation } from '@seller/store/reducers/blogCategoryApi';
import { useAppSelector } from '@seller/store/store';

const useBlogCategory = () => {
	// fetch categories
	useFetchBlogCategoriesQuery();

	// select category
	const { categories, meta } = useAppSelector((state) => state.blogCategory);

	// create category
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
	] = useCreateBlogCategoryMutation();
	const create = ({
		formData,
		onSuccess,
	}: {
		formData: CreateCategoryPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleCreate(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	// update category
	const [
		handleUpdate,
		{
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
		},
	] = useUpdateBlogCategoryMutation();
	const update = ({
		formData,
		onSuccess,
	}: {
		formData: UpdateCategoryPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleUpdate(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	// delete category
	const [
		handleDelete,
		{
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	] = useDeleteBlogCategoryMutation();
	const deleteCategory = ({
		formData,
		onSuccess,
	}: {
		formData: DeleteCategoryPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleDelete(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	return {
		categories,
		meta,
		create: {
			submit: create,
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
		update: {
			submit: update,
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
		},
		delete: {
			submit: deleteCategory,
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	};
};
export default useBlogCategory;
