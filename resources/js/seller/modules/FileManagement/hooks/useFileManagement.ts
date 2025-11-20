import { useAppSelector } from '../../../store/store';
import {
    useDeleteFileMutation,
    useFetchFilesQuery,
    useUpdateFileMutation,
    useUploadFileMutation
} from '../store/fileManagementApi';
import { DeleteFilePayload, UpdateFilePayload, UploadFilePayload } from '../types';

const useFileManagement = () => {
  // Fetch files
  useFetchFilesQuery();

  // Select file management state
  const {
    files,
    selectedFile,
    meta,
  } = useAppSelector((state) => state.fileManagement);

  // Upload file
  const [
    handleUpload,
    {
      isLoading: isUploadLoading,
      isError: isUploadError,
      error: uploadError,
      data: uploadData,
    },
  ] = useUploadFileMutation();

  const upload = ({
    formData,
    onSuccess,
  }: {
    formData: UploadFilePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleUpload(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Update file
  const [
    handleUpdate,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateFileMutation();

  const updateFile = ({
    formData,
    onSuccess,
  }: {
    formData: UpdateFilePayload;
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

  // Delete file
  const [
    handleDelete,
    {
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },
  ] = useDeleteFileMutation();

  const deleteFile = ({
    formData,
    onSuccess,
  }: {
    formData: DeleteFilePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleDelete(formData).then((response) => {
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Image helper functions
  const getImageFileFromUrl = async ({
    onSuccess,
    url,
  }: {
    onSuccess: CallableFunction;
    url: string;
  }) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = function (_event: ProgressEvent<FileReader>) {
        onSuccess(reader.readAsDataURL(blob));
      };
    } catch (error) {
      return 'error';
    }
  };

  // Get cropped image
  const getCroppedImg = async ({
    image,
    crop,
  }: {
    image: HTMLImageElement;
    crop: any;
  }) => {
    if (!crop.width || !crop.height) return null;

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width;
    canvas.height = crop.height;

    if (!ctx) return null;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || null);
      }, 'image/jpeg');
    });
  };

  return {
    files,
    selectedFile,
    meta,

    upload: {
      submit: upload,
      isLoading: isUploadLoading,
      isError: isUploadError,
      error: uploadError,
      data: uploadData,
    },
    updateFile: {
      submit: updateFile,
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
    delete: {
      submit: deleteFile,
      isLoading: isDeleteLoading,
      isError: isDeleteError,
      error: deleteError,
      data: deleteData,
    },

    // Image utilities
    getImageFileFromUrl,
    getCroppedImg,
  };
};

export default useFileManagement;
