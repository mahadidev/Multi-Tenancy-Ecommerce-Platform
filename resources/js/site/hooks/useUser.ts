import { useFetchUserProfileQuery } from '@site/store/reducers/userApi';
import { useAppSelector } from '@site/store/store';

const useUser = () => {
	// select state
	const { userProfileData, user, accessToken } = useAppSelector(
		(state) => state.auth
	);

	// fetch profile
	useFetchUserProfileQuery();

	return {
		userProfileData,
		user,
		accessToken,
	};
};
export default useUser;
