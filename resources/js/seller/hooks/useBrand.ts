import { CreateBrandPayloadType, DeleteBrandPayloadType, UpdateBrandPayloadType, useCreateBrandMutation, useDeleteBrandMutation, useUpdateBrandMutation } from '@seller/store/reducers/brandApi';
import { useAppSelector } from '@seller/store/store';

const useBrand = () => {
	// select brand
	const { brands, meta } = useAppSelector((state) => state.brand);

	// create brand
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
	] = useCreateBrandMutation();
	const create = ({
		formData,
		onSuccess,
	}: {
		formData: CreateBrandPayloadType;
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

	// update brand
	const [
		handleUpdate,
		{
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
		},
	] = useUpdateBrandMutation();
	const update = ({
		formData,
		onSuccess,
	}: {
		formData: UpdateBrandPayloadType;
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

	// delete brand
	const [
		handleDelete,
		{
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	] = useDeleteBrandMutation();
	const deleteBrand = ({
		formData,
		onSuccess,
	}: {
		formData: DeleteBrandPayloadType;
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
		brands,
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
			submit: deleteBrand,
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	};
};
export default useBrand;
