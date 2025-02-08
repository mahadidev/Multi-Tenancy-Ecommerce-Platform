import { LoginPayloadType, RegisterPayloadType, useLoginMutation, useRegisterMutation } from '@site/store/reducers/authApi';

const useAuth = () => {
	// sing in
	const [
		handleLogin,
		{ isLoading: isLoginLoading, error: loginError, data: loginData },
	] = useLoginMutation();
	const login = ({
		formData,
		onSuccess,
	}: {
		formData: LoginPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleLogin(formData).then((response) => {
			console.log('login re', response);
			if (onSuccess) {
				onSuccess();
			}
		});
	};

	// sing up
	const [
		handleRegister,
		{ isLoading: isRegisterLoading, error: registerError, data: registerData },
	] = useRegisterMutation();
	const register = ({
		formData,
		onSuccess,
	}: {
		formData: RegisterPayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleRegister(formData).then((response) => {
			console.log('login re', response);
			if (onSuccess) {
				onSuccess();
			}
		});
	};

	return {
		login: {
			submit: login,
			isLoading: isLoginLoading,
			error: loginError,
			data: loginData,
		},
		register: {
			submit: register,
			isLoading: isRegisterLoading,
			error: registerError,
			data: registerData,
		},
	};
};
export default useAuth;
