/* eslint-disable react-hooks/exhaustive-deps */
import { FileInput } from '@/seller/components';
import useBrand from '@/seller/hooks/useBrand';
import useCategory from '@/seller/hooks/useCategory';
import useForm from '@/seller/hooks/useForm';
import useProduct from '@/seller/hooks/useProduct';
import useString from '@/seller/hooks/useString';
import { RoutePath } from '@/seller/seller_env';
import { BrandType } from '@/seller/types/brandType';
import { CategoryType } from '@/seller/types/categoryType';
import {
    Breadcrumb,
    Button,
    Label,
    Select,
    Textarea,
    TextInput,
} from 'flowbite-react';
import { useEffect } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiHome } from 'react-icons/hi';
import { useParams } from 'react-router-dom';

const ProductEditPage = () => {
	const { id } = useParams();
	const { categories } = useCategory();
	const { update, product, fetchProduct } = useProduct();
	const { brands } = useBrand();
	const { getSlug } = useString();
	const { handleChange, formState, formErrors, setFormState } = useForm({
		default: product,
	});

	useEffect(() => {
		if (id) {
			fetchProduct.submit({
				formData: {
					id: id,
				},
			});
		}
	}, [id]);

	return (
		<div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
			<div className="mb-4">
				<Breadcrumb className="mb-5">
					<Breadcrumb.Item href={RoutePath.DashboardPage.index()}>
						<div className="flex items-center gap-x-3">
							<HiHome className="text-xl" />
							<span>Dashboard</span>
						</div>
					</Breadcrumb.Item>
					<Breadcrumb.Item href={'/seller/products'}>Product</Breadcrumb.Item>
					<Breadcrumb.Item>Edit</Breadcrumb.Item>
				</Breadcrumb>
				<h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
					Edit Product
				</h1>
			</div>

			<section>
				<div className="">
					<div>
						<div className="flex flex-col gap-6">
							<div className="flex gap-6 w-full">
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-3 w-full ">
									<div className="flex flex-col col-span-2 gap-2">
										<Label htmlFor="name">Name</Label>
										<TextInput
											id="name"
											name="name"
											placeholder="Product name"
											value={formState['name']}
											onChange={(e) => {
												handleChange(e);
												setFormState((prev: any) => ({
													...prev,
													slug: getSlug(e.target.value),
												}));
											}}
											required
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="slug">Slug</Label>
										<TextInput
											id="slug"
											name="slug"
											placeholder="Product slug"
											value={formState['slug']}
											onChange={(e) => {
												handleChange(e);
												setFormState((prev: any) => ({
													...prev,
													slug: getSlug(e.target.value),
												}));
											}}
											required
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="sku">SKU</Label>
										<TextInput
											id="sku"
											name="sku"
											placeholder="Product sku"
											value={formState['sku']}
											onChange={(e) => {
												handleChange(e);
												setFormState((prev: any) => ({
													...prev,
													slug: getSlug(e.target.value),
												}));
											}}
											required
										/>
									</div>
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
											{categories.map((category: CategoryType) => (
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
									<div className="flex flex-col gap-2">
										<Label htmlFor="price">Price</Label>
										<TextInput
											id="price"
											name="price"
											type="number"
											placeholder="Enter price"
											value={formState['price']}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="discount_amount">Discount amount</Label>
										<TextInput
											id="discount_amount"
											name="discount_amount"
											type="number"
											placeholder="Enter discount_amount"
											value={formState['discount_amount']}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Label htmlFor="stock">Stock</Label>
										<TextInput
											id="stock"
											name="stock"
											type="number"
											placeholder="Enter stock"
											value={formState['stock']}
											onChange={handleChange}
											required
										/>
									</div>

									<div className="flex flex-col gap-2 sm:col-span-3">
										<Label htmlFor="short_description">Sort Description</Label>
										<Textarea
											id="short_description"
											name="short_description"
											placeholder="Enter product short_description"
											rows={5}
											value={formState['short_description']}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className="w-[70%] ">
									<div className="flex flex-col gap-6 col-span-full">
										<div className="flex flex-col gap-2">
											<Label htmlFor="thumbnail">Thumbnail</Label>
											<div>
												<FileInput
													id="thumbnail"
													name="thumbnail"
													placeholder="Click to upload thumbnail"
													value={formState['thumbnail']}
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
										<div>
											{formState['thumbnail'] && (
												<img
													src={formState['thumbnail']}
													alt="thumbnail"
													className="w-36 h-36 object-cover rounded-md"
												/>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* second section  */}
							<div className="flex flex-col gap-2 sm:col-span-3">
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
						</div>

						{/* Variants Section */}
						{/* <div className="my-6">
								<Label>Variants</Label>
								{formState.variants?.map(
									(variant: any, variantIndex: number) => (
										<div key={variantIndex} className="border p-4 mb-4 rounded">
											<div className="flex items-center justify-between">
												<TextInput
													name={`variant-label-${variantIndex}`}
													placeholder="Variant label"
													value={variant.label}
													onChange={(e) => {
														const newLabel = e.target.value;
														setFormState((prev: any) => {
															const updatedVariants = [...prev.variants];
															updatedVariants[variantIndex].label = newLabel;
															return {
																...prev,
																variants: updatedVariants,
															};
														});
													}}
												/>
												<Button
													color="failure"
													onClick={() => removeVariant(variantIndex)}
												>
													<HiTrash className="text-xl" />
												</Button>
											</div>
											<div className="mt-4">
												<Label>Options</Label>
												<div className="flex flex-col gap-3">
													{variant.options.map(
														(option: any, optionIndex: number) => (
															<div key={optionIndex} className="flex gap-3">
																<TextInput
																	placeholder="Option label"
																	value={option.label}
																	onChange={(e) => {
																		const newLabel = e.target.value;
																		setFormState((prev: any) => {
																			const updatedVariants = [
																				...prev.variants,
																			];
																			updatedVariants[variantIndex].options[
																				optionIndex
																			].label = newLabel;
																			return {
																				...prev,
																				variants: updatedVariants,
																			};
																		});
																	}}
																/>
																<TextInput
																	placeholder="Price"
																	type="number"
																	value={option.price}
																	onChange={(e) => {
																		const newPrice = e.target.value;
																		setFormState((prev: any) => {
																			const updatedVariants = [
																				...prev.variants,
																			];
																			updatedVariants[variantIndex].options[
																				optionIndex
																			].price = newPrice;
																			return {
																				...prev,
																				variants: updatedVariants,
																			};
																		});
																	}}
																/>
																<TextInput
																	placeholder="Stock Qty"
																	type="number"
																	value={option.qty_stock}
																	onChange={(e) => {
																		const newStock = e.target.value;
																		setFormState((prev: any) => {
																			const updatedVariants = [
																				...prev.variants,
																			];
																			updatedVariants[variantIndex].options[
																				optionIndex
																			].qty_stock = newStock;
																			return {
																				...prev,
																				variants: updatedVariants,
																			};
																		});
																	}}
																/>
																<Button
																	color="failure"
																	onClick={() =>
																		removeVariantOption(
																			variantIndex,
																			optionIndex
																		)
																	}
																>
																	<HiTrash className="text-xl" />
																</Button>
															</div>
														)
													)}
												</div>
												<Button
													className="mt-2 p-0"
													color="primary"
													size="sm"
													onClick={() => addVariantOption(variantIndex)}
												>
													<div className="flex items-center gap-x-2">
														<FaPlus />
														<span>Add Option</span>
													</div>
												</Button>
											</div>
										</div>
									)
								)}
								<Button
									className="mt-4"
									color="primary"
									size="sm"
									onClick={addVariant}
								>
									<div className="flex items-center gap-x-2">
										<FaPlus />
										<span>Add Variant</span>
									</div>
								</Button>
							</div> */}
					</div>
				</div>
				<div className="flex justify-end mt-6">
					<Button
						color="primary"
						onClick={() => {
							update.submit({
								formData: formState,
							});
						}}
						isProcessing={update.isLoading}
						disabled={update.isLoading}
						processingLabel="Saving"
						processingSpinner={<AiOutlineLoading />}
					>
						Save all
					</Button>
				</div>
			</section>
		</div>
	);
};

export default ProductEditPage;
