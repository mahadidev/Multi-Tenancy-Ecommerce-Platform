import {
    LoginPayloadType,
    RegisterPayloadType,
    useFetchUserQuery,
    useLoginMutation,
    useLogOutMutation,
    useRegisterMutation,
    UserUpdatePasswordPayloadType,
    useUpdateUserMutation,
    useUpdateUserPasswordMutation,
} from "@seller/store/reducers/authApi";
import { UserProfileType } from "@type/authType";
import { Toast } from "flowbite-react";
import { useAppSelector } from "../store/store";

const useAuth = () => {
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
                    console.log(response.data.data);
                    Toast({ title: "Profile updated successfully" });
                }
            }
        });
    };

    // send reset request
    const [
        handlePasswordResetRequest,
        {
            isLoading: isPasswordResetRequestLoading,
            isError: isPasswordResetRequestError,
            error: passwordResetRequestError,
            data: passwordResetRequestData,
        },
    ] = useLoginMutation();
    const passwordResetRequest = ({
        formData,
        onSuccess,
    }: {
        formData: LoginPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handlePasswordResetRequest(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            }
        });
    };
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
        passwordResetRequest: {
            submit: passwordResetRequest,
            isLoading: isPasswordResetRequestLoading,
            isError: isPasswordResetRequestError,
            error: passwordResetRequestError,
            data: passwordResetRequestData,
        },
    };
};

export default useAuth;
