import useForm from '@themes/hooks/useForm';
import { ThemeComponentPropsType } from '@type/themeComponentType';
import { Button, Label, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const SingupForm: FC<ThemeComponentPropsType> = function (props) {
	const { handleChange, formState, formErrors } = useForm({
		formValidationError: props.hooks?.auth.register.error,
	});

	return (
		<>
			<section className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<img
						alt="Your Company"
						src={props.store.logo}
						className="mx-auto h-10 w-auto"
					/>
					<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
						Sing up your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<div className="space-y-6">
						<div className="flex flex-col gap-y-2">
							<Label htmlFor="name">Your name</Label>
							<TextInput
								id="name"
								name="name"
								placeholder="Enter your name"
								type="text"
								value={formState['name']}
								color={formErrors['name'] ? 'failure' : 'gray'}
								helperText={
									formErrors['name'] ? formErrors['name'][0] : false
								}
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-col gap-y-2">
							<Label htmlFor="email">Your email</Label>
							<TextInput
								id="email"
								name="email"
								placeholder="name@gmail.com"
								type="email"
								value={formState['email']}
								color={formErrors['email'] ? 'failure' : 'gray'}
								helperText={
									formErrors['email'] ? formErrors['email'][0] : false
								}
								onChange={handleChange}
							/>
						</div>

						<div className="flex flex-col gap-y-2">
							<Label htmlFor="password">Your password</Label>

							<TextInput
								id="password"
								name="password"
								placeholder="••••••••"
								value={formState['password']}
								color={formErrors['password'] ? 'failure' : 'gray'}
								helperText={
									formErrors['password'] ? formErrors['password'][0] : false
								}
								onChange={handleChange}
							/>
						</div>

						<div className="flex flex-col gap-y-2">
							<Label htmlFor="confirm_password">Comfirm Password</Label>

							<TextInput
								id="confirm_password"
								name="confirm_password"
								placeholder="••••••••"
								value={formState['confirm_password']}
								color={formErrors['confirm_password'] ? 'failure' : 'gray'}
								helperText={
									formErrors['confirm_password']
										? formErrors['confirm_password'][0]
										: false
								}
								onChange={handleChange}
							/>
						</div>

						{props.hooks?.auth.register.error?.message && (
							<p className="mt-2 text-sm text-red-600 dark:text-red-500">
								{props.hooks?.auth.register.error.message}
							</p>
						)}

						<div>
							<Button
								type="button"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								onClick={() => {
									if (props.hooks?.auth.register) {
										props.hooks.auth.register.submit({
											formData: {
												name: formState['name'],
												email: formState['email'],
												password: formState['password'],
												confirm_password: formState['confirm_password'],
                                                store_id: props.store.id
											},
											onSuccess: (data) => {
												console.log('from login form', data);
											},
										});
									}
								}}
								isProcessing={props.hooks?.auth.login.isLoading}
								processingLabel="Processing"
							>
								Sign Up
							</Button>
						</div>
					</div>

					{props.store.pages.find((page) => page.type.type === 'signin') && (
						<p className="mt-10 text-center text-sm/6 text-gray-500">
							Already a member?{' '}
							<Link
								to={
									props.store.pages.find((page) => page.type.type === 'signin')
										?.slug ?? '/signin'
								}
								className="font-semibold text-indigo-600 hover:text-indigo-500"
							>
								Login your account
							</Link>
						</p>
					)}
				</div>
			</section>
		</>
	);
};
export default SingupForm;
