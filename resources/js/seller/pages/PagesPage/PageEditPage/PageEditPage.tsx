/* eslint-disable react-hooks/exhaustive-deps */
import usePage from '@seller/hooks/usePage';
import useStore from '@seller/hooks/useStore';
import useTheme from '@seller/hooks/useTheme';
import useWidget from '@seller/hooks/useWidget';
import { registeredTheme } from '@themes/registeredTheme';
import { PageType } from '@type/pageType';
import { Button } from 'flowbite-react';
import { useEffect } from 'react';
import { IoMdMove } from 'react-icons/io';
import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import AddWidgetModal from './AddWidgetModal';

const PageEditPage = () => {
	const { fetchPage, page } = usePage();
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
                onSuccess: (data: {
                    page: PageType
                }) => {
                    console.log("page", data)
                }
			});
		}
	}, [id]);

	return (
		<div className="space-y-4">
			<div className="bg-white">
				{page &&
					page.layout &&
					store &&
					store.theme &&
					(registeredTheme[store.theme.name] ? (
						registeredTheme[store.theme.name]?.layout({
							store: store,
							layout: page.layout,
							children: (
								<>
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
													{store &&
														theme &&
														registeredTheme[theme.name]?.widget({
															widget: widget,
															store: store,
														})}

													<div className="absolute top-0 left-0 right-0 w-full h-full  z-30 opacity-0 hover:opacity-100 transition-all duration-300 cursor-grab flex justify-end">
														<div className="w-max h-max flex gap-2.5 items-center p-2.5">
															<Button.Group>
																<Button color="dark">
																	<IoMdMove className="text-2xl" />
																</Button>
																<Button
																	color="dark"
																	onClick={() => onDeleteWidget(widget)}
																>
																	<MdDeleteOutline className="text-2xl" />
																</Button>
																<Button
																	color="dark"
																	onClick={() => onEditWidget(widget)}
																>
																	<MdModeEditOutline className="text-2xl" />
																</Button>
															</Button.Group>
														</div>
													</div>
												</div>
											))}
									</ReactSortable>
								</>
							),
						})
					) : (
						<h1>Layout not found.</h1>
					))}
			</div>

			<AddWidgetModal />
		</div>
	);
};
export default PageEditPage;
