
import { useUpdateBrandMutation } from '@seller-panel/store/reducers/brandApi';
import {
    CreateSocialMediaPayloadType,
    DeleteSocialMediaPayloadType,
    useCreateSocialMediaMutation,
    useDeleteCategoryMutation,
    useFetchSocialMediasQuery
} from '@seller-panel/store/reducers/socialMediaApi';
import { UpdateStorePayloadType } from '@seller-panel/store/reducers/storeApi';
import { useAppSelector } from '@seller-panel/store/store';

const useSocialMedia = () => {
	// fetch stores
	useFetchSocialMediasQuery();
	// select store
	const { socialMedias, meta, socialMediaList } = useAppSelector(
		(state) => state.socialMedia
	);

	// create social media
	const [
		handleCreate,
		{
			isLoading: isCreateLoading,
			isError: isCreateError,
			error: createError,
			data: createData,
		},
	] = useCreateSocialMediaMutation();
	const create = ({
		formData,
		onSuccess,
	}: {
		formData: CreateSocialMediaPayloadType;
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

	// update social media
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
		formData: UpdateStorePayloadType;
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

	// delete product
	const [
		handleDelete,
		{
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	] = useDeleteCategoryMutation();
	const deleteSocialMedia = ({
		formData,
		onSuccess,
	}: {
		formData: DeleteSocialMediaPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleDelete(formData).then((response) => {
            console.log(response)
			if (response.data?.status === 200) {
				if (onSuccess) {

					onSuccess(response.data.data);
				}
			}
		});
	};

	return {
		socialMedias,
		meta,
		socialMediaList,
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
			submit: deleteSocialMedia,
			isLoading: isDeleteLoading,
			isError: isDeleteError,
			error: deleteError,
			data: deleteData,
		},
	};
};
export default useSocialMedia;
