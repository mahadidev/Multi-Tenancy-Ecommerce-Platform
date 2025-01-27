import { GLOBAL_APP_URL } from '@helper/global_env';
import useTheme from '@seller/hooks/useTheme';
import useWidget from '@seller/hooks/useWidget';
import { Button, Modal } from 'flowbite-react';
import { FC, useState } from 'react';

const AddWidgetModal: FC = function () {
	const [openModal, setOpenModal] = useState(false);
	const { theme } = useTheme();
	const { onAddWidget } = useWidget();

	return (
		<div className="p-4">
			<button
				onClick={() => setOpenModal(true)}
				className="flex w-full items-center justify-center whitespace-nowrap rounded-lg border-2 border-dashed border-gray-200 px-5 py-2 font-semibold text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
			>
				<svg
					className="h-6 w-6"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
						clipRule="evenodd"
					/>
				</svg>
				Add new widget
			</button>
			<Modal show={openModal} onClose={() => setOpenModal(false)} size="6xl">
				<Modal.Header>Select a widget</Modal.Header>
				<Modal.Body>
					<div className="grid grid-cols-3 gap-6">
						{theme?.widgets.map((widget) => (
							<div className="space-y-4" key={widget.id}>
								<img
									src={`${GLOBAL_APP_URL}/images/placeholder/theme-thumbnail.png`}
									className="rounded-t-md"
								/>

								<div className="flex flex-wrap justify-between gap-4">
									<h2 className="text-xl font-medium text-gray-800 dark:text-white">
										{widget.name}
									</h2>
									<Button
										onClick={() =>
											onAddWidget({
												widget: widget,
                                                onSuccess: () => {
                                                    setOpenModal(false)
                                                }
											})
										}
										color="primary"
										size="sm"
									>
										Insert
									</Button>
								</div>
							</div>
						))}
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default AddWidgetModal;
