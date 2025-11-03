import useForm from '@seller/_hooks/useForm';
import useString from '@seller/_hooks/useString';
import useToast from '@seller/_hooks/useToast';
import { FileInput, Select, TextInput } from '@seller/components';
import QuickAddSelect from '@seller/components/Form/QuickAddSelect/QuickAddSelect';
import { useCategory } from '@seller/modules/Category/hooks';
import { Button, Label, Modal } from 'flowbite-react';
import { FC, useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';
import { useProduct } from '../hooks';
import MultipleImageUploader from './ProductEditPage/MultipleImageUploader';

const CreateProductModal: FC = function () {
	const [isOpen, setOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const { create } = useProduct({});
	const { productCategories, create: createCategory } = useCategory();
	const { toaster } = useToast();
	const { handleChange, formState, formErrors, setFormState } = useForm({
		formValidationError: create.error,
	});
	const { getSlug } = useString();
	const [attachments, setAttachments] = useState<string[]>(['']);

	const handleQuickAddCategory = async (categoryName: string) => {
		return new Promise<{ id: string | number; name: string }>((resolve) => {
			createCategory.submit({
				formData: {
					name: categoryName,
					type: 'product', // Explicitly set type to 'product' for product categories
				},
				onSuccess: (responseData: any) => {
                    console.log()
					const newCategory = {
						id: responseData.data.category.id,
						name: responseData.data.category.name,
					};

					resolve(newCategory);
					setFormState((prev: any) => ({
						...prev,
						category_id: newCategory.id,
					}));
				},
			});
		});
	};

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			setOpen(false);
			setIsClosing(false);
			setFormState({});
			setAttachments(['']);
		}, 300);
	};

	const handleSubmit = async () => {
		await create.submit({
			formData: {
				...formState,
				attachments,
				discount_type: formState['discount_type'] || 'flat',
			},
			onSuccess: () => {
				toaster({
					text: '✅ Product created successfully!',
					status: 'success',
				});
				handleClose();
			},
		});
	};

	useEffect(() => {
		if (create.data && isOpen) {
			toaster({
				text: '✅ Product created successfully!',
				status: 'success',
			});
			handleClose();
		}
	}, [create.data]);

    useEffect(() => {
        console.log(formState, "formState")
    }, [formState])
	return (
		<>
			<Button
				color="primary"
				onClick={() => {
					console.log('Opening Create Product Modal');
					setOpen(true);
				}}
				type="button"
			>
				<HiPlus className="mr-2 text-lg" />
				Create Product
			</Button>
			<Modal
				onClose={handleClose}
				show={isOpen}
				className={`transition-all duration-300 ${
					isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
				}`}
				size="4xl"
			>
				<Modal.Header className="animate-fadeIn">
					Create a new Product
				</Modal.Header>
				<Modal.Body className="animate-slideIn max-h-[70vh] overflow-y-auto">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<TextInput
							id="name"
							name="name"
							label="Product Name"
							formState={formState}
							formErrors={formErrors}
							onChange={(event) => {
								handleChange(event);
								const slug = getSlug(event.target.value);
								const sku =
									slug.toUpperCase().substring(0, 8) +
									'-' +
									Math.floor(1000 + Math.random() * 9000);

								setFormState((prev: any) => ({
									...prev,
									slug: slug,
									sku: sku,
								}));
							}}
							placeholder="Product name"
							required
						/>
						<TextInput
							id="slug"
							name="slug"
							label="Product Slug"
							placeholder="Product Slug"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							required
						/>
						<TextInput
							id="sku"
							name="sku"
							label="Product sku"
							placeholder="Product sku"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							required
						/>
						<TextInput
							id="price"
							name="price"
							label="Product Price ( TK )"
							placeholder="Product Price"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							type="number"
							required
						/>
						<Select
							id="discount_type"
							name="discount_type"
							onChange={handleChange}
							value={formState['discount_type']}
							label="Discount Type"
							formState={formState}
							formErrors={formErrors}
						>
							<option value="flat">TK</option>
							<option value="percentage">%</option>
						</Select>
						<TextInput
							id="discount_amount"
							name="discount_amount"
							label={`Discount Amount (${
								formState['discount_type'] === 'flat' ? 'TK' : '%'
							})`}
							placeholder="Discount amount"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							type="number"
							defaultValue={0}
						/>
						<TextInput
							id="buying_price"
							name="buying_price"
							label="Buying Price ( TK )"
							placeholder="Buying Price"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							type="number"
							min={0}
						/>
						<QuickAddSelect
							name="category_id"
							label="Category"
							value={formState.category_id || ''}
							onChange={handleChange}
							options={
								productCategories?.map((category) => ({
									value: category.id,
									label: category.name,
								})) || []
							}
							placeholder="Select a Category"
							onQuickAdd={handleQuickAddCategory}
							required
						/>
						<div className="flex flex-col gap-2 col-span-full">
							<Label htmlFor="thumbnail">Thumbnail</Label>
							<div>
								<FileInput
									id="thumbnail"
									name="thumbnail"
									placeholder="Click to upload thumbnail"
									value={formState['thumbnail']}
									color={formErrors['thumbnail'] ? 'failure' : 'gray'}
									helperText={
										formErrors['thumbnail'] ? formErrors['thumbnail'][0] : false
									}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										handleChange(event);
									}}
									required
								/>
							</div>
						</div>
						<MultipleImageUploader
							attachments={attachments}
							setAttachments={setAttachments}
							gridStyle="grid lg:grid-cols-1 xl:grid-cols-2 gap-2"
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						color="gray"
						onClick={handleClose}
						disabled={create.isLoading}
					>
						Cancel
					</Button>
					<Button
						color="primary"
						onClick={handleSubmit}
						isProcessing={create.isLoading}
						disabled={create.isLoading}
						processingLabel="Creating..."
						processingSpinner={<AiOutlineLoading className="animate-spin" />}
					>
						Create Product
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default CreateProductModal;
