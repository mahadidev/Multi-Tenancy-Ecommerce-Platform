import { FormErrorType, FormStateType } from '@seller/_hooks/useForm';
import { FileInput } from '@seller/components';
import { Button, Label } from 'flowbite-react';
import { ChangeEventHandler, FC } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';


interface PropsType {
	stepNum: number;
	setStepNum: CallableFunction;
	formState: FormStateType;
	formErrors: FormErrorType;
	handleChange: ChangeEventHandler<any>;
	setFormState: CallableFunction;
}

const StoreStepTwo: FC<PropsType> = function (props) {
	return (
		<div className={`space-y-8  ${props.stepNum === 2 ? 'block' : 'hidden'}`}>
			<h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
				Appearance
			</h2>

			<div className="mt-8 space-y-6">
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="logo">Logo</Label>
					<FileInput
						id="logo"
						name="logo"
						type="logo"
						value={props.formState['logo']}
						color={props.formErrors['logo'] ? 'failure' : 'gray'}
						helperText={
							props.formErrors['logo'] ? props.formErrors['logo'][0] : false
						}
						onChange={props.handleChange}
						placeholder="Click to upload logo"
					/>
				</div>

				<div className="mb-6 flex items-center justify-between">
					<Button
						type="button"
						size="lg"
						color="primary"
						theme={{ inner: { base: 'px-5 py-3' } }}
						className="w-full px-0 py-px sm:w-auto"
						onClick={() => {
							props.setStepNum(1);
						}}
						processingSpinner={
							<AiOutlineLoading className="h-6 w-6 animate-spin" />
						}
					>
						Prev: Basic info
					</Button>
					<Button
						type="button"
						size="lg"
						color="primary"
						theme={{ inner: { base: 'px-5 py-3' } }}
						className="w-full px-0 py-px sm:w-auto"
						onClick={() => {
							props.setStepNum(3);
						}}
						processingSpinner={
							<AiOutlineLoading className="h-6 w-6 animate-spin" />
						}
					>
						Next: Theme
					</Button>
				</div>
			</div>
		</div>
	);
};
export default StoreStepTwo;
