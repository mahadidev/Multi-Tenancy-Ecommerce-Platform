import { useAppDispatch } from "@/seller/store";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../env";
import { authApi } from "../store/reducers/authApi";
import { storeApi } from "../store/reducers/storeApi";
import { removeAuth } from "../store/slices/authSlice";
import { removeStore } from "../store/slices/storeSlice";

const useAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loggedOut = () => {
        dispatch(removeAuth());
        dispatch(removeStore());
        dispatch(storeApi.util.resetApiState());
        dispatch(authApi.util.resetApiState());
        navigate(RoutePath.login);
    };

    return {
        loggedOut,
    };
};

export default useAuth;
