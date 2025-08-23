import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { setSidebarCollapsed } from '@seller/store/slices/uiSlice';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
  initialCollapsed?: boolean;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ 
  children, 
  initialCollapsed = false 
}) => {
  const dispatch = useAppDispatch();
  const { sidebar } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (initialCollapsed !== sidebar.desktop.isCollapsed) {
      dispatch(setSidebarCollapsed(initialCollapsed));
    }
  }, [initialCollapsed, sidebar.desktop.isCollapsed, dispatch]);

  const toggleSidebar = () => {
    dispatch(setSidebarCollapsed(!sidebar.desktop.isCollapsed));
  };

  const setCollapsed = (collapsed: boolean) => {
    dispatch(setSidebarCollapsed(collapsed));
  };

  const setIsOpenMobile = (_: boolean) => {
    // You can implement mobile toggle if needed
  };

  const contextValue: SidebarContextType = {
    isCollapsed: sidebar.desktop.isCollapsed,
    toggleSidebar,
    setCollapsed,
    isOpenMobile: sidebar.mobile.isOpenMobile,
    setIsOpenMobile,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext;