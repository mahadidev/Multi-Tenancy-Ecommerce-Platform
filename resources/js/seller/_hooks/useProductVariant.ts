import { CreateProductVariantPayloadType, DeleteProductVariantPayloadType, UpdateProductVariantPayloadType, useCreateProductVariantMutation, useDeleteProductVariantMutation, useFetchProductVariantsQuery, useUpdateProductVariantMutation } from '@seller/store/reducers/productVariantApi';
import { useAppSelector } from '@seller/store/store';

const useProductVariant = (id: number | string) => {
	// fetch products
	useFetchProductVariantsQuery({
		productId: id,
	});

	// select product
	const { variants, selectedVariant } = useAppSelector(
		(state) => state.productVariant
	);

	// create product
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			isSuccess: isCreateSuccess,
			error: createError,
			data: createData,
		},
	] = useCreateProductVariantMutation();
	const create = ({
		formData,
		onSuccess,
	}: {
		formData: CreateProductVariantPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleCreate({
			...formData,
		}).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	// update product
	const [
		handleUpdate,
		{
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			isSuccess: isUpdateSuccess,
			error: updateError,
			data: updateData,
		},
	] = useUpdateProductVariantMutation();
	const update = ({
		formData,
		onSuccess,
	}: {
		formData: UpdateProductVariantPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleUpdate({
			...formData,
		}).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	// delete product variant
	const [
		handleDelete,
		{
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			isSuccess: isDeleteSuccess,
			error: deleteError,
			data: deleteData,
		},
	] = useDeleteProductVariantMutation();
	const deleteVariant = ({
		formData,
		onSuccess,
	}: {
		formData: DeleteProductVariantPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleDelete({
			...formData,
		}).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	return {
		productVariants: variants,
		productVariant: selectedVariant,
		create: {
			submit: create,
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
			isSuccess: isCreateSuccess,
		},
		update: {
			submit: update,
			isLoading: isUpdateLoading,
			isError: isUpdateError,
			error: updateError,
			data: updateData,
			isSuccess: isUpdateSuccess,
		},
		delete: {
			submit: deleteVariant,
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
			isSuccess: isDeleteSuccess,
		},
	};
};
export default useProductVariant;
