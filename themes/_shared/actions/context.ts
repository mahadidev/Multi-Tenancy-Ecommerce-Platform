import { createContext } from 'react';
import { ThemeActions } from './index';

export const ActionContext = createContext<ThemeActions | null>(null);