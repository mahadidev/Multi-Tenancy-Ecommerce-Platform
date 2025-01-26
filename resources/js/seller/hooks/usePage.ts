
import { CreatePagePayloadType, DeletePagePayloadType, UpdatePagePayloadType, useCreatePageMutation, useDeletePageMutation, useFetchPagesQuery, useFetchPageTypesQuery, useUpdatePageMutation } from '@seller/store/reducers/pageApi';
import { useAppSelector } from '@seller/store/store';

const usePage = () => {
	// fetch pages
	useFetchPagesQuery();
    useFetchPageTypesQuery();

	// select page
	const { pages, meta, page, pageTypes } = useAppSelector((state) => state.page);

	// create page
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
	] = useCreatePageMutation();
	const create = ({
		formData,
		onSuccess,
	}: {
		formData: CreatePagePayloadType;
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

	// update page
	const [
		handleUpdate,
		{
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
		},
	] = useUpdatePageMutation();
	const update = ({
		formData,
		onSuccess,
	}: {
		formData: UpdatePagePayloadType;
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

	// delete page
	const [
		handleDelete,
		{
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	] = useDeletePageMutation();
	const deletePage = ({
		formData,
		onSuccess,
	}: {
		formData: DeletePagePayloadType;
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
		pages,
		page,
		meta,
        pageTypes,
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
			submit: deletePage,
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	};
};
export default usePage;
