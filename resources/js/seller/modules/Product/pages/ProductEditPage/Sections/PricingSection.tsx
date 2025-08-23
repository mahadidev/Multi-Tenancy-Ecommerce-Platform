import { Select, TextInput } from '@seller/components';
import { SectionProps } from '../ProductEditPage';

const PricingSection = ({
	formState,
	formErrors,
	handleChange,
}: SectionProps) => (
	<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
		<TextInput
			id="buying_price"
			name="buying_price"
			label="Buying Price"
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
			label="Discount Type"
			formState={formState}
			formErrors={formErrors}
			value={formState['percentage']}
			onChange={handleChange}
		>
			<option value="flat" selected={formState['discount_type'] === 'flat'}>
				TK
			</option>
			<option
				value="percentage"
				selected={formState['discount_type'] === 'percentage'}
			>
				%
			</option>
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
		/>
		<TextInput
			id="tax"
			name="tax"
			label="Tax (tk)"
			formState={formState}
			formErrors={formErrors}
			onChange={handleChange}
			type="number"
			min={0}
		/>
	</div>
);

export default PricingSection;
