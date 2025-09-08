import type { ResponsiveSettings, ResponsiveBreakpoint } from '../elementor/ElementorBuilder';

export function getResponsiveValue<T>(
  settings: ResponsiveSettings<T>, 
  fallbackValue: T,
  device: ResponsiveBreakpoint
): T {
  if (device === 'mobile' && settings.mobile) {
    return { ...settings.desktop, ...settings.mobile } as T;
  } else if (device === 'tablet' && settings.tablet) {
    return { ...settings.desktop, ...settings.tablet } as T;
  }
  
  return settings.desktop || fallbackValue;
}

export function updateResponsiveSetting<T>(
  currentSettings: ResponsiveSettings<T>,
  breakpoint: ResponsiveBreakpoint,
  updates: Partial<T>
): ResponsiveSettings<T> {
  if (breakpoint === 'desktop') {
    return {
      ...currentSettings,
      desktop: { ...currentSettings.desktop, ...updates }
    };
  } else {
    const currentBreakpointSettings = currentSettings[breakpoint] || {};
    return {
      ...currentSettings,
      [breakpoint]: { ...currentBreakpointSettings, ...updates }
    };
  }
}

export function ensureResponsiveFormat<T extends object>(
  settings: any, 
  defaultValues: T
): ResponsiveSettings<T> {
  if (settings && settings.desktop) {
    return settings as ResponsiveSettings<T>;
  }
  
  return {
    desktop: { ...defaultValues, ...settings }
  };
}