import { useAppDispatch, useAppSelector } from "@/seller/store";
import {
    setInSidebarCollapsed as onInSidebarCollapsed,
    setSidebarCollapsed as onSidebarCollapsed,
} from "@/seller/store/slices/baseSlice";

const useBase = () => {
    const dispatch = useAppDispatch();
    const { inSidebar } = useAppSelector((state) => state.base);

    const setSidebarCollapsed = (isCollapsed: boolean) => {
        dispatch(onSidebarCollapsed(!isCollapsed));
    };

    const setInSidebarCollapsed = (isCollapsed: boolean) => {
        dispatch(onInSidebarCollapsed(!isCollapsed));
    };

    return {
        setSidebarCollapsed,
        setInSidebarCollapsed,
        inSidebar,
    };
};

export default useBase;
