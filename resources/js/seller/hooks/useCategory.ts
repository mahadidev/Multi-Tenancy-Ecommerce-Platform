import {
    CreateCategoryPayloadType,
    DeleteCategoryPayloadType,
    UpdateCategoryPayloadType,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery,
    useUpdateCategoryMutation,
} from '@seller/store/reducers/categoryApi';
import { useAppSelector } from '@seller/store/store';

const useCategory = () => {
	// fetch categories
	useFetchCategoriesQuery();

	// select category
	const { categories, meta } = useAppSelector((state) => state.category);

	// create category
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
	] = useCreateCategoryMutation();
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
	] = useUpdateCategoryMutation();
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
	] = useDeleteCategoryMutation();
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
export default useCategory;
