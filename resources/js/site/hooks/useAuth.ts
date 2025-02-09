import {
    LoginPayloadType,
    RegisterPayloadType,
    useLoginMutation,
    useLogOutMutation,
    useRegisterMutation,
} from '@site/store/reducers/authApi';
import { useAppSelector } from '@site/store/store';

const useAuth = () => {
	// select user
	const { user } = useAppSelector((state) => state.auth);

	// sing in
	const [
		handleLogin,
		{
			isLoading: isLoginLoading,
			error: loginError,
			data: loginData,
			isSuccess: isLoginSuccess,
		},
	] = useLoginMutation();
	const login = ({
		formData,
		onSuccess,
	}: {
		formData: LoginPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleLogin(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data);
				}
			}
		});
	};

	// sing up
	const [
		handleRegister,
		{
			isLoading: isRegisterLoading,
			error: registerError,
			data: registerData,
			isSuccess: isRegisterSuccess,
		},
	] = useRegisterMutation();
	const register = ({
		formData,
		onSuccess,
	}: {
		formData: RegisterPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleRegister(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data);
				}
			}
		});
	};

	// logout
	const [
		handleLogOut,
		{
			isLoading: isLogOutLoading,
			isSuccess: isLogOutSuccess,
            error: logOutError,
			data: logOutData,
		},
	] = useLogOutMutation();
	const logOut = ({ onSuccess }: { onSuccess?: CallableFunction }) => {
		handleLogOut().then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	return {
		user: user,
		login: {
			submit: login,
			isLoading: isLoginLoading,
			error: loginError,
			data: loginData,
			isSuccess: isLoginSuccess,
		},
		register: {
			submit: register,
			isLoading: isRegisterLoading,
			error: registerError,
			data: registerData,
			isSuccess: isRegisterSuccess,
		},
		logOut: {
			submit: logOut,
			isLoading: isLogOutLoading,
			error: logOutError,
			data: logOutData,
			isSuccess: isLogOutSuccess,
		},
	};
};
export default useAuth;
