import { ThemeComponentPropsType } from '@type/themeComponentType';
import { Button } from 'flowbite-react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard: FC<ThemeComponentPropsType> = (props) => {
	const navigate = useNavigate();

	let user = null;
    let logOut = null;
	let userProfileData = null;

	if (props.hooks) {
		const useAuth = props.hooks.useAuth();
		user = useAuth.user;
		logOut = useAuth.logOut;

		const useUser = props.hooks.useUser();
        userProfileData = useUser.userProfileData;

	}

	return (
		<section className="py-16 bg-gray-100">
			<div className="container mx-auto">
				<h2>Welcome {user?.name}</h2>
				<p>{userProfileData?.email}</p>

				<Button
					onClick={() => {
						if (logOut) {
							logOut.submit({
								onSuccess: () => {
									navigate('/');
								},
							});
						}
					}}
					isProcessing={logOut?.isLoading}
					processingLabel="Logging Out"
				>
					Log out here
				</Button>
			</div>
		</section>
	);
};
export default ProfileCard;
