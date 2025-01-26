import { setWidget, setWidgets } from '@seller/store/slices/widgetSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { WidgetType } from '@type/widgetType';

const useWidget = () => {
	const { widgets, widget, input, item } = useAppSelector(
		(state) => state.widget
	);
	const dispatch = useAppDispatch();


    // on sort widget
	const onSortWidget = (widgets: any) => {
		const sortedWidgets = widgets.map((widget: WidgetType, index: number) => {
			if ('chosen' in widget) {
				delete widget.chosen;
			}

			return {
				...widget,
                serial: index
			};
		});

		dispatch(setWidgets(sortedWidgets));
	};

    // on delete widget
    const onDeleteWidget = (widget: WidgetType) => {
		dispatch(setWidgets(widgets.filter((filterWidget) => filterWidget.id !== widget.id)));
    }

    // on edit widget
    const onEditWidget = (widget: WidgetType) => {
        dispatch(setWidget(widget));
    }

	return { widgets,widget, input, item, onSortWidget, onEditWidget, onDeleteWidget };
};

export default useWidget;
