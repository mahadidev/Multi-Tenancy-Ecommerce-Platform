import { FileInput } from "@seller-panel/components";
import { useForm } from '@seller-panel/hooks';
import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';
import { TableCrudPropsType } from './TableCrud';

const CreateModal: FC<TableCrudPropsType> = function (props) {
	const [isOpen, setOpen] = useState(false);
	const { handleChange, formState, formErrors } = useForm({
		errors: props.createModal?.create.error,
		default: props.createModal?.defaultState ?? {},
	});

	return (
		<>
			{props.createModal && (
				<>
					<Button color="primary" className="p-0" onClick={() => setOpen(true)}>
						<div className="flex items-center gap-x-3">
							<HiPlus className="text-xl" />
							Create {props.item?.title}
						</div>
					</Button>
					<Modal onClose={() => setOpen(false)} show={isOpen}>
						<Modal.Header>{props.createModal.title}</Modal.Header>
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
													{field.options?.map((option, optionIndex: number) => (
														<option value={option.value} key={optionIndex}>
															{option.label}
														</option>
													))}
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
									props.createModal?.create?.submit({
										formData: formState,
										onSuccess: () => {
											setOpen(false);
										},
									});
								}}
								isProcessing={props.createModal.create.isLoading}
								processingLabel="Creating"
								processingSpinner={<AiOutlineLoading />}
								disabled={props.createModal.create.isLoading}
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
export default CreateModal;
