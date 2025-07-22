import useCategory from '@seller/hooks/useCategory';
import useForm from '@seller/hooks/useForm';
import useProduct from '@seller/hooks/useProduct';
import useString from '@seller/hooks/useString';
import { CategoryType } from '@type/categoryType';
import { Button, Label, Modal } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';
import { FileInput, Select, TextInput } from '../../components';
import MultipleImageUploader from './ProductEditPage/MultipleImageUploader';

const CreateProductModal: FC = function () {
	const [isOpen, setOpen] = useState(false);
	const { create } = useProduct();
	const { productCategories } = useCategory();
	const { handleChange, formState, formErrors, setFormState } = useForm({
		formValidationError: create.error,
	});
	const { getSlug } = useString();
	const [attachments, setAttachments] = useState<string[]>(['']);
	return (
		<>
			<Button color="primary" className="p-0" onClick={() => setOpen(true)}>
				<div className="flex items-center gap-x-3">
					<HiPlus className="text-xl" />
					Create Product
				</div>
			</Button>
			<Modal onClose={() => setOpen(false)} show={isOpen}>
				<Modal.Header>Create a new Product</Modal.Header>
				<Modal.Body>
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
						<Select
							id="category_id"
							name="category_id"
							label="Category"
							formState={formState}
							formErrors={formErrors}
							onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
								if (event.target.value === '0') {
									event.target.value = 'null';
								}
								handleChange(event);
							}}
							required
						>
							<option value={0}>Select a Category</option>
							{productCategories?.map((category: CategoryType) => (
								<option value={category.id} key={category.id}>
									{category.name}
								</option>
							))}
						</Select>
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
						color="primary"
						onClick={() => {
							create.submit({
								formData: {
									...formState,
									attachments,
									discount_type: 'flat',
								},
								onSuccess: () => {
									setOpen(false);
									setFormState({});
								},
							});
						}}
						isProcessing={create.isLoading}
						disabled={create.isLoading}
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
export default CreateProductModal;
