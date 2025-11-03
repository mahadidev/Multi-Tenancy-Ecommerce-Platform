import { GLOBAL_APP_URL } from '@helper/global_env';
import useWidget from '@seller/_hooks/useWidget';
import { Button, Modal, Select } from 'flowbite-react';
import { FC, useState } from 'react';

const AddWidgetModal: FC = function () {
	const [openModal, setOpenModal] = useState(false);
	const { onAddWidget } = useWidget();
	const [selectedPageId, setSelectedPageId] = useState<number>(1);

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
					<div className="flex items-center justify-center py-12">
						<p className="text-gray-500 dark:text-gray-400">
							Theme system has been removed. Widget functionality is no longer available.
						</p>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default AddWidgetModal;
