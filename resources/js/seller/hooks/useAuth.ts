import { RoutePath } from "@seller/seller_env";
import {
    authApi,
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
    useVerifySocialMediaAuthenticationMutation,
    VerifySocialMediaAuthenticationPayload,
} from "@seller/store/reducers/authApi";
import { UserProfileType } from "@type/authType";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/store";
import useToast from "./useToast";

const useAuth = () => {
    const { toaster } = useToast(); // for showing toast messages
    const navigate = useNavigate();

    useFetchUserQuery(); // user query

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

    // login with facebook
    const [
        handleLoginWithFacebook,
        {
            isLoading: isLoginWithFacebookLoading,
            isError: isLoginWithFacebookError,
            error: loginWithFacebookError,
            data: loginWithFacebookData,
        },
    ] = authApi.endpoints.loginWithFacebook.useLazyQuery();
    const loginWithFacebook = () => {
        handleLoginWithFacebook().then((response) => {
            if (response.data?.status === 200) {
                const url = response?.data?.data?.auth_url;
                const validUrl = decodeURIComponent(url);
                window.open(validUrl, "_blank");
            }
        });
    };

    // login with google
    const [
        handleLoginWithGoogle,
        {
            isLoading: isLoginWithGoogleLoading,
            isError: isLoginWithGoogleError,
            error: loginWithGoogleError,
            data: loginWithGoogleData,
        },
    ] = authApi.endpoints.loginWithGoogle.useLazyQuery();
    const loginWithGoogle = () => {
        handleLoginWithGoogle().then((response) => {
            if (response.data?.status === 200) {
                const url = response?.data?.data?.auth_url;
                const validUrl = decodeURIComponent(url);
                window.open(validUrl, "_blank");
            }
        });
    };

    // verify social media authentication
    const [
        handleVerifySocialMediaAuthentication,
        {
            isLoading: isVerifySocialMediaAuthenticationLoading,
            isError: isVerifySocialMediaAuthenticationError,
            error: verifySocialMediaAuthenticationError,
            data: verifySocialMediaAuthenticationData,
        },
    ] = useVerifySocialMediaAuthenticationMutation();

    const verifySocialMediaAuthentication = ({
        formData,
        onSuccess,
    }: {
        formData: VerifySocialMediaAuthenticationPayload;
        onSuccess?: CallableFunction;
    }) => {
        handleVerifySocialMediaAuthentication(formData).then((response) => {
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
    }: {
        formData: UserUpdatePasswordPayloadType;
        onSuccess?: CallableFunction;
    }) => {
        handleUpdateUserPassword(formData).then((response) => {
            if (response.data?.status === 200) {
                navigate(
                    "/login?guidAlertMessage=Your password has been changed. Please login again."
                );
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
                toaster({
                    status: "success",
                    text: "Reset password link sent.",
                    description: "Please check your email inbox!",
                });
                navigate(RoutePath.ForgotPasswordSuccessPage.index());
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
                toaster({
                    status: "success",
                    text: "Password has been reset.",
                    description: "Please login again!",
                });
                navigate(
                    `/login?guidAlertMessage=Your password has been reset. Please login again.`
                );
            } else {
                toaster({
                    status: "error",
                    text: "Failed to reset password.",
                    description: "Token is invalid",
                });
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
        loginWithFacebook: {
            submit: loginWithFacebook,
            isLoading: isLoginWithFacebookLoading,
            isError: isLoginWithFacebookError,
            error: loginWithFacebookError,
            data: loginWithFacebookData,
        },
        loginWithGoogle: {
            submit: loginWithGoogle,
            isLoading: isLoginWithGoogleLoading,
            isError: isLoginWithGoogleError,
            error: loginWithGoogleError,
            data: loginWithGoogleData,
        },
        register: {
            submit: register,
            isLoading: isRegisterLoading,
            isError: isRegisterError,
            error: registerError,
            data: registerData,
        },
        verifySocialMediaAuthentication: {
            submit: verifySocialMediaAuthentication,
            isLoading: isVerifySocialMediaAuthenticationLoading,
            isError: isVerifySocialMediaAuthenticationError,
            error: verifySocialMediaAuthenticationError,
            data: verifySocialMediaAuthenticationData,
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
