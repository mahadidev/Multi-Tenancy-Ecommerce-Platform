import { useAppSelector } from "@/seller/store";
import {
    CreatePagePayloadType,
    UpdatePagePayloadType,
    useCreatePageMutation,
    useUpdatePageMutation,
} from "@/seller/store/reducers/pageApi";
import { StorePageType, StoreType, WidgetInputType } from "@/seller/types";
import { useParams } from "react-router-dom";

const usePage = () => {
    const { currentStore } = useAppSelector((state) => state.store);
    const store: StoreType = currentStore;

    const [onCreatePage, { error: createError, isLoading: isCreateLoading }] =
        useCreatePageMutation();
    const [onUpdatePage, { isLoading: isUpdateLoading, error: updateError }] =
        useUpdatePageMutation();
    const [
        onAddWidgets,
        { isLoading: isAddWidgetsLoading, error: addWidgetsError },
    ] = useUpdatePageMutation();
    const [
        onDeleteWidget,
        { isLoading: isDeleteWidgetLoading, error: deleteWidgetError },
    ] = useUpdatePageMutation();

    const createPage = ({
        pageData,
        onSuccess,
    }: {
        pageData: CreatePagePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        onCreatePage({
            storeId: store.id,
            formData: pageData,
        }).then((response) => {
            if (response.data.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    // if inside any page
    const params = useParams();
    const { id: pageId } = params;

    const updatePage = ({
        pageData,
        onSuccess,
    }: {
        pageData: UpdatePagePayloadType;
        onSuccess?: CallableFunction;
    }) => {
        onUpdatePage({
            storeId: store.id,
            pageId: pageId ? pageId : 0,
            formData: pageData,
        }).then((response) => {
            if (response.data.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    const addWidgets = ({
        widgetsData,
        onSuccess,
        pageData,
    }: {
        widgetsData: {
            name: string;
            label: string;
            inputs: WidgetInputType[];
        }[];
        onSuccess?: CallableFunction;
        pageData: StorePageType | undefined;
    }) => {
        onAddWidgets({
            storeId: store.id,
            pageId: pageId ? pageId : 0,
            formData: {
                widgets: [
                    ...(pageData && pageData.widgets ? pageData.widgets : []),
                    ...widgetsData,
                ],
            },
        }).then((response) => {
            if (response.data.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    const deleteWidget = ({
        widgetId,
        onSuccess,
        pageData,
    }: {
        widgetId: number;
        onSuccess?: CallableFunction;
        pageData: StorePageType | undefined;
    }) => {
        onDeleteWidget({
            storeId: store.id,
            pageId: pageId ? pageId : 0,
            formData: {
                widgets: [
                    ...(pageData && pageData.widgets
                        ? pageData.widgets.filter(
                              (item) => item.id !== widgetId
                          )
                        : []),
                ],
            },
        }).then((response) => {
            if (response.data.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    return {
        createPage: {
            create: createPage,
            isLoading: isCreateLoading,
            error: createError,
        },
        updatePage: {
            update: updatePage,
            isLoading: isUpdateLoading,
            error: updateError,
        },
        addWidgets: {
            add: addWidgets,
            isLoading: isAddWidgetsLoading,
            error: addWidgetsError,
        },
        deleteWidget: {
            delete: deleteWidget,
            isLoading: isDeleteWidgetLoading,
            error: deleteWidgetError,
        },
        pageId: pageId,
        store,
    };
};

export default usePage;
