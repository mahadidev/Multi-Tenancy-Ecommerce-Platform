import React from 'react';
import { ThemeActions } from './index';
import { CartActionsImpl } from './Cart';
import { AuthActionsImpl } from './Auth';
import { ActionContext } from './context';

export interface ActionProviderProps {
  children: React.ReactNode;
  actions?: ThemeActions;
}

/**
 * ActionProvider - Provides actions to all child components
 * 
 * In development/demo: Uses default implementations
 * In production: Website-renderer provides real implementations
 */
export const ActionProvider: React.FC<ActionProviderProps> = ({
  children,
  actions
}) => {
  // Use provided actions or fall back to demo implementations
  const themeActions = React.useMemo(() => {
    return actions || {
      cart: new CartActionsImpl(),
      auth: new AuthActionsImpl()
    };
  }, [actions]);

  return (
    <ActionContext.Provider value={themeActions}>
      {children}
    </ActionContext.Provider>
  );
};

