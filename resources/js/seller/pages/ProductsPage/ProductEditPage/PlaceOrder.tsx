import { ErrorMessage, Radio, Select, TextInput, Textarea } from '@seller/components';
import useCustomer from '@seller/hooks/useCustomer';
import useForm from '@seller/hooks/useForm';
import useOrders from '@seller/hooks/useOrders';
import { CustomerType } from '@type/customersType';
import { OrderProductVariantType } from '@type/orderType';
import { ProductType } from '@type/productType';
import { Button, Label, Modal } from 'flowbite-react';
import { FC, useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';

interface SelectedVariantType extends OrderProductVariantType {
	maxQty: number;
}

const PlaceOrder: FC<{
	product: ProductType | null;
}> = ({ product }) => {
	const [isOpen, setOpen] = useState(false);
	const { create, customers } = useCustomer();
	const { placeOrderNonUser } = useOrders();
	const [selectedVariants, setSelectedVariants] = useState<
		SelectedVariantType[]
	>([]);
	const defaultConfig = {
		qty: 1,
		discount: product?.discount_amount,
		step: 1,
	};
	const { handleChange, formState, formErrors, setFormState } = useForm({
		formValidationError: create.error,
		default: defaultConfig,
	});
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
		null
	);
    const [priceWithVariant, setPriceWithVariant] = useState<number>(product?.price ?? 0);

	const handleSubmit = () => {
		if (formState['step'] === 1) {
			return setFormState((prev: any) => ({ ...prev, step: 2 }));
		}

		placeOrderNonUser.submit({
			formData: {
				name: formState['name'],
				email: formState['email'],
				phone: formState['phone']?.toString(),
				address: formState['address'],
				notes: formState['notes'],
				status: formState['status'],
				payment_method: formState['paymentMethod'],
				items: [
					{
						product_id: product?.id ?? 0,
						qty: formState['qty'],
						discount: formState['discount'],
						variants: selectedVariants,
					},
				],
			},
			onSuccess: () => {
				setOpen(false);
				setFormState(defaultConfig);
			},
		});
	};

	useEffect(() => {
		if (selectedCustomer) {
			setFormState((prev: any) => ({
				...prev,
				name: selectedCustomer.name,
				phone: selectedCustomer.phone,
				email: selectedCustomer.email,
				address: selectedCustomer.address,
			}));
		} else {
			setFormState((prev: any) => ({
				...prev,
				name: '',
				phone: '',
				email: '',
				address: '',
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCustomer]);

    // detect change variant
    useEffect(() => {
        setPriceWithVariant(product?.price ?? 0);
        selectedVariants.map((variant) => {
            setPriceWithVariant((prev) => prev + variant.price)
        })
    }, [product?.price, selectedVariants])

	return (
		<>
			<Button color="blue" className="p-0" onClick={() => setOpen(true)}>
				<div className="flex items-center gap-x-3">
					<HiPlus className="text-xl" />
					Create Order
				</div>
			</Button>

			<Modal show={isOpen} onClose={() => setOpen(false)}>
				<Modal.Header>Place order</Modal.Header>
				<Modal.Body>
					{formState['step'] === 1 && (
						<>
							<div className="w-full flex gap-6 items-start">
								<div className="w-full flex flex-col gap-6">
									{product?.variants?.map((variant, index) => (
										<div className="w-full flex flex-col gap-2" key={index}>
											<h6 className="dark:text-white">{variant.label}</h6>
											<div className="mt-0.5 flex gap-2.5 items-center flex-wrap">
												{variant.options.map((option, optionIndex) => (
													<Radio
														name={variant.label}
														label={option.label}
														formState={formState}
														formErrors={formErrors}
														onChange={() =>
															setSelectedVariants((prev) => [
																...(prev.filter(
																	(prev) => prev.label !== variant.label
																) ?? []),
																{
																	label: variant.label,
																	value: option.label,
																	price: option.price ?? 0,
																	maxQty: option.qty_stock ?? 1,
																},
															])
														}
														value={option.label}
														id={`${variant.label}-${optionIndex}`}
													/>
												))}
											</div>
										</div>
									))}

									<TextInput
										name="qty"
										type="number"
										label="Qty"
										value={formState['qty']}
										formState={formState}
										formErrors={formErrors}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											if (
												parseInt(event.target.value) === 0 ||
												event.target.value === ''
											) {
												return setFormState((prev: any) => ({
													...prev,
													qty: 1,
												}));
											} else {
												return setFormState((prev: any) => ({
													...prev,
													qty: Number(event.target.value),
												}));
											}
										}}
									/>

									<TextInput
										label="Discount"
										formErrors={formErrors}
										formState={formState}
										name="discount"
										className="w-full"
										type="number"
										value={formState['discount']}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											if (event.target.value === '') {
												setFormState((prev: any) => ({
													...prev,
													discount: Number(0),
												}));
											} else {
												setFormState((prev: any) => ({
													...prev,
													discount: parseInt(event.target.value),
												}));
											}
										}}
										placeholder="%"
									/>
								</div>
							</div>
						</>
					)}

					{formState['step'] === 2 && (
						<div className="w-full grid sm:grid-cols-2 gap-4 items-center">
							<div className="w-full sm:col-span-2 flex flex-col gap-2">
								<Label htmlFor="user_id">Customer</Label>
								<Select
									name="customer"
									formState={formState}
									formErrors={formErrors}
									id="user_id"
									required
									onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
										if (customers && customers.length > 0) {
											const findCustomer =
												customers.find(
													(customer: CustomerType) =>
														customer &&
														customer?.id == Number(event.target.value)
												) ?? null;

											setSelectedCustomer(findCustomer);
										}
									}}
								>
									<option value="">Select a Customer</option>
									{customers.map((customer: CustomerType) => (
										<option
											key={customer.id}
											value={customer.id}
											selected={selectedCustomer?.id === customer.id}
										></option>
									))}
								</Select>
							</div>
							<TextInput
								label="Customer Name"
								formState={formState}
								formErrors={formErrors}
								placeholder="Customer Name"
								onChange={handleChange}
								name="name"
								required
								value={formState['name']}
							/>
							<TextInput
								label="Customer Phone"
								formState={formState}
								formErrors={formErrors}
								placeholder="Customer Phone"
								onChange={handleChange}
								name="phone"
								value={formState['phone']}
							/>
							<TextInput
								label={'Customer Email'}
								formState={formState}
								formErrors={formErrors}
								placeholder="Customer Email"
								onChange={handleChange}
								name="email"
								value={formState['email']}
							/>
							<TextInput
								label="Shipping Address"
								formState={formState}
								formErrors={formErrors}
								placeholder="Shipping Address"
								onChange={handleChange}
								name="address"
								value={formState['address']}
							/>
							<Textarea
								label="Note"
								formState={formState}
								formErrors={formErrors}
								className="sm:col-span-2 w-full"
								rows={2}
								placeholder="Customer Note"
								name="notes"
								value={formState['notes']}
								onChange={handleChange}
							/>

							<div className="w-full flex flex-col gap-2.5">
								<Label>Order Status</Label>
								<Select
									name="status"
									formState={formState}
									formErrors={formErrors}
									onChange={handleChange}
								>
									{['Pending', 'Confirmed', 'Delivered'].map((status) => (
										<option
											value={status}
											key={status}
											selected={formState['status'] === status}
										>
											{status}
										</option>
									))}
								</Select>
							</div>

							<div className="w-full flex flex-col gap-2.5">
								<Label>Payment Status</Label>
								<Select
									name="paymentMethod"
									onChange={handleChange}
									formState={formState}
									formErrors={formErrors}
								>
									{['Paid', 'Pending', 'Cash On Delivery'].map((status) => (
										<option
											value={status}
											key={status}
											selected={formState['paymentMethod'] === status}
										>
											{status}
										</option>
									))}
								</Select>
							</div>
						</div>
					)}

					{formErrors['message'] && (
						<ErrorMessage>{formErrors['message']}</ErrorMessage>
					)}
				</Modal.Body>

				<Modal.Footer>
					{formState['step'] === 1 ? (
						<>
							<Button
								color="blue"
								onClick={handleSubmit}
								isProcessing={create.isLoading}
								disabled={create.isLoading || selectedVariants.length === 0}
								processingLabel="Creating"
								processingSpinner={
									<AiOutlineLoading className="animate-spin" />
								}
								className="whitespace-nowrap"
							>
								Next
							</Button>
							<Button
								color="blue"
								onClick={() => setOpen(false)}
								disabled={create.isLoading}
							>
								Cancel
							</Button>
						</>
					) : (
						<>
							<Button
								color="blue"
								onClick={handleSubmit}
								isProcessing={create.isLoading}
								disabled={create.isLoading || !selectedVariants}
								processingLabel="Creating"
								processingSpinner={
									<AiOutlineLoading className="animate-spin" />
								}
								className=" whitespace-nowrap"
							>
								Place Order
							</Button>
							<Button
								color="blue"
								onClick={() => {
									setFormState((prev: any) => ({
										...prev,
										step: prev['step'] > 1 ? prev['step'] - 1 : 1,
									}));
								}}
								disabled={create.isLoading}
							>
								Prev
							</Button>
						</>
					)}

					<div className="w-full flex justify-end">
						<p className="dark:text-white font-medium text-end ml-auto">
							{Math.min(
								formState['qty'] *
									(priceWithVariant) *
									(1 - (formState['discount'] ?? 0) / 100)
							).toFixed(2)}{' '}
							TK.
						</p>
					</div>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default PlaceOrder;
