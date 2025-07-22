/* eslint-disable react-hooks/exhaustive-deps */
import { ErrorMessage, Select, Textarea, TextInput } from '@seller/components';
import useForm from '@seller/hooks/useForm';
import useProductStock from '@seller/hooks/useProductStock';
import { useAppSelector } from '@seller/store/store';
import { ProductStockType } from '@type/productType';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useParams } from 'react-router-dom';

const EditStockModal = ({ stock }: { stock: ProductStockType }) => {
	const { id } = useParams();
	const productId = Number(id);
	const { update } = useProductStock(productId);
	const { product } = useAppSelector((state) => state.product);

	const variants = product?.variants ?? [];

	const { formState, formErrors, handleChange, setFormState } = useForm({
		formValidationError: update.error,
	});

	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		if (stock) {
			// Prepare variant selections by mapping variant.id to option.id
			const variantSelections: Record<number, number> = {};

			stock.stock_items.forEach((item: any) => {
				const optionId =
					// Safely handle both correct and incorrect backend keys
					item.variant_option_id ?? item.variant_opton_id;

				if (item.variant && optionId) {
					variantSelections[item.variant.id] = optionId;
				}
			});

			setFormState({
				qty: stock.qty,
				price: stock.price,
				buying_price: stock.buying_price,
				discount_amount: stock.discount_amount,
				tax: stock.tax,
				sku: stock.sku,
				note: stock?.note ?? '',
				variant_option_ids: Object.values(variantSelections),
			});
		}
	}, [showModal, stock]);

	const handleVariantChange = (variantId: number, optionId: number) => {
		setFormState((prev: any) => {
			const updatedOptions = [...(prev.variant_option_ids ?? [])];

			const newOptions = updatedOptions.filter((id: number) => {
				return !variants.some(
					(v) => v.id === variantId && v.options.some((opt) => opt.id === id)
				);
			});

			newOptions.push(optionId);

			return {
				...prev,
				variant_option_ids: newOptions,
			};
		});
	};

	const isDuplicateOption = (optionId: number) => {
		return formState.variant_option_ids?.includes(optionId);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setFormState({});
	};

	const handleSubmit = () => {
		if (
			formState.qty &&
			!isNaN(Number(formState.qty)) &&
			formState.price &&
			!isNaN(Number(formState.price))
		) {
			update.submit({
				formData: {
					productId,
					stock: {
						id: stock.id,
						qty: Number(formState.qty),
						price: Number(formState.price),
						buying_price: formState.buying_price
							? Number(formState.buying_price)
							: 0,
						discount_amount: formState.discount_amount
							? Number(formState.discount_amount)
							: 0,
						tax: formState.tax
							? Number(formState.tax)
							: 0,
						sku: formState.sku ?? '',
						note: formState.note ?? '',
						items: formState.variant_option_ids?.map((id: number) => ({
							variant_option_id: id,
						})),
					},
				},
				onSuccess: handleCloseModal,
			});
		}
	};

	const isSubmitDisabled =
		!formState.qty ||
		!formState.price ||
		isNaN(Number(formState.qty)) ||
		isNaN(Number(formState.price));

	return (
		<>
			<button
				className="text-primary underline font-medium"
				onClick={() => setShowModal(true)}
			>
				Edit
			</button>

			<Modal show={showModal} onClose={handleCloseModal} size={'7xl'}>
				<div className="p-4">
					<div className="flex justify-between items-center">
						<h1 className="text-xl font-medium">Update Stock</h1>
						<button onClick={handleCloseModal}>
							<MdClose size={22} />
						</button>
					</div>

					<div className="grid md:grid-cols-2 gap-x-2.5 gap-y-5  py-5">
						{variants.map((variant) => (
							<div key={variant.id} className="flex flex-col gap-1">
								<label className="text-sm font-medium text-gray-700">
									{variant.label}
								</label>
								<Select
									name="variant_options"
									formState={formState}
									formErrors={formErrors}
									value={
										formState.variant_option_ids?.find((optId: any) =>
											variant.options.some((opt) => opt.id === optId)
										) ?? ''
									}
									onChange={(e) =>
										handleVariantChange(variant.id, Number(e.target.value))
									}
								>
									<option value="">Select {variant.label}</option>
									{variant.options.map((opt) => (
										<option
											key={opt.id}
											value={opt.id}
											disabled={
												isDuplicateOption(opt.id) &&
												!formState.variant_option_ids?.includes(opt.id)
											}
										>
											{opt.label}
										</option>
									))}
								</Select>
							</div>
						))}

						<TextInput
							id="qty"
							name="qty"
							type="number"
							label="Quantity"
							formState={formState}
							onChange={handleChange}
							formErrors={formErrors}
							placeholder="Enter quantity"
							required
						/>

						<TextInput
							id="price"
							name="price"
							type="number"
							label="Price"
							formState={formState}
							onChange={handleChange}
							formErrors={formErrors}
							placeholder="Enter price"
							required
						/>

						<TextInput
							id="buying_price"
							name="buying_price"
							type="number"
							label="Buying Price"
							formState={formState}
							onChange={handleChange}
							formErrors={formErrors}
							placeholder="(optional)"
						/>

						<TextInput
							id="discount_amount"
							name="discount_amount"
							label={`Discount amount (${
								product && product?.discount_type === 'flat' ? 'tk' : '%'
							})`}
							type="number"
							formState={formState}
							onChange={handleChange}
							formErrors={formErrors}
							placeholder="(optional)"
						/>

						<TextInput
							id="tax"
							name="tax"
							label={`Tax (TK)`}
							type="number"
							formState={formState}
							onChange={handleChange}
							formErrors={formErrors}
							placeholder="tax amount optional"
						/>

						<TextInput
							id="sku"
							name="sku"
							type="text"
							label="SKU"
							formState={formState}
							onChange={handleChange}
							formErrors={formErrors}
							placeholder="(optional)"
						/>

						<Textarea
							id="note"
							name="note"
							label="Note"
							formState={formState}
							onChange={handleChange}
							formErrors={formErrors}
							placeholder="write a note (optional)"
						/>
					</div>

					<div className="pt-4 border-t">
						{formErrors['message'] && (
							<ErrorMessage className="mb-2.5 !mt-0">
								{formErrors['message']}
							</ErrorMessage>
						)}
						<Button
							onClick={handleSubmit}
							disabled={isSubmitDisabled || update.isLoading}
							isProcessing={update.isLoading}
						>
							Update
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default EditStockModal;
