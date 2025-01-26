import { FormErrorType, FormStateType } from '@seller/hooks/useForm';
import useStore from '@seller/hooks/useStore';
import useTheme from '@seller/hooks/useTheme';
import { RoutePath } from "@seller/seller_env";
import { ThemeType } from '@type/themeType';
import { Button } from 'flowbite-react';
import { ChangeEventHandler, FC } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { Navigate } from 'react-router-dom';

interface PropsType {
	stepNum: number;
	setStepNum: CallableFunction;
	formState: FormStateType | any;
	formErrors: FormErrorType;
	handleChange: ChangeEventHandler<any>;
	setFormState: CallableFunction;
}

const StoreStepThree: FC<PropsType> = function (props) {
	const { themes } = useTheme();
	const { create } = useStore();

	return (
		<div className={`space-y-8  ${props.stepNum === 3 ? 'block' : 'hidden'}`}>
			<h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
				Choose a theme
			</h2>

			<div className="mt-8 space-y-6">
				<ul className="grid w-full gap-6 md:grid-cols-3">
					{themes?.map((item: ThemeType, index: number) => (
						<li key={index}>
							<input
								name="theme_id"
								type="radio"
								id={item.slug}
								value={item.id}
								className="hidden peer"
								required
								defaultChecked={
									(themes[0] && themes[0].id == item.id) ||
									props.formState['theme_id'] === item.id
								}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									props.handleChange(event);
								}}
							/>
							<label
								htmlFor={item.slug}
								className="inline-flex items-center justify-between w-full text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600
                                        peer-checked:bg-gray-50
                                        peer-checked:dark:bg-gray-700
                                        hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden"
							>
								<div className="block w-full">
									<img
										className="w-full block"
										src={item.thumbnail ?? ''}
										alt={item.name}
									/>
									<div className="w-full p-2.5">
										<p className="text-center">{item.name}</p>
									</div>
								</div>
							</label>
						</li>
					))}
				</ul>

				<div className="mb-6 flex items-center justify-between">
					<Button
						type="button"
						size="lg"
						color="primary"
						theme={{ inner: { base: 'px-5 py-3' } }}
						className="w-full px-0 py-px sm:w-auto"
						onClick={() => {
							props.setStepNum(2);
						}}
						processingSpinner={
							<AiOutlineLoading className="h-6 w-6 animate-spin" />
						}
					>
						Prev: Store branding
					</Button>
					<Button
						type="button"
						size="lg"
						color="primary"
						theme={{ inner: { base: 'px-5 py-3' } }}
						className="w-full px-0 py-px sm:w-auto"
						onClick={() => {
							if ("name" in props.formState && "domain" in props.formState) {
								create.submit({
									formData: props.formState,
                                    onSuccess: () => {
                                        return <Navigate to={RoutePath.DashboardPage.index()} />
                                    }
								});
							}
						}}
                        isProcessing={create.isLoading}
						processingSpinner={
							<AiOutlineLoading className="h-6 w-6 animate-spin" />
						}
					>
						Next: Complete
					</Button>
				</div>
			</div>
		</div>
	);
};
export default StoreStepThree;
