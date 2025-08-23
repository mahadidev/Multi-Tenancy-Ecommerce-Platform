import { 
  useCreateSocialMediaMutation,
  useUpdateSocialMediaMutation,
  useDeleteSocialMediaMutation,
  useFetchSocialMediasQuery
} from '../store/socialMediaApi';
import { useAppSelector } from '../../../store/store';
import { 
  CreateSocialMediaPayload, 
  UpdateSocialMediaPayload, 
  DeleteSocialMediaPayload 
} from '../types';

const useSocialMedia = () => {
  // Fetch social media
  useFetchSocialMediasQuery();

  // Select social media state
  const {
    socialMedias,
    selectedSocialMedia,
    socialMediaList,
    meta,
  } = useAppSelector((state) => state.socialMedia);

  // Create social media
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
    formData: CreateSocialMediaPayload;
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

  // Update social media
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateSocialMediaMutation();

  const update = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateSocialMediaPayload;
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

  // Delete social media
  const [
    handleDelete,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  ] = useDeleteSocialMediaMutation();

  const deleteSocialMedia = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteSocialMediaPayload;
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
    socialMedias,
    selectedSocialMedia,
    socialMediaList,
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
      submit: deleteSocialMedia,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  };
};

export default useSocialMedia;