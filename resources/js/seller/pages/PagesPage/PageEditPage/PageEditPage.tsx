/* eslint-disable react-hooks/exhaustive-deps */
import usePage from '@seller/hooks/usePage';
import useStore from '@seller/hooks/useStore';
import useTheme from '@seller/hooks/useTheme';
import useWidget from '@seller/hooks/useWidget';
import GetComponent from '@themes/getComponent';
import { Button } from 'flowbite-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import AddWidgetModal from './AddWidgetModal';

const PageEditPage = () => {
	const { fetchPage } = usePage();
	const { widgets, onSortWidget, onEditWidget, onDeleteWidget } = useWidget();
	const { theme } = useTheme();
	const { store } = useStore();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			fetchPage.submit({
				formData: {
					id: id,
				},
			});
		}
	}, [id]);

	return (
		<div className="space-y-4">
			<div className="bg-white">
				<ReactSortable
					list={widgets.map((x) => ({ ...x, chosen: true }))}
					setList={(newState) => onSortWidget(newState)}
				>
					{widgets
						.slice()
						.sort(function (widgetA, widgetB) {
							return widgetA.serial - widgetB.serial;
						})
						.map((widget) => (
							<div className="w-full h-max relative" key={widget.id}>
								{store && theme && (
									<GetComponent store={store} widget={widget} theme={theme} />
								)}

								<div className="absolute top-0 left-0 right-0 w-full h-full bg-gray-900/75 z-30 opacity-0 hover:opacity-100 transition-all duration-300 flex justify-center items-center gap-2.5 cursor-grab">
									<Button color="red" onClick={() => onDeleteWidget(widget)}>
										Delete
									</Button>
									<Button color="primary" onClick={() => onEditWidget(widget)}>
										Edit {widget.label}
									</Button>
								</div>
							</div>
						))}
				</ReactSortable>
			</div>

			<AddWidgetModal />
		</div>
	);
};
export default PageEditPage;
