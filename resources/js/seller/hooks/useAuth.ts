import {
    LoginPayloadType,
    RegisterPayloadType,
    useLoginMutation,
    useLogOutMutation,
    useRegisterMutation,
} from '@seller/store/reducers/authApi';

const useAuth = () => {
	// login
	const [
		handleLogin,
		{
			isLoading: isLoginLoading,
			isError: isLoginError,
			error: loginError,
			data: loginData,
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
					onSuccess(response.data.data);
				}
			}
		});
	};

	// register
	const [
		handleRegister,
		{
			isLoading: isRegisterLoading,
			isError: isRegisterError,
			error: registerError,
			data: registerData,
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
					onSuccess(response.data.data);
				}
			}
		});
	};

	// login
	const [
		handleLogOut,
		{
			isLoading: isLogOutLoading,
			isError: isLogOutError,
			data: logOutData,
		},
	] = useLogOutMutation();
	const logOut = ({
		onSuccess,
	}: {
		onSuccess?: CallableFunction;
	}) => {
		handleLogOut().then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	return {
		login: {
			submit: login,
			isLoading: isLoginLoading,
			isError: isLoginError,
			error: loginError,
			data: loginData,
		},
		register: {
			submit: register,
			isLoading: isRegisterLoading,
			isError: isRegisterError,
			error: registerError,
			data: registerData,
		},
        logOut: {
            submit: logOut,
            isLoading: isLogOutLoading,
            isError: isLogOutError,
            error: isLogOutError,
            data: logOutData
        }
	};
};

export default useAuth;
