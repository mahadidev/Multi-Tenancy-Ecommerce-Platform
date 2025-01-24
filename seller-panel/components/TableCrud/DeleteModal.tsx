import { Button, Modal } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiOutlineExclamationCircle, HiTrash } from 'react-icons/hi';
import { TableCrudPropsType } from './TableCrud';

const DeleteModal: FC<
	TableCrudPropsType & { cell: { [Key: string]: string } }
> = function (props) {
	const [isOpen, setOpen] = useState(false);
	return (
		<>
			{props.deleteModal && (
				<>
					<Button
						size="sm"
						color="failure"
						className="p-0"
						onClick={() => setOpen(true)}
					>
						<div className="flex items-center gap-x-2">
							<HiTrash className="h-5 w-5" />
							Delete {props.item?.title}
						</div>
					</Button>
					<Modal onClose={() => setOpen(false)} show={isOpen} size="md">
						<Modal.Header className="border-none p-2">
							<span className="sr-only">Confirmation</span>
						</Modal.Header>
						<Modal.Body className="px-6 pb-6 pt-0">
							<div className="flex flex-col items-center gap-y-6 text-center">
								<HiOutlineExclamationCircle className="mx-auto h-20 w-20 text-red-600" />
								<p className="text-xl font-normal text-gray-500 dark:text-gray-400">
									Are you sure you want to delete this{' '}
									{props.item && props.cell[props.item.key]
										? props.cell[props.item.key]
										: props.item?.title}
									?
								</p>
								<div className="flex items-center gap-x-3">
									<Button
										color="failure"
										theme={{ base: 'px-0' }}
										onClick={() => {
											props.deleteModal?.delete.submit({
												formData: props.cell,
												onSuccess: () => {
													setOpen(false);
												},
											});
										}}
										isProcessing={props.deleteModal?.delete.isLoading}
										processingLabel="Deleting"
										processingSpinner={<AiOutlineLoading />}
										disabled={props.deleteModal?.delete.isLoading}
									>
										<span className="text-base font-medium">Yes, I'm sure</span>
									</Button>
									<Button
										color="gray"
										theme={{ base: 'px-0' }}
										onClick={() => setOpen(false)}
									>
										<span className="text-base font-medium">No, cancel</span>
									</Button>
								</div>
							</div>
						</Modal.Body>
					</Modal>
				</>
			)}
		</>
	);
};
export default DeleteModal;
