/* eslint-disable react-hooks/exhaustive-deps */
import {
    DataTable,
    FileInput,
    Select,
    TextInput,
    Textarea,
} from '@seller/components';
import LoadingOverlay from '@seller/components/LoadingOverlay/LoadingOverlay';
import { PageBreadCrumb } from '@seller/components/PageHeader/PageBreadcrumb';
import useBrand from '@seller/hooks/useBrand';
import useCategory from '@seller/hooks/useCategory';
import useForm from '@seller/hooks/useForm';
import useProduct from '@seller/hooks/useProduct';
import useString from '@seller/hooks/useString';
import useToast from '@seller/hooks/useToast';
import { BrandType } from '@type/brandType';
import { CategoryType } from '@type/categoryType';
import { Button, Label } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import BarcodeGenerator from './BarcodeGenerator/BarcodeGenerator';
import MultipleImageUploader from './MultipleImageUploader';
import ProductVariantTable from './ProductVariantTable';

const ProductEditPage = () => {
	const { id } = useParams();
	const { productCategories } = useCategory();
	const { update, product, fetchProduct } = useProduct();
	const { brands } = useBrand();
	const { getSlug } = useString();
	const [attachments, setAttachments] = useState<string[]>(['']);
	const { handleChange, formState, formErrors, setFormState } = useForm({
		default: {
			id: product?.id || '',
			name: product?.name || '',
			slug: product?.slug || '',
			sku: product?.sku || '',
			category_id: product?.category?.id || '',
			brand: product?.brand?.id || '',
			price: product?.price,
			buying_price: product?.buying_price,
			discount_amount: product?.discount_amount,
			stock: product?.stock,
			tax: product?.tax,
			discount_type: 'flat',
			description: product?.description,
			short_description: product?.short_description,
			variants: product?.variants,
			has_variants: product?.has_variants,
			variants_type: product?.variants_type,
			attachments: product?.attachments || [],
		},
	});
	const { toaster } = useToast();

	useEffect(() => {
		if (id) {
			fetchProduct.submit({
				formData: {
					id: id,
				},
			});
		}
	}, [id]);

	useEffect(() => {
		if (product) {
			setAttachments(product?.attachments || []);
			setFormState({
				id: product?.id || '',
				name: product?.name || '',
				slug: product?.slug || '',
				sku: product?.sku || '',
				category_id: product?.category?.id || '',
				brand_id: product?.brand?.id || '',
				price: product?.price,
				buying_price: product?.buying_price,
				tax: product?.tax,
				discount_amount: product?.discount_amount,
				discount_type: 'flat',
				has_variants: product?.has_variants,
				variants_type: product?.variants_type,
				stock: product?.stock,
				description: product?.description,
				short_description: product?.short_description,
				variants: product?.variants,
				attachments: product?.attachments || [],
			});
		}
	}, [product]);

	// look at variants_type
	useEffect(() => {
		if (formState['variants_type'] === 'none') {
			setFormState((prev: any) => ({
				...prev,
				has_variants: false,
			}));
		} else {
			setFormState((prev: any) => ({
				...prev,
				has_variants: true,
			}));
		}
	}, [formState['variants_type']]);

	return (
		<div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 relative">
			<PageBreadCrumb
				title="Edit Product"
				items={['Product', 'Edit']}
				action={
					<div className="flex gap-2.5 items-center">
						{product && (
							<>
								<BarcodeGenerator product={product} />
							</>
						)}
					</div>
				}
			/>

			<section className="p-4">
				<div className="flex flex-col gap-6">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
						<TextInput
							id="name"
							name="name"
							label="Product Name"
							placeholder="Product Name"
							formState={formState}
							formErrors={formErrors}
							onChange={(event) => {
								handleChange(event);
								setFormState((prev: any) => ({
									...prev,
									slug: getSlug(event.target.value),
								}));
							}}
							required
						/>
						<TextInput
							id="slug"
							name="slug"
							label="Product Slug"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							required
						/>
						<TextInput
							id="sku"
							name="sku"
							label="Product SKU"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							readOnly
							required
						/>

						<Select
							id="category_id"
							name="category_id"
							onChange={handleChange}
							value={formState['category_id']}
							label="Category"
							required
							formState={formState}
							formErrors={formErrors}
						>
							<option value={0}>Select a Category</option>
							{productCategories?.map((category: CategoryType) => (
								<option value={category.id} key={category.id}>
									{category.name}
								</option>
							))}
						</Select>

						<Select
							id="brand_id"
							name="brand_id"
							onChange={handleChange}
							value={formState['brand_id']}
							label="Brand"
							formState={formState}
							formErrors={formErrors}
						>
							<option value={0}>Select a brand</option>
							{brands.map((brand: BrandType) => (
								<option value={brand.id} key={brand.id}>
									{brand.name}
								</option>
							))}
						</Select>

						<TextInput
							id="buying_price"
							name="buying_price"
							label="Buying Price"
							placeholder="Buying Price"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							type="number"
						/>
						<TextInput
							id="price"
							name="price"
							label="Product Price"
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
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							type="number"
							placeholder="Discount Amount"
						/>
						<TextInput
							id="tax"
							name="tax"
							label="Tax (tk)"
							placeholder="Tax (tk)"
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							type="number"
							min={0}
						/>

						{!formState['has_variants'] && (
							<TextInput
								id="stock"
								name="stock"
								label="Stock Quantity"
								formState={formState}
								formErrors={formErrors}
								onChange={handleChange}
								type="number"
								min={0}
								required
								readOnly
							/>
						)}

						<Select
							id="variants_type"
							name="variants_type"
							onChange={handleChange}
							value={formState['variants_type']}
							label="Variants"
							formState={formState}
							formErrors={formErrors}
						>
							{[
								{
									value: 'basic',
									label: 'Basic',
								},
								{
									value: 'advance',
									label: 'Advance',
								},
								{
									value: 'none',
									label: 'None',
								},
							].map((item: { value: string; label: string }) => (
								<option
									value={item.value}
									selected={formState['variants_type'] === item.value}
								>
									{item.label}
								</option>
							))}
						</Select>

						{(formState['variants_type'] === 'basic' ||
							formState['variants_type'] === 'advance') && (
							<div className="col-span-full">
								<h2 className="mb-2.5">Product Variants</h2>

								<DataTable disablePagination columns={[{}]} data={[]} />
							</div>
						)}

						<Textarea
							id="short_description"
							name={'short_description'}
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							label="Short Description"
							placeholder="Short Description of product"
							wrapperClassName="col-span-full"
						/>

						<Textarea
							id="description"
							name={'description'}
							formState={formState}
							formErrors={formErrors}
							onChange={handleChange}
							label="Description"
							placeholder="Description of product"
							wrapperClassName="col-span-full"
							rows={5}
						/>

						{/* Variants */}
						<ProductVariantTable product={product!} />

						{/* Thumbnail */}
						<div className="flex flex-col gap-6 col-span-full">
							<div className="flex flex-col gap-2">
								<Label htmlFor="thumbnail">Thumbnail</Label>
								<FileInput
									id="thumbnail"
									name="thumbnail"
									placeholder="Click to upload thumbnail"
									value={formState['thumbnail'] ?? product?.thumbnail}
									color={formErrors['thumbnail'] ? 'failure' : 'gray'}
									helperText={
										formErrors['thumbnail'] ? formErrors['thumbnail'][0] : false
									}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										handleChange(event);
									}}
								/>
							</div>
						</div>

						{/* Multiple Image Uploader */}
						<MultipleImageUploader
							attachments={attachments}
							setAttachments={setAttachments}
						/>
					</div>
				</div>

				<LoadingOverlay isLoading={fetchProduct.isLoading} position="fixed" />

				<div className="flex justify-end mt-6">
					<Button
						color="primary"
						onClick={() => {
							update.submit({
								formData: {
									...formState,
									variants: product?.variants,
									attachments,
								},
								onSuccess: () => {
									toaster({
										text: 'Product has been updated',
										status: 'success',
									});
								},
							});
						}}
						isProcessing={update.isLoading}
						disabled={update.isLoading}
						processingLabel="Saving"
						processingSpinner={<AiOutlineLoading className="animate-spin" />}
					>
						Save all
					</Button>
				</div>
			</section>
		</div>
	);
};

export default ProductEditPage;
