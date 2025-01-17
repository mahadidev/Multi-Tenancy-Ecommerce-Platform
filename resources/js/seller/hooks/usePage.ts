import { useAppDispatch, useAppSelector } from "@/seller/store";
import {
    CreatePagePayloadType,
    UpdatePagePayloadType,
    useCreatePageMutation,
    useUpdatePageMutation,
} from "@/seller/store/reducers/pageApi";
import {
    StorePageType,
    StoreType,
    WidgetInputType,
    WidgetType,
} from "@/seller/types";
import { useParams } from "react-router-dom";
import {
    setSelected as setPageSelected,
    setPage as setPageState,
    SetSelectedPayloadType,
    setWidget as setSelectedWidget,
} from "../store/slices/pageSlice";

const usePage = () => {
    const { currentStore } = useAppSelector((state) => state.store);
    const { page, selected, widget } = useAppSelector((state) => state.page);
    const store: StoreType = currentStore;
    const dispatch = useAppDispatch();

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

    const setPage = (pageData: StorePageType) => {
        dispatch(setPageState(pageData));
    };

    const setWidget = (widgetData: WidgetType) => {
        dispatch(setSelectedWidget(widgetData));
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

    const setSelected = (payload: SetSelectedPayloadType) => {
        dispatch(setPageSelected(payload));
    };

    const onChangePageInput = ({
        type,
        target,
        selected,
    }: {
        type: "item" | "input";
        target: {
            name: string;
            value: string;
        };
        selected: SetSelectedPayloadType;
    }) => {
        if (page && widget && selected) {
            const updatedPage: StorePageType = {
                ...page,
                widgets: [
                    ...page.widgets.filter(
                        (widgetItem) => widgetItem.id !== widget.id
                    ),
                    {
                        ...widget,
                        inputs: [
                            ...widget.inputs.filter(
                                (inputItem) =>
                                    inputItem.name !== selected.input.name
                            ),
                            {
                                ...(type === "input"
                                    ? {
                                          ...selected.input,
                                          value: target.value,
                                      }
                                    : selected.input),
                                items: [
                                    ...(selected.items
                                        ? selected.items.filter(
                                              (itemsItem) =>
                                                  itemsItem.id !==
                                                  selected.item?.id
                                          )
                                        : []),
                                    ...(selected.item
                                        ? [
                                              {
                                                  ...selected.item,
                                                  value: target.value,
                                              },
                                          ]
                                        : []),
                                ],
                            },
                        ],
                    },
                ],
            };

            setPage(updatedPage);
        }
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
        setPage,
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
        page,
        widget,
        pageId: pageId,
        store,
        setSelected,
        selected,
        onChangePageInput,
    };
};

export default usePage;
