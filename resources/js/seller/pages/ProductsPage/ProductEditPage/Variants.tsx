import { DataTable, TextInput } from '@seller/components';
import { FC } from 'react';

interface Props {
	formState: any;
	setFormState: React.Dispatch<any>;
	formErrors: any;
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | any>,
		onChange?: CallableFunction
	) => void;
}

const Variants: FC<Props> = () => {
	return (
		<>
			<div className="flex justify-between items-center gap-4 py-2.5">
				<h2 className="text-lg font-medium mb-2.5">Product Variants</h2>
                <a className='underline'>Create Attribute</a>
			</div>

			<DataTable disablePagination columns={[{}]} data={[]} />
		</>
	);
};
export default Variants;
