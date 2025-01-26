import { GLOBAL_APP_URL } from '@/global_env';
import usePage from '@seller/hooks/usePage';
import useTheme from '@seller/hooks/useTheme';
import { Button, Modal } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

const AddWidgetModal: FC = function () {
	const [openModal, setOpenModal] = useState(false);
	const { theme } = useTheme();
	const { addWidget } = usePage();

	return (
		<div className="p-4">
			<Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
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
											addWidget.submit({
												formData: {
													widget: widget,
												},
                                                onSuccess: () => {
                                                    setOpenModal(false);
                                                }
											})
										}
                                        processingLabel='Adding'
                                        processingSpinner={<AiOutlineLoading />}
                                        isProcessing={addWidget.isLoading}
                                        disabled={addWidget.isLoading}
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
