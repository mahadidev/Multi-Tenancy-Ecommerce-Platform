import useForm from '@seller/hooks/useForm';
import { BASE_IMAGE_URL } from '@seller/seller_env';
import { Card } from 'flowbite-react';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import StepHeader from './StepHeader';
import StoreStepOne from './StoreStepOne';
import StoreStepThree from './StoreStepThree';
import StoreStepTwo from './StoreStepTwo';

const StoreOnboardPage: FC = function () {
	const [stepNum, setStepNum] = useState<number>(1);
	const { setFormState, formState, formErrors, handleChange } = useForm();
	return (
		<>
			<div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
				<Link
					to="/"
					className="mb-8 flex items-center justify-center text-2xl font-semibold lg:mb-10 dark:text-white"
				>
					<img
						alt=""
						src={`${BASE_IMAGE_URL}/logo-text.png`}
						width={43}
						height={44}
						className="mr-4 h-11 w-auto dark:hidden"
					/>
					<img
						alt=""
						src={`${BASE_IMAGE_URL}/logo-text-dark.png`}
						width={43}
						height={44}
						className="mr-4 h-11 w-auto hidden dark:block"
					/>
				</Link>
				<Card
					horizontal
					className="w-full md:max-w-screen-lg *:object-cover"
					theme={{
						root: {
							children: 'my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16',
						},
						img: {
							horizontal: {
								on: 'hidden w-2/3 rounded-l-lg md:w-96 md:p-0 lg:block !object-cover',
							},
						},
					}}
				>
					<StepHeader stepNum={stepNum} />
					<StoreStepOne
						setFormState={setFormState}
						formState={formState}
						formErrors={formErrors}
						handleChange={handleChange}
						stepNum={stepNum}
						setStepNum={setStepNum}
					/>
					<StoreStepTwo
						setFormState={setFormState}
						formState={formState}
						formErrors={formErrors}
						handleChange={handleChange}
						stepNum={stepNum}
						setStepNum={setStepNum}
					/>
					<StoreStepThree
						setFormState={setFormState}
						formState={formState}
						formErrors={formErrors}
						handleChange={handleChange}
						stepNum={stepNum}
						setStepNum={setStepNum}
					/>
				</Card>
			</div>
		</>
	);
};
export default StoreOnboardPage;
