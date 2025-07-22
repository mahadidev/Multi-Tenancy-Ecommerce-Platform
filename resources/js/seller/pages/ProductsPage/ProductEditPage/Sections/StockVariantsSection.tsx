import { Checkbox, TextInput } from '@seller/components';
import { Label } from 'flowbite-react';
import { SectionProps } from '../ProductEditPage';
import Stocks from '../Stocks/Stocks';
import Variants from '../Variants/Variants';

const StockVariantsSection = ({
	formState,
	formErrors,
	setFormState,
	handleChange,
}: SectionProps) => {
	return (
		<>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
				<div className="flex flex-col gap-2.5">
					<Label>Product Stock Settings</Label>
					<Checkbox
						id="has_variants"
						name="has_variants"
						label="Has variant"
						formState={formState}
						formErrors={formErrors}
						value={1}
						onChange={handleChange}
					/>
				</div>

				{/* {!formState['has_variants'] && (
					<TextInput
						id="stock"
						name="stock"
						label="Stock Quantity"
						formState={formState}
						formErrors={formErrors}
						onChange={handleChange}
						type="number"
						min={0}
						readOnly
					/>
				)} */}

				{formState['has_variants'] ? (
					<>
						<div className="col-span-full">
							<Variants
								formState={formState}
								formErrors={formErrors}
								setFormState={setFormState}
								handleChange={handleChange}
							/>
						</div>
					</>
				) : (
					<></>
				)}

				<div className="col-span-full">
					<Stocks
						formState={formState}
						formErrors={formErrors}
						setFormState={setFormState}
						handleChange={handleChange}
					/>
				</div>
			</div>
		</>
	);
};

export default StockVariantsSection;
