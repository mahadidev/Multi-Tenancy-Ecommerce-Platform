import { useAppDispatch, useAppSelector } from "@/seller/store";
import {
    UpdatePagePayloadType,
    useFetchPageQuery,
    useUpdatePageMutation,
} from "@/seller/store/reducers/pageApi";
import {
    StoreType,
    WidgetInputItemType,
    WidgetInputType,
    WidgetType,
} from "@/seller/types";
import { useParams } from "react-router-dom";
import {
    useDeleteWidgetMutation,
    useFetchWidgetsQuery,
    widgetApi,
} from "../store/reducers/widgetApi";
import {
    setSelected as setPageSelected,
    SetSelectedPayloadType,
    setWidget as setSelectedWidget,
    setWidgets,
} from "../store/slices/pageSlice";

const usePage = () => {
    const { currentStore } = useAppSelector((state) => state.store);
    const { page, selected, widget, widgets, pageTypes } = useAppSelector(
        (state) => state.page
    );
    const store: StoreType = currentStore;
    const dispatch = useAppDispatch();
    const params = useParams();
    const { id: pageId } = params;
    // call fetch page api
    useFetchPageQuery({
        storeId: store.id,
        pageId: pageId ?? 0,
    });
    // call fetch page widget api
    useFetchWidgetsQuery({
        pageId: pageId ?? 0,
    });

    const [onUpdatePage, { isLoading: isUpdateLoading, error: updateError }] =
        useUpdatePageMutation();
    const [
        onAddWidgets,
        { isLoading: isAddWidgetsLoading, error: addWidgetsError },
    ] = useUpdatePageMutation();
    const [
        onDeleteWidget,
        { isLoading: isDeleteWidgetLoading, error: deleteWidgetError },
    ] = useDeleteWidgetMutation();
    const [reFetchWidget] = widgetApi.endpoints.fetchWidgets.useLazyQuery();

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

    const setWidget = (widgetData: WidgetType) => {
        dispatch(setSelectedWidget(widgetData));
    };

    const addWidgets = ({
        formData,
        onSuccess,
    }: {
        formData: WidgetType[];
        onSuccess?: CallableFunction;
    }) => {
        onAddWidgets({
            storeId: store.id,
            pageId: page ? page.id : 0,
            formData: {
                widgets: [...(page ? page.widgets : []), ...formData],
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
    }: {
        widgetId: number;
        onSuccess?: CallableFunction;
    }) => {
        onDeleteWidget({
            pageId: pageId ? pageId : 0,
            widgetId: widgetId,
        }).then((response) => {
            if (response.data.status === 200) {
                if (onSuccess) {
                    onSuccess();
                }
            }
        });
    };

    const setSelected = (payload: SetSelectedPayloadType) => {
        dispatch(setPageSelected(payload));
    };

    const onChangeWidgetInput = ({
        event,
        input,
    }: {
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
        input: WidgetInputType;
    }) => {
        const { value } = event.target;
        const findWidget = widgets.find(
            (findWidget) => findWidget.id === (widget?.id ?? 1)
        );

        if (findWidget) {
            dispatch(
                setWidgets([
                    ...widgets.filter(
                        (filterWidget) => filterWidget.id !== findWidget.id
                    ),
                    {
                        ...findWidget,
                        inputs: [
                            ...findWidget.inputs.filter(
                                (filterInput) => filterInput.id !== input.id
                            ),
                            {
                                ...input,
                                value: value,
                            },
                        ],
                    },
                ])
            );
        }
    };

    const onChangeWidgetInputItem = ({
        event,
        input,
        item,
    }: {
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
        input: WidgetInputType;
        item: WidgetInputItemType;
    }) => {
        const { value } = event.target;
        const findWidget = widgets.find(
            (findWidget) => findWidget.id === (widget?.id ?? 1)
        );

        if (findWidget && widgets) {
            dispatch(
                setWidgets([
                    ...widgets.filter(
                        (filterWidget) => filterWidget.id !== findWidget.id
                    ),
                    {
                        ...findWidget,
                        inputs: [
                            ...findWidget.inputs.filter(
                                (filterInput) => filterInput.id !== input.id
                            ),
                            {
                                ...input,
                                items: [
                                    ...(input.items
                                        ? input.items.filter(
                                              (filterItem) =>
                                                  filterItem.id !== item.id
                                          )
                                        : []),
                                    {
                                        ...item,
                                        value: value,
                                    },
                                ],
                            },
                        ],
                    },
                ])
            );
        }
    };

    const onWidgetReset = () => {
        reFetchWidget({ pageId: page?.id ?? 0 }).then((response) =>
            setWidget(response.data?.data.widgets)
        );
    };

    const onSaveWidgets = () => {};

    return {
        updatePage: {
            update: updatePage,
            isLoading: isUpdateLoading,
            error: updateError,
        },
        setWidget,
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
        saveWidgets: {
            save: onSaveWidgets,
            isLoading: false,
            error: null,
        },
        onWidgetReset,
        page,
        widgets,
        widget,
        pageId: pageId,
        store,
        setSelected,
        selected,
        onChangeWidgetInput,
        onChangeWidgetInputItem,
        pageTypes,
    };
};

export default usePage;
