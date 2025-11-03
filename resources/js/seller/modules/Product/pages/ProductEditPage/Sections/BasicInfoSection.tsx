import useBrand from '@seller/_hooks/useBrand';
import useCategory from '@seller/_hooks/useCategory';
import useString from '@seller/_hooks/useString';
import { Select, TextInput } from '@seller/components';
import QuickAddSelect from '@seller/components/Form/QuickAddSelect/QuickAddSelect';
import { BrandType } from '@type/brandType';
import { CategoryType } from '@type/categoryType';
import { SectionProps } from '../ProductEditPage';


const BasicInfoSection = ({
	formState,
	formErrors,
	handleChange,
	setFormState,
}: SectionProps) => {
	const { productCategories, create: createCategory } = useCategory();
	const { brands } = useBrand();
	const { getSlug } = useString();

	const handleQuickAddCategory = async (categoryName: string) => {
		return new Promise<{ id: string | number; name: string }>((resolve) => {
			createCategory.submit({
				formData: { 
					name: categoryName,
					type: 'product' // Explicitly set type to 'product' for product categories
				},
				onSuccess: (responseData: any) => {
					const newCategory = {
						id: responseData.category.id,
						name: responseData.category.name,
					};
					
					resolve(newCategory);
				},
			});
		});
	};

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
			<TextInput
				id="name"
				name="name"
				label="Product Name"
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
			<QuickAddSelect
				name="category_id"
				label="Category"
				value={formState.category_id || ''}
				onChange={handleChange}
				options={productCategories?.map(category => ({ value: category.id, label: category.name })) || []}
				placeholder="Select a Category"
				onQuickAdd={handleQuickAddCategory}
				required
			/>
			<Select
				id="brand_id"
				name="brand_id"
				label="Brand"
				formState={formState}
				formErrors={formErrors}
				value={formState['brand_id']}
				onChange={handleChange}
			>
				<option value={0}>Select a brand</option>
				{brands.map((brand: BrandType) => (
					<option value={brand.id} key={brand.id}>
						{brand.name}
					</option>
				))}
			</Select>
		</div>
	);
};

export default BasicInfoSection;
