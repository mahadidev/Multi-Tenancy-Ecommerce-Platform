/* eslint-disable react-hooks/exhaustive-deps */
import { ErrorMessage, TextInput } from '@seller/components';
import useForm from '@seller/hooks/useForm';
import useProductVariant from '@seller/hooks/useProductVariant';
import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';

interface VariantOptionType {
	label: string;
}

const CreateAttributeModal = () => {
	const { id } = useParams();
	const { create } = useProductVariant(id ?? 0);
	const { formState, formErrors, handleChange, setFormState } = useForm({
		formValidationError: create.error,
	});
	const [showModal, setShowModal] = useState(false);
	const optionInputRef = useRef<HTMLInputElement>(null); // ⬅️ ref for option input

	const handleAddOption = () => {
		const newOption = {
			label: formState.option?.trim(),
		};
		if (!newOption) return;

		setFormState((prev: any) => ({
			...prev,
			options: [...(prev.options ?? []), newOption],
			option: '',
		}));

		optionInputRef.current?.focus(); // focus again after adding
	};

	const handleDeleteOption = (optionToRemove: string) => {
		setFormState((prev: any) => ({
			...prev,
			options: (prev.options ?? []).filter(
				(opt: VariantOptionType) => opt.label !== optionToRemove
			),
		}));
	};

	const handleCloseModal = () => {
		setShowModal(false);

		setFormState((prev: any) => ({
			...prev,
			label: '',
			options: [],
			option: '',
		}));
	};

	const handleSubmit = () => {
		if (formState["label"] && formState.options?.length) {
			// Handle valid submission
			create.submit({
				formData: {
					productId: id ?? 1,
					variant: {
						label: formState['label'],
						options: formState['options'],
					},
				},
			});
		}
	};
	const isSubmitDisabled = !formState['label'] || !formState.options?.length;

	// handle success
	useEffect(() => {
		if (create.data?.status === 200) {
			handleCloseModal();
		}
	}, [create.isSuccess]);

	// handle error
	useEffect(() => {
		console.log('Error', create.error);
	}, [create.error]);

	return (
		<>
			<button className="underline" onClick={() => setShowModal(true)}>
				Create Attribute
			</button>

			<Modal show={showModal} onClose={handleCloseModal}>
				<div className="p-4">
					<div className="flex justify-between items-center">
						<h1 className="text-xl font-medium">Create attribute</h1>
						<button onClick={handleCloseModal}>
							<MdClose size={22} />
						</button>
					</div>

					<div className="flex flex-col gap-2.5 py-5">
						<TextInput
							id="label"
							name="label"
							label="Label"
							formState={formState}
							onChange={handleChange}
							formErrors={formErrors}
							placeholder="ex. Color"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									optionInputRef.current?.focus(); // ⬅️ focus option input
								}
							}}
						/>

						<Table className="mt-2.5">
							<Table.Head className="bg-gray-100">
								<Table.HeadCell>Option</Table.HeadCell>
								<Table.HeadCell />
							</Table.Head>
							<Table.Body className="bg-gray-50">
								{formState.options?.length > 0 ? (
									formState.options.map((option: VariantOptionType) => (
										<Table.Row key={option.label}>
											<Table.Cell className="py-2 text-xs text-gray-800">
												{option.label}
											</Table.Cell>
											<Table.Cell className="flex justify-end py-2">
												<button
													className="text-xs font-medium underline text-black"
													onClick={() => handleDeleteOption(option.label)}
												>
													Delete
												</button>
											</Table.Cell>
										</Table.Row>
									))
								) : (
									<Table.Row>
										<Table.Cell
											colSpan={2}
											className="text-center text-sm text-gray-500 py-4"
										>
											No options found
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table>

						<div className="w-full flex justify-between items-center gap-4 pt-2">
							<TextInput
								ref={optionInputRef} // ⬅️ assign the ref here
								className="w-full"
								id="option"
								name="option"
								formState={formState}
								onChange={handleChange}
								formErrors={formErrors}
								placeholder="ex. Red"
								sizing="sm"
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleAddOption();
									}
								}}
							/>
							<Button
								className="w-max text-nowrap"
								size="xs"
								color="dark"
								onClick={handleAddOption}
							>
								add option
							</Button>
						</div>
					</div>

					<div className="pt-4 border-t">
						{formErrors['message'] ? (
							<>
								<ErrorMessage className="mb-2.5 !mt-0">
									{formErrors['message']}
								</ErrorMessage>
							</>
						) : (
							<></>
						)}
						<Button
							onClick={handleSubmit}
							disabled={isSubmitDisabled || create.isLoading}
							isProcessing={create.isLoading}
						>
							Create
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default CreateAttributeModal;
