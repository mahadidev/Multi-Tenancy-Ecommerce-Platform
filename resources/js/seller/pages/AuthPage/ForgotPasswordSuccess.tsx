import { RoutePath } from "@seller/seller_env";
import { Button, Card } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordSuccess: React.FC = () => {
    const navigate = useNavigate();
    return (
			<>
				<div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
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
						<div className="flex flex-col gap-2.5">
							<h2 className="text-2xl font-bold dark:text-white md:text-3xl">
								Password Reset Link Sent
							</h2>

							<p className="mb-3 text-gray-500 dark:text-gray-300">
								We've sent a password reset link to your email. Please check
								your inbox and follow the instructions to reset your password.
							</p>
						</div>

						<div className="mb-6">
							<Button
								type="button"
								size="lg"
								color="primary"
								theme={{ inner: { base: 'px-5 py-3' } }}
								className="w-full px-0 py-px sm:w-auto"
								onClick={() => {
									navigate(RoutePath.LoginPage.index());
								}}
							>
								Back to Login
							</Button>
						</div>
					</Card>
				</div>
			</>
		);
};

export default ForgotPasswordSuccess;
