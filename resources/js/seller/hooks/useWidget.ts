import { setWidget, setWidgets } from '@seller/store/slices/widgetSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import {
    WidgetInputItemType,
    WidgetInputType,
    WidgetType,
} from '@type/widgetType';

const useWidget = () => {
	const { widgets, widget, input, item } = useAppSelector(
		(state) => state.widget
	);
	const dispatch = useAppDispatch();

	// on add widget
	const onAddWidget = ({widget, onSuccess}:{
        widget: WidgetType,
        onSuccess: CallableFunction
    }) => {
		dispatch(
			setWidgets(
				[
                    ...widgets,
                    widget
                ]
			)
		);
        dispatch(setWidget(widget));
        if(onSuccess){
            onSuccess()
        }
	};

	// on delete widget
	const onDeleteWidget = (deleteWidget: WidgetType) => {
        if(deleteWidget.id === widget?.id){
            dispatch(setWidget(null));
        }
		dispatch(
			setWidgets(
				widgets.filter((filterWidget) => filterWidget.id !== deleteWidget.id)
			)
		);
	};

	// on sort widget
	const onSortWidget = (widgets: any) => {
		const sortedWidgets = widgets.map((widget: WidgetType, index: number) => {
			if ('chosen' in widget) {
				delete widget.chosen;
			}

			return {
				...widget,
				serial: index,
			};
		});

		dispatch(setWidgets(sortedWidgets));
	};

	// on edit widget
	const onEditWidget = (widget: WidgetType) => {
		dispatch(setWidget(widget));
	};

	// on change item item
	const onChangeInputItem = ({
		item,
		event,
	}: {
		item: WidgetInputItemType;
		event: React.ChangeEvent<HTMLInputElement | any>;
	}) => {
		const findWidget = widgets.find(
			(findWidget) => findWidget.id === widget?.id
		);

		if (findWidget) {
			const filteredInputs: WidgetInputType[] = findWidget.inputs.filter(
				(filterInputs) => filterInputs.id !== item.widget_input_id
			);
			const input: WidgetInputType | undefined = findWidget.inputs.find(
				(findInput) => findInput.id === item.widget_input_id
			);
			const filteredItems: WidgetInputItemType[] | undefined =
				input && input.items?.filter((filterItem) => filterItem.id !== item.id);

			if (input && filteredItems) {
				dispatch(
					setWidgets([
						...widgets.filter(
							(filterWidget) => filterWidget.id !== findWidget.id
						),
						{
							...findWidget,
							inputs: [
								...filteredInputs,
								{
									...input,
									items: [
										...filteredItems,
										{ ...item, value: event.target.value },
									],
								},
							],
						},
					])
				);
			}
		}
	};

	// on change input
	const onChangeInput = ({
		input,
		event,
	}: {
		input: WidgetInputType;
		event: React.ChangeEvent<HTMLInputElement | any>;
	}) => {
		const findWidget = widgets.find(
			(findWidget) => findWidget.id === widget?.id
		);

		if (findWidget) {
			dispatch(
				setWidgets([
					...widgets.filter(
						(filterWidgets) => filterWidgets.id !== findWidget.id
					),
					{
						...findWidget,
						inputs: [
							...findWidget.inputs.filter(
								(filterInputs) => filterInputs.id !== input.id
							),
							{
								...input,
								value: event.target.value,
							},
						],
					},
				])
			);
		}
	};

	// on change input or item
	const onChangeInputOrItem = (props: {
		inputOrItem: WidgetInputType | WidgetInputItemType;
		event: React.ChangeEvent<HTMLInputElement | any>;
	}) => {
		// check if input  is input or items
		if ('widget_input_id' in props.inputOrItem) {
			onChangeInputItem({
				event: props.event,
				item: props.inputOrItem,
			});
		} else {
			onChangeInput({
				event: props.event,
				input: props.inputOrItem,
			});
		}
	};

	return {
		widgets,
		widget:
			widgets.find((findWidget: WidgetType) => findWidget.id === widget?.id) ??
			null,
		input,
		item,
        onAddWidget,
		onSortWidget,
		onEditWidget,
		onDeleteWidget,
		onChangeInputOrItem,
	};
};

export default useWidget;
