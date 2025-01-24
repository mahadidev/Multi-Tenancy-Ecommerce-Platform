import { FileInput } from '@seller-panel/components';
import { useForm } from '@seller-panel/hooks';
import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPencilAlt } from 'react-icons/hi';
import { TableCrudPropsType } from './TableCrud';

const EditModal: FC<TableCrudPropsType & { cell: { [Key: string]: string } | any }> =
	function (props) {
		const [isOpen, setOpen] = useState(false);
		const { handleChange, formState, formErrors } = useForm({
			errors: props.createModal?.create.error,
			default: {
				...props.cell,
				...props.editModal?.defaultState,
			},
		});

		return (
			<>
				{props.editModal && (
					<>
						<Button
							size="sm"
							color="primary"
							className="p-0"
							onClick={() => setOpen(true)}
						>
							<div className="flex items-center gap-x-2">
								<HiPencilAlt className="h-5 w-5" />
								Edit {props.item?.title}
							</div>
						</Button>
						<Modal onClose={() => setOpen(false)} show={isOpen}>
							<Modal.Header>{props.editModal.title}</Modal.Header>
							<Modal.Body>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									{props.form?.map((field, index: number) => (
										<div className="flex flex-col gap-2" key={index}>
											<Label htmlFor={field.name}>{field.label}</Label>
											<div>
												{field.type !== 'image' && field.type !== 'select' && (
													<TextInput
														id={field.name}
														name={field.name}
														placeholder={field.placeholder}
														value={formState[field.name]}
														color={formErrors[field.name] ? 'failure' : 'gray'}
														helperText={
															formErrors[field.name]
																? formErrors[field.name][0]
																: false
														}
														onChange={(
															event: React.ChangeEvent<HTMLInputElement>
														) => {
															handleChange(event);
														}}
														required={field.required ?? false}
													/>
												)}

												{field.type === 'image' && (
													<FileInput
														id={field.name}
														name={field.name}
														placeholder={field.placeholder}
														value={formState[field.name]}
														color={formErrors[field.name] ? 'failure' : 'gray'}
														helperText={
															formErrors[field.name]
																? formErrors[field.name][0]
																: false
														}
														onChange={(
															event: React.ChangeEvent<HTMLInputElement>
														) => {
															handleChange(event);
														}}
														required={field.required ?? false}
													/>
												)}

												{field.type === 'select' && (
													<Select
														id={field.name}
														name={field.name}
														value={formState[field.name]}
														color={formErrors[field.name] ? 'failure' : 'gray'}
														helperText={
															formErrors[field.name]
																? formErrors[field.name][0]
																: false
														}
														onChange={(
															event: React.ChangeEvent<HTMLSelectElement | any>
														) => {
															handleChange(event);
														}}
														required={field.required ?? false}
													>
														{field.options?.map(
															(option, optionIndex: number) => (
																<option
																	value={option.value ?? 0}
																	key={optionIndex}
																	selected={props.cell[option.selectKey] &&
																		option.value ===
																		(option.subSelectKey in props.cell[option.selectKey]
																			? props.cell[option.selectKey][
																					option.subSelectKey
																			  ]
																			: props.cell[option.selectKey])
																	}
																>
																	{option.label}
																</option>
															)
														)}
													</Select>
												)}
											</div>
										</div>
									))}
								</div>
							</Modal.Body>
							<Modal.Footer>
								<Button
									color="blue"
									onClick={() => {
										props.editModal?.update?.submit({
											formData: formState,
											onSuccess: () => {
												setOpen(false);
											},
										});
									}}
									isProcessing={props.editModal?.update.isLoading}
									processingLabel="Creating"
									processingSpinner={<AiOutlineLoading />}
									disabled={props.editModal?.update.isLoading}
								>
									Create {props.item?.title}
								</Button>
							</Modal.Footer>
						</Modal>
					</>
				)}
			</>
		);
	};
export default EditModal;
