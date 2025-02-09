import useForm from '@themes/hooks/useForm';
import { ThemeComponentPropsType } from '@type/themeComponentType';
import { Button, Label, TextInput } from 'flowbite-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const LoginForm: FC<ThemeComponentPropsType> = function (props) {
	let login = null;

	if (props.hooks) {
		const auth = props.hooks.useAuth();
		login = auth.login;
	}

	const { handleChange, formState, formErrors } = useForm({
		formValidationError: login?.error,
	});

	return (
		<>
			<section className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100">
				{login?.isSuccess ? (
					<>
						<h1>Login Successful.</h1>
					</>
				) : (
					<>
						<div className="sm:mx-auto sm:w-full sm:max-w-sm">
							<img
								alt="Your Company"
								src={props.store.logo}
								className="mx-auto h-10 w-auto"
							/>
							<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
								Sign in to your account
							</h2>
						</div>

						<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
							<div className="space-y-6">
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

								{login?.error?.message && (
									<p className="mt-2 text-sm text-red-600 dark:text-red-500">
										{login?.error.message}
									</p>
								)}

								<div>
									<Button
										type="button"
										className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
										onClick={() => {
											if (login) {
												login.submit({
													formData: {
														email: formState['email'],
														password: formState['password'],
														store_id: props.store.id,
													},
													onSuccess: (data) => {
														console.log('from login form', data);
													},
												});
											}
										}}
										isProcessing={login?.isLoading}
										processingLabel="Processing"
									>
										Sign in
									</Button>
								</div>
							</div>

							{props.store.pages.find(
								(page) => page.type.type === 'singup'
							) && (
								<p className="mt-10 text-center text-sm/6 text-gray-500">
									Not a member?{' '}
									<Link
										to={
											props.store.pages.find(
												(page) => page.type.type === 'singup'
											)?.slug ?? '/singup'
										}
										className="font-semibold text-indigo-600 hover:text-indigo-500"
									>
										Create a free account
									</Link>
								</p>
							)}
						</div>
					</>
				)}
			</section>
		</>
	);
};
export default LoginForm;
