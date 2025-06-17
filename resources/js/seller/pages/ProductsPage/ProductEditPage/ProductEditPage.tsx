import { FileInput, TextInput } from '@seller/components';
import FormInput from '@seller/components/FormInput/FormInput';
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
import { Button, Label, Select, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import BarcodeGenerator from './BarcodeGenerator/BarcodeGenerator';
import MultipleImageUploader from './MultipleImageUploader';
import PlaceOrder from './PlaceOrder';
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
			discount_amount: product?.discount_amount,
			stock: product?.stock,
			tax: product?.tax,
			description: product?.description,
			short_description: product?.short_description,
			variants: product?.variants,
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
				tax: product?.tax,
				discount_amount: product?.discount_amount,
				stock: product?.stock,
				description: product?.description,
				short_description: product?.short_description,
				variants: product?.variants,
				attachments: product?.attachments || [],
			});
		}
	}, [product]);

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
								<PlaceOrder product={product} />
							</>
						)}
					</div>
				}
			/>

			<section className="p-4">
				<div>
					<div>
						<div className="flex flex-col gap-6">
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full ">
								<FormInput
									id="name"
									label="Product Name"
									formState={formState}
									formErrors={formErrors}
									handleChange={(event) => {
										handleChange(event);
										setFormState((prev: any) => ({
											...prev,
											slug: getSlug(event.target.value),
										}));
									}}
								/>
								<FormInput
									id="slug"
									label="Product Slug"
									formState={formState}
									formErrors={formErrors}
									handleChange={handleChange}
								/>
								<TextInput
									name="sku"
									label="Product sku"
									formState={formState}
									formErrors={formErrors}
                                    onChange={handleChange}
                                    readOnly
								/>

								<div className="flex flex-col gap-2">
									<Label htmlFor="category_id">Category</Label>
									<Select
										id="category_id"
										name="category_id"
										value={formState['category_id']}
										onChange={handleChange}
										required
									>
										<option value={0}>Select a Category</option>
										{productCategories?.map((category: CategoryType) => (
											<option value={category.id} key={category.id}>
												{category.name}
											</option>
										))}
									</Select>
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="brand_id">Brand</Label>
									<Select
										id="brand_id"
										name="brand_id"
										value={formState['brand_id']}
										onChange={handleChange}
										required
									>
										<option value={0}>Select a brand</option>
										{brands.map((brand: BrandType) => (
											<option value={brand.id} key={brand.id}>
												{brand.name}
											</option>
										))}
									</Select>
								</div>
								<FormInput
									id="price"
									label="Product Price"
									formState={formState}
									formErrors={formErrors}
									handleChange={handleChange}
									type="number"
								/>
								<TextInput
									name="discount_amount"
									label="Discount Amount"
									formState={formState}
									formErrors={formErrors}
									onChange={handleChange}
									type="number"
									placeholder="discount in %"
								/>

								<TextInput
									name="stock"
									label="Stock Quantity"
									formState={formState}
									formErrors={formErrors}
									onChange={handleChange}
									type="number"
								/>

								<TextInput
									name="tax"
									label="Tax (%)"
									formState={formState}
									formErrors={formErrors}
									onChange={handleChange}
									type="number"
								/>

								<div className="flex flex-col gap-2 col-span-full">
									<Label htmlFor="short_description">Sort Description</Label>
									<Textarea
										id="short_description"
										name="short_description"
										placeholder="Enter product short description"
										rows={5}
										value={formState['short_description']}
										onChange={handleChange}
									/>
								</div>
								<div className="flex flex-col gap-2 col-span-full">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										name="description"
										placeholder="Enter product description"
										rows={5}
										value={formState['description']}
										onChange={handleChange}
									/>
								</div>

								{/* variants */}
								<ProductVariantTable product={product!} />

								<div className="flex flex-col gap-6 col-span-full">
									<div className="flex flex-col gap-2">
										<Label htmlFor="thumbnail">Thumbnail</Label>
										<div>
											<FileInput
												id="thumbnail"
												name="thumbnail"
												placeholder="Click to upload thumbnail"
												value={formState['thumbnail'] ?? product?.thumbnail}
												color={formErrors['thumbnail'] ? 'failure' : 'gray'}
												helperText={
													formErrors['thumbnail']
														? formErrors['thumbnail'][0]
														: false
												}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													handleChange(event);
												}}
											/>
										</div>
									</div>
								</div>

								{/* multiple image uploader */}
								<MultipleImageUploader
									attachments={attachments}
									setAttachments={setAttachments}
								/>
							</div>
						</div>
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
