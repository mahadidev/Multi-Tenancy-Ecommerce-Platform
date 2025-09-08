import React, { useState } from 'react';
import { ElementorSection, ElementorColumn, ElementorWidget, ResponsiveBreakpoint, ResponsiveSettings, SectionSettings, ColumnSettings } from './ElementorBuilder';
import { ResponsiveControls, ResponsiveNumberInput, ResponsiveToggle, ResponsiveSelect } from './ResponsiveControls';
import { websiteBuilderApi } from '../store/websiteBuilderApi';

interface ElementorSettingsPanelProps {
  selectedElement: {
    type: 'section' | 'column' | 'widget';
    id: string;
  };
  sections: ElementorSection[];
  onUpdateSettings: (settings: any) => void;
  onClose: () => void;
  onDelete?: () => void;
  onClearSection?: (sectionId: string) => void;
  activeTab?: string;
  currentBreakpoint?: ResponsiveBreakpoint;
  updateResponsiveSetting?: <T>(
    currentSettings: ResponsiveSettings<T>,
    breakpoint: ResponsiveBreakpoint,
    updates: Partial<T>
  ) => ResponsiveSettings<T>;
  onBreakpointChange?: (breakpoint: ResponsiveBreakpoint) => void;
  websiteId?: number;
}

interface SettingTabProps {
  id: string;
  label: string;
  icon: JSX.Element;
  isActive: boolean;
  onClick: () => void;
}

const SettingTab = ({ id, label, icon, isActive, onClick }: SettingTabProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-16 border-b-2 transition-all duration-200 ${
      isActive
        ? 'border-blue-500 text-blue-600 bg-gradient-to-t from-blue-50 to-purple-50'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }`}
    title={label}
  >
    <div className="text-lg mb-1">{icon}</div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

interface ControlGroupProps {
  title: string;
  children: React.ReactNode;
}

const ControlGroup = ({ title, children }: ControlGroupProps) => (
  <div className="mb-6">
    <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">{title}</h4>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput = ({ label, value, onChange, placeholder }: TextInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
    />
  </div>
);

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

const SelectInput = ({ label, value, onChange, options, disabled = false }: SelectInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput = ({ label, value, onChange }: ColorInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
    </div>
  </div>
);

interface RangeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

const RangeInput = ({ label, value, onChange, min, max, step = 1, unit = 'px' }: RangeInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} ({value}{unit})
    </label>
    <div className="flex items-center space-x-3">
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
        min={min}
        max={max}
        step={step}
      />
    </div>
  </div>
);

interface ToggleInputProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleInput = ({ label, value, onChange }: ToggleInputProps) => (
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
        value ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

interface CategorizedStylePanelProps {
  settings: any;
  onUpdateSettings: (settings: any) => void;
  responsive?: boolean;
  currentBreakpoint?: ResponsiveBreakpoint;
}

interface StyleCategory {
  id: string;
  name: string;
  icon: string;
  items: StyleItem[];
}

interface StyleItem {
  id: string;
  label: string;
  type: 'color' | 'text' | 'select' | 'range' | 'toggle' | 'spacing' | 'shadow';
  property: string;
  value?: string | number | boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { value: string; label: string }[];
  subItems?: StyleItem[];
}

const CategorizedStylePanel = ({ settings, onUpdateSettings, responsive = false, currentBreakpoint = 'desktop' }: CategorizedStylePanelProps) => {
  const [openSection, setOpenSection] = useState<string | null>('background'); // Only one section open at a time

  const toggleSection = (sectionId: string) => {
    setOpenSection(prev => 
      prev === sectionId ? null : sectionId // Close if same section, otherwise open the new one
    );
  };

  const styleCategories: StyleCategory[] = [
    {
      id: 'background',
      name: 'Background',
      icon: '🎨',
      items: [
        { id: 'bg-color', label: 'Color', type: 'color', property: 'backgroundColor', value: settings.backgroundColor || '#ffffff' },
        { id: 'bg-image', label: 'Image', type: 'text', property: 'backgroundImage', value: settings.backgroundImage || '', placeholder: 'URL or gradient' },
        { id: 'bg-size', label: 'Size', type: 'select', property: 'backgroundSize', value: settings.backgroundSize || 'cover',
          options: [
            { value: 'auto', label: 'Auto' },
            { value: 'cover', label: 'Cover' },
            { value: 'contain', label: 'Contain' },
            { value: '100%', label: '100%' }
          ]
        },
        { id: 'bg-position', label: 'Position', type: 'select', property: 'backgroundPosition', value: settings.backgroundPosition || 'center center',
          options: [
            { value: 'left top', label: 'Left Top' },
            { value: 'left center', label: 'Left Center' },
            { value: 'left bottom', label: 'Left Bottom' },
            { value: 'center top', label: 'Center Top' },
            { value: 'center center', label: 'Center Center' },
            { value: 'center bottom', label: 'Center Bottom' },
            { value: 'right top', label: 'Right Top' },
            { value: 'right center', label: 'Right Center' },
            { value: 'right bottom', label: 'Right Bottom' }
          ]
        },
        { id: 'bg-repeat', label: 'Repeat', type: 'select', property: 'backgroundRepeat', value: settings.backgroundRepeat || 'no-repeat',
          options: [
            { value: 'no-repeat', label: 'No Repeat' },
            { value: 'repeat', label: 'Repeat' },
            { value: 'repeat-x', label: 'Repeat X' },
            { value: 'repeat-y', label: 'Repeat Y' }
          ]
        },
        { id: 'bg-attachment', label: 'Attachment', type: 'select', property: 'backgroundAttachment', value: settings.backgroundAttachment || 'scroll',
          options: [
            { value: 'scroll', label: 'Scroll' },
            { value: 'fixed', label: 'Fixed' },
            { value: 'local', label: 'Local' }
          ]
        }
      ]
    },
    {
      id: 'layout',
      name: 'Layout',
      icon: '📐',
      items: [
        { id: 'width', label: 'Width', type: 'text', property: 'width', value: settings.width || 'auto', placeholder: 'auto, 100%, 200px' },
        { id: 'height', label: 'Height', type: 'text', property: 'height', value: settings.height || 'auto', placeholder: 'auto, 100%, 200px' },
        { id: 'min-width', label: 'Min Width', type: 'text', property: 'minWidth', value: settings.minWidth || '', placeholder: '0, 100px' },
        { id: 'min-height', label: 'Min Height', type: 'text', property: 'minHeight', value: settings.minHeight || '', placeholder: '0, 100px' },
        { id: 'max-width', label: 'Max Width', type: 'text', property: 'maxWidth', value: settings.maxWidth || '', placeholder: 'none, 100%' },
        { id: 'max-height', label: 'Max Height', type: 'text', property: 'maxHeight', value: settings.maxHeight || '', placeholder: 'none, 100%' },
        { id: 'display', label: 'Display', type: 'select', property: 'display', value: settings.display || 'block',
          options: [
            { value: 'block', label: 'Block' },
            { value: 'inline', label: 'Inline' },
            { value: 'inline-block', label: 'Inline Block' },
            { value: 'flex', label: 'Flex' },
            { value: 'grid', label: 'Grid' },
            { value: 'none', label: 'None' }
          ]
        },
        { id: 'overflow', label: 'Overflow', type: 'select', property: 'overflow', value: settings.overflow || 'visible',
          options: [
            { value: 'visible', label: 'Visible' },
            { value: 'hidden', label: 'Hidden' },
            { value: 'scroll', label: 'Scroll' },
            { value: 'auto', label: 'Auto' }
          ]
        }
      ]
    },
    {
      id: 'spacing',
      name: 'Spacing',
      icon: '📏',
      items: [
        { id: 'padding', label: 'Padding', type: 'spacing', property: 'padding', value: settings.padding || '0' },
        { id: 'margin', label: 'Margin', type: 'spacing', property: 'margin', value: settings.margin || '0' }
      ]
    },
    {
      id: 'border',
      name: 'Border',
      icon: '⬜',
      items: [
        { id: 'border-width', label: 'Width', type: 'text', property: 'borderWidth', value: settings.borderWidth || '0', placeholder: '1px, 2px 4px' },
        { id: 'border-style', label: 'Style', type: 'select', property: 'borderStyle', value: settings.borderStyle || 'solid',
          options: [
            { value: 'none', label: 'None' },
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'double', label: 'Double' }
          ]
        },
        { id: 'border-color', label: 'Color', type: 'color', property: 'borderColor', value: settings.borderColor || '#000000' },
        { id: 'border-radius', label: 'Radius', type: 'text', property: 'borderRadius', value: settings.borderRadius || '0', placeholder: '4px, 50%' }
      ]
    },
    {
      id: 'typography',
      name: 'Typography',
      icon: '📝',
      items: [
        { id: 'font-family', label: 'Font Family', type: 'text', property: 'fontFamily', value: settings.fontFamily || '', placeholder: 'Arial, sans-serif' },
        { id: 'font-size', label: 'Size', type: 'text', property: 'fontSize', value: settings.fontSize || '16px', placeholder: '16px, 1.2em' },
        { id: 'font-weight', label: 'Weight', type: 'select', property: 'fontWeight', value: settings.fontWeight || 'normal',
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'bold', label: 'Bold' },
            { value: '100', label: '100' },
            { value: '200', label: '200' },
            { value: '300', label: '300' },
            { value: '400', label: '400' },
            { value: '500', label: '500' },
            { value: '600', label: '600' },
            { value: '700', label: '700' },
            { value: '800', label: '800' },
            { value: '900', label: '900' }
          ]
        },
        { id: 'line-height', label: 'Line Height', type: 'text', property: 'lineHeight', value: settings.lineHeight || 'normal', placeholder: '1.4, 20px' },
        { id: 'letter-spacing', label: 'Letter Spacing', type: 'text', property: 'letterSpacing', value: settings.letterSpacing || 'normal', placeholder: '1px, 0.1em' },
        { id: 'text-align', label: 'Align', type: 'select', property: 'textAlign', value: settings.textAlign || 'left',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
            { value: 'justify', label: 'Justify' }
          ]
        },
        { id: 'color', label: 'Color', type: 'color', property: 'color', value: settings.color || '#000000' },
        { id: 'text-decoration', label: 'Decoration', type: 'select', property: 'textDecoration', value: settings.textDecoration || 'none',
          options: [
            { value: 'none', label: 'None' },
            { value: 'underline', label: 'Underline' },
            { value: 'line-through', label: 'Line Through' },
            { value: 'overline', label: 'Overline' }
          ]
        },
        { id: 'text-transform', label: 'Transform', type: 'select', property: 'textTransform', value: settings.textTransform || 'none',
          options: [
            { value: 'none', label: 'None' },
            { value: 'uppercase', label: 'Uppercase' },
            { value: 'lowercase', label: 'Lowercase' },
            { value: 'capitalize', label: 'Capitalize' }
          ]
        }
      ]
    },
    {
      id: 'effects',
      name: 'Effects',
      icon: '✨',
      items: [
        { id: 'opacity', label: 'Opacity', type: 'range', property: 'opacity', value: parseFloat(settings.opacity || '1'), min: 0, max: 1, step: 0.1, unit: '' },
        { id: 'box-shadow', label: 'Box Shadow', type: 'shadow', property: 'boxShadow', value: settings.boxShadow || 'none' },
        { id: 'text-shadow', label: 'Text Shadow', type: 'text', property: 'textShadow', value: settings.textShadow || 'none', placeholder: '2px 2px 4px rgba(0,0,0,0.5)' },
        { id: 'filter', label: 'Filter', type: 'text', property: 'filter', value: settings.filter || 'none', placeholder: 'blur(2px), brightness(1.2)' },
        { id: 'backdrop-filter', label: 'Backdrop Filter', type: 'text', property: 'backdropFilter', value: settings.backdropFilter || 'none', placeholder: 'blur(10px)' }
      ]
    },
    {
      id: 'transform',
      name: 'Transform',
      icon: '🔄',
      items: [
        { id: 'justify-content', label: 'Justify Content', type: 'select', property: 'justifyContent', value: settings.justifyContent || 'flex-start',
          options: [
            { value: 'flex-start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'flex-end', label: 'End' },
            { value: 'space-between', label: 'Space Between' },
            { value: 'space-around', label: 'Space Around' },
            { value: 'space-evenly', label: 'Space Evenly' }
          ]
        },
        { id: 'align-items', label: 'Align Items', type: 'select', property: 'alignItems', value: settings.alignItems || 'stretch',
          options: [
            { value: 'stretch', label: 'Stretch' },
            { value: 'flex-start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'flex-end', label: 'End' },
            { value: 'baseline', label: 'Baseline' }
          ]
        },
        { id: 'transform', label: 'Transform', type: 'select', property: 'transform', value: settings.transform || 'none',
          options: [
            { value: 'none', label: 'None' },
            { value: 'rotate(90deg)', label: 'Rotate 90°' },
            { value: 'rotate(180deg)', label: 'Rotate 180°' },
            { value: 'rotate(270deg)', label: 'Rotate 270°' },
            { value: 'rotate(45deg)', label: 'Rotate 45°' },
            { value: 'rotate(-45deg)', label: 'Rotate -45°' },
            { value: 'scale(0.5)', label: 'Scale 50%' },
            { value: 'scale(1.2)', label: 'Scale 120%' },
            { value: 'scale(1.5)', label: 'Scale 150%' },
            { value: 'scale(2)', label: 'Scale 200%' },
            { value: 'scaleX(-1)', label: 'Flip Horizontal' },
            { value: 'scaleY(-1)', label: 'Flip Vertical' },
            { value: 'skew(15deg)', label: 'Skew 15°' },
            { value: 'skew(-15deg)', label: 'Skew -15°' },
            { value: 'translateX(10px)', label: 'Move Right 10px' },
            { value: 'translateX(-10px)', label: 'Move Left 10px' },
            { value: 'translateY(-10px)', label: 'Move Up 10px' },
            { value: 'translateY(10px)', label: 'Move Down 10px' }
          ]
        }
      ]
    },
    {
      id: 'position',
      name: 'Position',
      icon: '📍',
      items: [
        { id: 'position', label: 'Position', type: 'select', property: 'position', value: settings.position || 'static',
          options: [
            { value: 'static', label: 'Static' },
            { value: 'relative', label: 'Relative' },
            { value: 'absolute', label: 'Absolute' },
            { value: 'fixed', label: 'Fixed' },
            { value: 'sticky', label: 'Sticky' }
          ]
        },
        { id: 'top', label: 'Top', type: 'text', property: 'top', value: settings.top || 'auto', placeholder: 'auto, 10px, 50%' },
        { id: 'right', label: 'Right', type: 'text', property: 'right', value: settings.right || 'auto', placeholder: 'auto, 10px, 50%' },
        { id: 'bottom', label: 'Bottom', type: 'text', property: 'bottom', value: settings.bottom || 'auto', placeholder: 'auto, 10px, 50%' },
        { id: 'left', label: 'Left', type: 'text', property: 'left', value: settings.left || 'auto', placeholder: 'auto, 10px, 50%' },
        { id: 'z-index', label: 'Z-Index', type: 'text', property: 'zIndex', value: settings.zIndex || 'auto', placeholder: 'auto, 1, 999' }
      ]
    }
  ];

  const handleValueChange = (property: string, value: any) => {
    onUpdateSettings({ 
      settings: { 
        ...settings, 
        [property]: value 
      } 
    });
  };

  const renderStyleItem = (item: StyleItem) => {
    switch (item.type) {
      case 'color':
        return (
          <div key={item.id} className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">{item.label}</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={item.value as string}
                onChange={(e) => handleValueChange(item.property, e.target.value)}
                className="w-6 h-5 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={item.value as string}
                onChange={(e) => handleValueChange(item.property, e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={item.id} className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">{item.label}</label>
            <input
              type="text"
              value={item.value as string}
              onChange={(e) => handleValueChange(item.property, e.target.value)}
              placeholder={item.placeholder}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        );

      case 'select':
        return (
          <div key={item.id} className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">{item.label}</label>
            <select
              value={item.value as string}
              onChange={(e) => handleValueChange(item.property, e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {item.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'range':
        return (
          <div key={item.id} className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">
              {item.label} ({item.value}{item.unit})
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                value={item.value as number}
                onChange={(e) => handleValueChange(item.property, parseFloat(e.target.value))}
                min={item.min}
                max={item.max}
                step={item.step}
                className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                value={item.value as number}
                onChange={(e) => handleValueChange(item.property, parseFloat(e.target.value) || 0)}
                className="w-10 px-1 py-1 text-xs border border-gray-300 rounded"
                min={item.min}
                max={item.max}
                step={item.step}
              />
            </div>
          </div>
        );

      case 'spacing':
        return (
          <div key={item.id} className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">{item.label}</label>
            <input
              type="text"
              value={item.value as string}
              onChange={(e) => handleValueChange(item.property, e.target.value)}
              placeholder="10px, 10px 20px"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        );

      case 'shadow':
        return (
          <div key={item.id} className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">{item.label}</label>
            <input
              type="text"
              value={item.value as string}
              onChange={(e) => handleValueChange(item.property, e.target.value)}
              placeholder="2px 4px 8px rgba(0,0,0,0.1)"
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-1 min-h-0">
      {styleCategories.map((category) => {
        const isOpen = openSection === category.id;
        
        return (
          <div key={category.id} className="border border-gray-200 rounded overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleSection(category.id)}
              className={`w-full px-3 py-2 flex items-center justify-between text-left transition-all duration-200 ${
                isOpen 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <h3 className="text-xs font-medium">{category.name}</h3>
              <svg 
                className={`w-3 h-3 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div className="px-3 py-2 bg-white space-y-2">
                {category.items.map(item => renderStyleItem(item))}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Add some extra space at the bottom to ensure scrolling works */}
      <div className="h-8"></div>
    </div>
  );
};

export function ElementorSettingsPanel({
  selectedElement,
  sections,
  onUpdateSettings,
  onClose,
  onDelete,
  activeTab = 'content',
  currentBreakpoint = 'desktop',
  updateResponsiveSetting,
  onBreakpointChange,
  websiteId
}: ElementorSettingsPanelProps) {

  // Get the actual element based on selected element
  const getSelectedElementData = () => {
    for (const section of sections) {
      if (selectedElement.type === 'section' && section.id === selectedElement.id) {
        return section;
      }
      for (const column of section.columns) {
        if (selectedElement.type === 'column' && column.id === selectedElement.id) {
          return column;
        }
        for (const widget of column.widgets) {
          if (selectedElement.type === 'widget' && widget.id === selectedElement.id) {
            return widget;
          }
        }
      }
    }
    return null;
  };

  const elementData = getSelectedElementData();

  const renderSectionSettings = (section: ElementorSection) => {
    // Ensure section settings are in responsive format
    const ensureResponsiveSectionSettings = (settings: any): ResponsiveSettings<SectionSettings> => {
      if (settings?.desktop) {
        // Even if settings.desktop exists, ensure columnsPerRow is set
        const desktopSettings = settings.desktop;
        return {
          ...settings,
          desktop: {
            ...desktopSettings,
            // Set columnsPerRow to actual column count if not already set
            columnsPerRow: desktopSettings.columnsPerRow || section.columns.length,
            columnGap: desktopSettings.columnGap || '1rem',
            rowGap: desktopSettings.rowGap || '1rem',
            alignItems: desktopSettings.alignItems || 'stretch',
            justifyContent: desktopSettings.justifyContent || 'start'
          }
        };
      }
      // Convert legacy format
      return {
        desktop: {
          layout: settings?.layout || 'boxed',
          contentWidth: settings?.contentWidth || '1140px',
          height: settings?.height || 'auto',
          backgroundColor: settings?.backgroundColor || 'transparent',
          backgroundImage: settings?.backgroundImage || '',
          padding: settings?.padding || '60px 20px',
          margin: settings?.margin || '0',
          // Responsive Grid defaults
          columnsPerRow: settings?.columnsPerRow || section.columns.length,
          columnGap: settings?.columnGap || '1rem',
          rowGap: settings?.rowGap || '1rem',
          alignItems: settings?.alignItems || 'stretch',
          justifyContent: settings?.justifyContent || 'start'
        }
      };
    };

    const responsiveSettings = ensureResponsiveSectionSettings(section.settings);
    
    // Auto-save corrected settings if they were missing
    const needsInitialization = !section.settings?.desktop || section.settings.desktop.columnsPerRow === undefined;
    if (needsInitialization) {
      // Use setTimeout to avoid updating during render
      setTimeout(() => {
        onUpdateSettings(responsiveSettings);
      }, 0);
    }

    const handleResponsiveUpdate = (breakpoint: ResponsiveBreakpoint, updates: Partial<SectionSettings>) => {
      if (updateResponsiveSetting) {
        const newSettings = updateResponsiveSetting(responsiveSettings, breakpoint, updates);
        onUpdateSettings(newSettings);
      }
    };

    if (activeTab === 'content') {
      return (
        <div className="space-y-6">
          <ResponsiveControls<SectionSettings>
            label="Layout Settings"
            settings={responsiveSettings}
            currentBreakpoint={currentBreakpoint}
            onUpdate={handleResponsiveUpdate}
            onBreakpointChange={onBreakpointChange}
            renderControls={(values, onChange, breakpoint) => (
              <>
                <ResponsiveSelect
                  label="Content Width"
                  value={values.layout || 'boxed'}
                  options={[
                    { value: 'boxed', label: 'Boxed' },
                    { value: 'full-width', label: 'Full Width' }
                  ]}
                  onChange={(value) => onChange({ layout: value as 'boxed' | 'full-width' })}
                />
                {values.layout === 'boxed' && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 block">Max Width</label>
                    <input
                      type="text"
                      value={values.contentWidth || '1140px'}
                      onChange={(e) => onChange({ contentWidth: e.target.value })}
                      placeholder="1140px"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 block">Height</label>
                  <input
                    type="text"
                    value={values.height || 'auto'}
                    onChange={(e) => onChange({ height: e.target.value })}
                    placeholder="auto"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Responsive Grid Controls */}
                <div className="border-t pt-3 mt-3 space-y-3">
                  <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">Responsive Grid</h4>
                  
                  <ResponsiveNumberInput
                    label="Columns per Row"
                    value={values.columnsPerRow || 1}
                    onChange={(value) => onChange({ columnsPerRow: value })}
                    min={1}
                    max={12}
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 block">Column Gap</label>
                    <input
                      type="text"
                      value={values.columnGap || '1rem'}
                      onChange={(e) => onChange({ columnGap: e.target.value })}
                      placeholder="1rem"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700 block">Row Gap</label>
                    <input
                      type="text"
                      value={values.rowGap || '1rem'}
                      onChange={(e) => onChange({ rowGap: e.target.value })}
                      placeholder="1rem"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <ResponsiveSelect
                    label="Align Items"
                    value={values.alignItems || 'stretch'}
                    options={[
                      { value: 'start', label: 'Start' },
                      { value: 'center', label: 'Center' },
                      { value: 'end', label: 'End' },
                      { value: 'stretch', label: 'Stretch' }
                    ]}
                    onChange={(value) => onChange({ alignItems: value as any })}
                  />

                  <ResponsiveSelect
                    label="Justify Content"
                    value={values.justifyContent || 'start'}
                    options={[
                      { value: 'start', label: 'Start' },
                      { value: 'center', label: 'Center' },
                      { value: 'end', label: 'End' },
                      { value: 'space-between', label: 'Space Between' },
                      { value: 'space-around', label: 'Space Around' },
                      { value: 'space-evenly', label: 'Space Evenly' }
                    ]}
                    onChange={(value) => onChange({ justifyContent: value as any })}
                  />
                </div>
              </>
            )}
          />

          {/* Section Actions */}
          <div className="border-t pt-4 mt-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">Section Actions</h4>
            
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all content from this section? This action cannot be undone.')) {
                  // Clear all widgets from all columns in this section
                  const clearedSection = {
                    ...section,
                    columns: section.columns.map(column => ({
                      ...column,
                      widgets: []
                    }))
                  };
                  
                  // Call the clear section function
                  if (onClearSection) {
                    onClearSection(section.id);
                  } else {
                    console.warn('onClearSection function not provided. Section ID:', section.id);
                    alert('Clear section functionality is not available.');
                  }
                }
              }}
              className="w-full px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Section Content
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'style') {
      return (
        <CategorizedStylePanel
          settings={responsiveSettings.desktop}
          onUpdateSettings={(updates) => {
            const newSettings = updateResponsiveSetting ? 
              updateResponsiveSetting(responsiveSettings, currentBreakpoint, updates.settings) : 
              responsiveSettings;
            onUpdateSettings(newSettings);
          }}
          responsive={true}
          currentBreakpoint={currentBreakpoint}
        />
      );
    }

    return null;
  };

  const renderColumnSettings = (column: ElementorColumn) => {
    // Ensure column settings are in responsive format
    const ensureResponsiveColumnSettings = (settings: any): ResponsiveSettings<ColumnSettings> => {
      if (settings?.desktop) {
        return settings;
      }
      // Convert legacy format
      return {
        desktop: {
          width: settings?.width || 100,
          padding: settings?.padding || '20px',
          backgroundColor: settings?.backgroundColor || 'transparent',
          order: settings?.order || 0,
          hidden: settings?.hidden || false
        }
      };
    };

    const responsiveSettings = ensureResponsiveColumnSettings(column.settings);

    const handleColumnResponsiveUpdate = (breakpoint: ResponsiveBreakpoint, updates: Partial<ColumnSettings>) => {
      if (updateResponsiveSetting) {
        const newSettings = updateResponsiveSetting(responsiveSettings, breakpoint, updates);
        onUpdateSettings(newSettings);
      }
    };

    if (activeTab === 'content') {
      return (
        <div className="space-y-6">
          <ResponsiveControls<ColumnSettings>
            label="Column Layout"
            settings={responsiveSettings}
            currentBreakpoint={currentBreakpoint}
            onUpdate={handleColumnResponsiveUpdate}
            onBreakpointChange={onBreakpointChange}
            renderControls={(values, onChange, breakpoint) => (
              <>
                <ResponsiveNumberInput
                  label="Width"
                  value={values.width || 100}
                  onChange={(value) => onChange({ width: value })}
                  min={10}
                  max={100}
                  suffix="%"
                />
                <ResponsiveNumberInput
                  label="Order"
                  value={values.order || 0}
                  onChange={(value) => onChange({ order: value })}
                  min={0}
                  max={10}
                />
                <ResponsiveToggle
                  label="Hide on this device"
                  value={values.hidden || false}
                  onChange={(value) => onChange({ hidden: value })}
                />
              </>
            )}
          />
        </div>
      );
    }

    if (activeTab === 'style') {
      return (
        <CategorizedStylePanel
          settings={responsiveSettings.desktop}
          onUpdateSettings={(updates) => {
            const newSettings = updateResponsiveSetting ? 
              updateResponsiveSetting(responsiveSettings, currentBreakpoint, updates.settings) : 
              responsiveSettings;
            onUpdateSettings(newSettings);
          }}
          responsive={true}
          currentBreakpoint={currentBreakpoint}
        />
      );
    }

    return null;
  };

  const renderWidgetSettings = (widget: ElementorWidget) => {
    if (activeTab === 'content') {
      switch (widget.type) {
        case 'heading':
          return (
            <div className="space-y-6">
              <ControlGroup title="Content">
                <TextInput
                  label="Title"
                  value={widget.content.text || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, text: value } })}
                  placeholder="Add Your Heading Text Here"
                />
                <SelectInput
                  label="HTML Tag"
                  value={widget.content.tag || 'h2'}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, tag: value } })}
                  options={[
                    { value: 'h1', label: 'H1' },
                    { value: 'h2', label: 'H2' },
                    { value: 'h3', label: 'H3' },
                    { value: 'h4', label: 'H4' },
                    { value: 'h5', label: 'H5' },
                    { value: 'h6', label: 'H6' }
                  ]}
                />
              </ControlGroup>
            </div>
          );

        case 'text-editor':
          return (
            <div className="space-y-6">
              <ControlGroup title="Content">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                  <textarea
                    value={widget.content.text || ''}
                    onChange={(e) => onUpdateSettings({ content: { ...widget.content, text: e.target.value } })}
                    placeholder="Lorem ipsum dolor sit amet..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    rows={6}
                  />
                </div>
              </ControlGroup>
            </div>
          );

        case 'button':
          return (
            <div className="space-y-6">
              <ControlGroup title="Content">
                <TextInput
                  label="Text"
                  value={widget.content.text || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, text: value } })}
                  placeholder="Click here"
                />
                <TextInput
                  label="Link"
                  value={widget.content.link || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, link: value } })}
                  placeholder="https://"
                />
              </ControlGroup>
            </div>
          );

        case 'image':
          return (
            <div className="space-y-6">
              <ControlGroup title="Content">
                <TextInput
                  label="Image URL"
                  value={widget.content.src || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, src: value } })}
                  placeholder="https://"
                />
                <TextInput
                  label="Alt Text"
                  value={widget.content.alt || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, alt: value } })}
                  placeholder="Image description"
                />
              </ControlGroup>
            </div>
          );

        case 'nav-menu':
          // Get menus for the current website
          const { data: menusData, isLoading: menusLoading } = websiteBuilderApi.useGetWebsiteMenusQuery(
            websiteId,
            { skip: !websiteId }
          );
          const menus = menusData?.data || [];
          
          console.log('Nav-menu widget debug:', {
            websiteId,
            menusLoading,
            menusData,
            menus,
            widgetContent: widget.content
          });
          
          return (
            <div className="space-y-6">
              <ControlGroup title="Menu Selection">
                <SelectInput
                  label="Choose Menu"
                  value={widget.content.menuId ? widget.content.menuId.toString() : ''}
                  onChange={(value) => {
                    console.log('Menu selection changed:', value, 'Current widget content:', widget.content);
                    const updatedContent = { ...widget.content, menuId: value };
                    console.log('Updating with:', updatedContent);
                    onUpdateSettings({ content: updatedContent });
                  }}
                  options={[
                    { value: '', label: menusLoading ? 'Loading menus...' : 'Select a menu...' },
                    ...menus.map((menu: any) => ({
                      value: menu.id.toString(),
                      label: `${menu.name} (${menu.location})`
                    }))
                  ]}
                  disabled={menusLoading}
                />
                
                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                  <p><strong>Debug Info:</strong></p>
                  <p>Website ID: {websiteId || 'Not set'}</p>
                  <p>Menus found: {menus.length}</p>
                  <p>Loading: {menusLoading ? 'Yes' : 'No'}</p>
                  <p>Selected menuId: {widget.content.menuId || 'None'} (type: {typeof widget.content.menuId})</p>
                  <p>Available options: {JSON.stringify(menus.map((m: any) => ({ id: m.id, name: m.name, idType: typeof m.id })))}</p>
                </div>
                {!widget.content.menuId && !menusLoading && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      {menus.length === 0 ? 'No menus found' : 'No menu selected'}
                    </p>
                    <p className="text-xs text-blue-600 mb-3">
                      {menus.length === 0 
                        ? 'Create your first menu to get started.'
                        : 'Create menus in the Menu Builder and select them here.'
                      }
                    </p>
                    <button
                      onClick={() => {
                        // Open menu builder in new tab/window
                        const url = `/cg-builder/menus`;
                        window.open(url, '_blank');
                      }}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      Go to Menu Builder
                    </button>
                  </div>
                )}
                {widget.content.menuId && (
                  <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                    Menu selected: {menus.find((m: any) => m.id.toString() === widget.content.menuId)?.name || 'Unknown Menu'}
                  </div>
                )}
              </ControlGroup>
              
              <ControlGroup title="Display Settings">
                <SelectInput
                  label="Layout"
                  value={widget.settings.layout || 'horizontal'}
                  onChange={(value) => onUpdateSettings({ settings: { ...widget.settings, layout: value } })}
                  options={[
                    { value: 'horizontal', label: 'Horizontal' },
                    { value: 'vertical', label: 'Vertical' }
                  ]}
                />
                <SelectInput
                  label="Alignment"
                  value={widget.settings.alignment || 'left'}
                  onChange={(value) => onUpdateSettings({ settings: { ...widget.settings, alignment: value } })}
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' },
                    { value: 'justify', label: 'Justify' }
                  ]}
                />
                <TextInput
                  label="Gap Between Items"
                  value={widget.settings.gap || '30px'}
                  onChange={(value) => onUpdateSettings({ settings: { ...widget.settings, gap: value } })}
                  placeholder="30px"
                />
              </ControlGroup>

              <ControlGroup title="Mobile Settings">
                <TextInput
                  label="Mobile Breakpoint (px)"
                  value={widget.content.mobileBreakpoint?.toString() || '768'}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, mobileBreakpoint: parseInt(value) || 768 } })}
                  placeholder="768"
                />
                <ToggleInput
                  label="Show Mobile Toggle"
                  value={widget.settings.showMobileToggle || true}
                  onChange={(value) => onUpdateSettings({ settings: { ...widget.settings, showMobileToggle: value } })}
                />
              </ControlGroup>
            </div>
          );

        case 'copyright':
        case 'footer-copyright':
          return (
            <div className="space-y-6">
              <ControlGroup title="Copyright Content">
                <TextInput
                  label="Company Name"
                  value={widget.content.company_name || widget.content.companyName || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, company_name: value, companyName: value } })}
                  placeholder="Your Store"
                />
                <TextInput
                  label="Copyright Text"
                  value={widget.content.text || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, text: value } })}
                  placeholder="All rights reserved."
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Show Current Year
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={widget.content.show_year !== false && widget.content.showYear !== false}
                      onChange={(e) => onUpdateSettings({ 
                        content: { 
                          ...widget.content, 
                          show_year: e.target.checked,
                          showYear: e.target.checked 
                        } 
                      })}
                    />
                    <span className="ml-2 text-sm text-gray-600">Display current year</span>
                  </label>
                </div>
              </ControlGroup>
            </div>
          );

        case 'links':
        case 'footer-links':
          return (
            <div className="space-y-6">
              <ControlGroup title="Links Content">
                <TextInput
                  label="Section Title"
                  value={widget.content.title || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, title: value } })}
                  placeholder="Quick Links"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Links</label>
                  <div className="space-y-2">
                    {(widget.content.links || [{ label: '', url: '' }]).map((link: any, index: number) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Link text"
                          value={link.label || ''}
                          onChange={(e) => {
                            const newLinks = [...(widget.content.links || [])];
                            newLinks[index] = { ...link, label: e.target.value };
                            onUpdateSettings({ content: { ...widget.content, links: newLinks } });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.url || ''}
                          onChange={(e) => {
                            const newLinks = [...(widget.content.links || [])];
                            newLinks[index] = { ...link, url: e.target.value };
                            onUpdateSettings({ content: { ...widget.content, links: newLinks } });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newLinks = [...(widget.content.links || []), { label: '', url: '' }];
                        onUpdateSettings({ content: { ...widget.content, links: newLinks } });
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>
              </ControlGroup>
            </div>
          );

        case 'newsletter-signup':
        case 'footer-newsletter-signup':
        case 'newsletter':
          return (
            <div className="space-y-6">
              <ControlGroup title="Newsletter Content">
                <TextInput
                  label="Title"
                  value={widget.content.title || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, title: value } })}
                  placeholder="Newsletter"
                />
                <TextInput
                  label="Description"
                  value={widget.content.description || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, description: value } })}
                  placeholder="Subscribe to get the latest updates and offers."
                />
                <TextInput
                  label="Email Placeholder"
                  value={widget.content.placeholder || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, placeholder: value } })}
                  placeholder="Enter your email"
                />
                <TextInput
                  label="Button Text"
                  value={widget.content.buttonText || widget.content.button_text || ''}
                  onChange={(value) => onUpdateSettings({ content: { ...widget.content, buttonText: value, button_text: value } })}
                  placeholder="Subscribe"
                />
              </ControlGroup>
            </div>
          );

        default:
          return (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">Content settings for {widget.type} widget</p>
            </div>
          );
      }
    }

    if (activeTab === 'style') {
      return (
        <CategorizedStylePanel
          settings={widget.settings || {}}
          onUpdateSettings={(updates) => onUpdateSettings(updates)}
          responsive={false}
        />
      );
    }

    return null;
  };

  const renderContent = () => {
    if (!elementData) return null;

    if (selectedElement.type === 'section') {
      return renderSectionSettings(elementData as ElementorSection);
    }

    if (selectedElement.type === 'column') {
      return renderColumnSettings(elementData as ElementorColumn);
    }

    if (selectedElement.type === 'widget') {
      return renderWidgetSettings(elementData as ElementorWidget);
    }

    return null;
  };

  const getElementTitle = () => {
    if (selectedElement.type === 'section') {
      const sectionIndex = sections.findIndex(s => s.id === selectedElement.id);
      return `Section ${sectionIndex + 1}`;
    }

    if (selectedElement.type === 'column') {
      for (const section of sections) {
        const columnIndex = section.columns.findIndex(c => c.id === selectedElement.id);
        if (columnIndex !== -1) {
          return `Column ${columnIndex + 1}`;
        }
      }
      return 'Column';
    }

    if (selectedElement.type === 'widget') {
      const widget = elementData as ElementorWidget;
      return widget?.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Widget';
    }

    return 'Element';
  };

  return (
    <div className="h-full overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      {renderContent()}
    </div>
  );
}