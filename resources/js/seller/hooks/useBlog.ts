
import { blogApi, CreateBlogPayloadType, DeleteBlogPayloadType, FetchBlogPayloadType, UpdateBlogPayloadType, useCreateBlogMutation, useDeleteBlogMutation, useFetchBlogsQuery, useUpdateBlogMutation } from "@seller/store/reducers/blogApi";
import { useAppSelector } from "@seller/store/store";

const useBlog = () => {
    // fetch blogs
    useFetchBlogsQuery();

    // select blog
    const { blogs, meta, blog } = useAppSelector(
        (state) => state.blog
    );

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
        blog,
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
