import {
    authApi,
    LoginPayloadType,
    RegisterPayloadType,
    useLoginUserMutation,
    useRegisterUserMutation,
} from "@/seller/store/reducers/authApi";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../env";
import { useAppDispatch } from "../store";
import { storeApi } from "../store/reducers/storeApi";
import { removeAuth, setAuth } from "../store/slices/authSlice";
import { removeStore, setStoreResponse } from "../store/slices/storeSlice";

const useAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [onLogin, { isLoading: isLoginLoading, error: isLoginError }] =
        useLoginUserMutation();
    const [
        onRegister,
        { isLoading: isRegisterLoading, error: isRegisterError },
    ] = useRegisterUserMutation();

    const login = (props: LoginPayloadType) => {
        onLogin(props).then((response: any) => {
            if (response.data.status === 200) {
                dispatch(
                    setAuth({
                        access_token: response.data.data.access_token,
                        token_type: response.data.data.token_type,
                        user: response.data.data.user,
                    })
                );
                if (response.data.data.logged_store) {
                    dispatch(
                        setStoreResponse({
                            stores: response.data.data.user.stores,
                            currentStore: response.data.data.logged_store,
                        })
                    );
                    navigate(RoutePath.dashboard);
                } else {
                    navigate(RoutePath.storeOnboard);
                }
            }
        });
    };

    const register = (props: RegisterPayloadType) => {
        onRegister(props).then((response: any) => {
            if (response.data.status === 200) {
                navigate(RoutePath.storeOnboard);
            }
        });
    };

    const loggedOut = () => {
        dispatch(removeAuth());
        dispatch(removeStore());
        dispatch(storeApi.util.resetApiState());
        dispatch(authApi.util.resetApiState());
        navigate(RoutePath.login);
    };

    return {
        loggedOut,
        login,
        isLoginLoading,
        isLoginError,
        register,
        isRegisterLoading,
        isRegisterError,
    };
};

export default useAuth;
