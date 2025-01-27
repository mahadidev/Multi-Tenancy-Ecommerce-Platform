import { UserProfileType } from "@/types/authType";
import {
    LoginPayloadType,
    RegisterPayloadType,
    useFetchUserQuery,
    useLoginMutation,
    useLogOutMutation,
    useRegisterMutation,
    useUpdateUserMutation,
} from "@seller/store/reducers/authApi";
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

    // login
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
        handleUpdate,
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
        handleUpdate(formData).then((response) => {
            if (response.data?.status === 200) {
                if (onSuccess) {
                    onSuccess(response.data.data);
                    Toast({ title: "Profile updated successfully" });
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
    };
};

export default useAuth;
