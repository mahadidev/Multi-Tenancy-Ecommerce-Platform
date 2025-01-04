import { useAppDispatch, useAppSelector } from "@/seller/store";
import {
    setIsOpenMobile,
    setSidebarCollapsed,
    toggleIsOpenMobile,
} from "@/seller/store/slices/baseSlice";
import type { PropsWithChildren } from "react";
import { createContext } from "react";

interface SidebarContextProps {
    desktop: {
        isCollapsed: boolean;
        setCollapsed(value: boolean): void;
        toggle(): void;
    };
    mobile: {
        isOpen: boolean;
        close(): void;
        toggle(): void;
    };
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function SidebarProvider({
    children,
}: PropsWithChildren<{ initialCollapsed: boolean }>) {
    const { isOpenMobile } = useAppSelector(
        (state) => state.base.sidebar.mobile
    );
    const { isCollapsed } = useAppSelector(
        (state) => state.base.sidebar.desktop
    );
    const dispatch = useAppDispatch();

    function handleSetCollapsed(value: boolean) {
        dispatch(setSidebarCollapsed(value));
    }

    function handleIsOpenMobile(value: boolean) {
        dispatch(setIsOpenMobile(value));
    }

    function handleToggleIsOpenMobile() {
        dispatch(toggleIsOpenMobile());
    }

    return (
        <SidebarContext.Provider
            value={{
                desktop: {
                    isCollapsed,
                    setCollapsed: handleSetCollapsed,
                    toggle: () => handleSetCollapsed(!isCollapsed),
                },
                mobile: {
                    isOpen: isOpenMobile,
                    close: () => handleIsOpenMobile(false),
                    toggle: () => handleToggleIsOpenMobile,
                },
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}
