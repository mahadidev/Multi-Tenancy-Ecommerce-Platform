import { Textarea } from '@seller/components';
import { SectionProps } from '../ProductEditPage';

const DescriptionSection = ({
	formState,
	formErrors,
	handleChange,
}: SectionProps) => {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
			<Textarea
				id="short_description"
				name="short_description"
				formState={formState}
				formErrors={formErrors}
				onChange={handleChange}
				label="Short Description"
				placeholder="Short Description"
			/>
			<Textarea
				id="description"
				name="description"
				formState={formState}
				formErrors={formErrors}
				onChange={handleChange}
				label="Full Description"
				placeholder="Full Description"
				rows={5}
			/>
		</div>
	);
};

export default DescriptionSection;
