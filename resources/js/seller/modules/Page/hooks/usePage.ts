import { useAppDispatch, useAppSelector } from '@seller/store/store';
import {
    pageApi,
    useCreatePageMutation,
    useDeletePageMutation,
    useFetchPagesQuery,
    useFetchPageTypesQuery,
    useUpdatePageMutation,
} from '../store/pageApi';
import { setPage } from '../store/pageSlice';
import { CreatePagePayload, DeletePagePayload, FetchPagePayload, UpdatePagePayload } from '../types';

const usePage = () => {
  // fetch pages
  useFetchPagesQuery();
  useFetchPageTypesQuery();

  // select page
  const { pages, meta, page, pageTypes } = useAppSelector(
    (state) => state.page
  );

  // select widgets
  const { widgets } = useAppSelector((state) => state.widget);

  // dispatch
  const dispatch = useAppDispatch();

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
    formData: CreatePagePayload;
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
    formData: UpdatePagePayload;
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
    formData: DeletePagePayload;
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

  // fetch page
  const [
    handleFetchPage,
    {
      isLoading: isFetchPageLoading,
      isError: isFetchPageError,
      error: fetchPageError,
      data: fetchPageData,
    },
  ] = pageApi.endpoints.fetchPage.useLazyQuery();
  const fetchPage = ({
    formData,
    onSuccess,
  }: {
    formData: FetchPagePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleFetchPage(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // on change page input
  const onChangePageInput = (
    event: React.ChangeEvent<HTMLInputElement | any>
  ) => {
    if (page) {
      dispatch(
        setPage({
          ...page,
          [event.target.name]: event.target.value,
        })
      );
    }
  };

  // save page
  const [
    handleSavePage,
    {
      isLoading: isSavePageLoading,
      isError: isSavePageError,
      error: savePageError,
      data: savePageData,
    },
  ] = useUpdatePageMutation();
  const savePage = ({ onSuccess }: { onSuccess?: CallableFunction }) => {
    if (page) {
      handleSavePage({
        ...page,
        widgets: widgets.map((widget) => {
          return {
            ...widget,
            inputs: widget.inputs
              .slice()
              .sort(function (inputA, inputB) {
                return inputA.id - inputB.id;
              })
              .map((input) => {
                return {
                  ...input,
                  child: input.child
                    ? input.child.slice().sort(function (inputA, inputB) {
                        return inputA.id - inputB.id;
                      })
                    : [],
                };
              }),
          };
        }),
      }).then((response) => {
        if (response.data?.status === 200) {
          if (onSuccess) {
            onSuccess(response.data.data);
          }
        }
      });
    }
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
    fetchPage: {
      submit: fetchPage,
      isLoading: isFetchPageLoading,
      isError: isFetchPageError,
      error: fetchPageError,
      data: fetchPageData,
    },
    savePage: {
      submit: savePage,
      isLoading: isSavePageLoading,
      isError: isSavePageError,
      error: savePageError,
      data: savePageData,
    },
    onChangePageInput,
  };
};

export default usePage;
