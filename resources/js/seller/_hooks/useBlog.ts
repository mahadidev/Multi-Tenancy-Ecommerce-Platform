import {
    blogApi,
    CreateBlogPayloadType,
    DeleteBlogPayloadType,
    FetchBlogPayloadType,
    UpdateBlogPayloadType,
    useCreateBlogMutation,
    useDeleteBlogMutation,
    useFetchBlogsQuery,
    useUpdateBlogMutation,
} from "@seller/store/reducers/blogApi";
import { useAppSelector } from "@seller/store/store";
import { useNavigate } from "react-router-dom";
import useToast from "./useToast";

const useBlog = () => {
    // fetch blogs
    useFetchBlogsQuery();

    // toast hook
    const { toaster } = useToast();

    // navigation
    const navigate = useNavigate();

    // select blog
    const { blogs, meta } = useAppSelector((state) => state.blog);

    // create blog
    const [
        handleCreate,
        {
            isLoading: isCreateLoading,
            isError: isCreateError,
            error: createError,
            data: createData,
        },
    ] = useCreateBlogMutation();
    const create = ({
        formData,
        onSuccess,
    }: {
        formData: CreateBlogPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleCreate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }

                navigate(`/blogs/${response?.data?.data?.blog?.id}`);

                toaster({
                    text: "Blog created successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to create blog",
                    status: "error",
                });
            }
        });
    };

    // update blog
    const [
        handleUpdate,
        {
            isLoading: isUpdateLoading,
            isError: isUpdateError,
            error: updateError,
            data: updateData,
        },
    ] = useUpdateBlogMutation();
    const update = ({
        formData,
        onSuccess,
    }: {
        formData: UpdateBlogPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Blog updated successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to update blog",
                    status: "error",
                });
            }
        });
    };

    // delete blog
    const [
        handleDelete,
        {
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            error: deleteError,
            data: deleteData,
        },
    ] = useDeleteBlogMutation();
    const deleteBlog = ({
        formData,
        onSuccess,
    }: {
        formData: DeleteBlogPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleDelete(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                toaster({
                    text: "Blog deleted successfully.",
                    status: "success",
                });
            } else {
                toaster({
                    text: "Failed to delete blog",
                    status: "error",
                });
            }
        });
    };

    // fetchBlog
    const [
        handleFetchBlog,
        {
            isLoading: isFetchBlogLoading,
            isError: isFetchBlogError,
            error: fetchBlogError,
            data: fetchBlogData,
        },
    ] = blogApi.endpoints.fetchBlog.useLazyQuery();
    const fetchBlog = ({
        formData,
        onSuccess,
    }: {
        formData: FetchBlogPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleFetchBlog(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    return {
        blogs,
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
            submit: deleteBlog,
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            error: deleteError,
            data: deleteData,
        },
        fetchBlog: {
            submit: fetchBlog,
            isLoading: isFetchBlogLoading,
            isError: isFetchBlogError,
            error: fetchBlogError,
            data: fetchBlogData,
        },
    };
};
export default useBlog;
