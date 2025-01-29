import {
    LoginPayloadType,
    PasswordForgotRequestPayloadType,
    RegisterPayloadType,
    ResetPasswordPayloadType,
    useFetchUserQuery,
    useForgotPasswordRequestMutation,
    useLoginMutation,
    useLogOutMutation,
    useRegisterMutation,
    useResetPasswordMutation,
    UserUpdatePasswordPayloadType,
    useUpdateUserMutation,
    useUpdateUserPasswordMutation,
} from "@seller/store/reducers/authApi";
import { UserProfileType } from "@type/authType";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/store";

const useAuth = () => {
    const navigate = useNavigate();
    useFetchUserQuery();
    // select user
    const { userProfileData } = useAppSelector((state) => state.auth);

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

    // logout
    const [
        handleLogOut,
        {
            isLoading: isLogOutLoading,
            isError: isLogOutError,
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

    // update user profile
    const [
        handleUpdateUser,
        {
            isLoading: isUpdateLoading,
            isError: isUpdateError,
            error: updateError,
            data: updateData,
        },
    ] = useUpdateUserMutation();
    const update = ({
        formData,
        onSuccess,
    }: {
        formData: UserProfileType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateUser(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };

    // update user password
    const [
        handleUpdateUserPassword,
        {
            isLoading: isUpdatePasswordLoading,
            isError: isUpdatePasswordError,
            error: updatePasswordError,
            data: updatePasswordData,
        },
    ] = useUpdateUserPasswordMutation();
    const updatePassword = ({
        formData,
        onSuccess,
    }: {
        formData: UserUpdatePasswordPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateUserPassword(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                    navigate("/login");
                }
            }
        });
    };

    // send forgot password request
    const [
        handleForgotPasswordRequest,
        {
            isLoading: isForgotPasswordRequestLoading,
            isError: isForgotPasswordRequestError,
            error: forgotPasswordRequestError,
            data: forgotPasswordRequestData,
        },
    ] = useForgotPasswordRequestMutation();
    const forgotPasswordRequest = ({
        formData,
    }: {
        formData: PasswordForgotRequestPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleForgotPasswordRequest(formData).then((response) => {
            if (response.data?.status === 200) {
                navigate(
                    `/reset-password?email=${response?.data?.data?.email}&token=${response?.data?.data?.token}`
                );
            }
        });
    };

    // reset password
    const [
        handleResetPassword,
        {
            isLoading: isResetPasswordLoading,
            isError: isResetPasswordError,
            error: resetPasswordError,
            data: resetPasswordData,
        },
    ] = useResetPasswordMutation();
    const resetPassword = ({
        formData,
    }: {
        formData: ResetPasswordPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleResetPassword(formData).then((response) => {
            if (response.data?.status === 200) {
                navigate(`/login`);
            }
        });
    };

    // return from here
    return {
        userProfileData,
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
            data: logOutData,
        },
        update: {
            submit: update,
            isLoading: isUpdateLoading,
            isError: isUpdateError,
            error: updateError,
            data: updateData,
        },
        updatePassword: {
            submit: updatePassword,
            isLoading: isUpdatePasswordLoading,
            isError: isUpdatePasswordError,
            error: updatePasswordError,
            data: updatePasswordData,
        },
        forgotPasswordRequest: {
            submit: forgotPasswordRequest,
            isLoading: isForgotPasswordRequestLoading,
            isError: isForgotPasswordRequestError,
            error: forgotPasswordRequestError,
            data: forgotPasswordRequestData,
        },
        resetPassword: {
            submit: resetPassword,
            isLoading: isResetPasswordLoading,
            isError: isResetPasswordError,
            error: resetPasswordError,
            data: resetPasswordData,
        },
    };
};

export default useAuth;
