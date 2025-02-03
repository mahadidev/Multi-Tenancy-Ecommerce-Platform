import useForm from '@seller/hooks/useForm';
import useProduct from '@seller/hooks/useProduct';
import useString from '@seller/hooks/useString';
import { ProductVariantOptionType } from '@type/productType';
import { Button, Label, Modal, Table, TextInput } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';

const CreateVariantModal: FC = function () {
	const [isOpen, setOpen] = useState(false);
	const { create, addVariant, product } = useProduct();
	const { handleChange, formState, formErrors, setFormState } = useForm({
		formValidationError: create.error,
	});
	const { getSlug } = useString();
	const [options, setOptions] = useState<ProductVariantOptionType[]>([]);

	return (
		<>
			<Button
				color="gray"
				size="xs"
				className="p-0"
				onClick={() => setOpen(true)}
			>
				<div className="flex items-center gap-x-3">
					<HiPlus className="text-xl" />
					Create Product variant
				</div>
			</Button>
			<Modal onClose={() => setOpen(false)} show={isOpen}>
				<Modal.Header>Create a new variant</Modal.Header>
				<Modal.Body>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div className="flex flex-col gap-2 col-span-full">
							<Label htmlFor="label">Label</Label>
							<div>
								<TextInput
									id="label"
									name="label"
									placeholder="ex. Color"
									value={formState['label']}
									color={formErrors['label'] ? 'failure' : 'gray'}
									helperText={
										formErrors['label'] ? formErrors['label'][0] : false
									}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										handleChange(event);

										setFormState((prev: any) => ({
											...prev,
											slug: getSlug(event.target.value),
										}));
									}}
									required
								/>
							</div>
						</div>
						<div className="col-span-full">
							<Table>
								<Table.Head>
									<Table.HeadCell>Option</Table.HeadCell>
									<Table.HeadCell>Price</Table.HeadCell>
									<Table.HeadCell>Stock</Table.HeadCell>
									<Table.HeadCell></Table.HeadCell>
								</Table.Head>
								<Table.Body>
									{options.map((option) => (
										<Table.Row className="bg-gray-100" key={option.id}>
											<Table.Cell>{option.label}</Table.Cell>
											<Table.Cell>{option.price}</Table.Cell>
											<Table.Cell>{option.qty_stock}</Table.Cell>
											<Table.Cell>
												<Button
													color="red"
													size="xs"
													onClick={() =>
														setOptions((prev) =>
															prev.filter(
																(filterOption) =>
																	filterOption.label !== option.label
															)
														)
													}
												>
													Delete
												</Button>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table>
						</div>
						<div className="col-span-full flex flex-col gap-2.5">
							<Label>Add new option</Label>
							<div className="p-2.5 bg-gray-100 rounded-md grid grid-cols-2 gap-2.5">
								<div className="flex flex-col gap-2.5">
									<Label htmlFor="option_label">Label</Label>
									<div>
										<TextInput
											id="option_label"
											name="option_label"
											placeholder="Option label"
											value={formState['option_label']}
											color={formErrors['option_label'] ? 'failure' : 'gray'}
											helperText={
												formErrors['option_label']
													? formErrors['option_label'][0]
													: false
											}
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) => {
												handleChange(event);
											}}
											required
										/>
									</div>
								</div>
								<div className="flex flex-col gap-2.5">
									<Label htmlFor="option_price">Price</Label>
									<div>
										<TextInput
											id="option_price"
											name="option_price"
											placeholder="Option price"
											value={formState['option_price'] ?? product?.price}
											color={formErrors['option_price'] ? 'failure' : 'gray'}
											helperText={
												formErrors['option_price']
													? formErrors['option_price'][0]
													: false
											}
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) => {
												handleChange(event);
											}}
											required
										/>
									</div>
								</div>
								<div className="flex flex-col gap-2.5">
									<Label htmlFor="option_qty_stock">Stock QTY</Label>
									<div>
										<TextInput
											id="option_qty_stock"
											name="option_qty_stock"
											placeholder="ex. 25"
											value={formState['option_qty_stock']}
											color={
												formErrors['option_qty_stock'] ? 'failure' : 'gray'
											}
											type="number"
											helperText={
												formErrors['option_qty_stock']
													? formErrors['option_qty_stock'][0]
													: false
											}
											onChange={(
												event: React.ChangeEvent<HTMLInputElement>
											) => {
												handleChange(event);
											}}
											required
										/>
									</div>
								</div>
								<div className="flex gap-2.5 items-end">
									<Button
										className="w-full"
										color="gray"
										onClick={() => {
											setOptions((prev) => [
												...prev,
												{
													id: 1,
													label: formState['option_label'],
													qty_stock: formState['option_qty_stock'],
													price: formState['option_price'] ?? product?.price,
													code: null,
													created_at: '',
													updated_at: '',
												},
											]);
											setFormState({
                                                ...formState,
												option_label: '',
												option_qty_stock: '',
												option_price: product?.price,
											});
										}}
									>
										Add Option
									</Button>
								</div>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						color="primary"
						onClick={() => {
							addVariant.submit({
								formData: {
									id: 1,
									label: formState['label'],
									slug: getSlug(formState['label']),
									options: [...options],
									updated_at: '',
									created_at: '',
								},
								onSuccess: () => {
									setOpen(false);

									setFormState({
										label: '',
										option_label: '',
										option_qty_stock: '',
										option_price: product?.price,
									});
									setOptions([]);
								},
							});
						}}
						isProcessing={create.isLoading}
						disabled={!formState['label']}
						processingLabel="Creating"
						processingSpinner={<AiOutlineLoading className="animate-spin" />}
					>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default CreateVariantModal;
