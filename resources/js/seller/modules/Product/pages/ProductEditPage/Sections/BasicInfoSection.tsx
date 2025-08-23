import useBrand from '@seller/_hooks/useBrand';
import useCategory from '@seller/_hooks/useCategory';
import useString from '@seller/_hooks/useString';
import { Select, TextInput } from '@seller/components';
import { BrandType } from '@type/brandType';
import { CategoryType } from '@type/categoryType';
import { SectionProps } from '../ProductEditPage';


const BasicInfoSection = ({
	formState,
	formErrors,
	handleChange,
	setFormState,
}: SectionProps) => {
	const { productCategories } = useCategory();
	const { brands } = useBrand();
	const { getSlug } = useString();

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
			<Select
				id="category_id"
				name="category_id"
				label="Category"
				formState={formState}
				formErrors={formErrors}
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
