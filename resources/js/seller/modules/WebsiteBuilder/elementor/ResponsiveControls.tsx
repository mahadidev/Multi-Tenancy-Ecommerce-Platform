import React, { useState } from 'react';
import { ResponsiveBreakpoint, ResponsiveSettings } from './ElementorBuilder';

interface ResponsiveControlsProps<T> {
  label: string;
  settings: ResponsiveSettings<T>;
  currentBreakpoint: ResponsiveBreakpoint;
  onUpdate: (breakpoint: ResponsiveBreakpoint, updates: Partial<T>) => void;
  onBreakpointChange?: (breakpoint: ResponsiveBreakpoint) => void;
  renderControls: (
    values: T, 
    onChange: (updates: Partial<T>) => void,
    breakpoint: ResponsiveBreakpoint
  ) => React.ReactNode;
}

export function ResponsiveControls<T>({
  label,
  settings,
  currentBreakpoint,
  onUpdate,
  onBreakpointChange,
  renderControls
}: ResponsiveControlsProps<T>) {
  const [activeBreakpoint, setActiveBreakpoint] = useState<ResponsiveBreakpoint>(currentBreakpoint);

  // Sync activeBreakpoint with currentBreakpoint when it changes
  React.useEffect(() => {
    setActiveBreakpoint(currentBreakpoint);
  }, [currentBreakpoint]);

  // Get merged values for current breakpoint
  const getCurrentValues = (breakpoint: ResponsiveBreakpoint): T => {
    // Ensure settings has desktop as fallback
    if (!settings?.desktop) {
      console.error('ResponsiveControls: settings.desktop is missing', { settings, breakpoint });
      return {} as T;
    }
    
    let values: T;
    if (breakpoint === 'desktop') {
      values = settings.desktop;
    } else if (breakpoint === 'tablet' && settings.tablet) {
      values = { ...settings.desktop, ...settings.tablet } as T;
    } else if (breakpoint === 'mobile' && settings.mobile) {
      values = { ...settings.desktop, ...settings.mobile } as T;
    } else {
      values = settings.desktop;
    }
    
    
    return values;
  };

  const currentValues = getCurrentValues(activeBreakpoint);

  const handleChange = (updates: Partial<T>) => {
    onUpdate(activeBreakpoint, updates);
  };

  const breakpoints: { key: ResponsiveBreakpoint; label: string; icon: React.ReactNode }[] = [
    {
      key: 'desktop',
      label: 'Desktop',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="4" width="20" height="12" rx="2" ry="2" strokeWidth="2" />
          <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2" />
          <line x1="12" y1="16" x2="12" y2="20" strokeWidth="2" />
        </svg>
      )
    },
    {
      key: 'tablet',
      label: 'Tablet',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
        </svg>
      )
    },
    {
      key: 'mobile',
      label: 'Mobile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-3">
      {/* Header with breakpoint selector */}
      <div className="flex items-center justify-between min-w-0">
        <h3 className="text-xs font-medium text-gray-900 truncate">{label}</h3>
        <div className="flex bg-gray-100 rounded p-0.5 ml-2 flex-shrink-0">
          {breakpoints.map((bp) => (
            <button
              key={bp.key}
              onClick={() => {
                setActiveBreakpoint(bp.key);
                onBreakpointChange?.(bp.key);
              }}
              className={`flex items-center justify-center w-6 h-6 rounded text-xs font-medium transition-colors ${
                activeBreakpoint === bp.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title={bp.label}
            >
              {bp.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive indicator */}
      {activeBreakpoint !== 'desktop' && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="truncate">Editing {activeBreakpoint} view</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {renderControls(currentValues, handleChange, activeBreakpoint)}
      </div>
    </div>
  );
}

// Helper components for common responsive controls
export const ResponsiveNumberInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-700 block">{label}</label>
    <div className="flex items-center space-x-2">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {suffix && <span className="text-xs text-gray-500 flex-shrink-0">{suffix}</span>}
    </div>
  </div>
);

export const ResponsiveToggle = ({
  label,
  value,
  onChange
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between">
    <label className="text-xs font-medium text-gray-700 flex-1">{label}</label>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ml-2 flex-shrink-0 ${
        value ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export const ResponsiveSelect = ({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-700 block">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);