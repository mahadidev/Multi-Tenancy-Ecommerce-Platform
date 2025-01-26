import { WidgetType } from '@/types/widgetType';
import {
    CreatePagePayloadType,
    DeletePagePayloadType,
    FetchPagePayloadType,
    pageApi,
    UpdatePagePayloadType,
    useCreatePageMutation,
    useDeletePageMutation,
    useFetchPagesQuery,
    useFetchPageTypesQuery,
    useUpdatePageMutation,
} from '@seller/store/reducers/pageApi';
import { useAppSelector } from '@seller/store/store';

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
		formData: FetchPagePayloadType;
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

	// add widget
	const [
		handleAddWidget,
		{
			isLoading: isAddWidgetLoading,
			isError: isAddWidgetError,
			error: addWidgetError,
			data: addWidgetData,
		},
	] = useUpdatePageMutation();
	const addWidget = ({
		formData,
		onSuccess,
	}: {
		formData: {
			widget: WidgetType;
		};
		onSuccess?: CallableFunction;
	}) => {
		if (page) {
			handleAddWidget({
				id: page.id,
				widgets: [...page.widgets, formData.widget],
			}).then((response) => {
				if (response.data?.status === 200) {
					if (onSuccess) {
						onSuccess(response.data.data);
					}
				}
			});
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
				id: page.id,
				name: page.name,
				slug: page.slug,
				title: page.title,
				is_active: page.is_active,
				widgets: widgets,
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
		addWidget: {
			submit: addWidget,
			isLoading: isAddWidgetLoading,
			isError: isAddWidgetError,
			error: addWidgetError,
			data: addWidgetData,
		},
		savePage: {
			submit: savePage,
			isLoading: isSavePageLoading,
			isError: isSavePageError,
			error: savePageError,
			data: savePageData,
		},
	};
};
export default usePage;
