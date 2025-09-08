import React, { forwardRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { ElementorSection, ElementorColumn, ElementorWidget, ResponsiveSettings, ResponsiveBreakpoint, SectionSettings, ColumnSettings } from './ElementorBuilder';
import { SectionLayout } from './SectionLayoutPanel';

// Safari Browser Frame Component
const BrowserFrame = ({ children, devicePreview, websiteUrl }: { 
  children: React.ReactNode; 
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  websiteUrl?: string;
}) => {
  const getFrameStyles = () => {
    switch (devicePreview) {
      case 'mobile':
        return {
          maxWidth: '375px',
          borderRadius: '30px',
          padding: '8px',
          background: '#1f2937'
        };
      case 'tablet':
        return {
          maxWidth: '768px',
          borderRadius: '20px',
          padding: '6px',
          background: '#1f2937'
        };
      default: // desktop
        return {
          maxWidth: '100%',
          borderRadius: '10px',
          padding: '4px',
          background: '#e5e7eb'
        };
    }
  };

  const frameStyles = getFrameStyles();

  if (devicePreview === 'mobile') {
    return (
      <div className="mx-auto" style={{ maxWidth: frameStyles.maxWidth }}>
        <div 
          className="shadow-2xl"
          style={{
            borderRadius: frameStyles.borderRadius,
            padding: frameStyles.padding,
            background: frameStyles.background
          }}
        >
          {/* iPhone status bar */}
          <div className="flex items-center justify-between mb-2 px-4 text-white text-xs">
            <div className="flex items-center space-x-1">
              <span>9:41</span>
            </div>
            <div className="w-6 h-3 bg-black rounded-full"></div>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-0.5">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
              <div className="w-6 h-3 border border-white rounded-sm">
                <div className="w-4 h-2 bg-white rounded-sm mx-auto mt-0.5"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[22px] overflow-hidden shadow-inner">
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (devicePreview === 'tablet') {
    return (
      <div className="mx-auto" style={{ maxWidth: frameStyles.maxWidth }}>
        <div 
          className="shadow-2xl"
          style={{
            borderRadius: frameStyles.borderRadius,
            padding: frameStyles.padding,
            background: frameStyles.background
          }}
        >
          {/* iPad home button */}
          <div className="flex justify-center mb-3">
            <div className="w-8 h-8 border-2 border-gray-500 rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-[16px] overflow-hidden shadow-inner">
            {children}
          </div>
          
          <div className="flex justify-center mt-3">
            <div className="w-8 h-8 border-2 border-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Safari frame
  return (
    <div className="mx-auto max-w-none">
      <div 
        className="shadow-xl"
        style={{
          borderRadius: frameStyles.borderRadius,
          padding: frameStyles.padding,
          background: frameStyles.background
        }}
      >
        {/* Safari top bar */}
        <div className="bg-white rounded-t-[6px] px-4 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Traffic light buttons */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"></div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center space-x-3">
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {/* Address bar */}
            <div className="flex-1 mx-4">
              <div className="bg-gray-100 rounded-md px-4 py-1.5 text-sm text-gray-700 font-mono">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>{websiteUrl || 'https://yourwebsite.com'}</span>
                </div>
              </div>
            </div>
            
            {/* Share button */}
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Website content */}
        <div className="bg-white rounded-b-[6px] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

// Column Selection Interface - Like Elementor WordPress
interface ColumnSelectionInterfaceProps {
  onSelectLayout: (layout: SectionLayout) => void;
  position?: 'top' | 'bottom' | 'between';
  afterSectionId?: string;
}

const sectionLayouts: SectionLayout[] = [
  {
    id: '1-col',
    name: 'Single Column',
    columns: [100],
    description: 'One full-width column',
    icon: (
      <div className="w-full h-12 bg-gray-300 rounded"></div>
    )
  },
  {
    id: '2-col-equal',
    name: 'Two Equal Columns',
    columns: [50, 50],
    description: 'Two columns with equal width',
    icon: (
      <div className="flex gap-2 w-full h-12">
        <div className="flex-1 bg-gray-300 rounded"></div>
        <div className="flex-1 bg-gray-300 rounded"></div>
      </div>
    )
  },
  {
    id: '2-col-left',
    name: 'Two Columns (2:1)',
    columns: [66.67, 33.33],
    description: 'Left column wider than right',
    icon: (
      <div className="flex gap-2 w-full h-12">
        <div className="w-2/3 bg-gray-300 rounded"></div>
        <div className="w-1/3 bg-gray-300 rounded"></div>
      </div>
    )
  },
  {
    id: '2-col-right',
    name: 'Two Columns (1:2)',
    columns: [33.33, 66.67],
    description: 'Right column wider than left',
    icon: (
      <div className="flex gap-2 w-full h-12">
        <div className="w-1/3 bg-gray-300 rounded"></div>
        <div className="w-2/3 bg-gray-300 rounded"></div>
      </div>
    )
  },
  {
    id: '3-col-equal',
    name: 'Three Equal Columns',
    columns: [33.33, 33.33, 33.33],
    description: 'Three columns with equal width',
    icon: (
      <div className="flex gap-2 w-full h-12">
        <div className="flex-1 bg-gray-300 rounded"></div>
        <div className="flex-1 bg-gray-300 rounded"></div>
        <div className="flex-1 bg-gray-300 rounded"></div>
      </div>
    )
  },
  {
    id: '4-col-equal',
    name: 'Four Equal Columns',
    columns: [25, 25, 25, 25],
    description: 'Four columns with equal width',
    icon: (
      <div className="flex gap-1 w-full h-12">
        <div className="flex-1 bg-gray-300 rounded"></div>
        <div className="flex-1 bg-gray-300 rounded"></div>
        <div className="flex-1 bg-gray-300 rounded"></div>
        <div className="flex-1 bg-gray-300 rounded"></div>
      </div>
    )
  }
];

const ColumnSelectionInterface = ({ onSelectLayout, position = 'bottom', afterSectionId }: ColumnSelectionInterfaceProps) => {
  if (position === 'between') {
    // Compact between-sections interface - show on hover
    return (
      <div className="relative py-2 text-center opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3 inline-block min-w-max relative z-10">
          <h3 className="text-xs font-medium text-gray-900 mb-2">Add section</h3>
          <div className="flex gap-2">
            {sectionLayouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => {
                  console.log('🔧 ColumnSelectionInterface clicked:', layout.name, layout);
                  onSelectLayout(layout);
                }}
                className="group/item p-2 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition-all w-12 h-10 flex flex-col items-center justify-center"
                title={layout.name}
              >
                <div className="w-6 mb-0.5">
                  {layout.icon}
                </div>
                <div className="text-xs text-gray-500 group-hover/item:text-blue-600 font-medium">
                  {layout.columns.length}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Standard interface for top/bottom positions - compact design
  return (
    <div className="w-full bg-white py-8">
      <div className="w-full max-w-7xl mx-auto px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-medium text-gray-700">Choose your section structure</h3>
        </div>
        
        <div className="flex justify-center gap-6">
          {sectionLayouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => {
                console.log('🔧 Full ColumnSelectionInterface clicked:', layout.name, layout);
                onSelectLayout(layout);
              }}
              className="group/item bg-white p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-200 w-40 h-auto flex flex-col items-center justify-center"
              title={layout.description}
            >
              <div className="w-28 mb-2">
                {layout.icon}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {layout.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple Header Renderer Component
const HeaderRenderer = ({ headerData }: { headerData?: any }) => {
  if (!headerData?.data) return null;

  const header = headerData.data;
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            {header.logo ? (
              <img 
                src={header.logo} 
                alt={header.site_title || 'Logo'} 
                className="h-8 w-auto"
              />
            ) : (
              <h1 className="text-xl font-bold text-gray-900">
                {header.site_title || 'Your Website'}
              </h1>
            )}
          </div>
          
          {/* Navigation */}
          {header.menu_items && header.menu_items.length > 0 && (
            <nav className="hidden md:flex space-x-8">
              {header.menu_items.map((item: any, index: number) => (
                <a
                  key={index}
                  href={item.url || '#'}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Simple Footer Renderer Component  
const FooterRenderer = ({ footerData }: { footerData?: any }) => {
  if (!footerData?.data) return null;

  const footer = footerData.data;
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              {footer.company_name || 'Your Company'}
            </h3>
            {footer.description && (
              <p className="text-gray-300 mb-4">{footer.description}</p>
            )}
            {footer.contact_info && (
              <div className="text-gray-300 text-sm space-y-1">
                {footer.contact_info.address && (
                  <p>{footer.contact_info.address}</p>
                )}
                {footer.contact_info.phone && (
                  <p>Phone: {footer.contact_info.phone}</p>
                )}
                {footer.contact_info.email && (
                  <p>Email: {footer.contact_info.email}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Footer Links */}
          {footer.footer_links && footer.footer_links.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {footer.footer_links.map((link: any, index: number) => (
                  <li key={index}>
                    <a 
                      href={link.url || '#'} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Social Media */}
          {footer.social_links && footer.social_links.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {footer.social_links.map((social: any, index: number) => (
                  <a
                    key={index}
                    href={social.url || '#'}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social.platform}</span>
                    <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} {footer.company_name || 'Your Company'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Header Preview Renderer - renders actual sections as header
const HeaderPreviewRenderer = ({ 
  sections, 
  selectedElement,
  setSelectedElement,
  onAddSection,
  onDeleteSection,
  onDuplicateSection,
  onAddWidget,
  onAddColumn,
  onApplyLayout,
  onRemoveColumn,
  onDuplicateColumn,
  getResponsiveValue,
  currentBreakpoint,
  onSelectLayout
}: {
  sections: ElementorSection[];
  selectedElement: any;
  setSelectedElement: any;
  onAddSection: any;
  onDeleteSection: any;
  onDuplicateSection: any;
  onAddWidget: any;
  onAddColumn?: any;
  onApplyLayout?: any;
  onRemoveColumn?: any;
  onDuplicateColumn?: any;
  getResponsiveValue?: any;
  currentBreakpoint?: any;
  onSelectLayout?: any;
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto">
        {sections.length === 0 ? (
          <div className="flex items-center justify-center min-h-16 border-2 border-dashed border-gray-300 mx-4 my-2 rounded-lg">
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm mb-2">Choose a layout to add header section</p>
              <ColumnSelectionInterface 
                onSelectLayout={onSelectLayout}
                position="top"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-0 relative">
            {sections.map((section) => (
              <Section
                key={section.id}
                section={section}
                isSelected={selectedElement?.type === 'section' && selectedElement.id === section.id}
                onClick={() => setSelectedElement({ type: 'section', id: section.id })}
                onAddSection={() => onAddSection(section.id)}
                onDeleteSection={() => onDeleteSection(section.id)}
                onDuplicateSection={() => onDuplicateSection(section.id)}
                onAddWidget={onAddWidget}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                onAddColumn={onAddColumn}
                onApplyLayout={onApplyLayout}
                onRemoveColumn={onRemoveColumn}
                onDuplicateColumn={onDuplicateColumn}
                getResponsiveValue={getResponsiveValue}
                currentBreakpoint={currentBreakpoint}
              />
            ))}
            
            {/* Column selection interface to add more sections */}
            <div className="flex justify-center py-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Add another header section</p>
                <ColumnSelectionInterface 
                  onSelectLayout={onSelectLayout}
                  position="top"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Footer Preview Renderer - renders actual sections as footer
const FooterPreviewRenderer = ({ 
  sections, 
  selectedElement,
  setSelectedElement,
  onAddSection,
  onDeleteSection,
  onDuplicateSection,
  onAddWidget,
  onAddColumn,
  onApplyLayout,
  onRemoveColumn,
  onDuplicateColumn,
  getResponsiveValue,
  currentBreakpoint,
  onSelectLayout
}: {
  sections: ElementorSection[];
  selectedElement: any;
  setSelectedElement: any;
  onAddSection: any;
  onDeleteSection: any;
  onDuplicateSection: any;
  onAddWidget: any;
  onAddColumn?: any;
  onApplyLayout?: any;
  onRemoveColumn?: any;
  onDuplicateColumn?: any;
  getResponsiveValue?: any;
  currentBreakpoint?: any;
  onSelectLayout?: any;
}) => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        {sections.length === 0 ? (
          <div className="flex items-center justify-center min-h-16 border-2 border-dashed border-gray-600 mx-4 my-2 rounded-lg">
            <div className="text-center text-gray-300 py-4">
              <p className="text-sm mb-2">Choose a layout to add footer section</p>
              <ColumnSelectionInterface 
                onSelectLayout={onSelectLayout}
                position="top"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-0 relative">
            {sections.map((section) => (
              <Section
                key={section.id}
                section={section}
                isSelected={selectedElement?.type === 'section' && selectedElement.id === section.id}
                onClick={() => setSelectedElement({ type: 'section', id: section.id })}
                onAddSection={() => onAddSection(section.id)}
                onDeleteSection={() => onDeleteSection(section.id)}
                onDuplicateSection={() => onDuplicateSection(section.id)}
                onAddWidget={onAddWidget}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                onAddColumn={onAddColumn}
                onApplyLayout={onApplyLayout}
                onRemoveColumn={onRemoveColumn}
                onDuplicateColumn={onDuplicateColumn}
                getResponsiveValue={getResponsiveValue}
                currentBreakpoint={currentBreakpoint}
              />
            ))}
            
            {/* Column selection interface to add more sections */}
            <div className="flex justify-center py-3 border-t border-gray-700">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">Add another footer section</p>
                <ColumnSelectionInterface 
                  onSelectLayout={onSelectLayout}
                  position="top"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

interface ElementorCanvasProps {
  sections: ElementorSection[];
  setSections: (sections: ElementorSection[]) => void;
  selectedElement: {
    type: 'section' | 'column' | 'widget';
    id: string;
  } | null;
  setSelectedElement: (element: { type: 'section' | 'column' | 'widget'; id: string } | null) => void;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  isPreviewMode: boolean;
  onAddSection: (afterSectionId?: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onAddWidget: (columnId: string, widget: any, position?: number) => void;
  onClearAllSections?: () => void;
  saveHistory: (sections: ElementorSection[]) => void;
  headerData?: any;
  footerData?: any;
  onAddColumn?: (sectionId: string) => void;
  onApplyLayout?: (sectionId: string, layout: any) => void;
  onRemoveColumn?: (sectionId: string, columnId: string) => void;
  onDuplicateColumn?: (sectionId: string, columnId: string) => void;
  onResizeColumn?: (columnId: string, newWidth: number) => void;
  onSelectLayout?: (layout: SectionLayout) => void;
  getResponsiveValue?: <T>(settings: ResponsiveSettings<T>, fallbackValue: T) => T;
  currentBreakpoint?: ResponsiveBreakpoint;
  layoutMode?: 'header' | 'footer';
}

interface WidgetRendererProps {
  widget: ElementorWidget;
  isSelected: boolean;
  onClick: () => void;
}

const WidgetRenderer = ({ widget, isSelected, onClick }: WidgetRendererProps) => {
  // Convert widget settings to CSS style object
  const getWidgetStyle = (additionalStyles: React.CSSProperties = {}) => {
    const settings = widget.settings || {};
    
    const baseStyle: React.CSSProperties = {
      // Typography
      color: settings.color,
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      fontWeight: settings.fontWeight,
      lineHeight: settings.lineHeight,
      letterSpacing: settings.letterSpacing,
      textAlign: settings.textAlign as any,
      textDecoration: settings.textDecoration,
      textTransform: settings.textTransform as any,
      
      // Background
      backgroundColor: settings.backgroundColor,
      backgroundImage: settings.backgroundImage,
      backgroundSize: settings.backgroundSize,
      backgroundPosition: settings.backgroundPosition,
      backgroundRepeat: settings.backgroundRepeat,
      backgroundAttachment: settings.backgroundAttachment,
      
      // Layout
      width: settings.width,
      height: settings.height,
      minWidth: settings.minWidth,
      minHeight: settings.minHeight,
      maxWidth: settings.maxWidth,
      maxHeight: settings.maxHeight,
      display: settings.display,
      overflow: settings.overflow,
      
      // Spacing
      padding: settings.padding,
      margin: settings.margin,
      
      // Border
      borderWidth: settings.borderWidth,
      borderStyle: settings.borderStyle,
      borderColor: settings.borderColor,
      borderRadius: settings.borderRadius,
      
      // Effects
      opacity: settings.opacity,
      boxShadow: settings.boxShadow,
      textShadow: settings.textShadow,
      filter: settings.filter,
      backdropFilter: settings.backdropFilter,
      
      // Transform
      transform: settings.transform,
      transformOrigin: settings.transformOrigin,
      justifyContent: settings.justifyContent,
      alignItems: settings.alignItems,
      
      // Position
      position: settings.position as any,
      top: settings.top,
      right: settings.right,
      bottom: settings.bottom,
      left: settings.left,
      zIndex: settings.zIndex,
      
      // Additional styles passed as parameter
      ...additionalStyles
    };

    // Remove undefined values to keep styles clean
    return Object.fromEntries(
      Object.entries(baseStyle).filter(([_, value]) => value !== undefined)
    );
  };

  const renderWidgetContent = () => {
    // Debug all widget types
    console.log('🔧 Widget Debug - Type:', widget.type, 'Content:', widget.content, 'Settings:', widget.settings);
    
    switch (widget.type) {
      case 'heading':
        const HeadingTag = (widget.content.tag || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={getWidgetStyle({
              // Fallback values if not set in style panel
              color: widget.settings.color || '#000000',
              fontSize: widget.settings.fontSize || '36px',
              fontWeight: widget.settings.fontWeight || 'bold'
            })}
          >
            {widget.content.text || 'Add Your Heading Text Here'}
          </HeadingTag>
        );
      
      case 'text-editor':
        return (
          <div
            style={getWidgetStyle({
              // Fallback values if not set in style panel
              color: widget.settings.color || '#666666',
              fontSize: widget.settings.fontSize || '16px',
              lineHeight: widget.settings.lineHeight || '1.6'
            })}
            dangerouslySetInnerHTML={{ __html: widget.content.text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }}
          />
        );
      
      case 'image':
        return (
          <div style={{ textAlign: widget.settings.alignment || 'center' }}>
            {widget.content.src ? (
              <img
                src={widget.content.src}
                alt={widget.content.alt || 'Image'}
                style={{
                  width: widget.settings.width || '100%',
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            ) : (
              <div className="bg-gray-200 rounded-lg flex items-center justify-center h-48">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Choose Image</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'button':
        return (
          <div style={{ textAlign: widget.settings.alignment || 'left' }}>
            <button
              style={getWidgetStyle({
                // Fallback values if not set in style panel
                backgroundColor: widget.settings.backgroundColor || '#61ce70',
                color: widget.settings.textColor || widget.settings.color || '#ffffff',
                padding: widget.settings.padding || '12px 24px',
                borderRadius: widget.settings.borderRadius || '4px',
                border: 'none',
                fontSize: widget.settings.fontSize || '16px',
                fontWeight: widget.settings.fontWeight || 'normal',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              })}
            >
              {widget.content.text || 'Click here'}
            </button>
          </div>
        );
      
      case 'spacer':
        return (
          <div
            style={getWidgetStyle({
              // Fallback values if not set in style panel
              height: widget.settings.height || '50px',
              width: '100%'
            })}
          />
        );
      
      case 'icon':
        return (
          <div style={{ textAlign: widget.settings.alignment || 'center' }}>
            <span
              style={{
                fontSize: widget.settings.size || '50px',
                color: widget.settings.color || '#6ec1e4'
              }}
            >
              {widget.content.icon === 'star' ? '⭐' : '⚪'}
            </span>
          </div>
        );

      case 'copyright':
      case 'footer-copyright':
        // Handle copyright widget with proper text rendering
        const currentYear = new Date().getFullYear();
        const companyName = widget.content.company_name || widget.content.companyName || 'Your Store';
        const text = widget.content.text || 'All rights reserved.';
        const showYear = widget.content.show_year !== false && widget.content.showYear !== false; // Default to true
        
        const copyrightText = `${showYear ? '© ' + currentYear + ' ' : ''}${companyName}. ${text}`;
        
        return (
          <div 
            className="text-gray-600 text-sm" 
            style={getWidgetStyle({ 
              textAlign: widget.settings.alignment || 'left',
              color: widget.settings.color || '#6b7280'
            })}
          >
            {copyrightText}
          </div>
        );

      case 'logo':
      case 'footer-logo':
      case 'header-logo':
      case 'site-logo':
        return (
          <div className="flex items-center" style={getWidgetStyle({ 
            justifyContent: widget.settings.alignment || 'left' 
          })}>
            <div className="flex items-center space-x-2">
              {widget.content.src ? (
                <img
                  src={widget.content.src}
                  alt={widget.content.alt || 'Logo'}
                  style={{
                    height: widget.settings.height || '40px',
                    width: 'auto'
                  }}
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
              )}
              {widget.content.showText !== false && (
                <span
                  style={getWidgetStyle({
                    fontSize: widget.settings.fontSize || '24px',
                    fontWeight: widget.settings.fontWeight || 'bold',
                    color: widget.settings.color || '#1f2937'
                  })}
                >
                  {widget.content.text || 'Your Logo'}
                </span>
              )}
            </div>
          </div>
        );

      case 'navigation':
        const navItems = widget.content.items || [
          { text: 'Home', url: '#' },
          { text: 'About', url: '#' },
          { text: 'Services', url: '#' },
          { text: 'Contact', url: '#' }
        ];
        
        return (
          <nav className="flex" style={{ 
            justifyContent: widget.settings.alignment || 'left',
            gap: widget.settings.gap || '30px'
          }}>
            {navItems.map((item: any, index: number) => (
              <a
                key={index}
                href={item.url}
                className="transition-colors hover:text-blue-600"
                style={{
                  color: widget.settings.color || '#374151',
                  fontSize: widget.settings.fontSize || '16px',
                  fontWeight: widget.settings.fontWeight || 'medium',
                  textDecoration: 'none'
                }}
              >
                {item.text}
              </a>
            ))}
          </nav>
        );

      case 'search':
        return (
          <div className="flex" style={{ justifyContent: widget.settings.alignment || 'left' }}>
            <div className="relative">
              <input
                type="text"
                placeholder={widget.content.placeholder || 'Search...'}
                className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  width: widget.settings.width || '250px',
                  fontSize: widget.settings.fontSize || '14px'
                }}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 'cart-icon':
        return (
          <div className="flex" style={{ justifyContent: widget.settings.alignment || 'right' }}>
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              <span 
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                style={{ fontSize: '10px' }}
              >
                {widget.content.count || '0'}
              </span>
            </button>
          </div>
        );

      case 'user-menu':
        return (
          <div className="flex" style={{ justifyContent: widget.settings.alignment || 'right' }}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {widget.content.showText !== false && (
                <span
                  style={{
                    color: widget.settings.color || '#374151',
                    fontSize: widget.settings.fontSize || '14px'
                  }}
                >
                  {widget.content.text || 'Account'}
                </span>
              )}
            </div>
          </div>
        );

      case 'cta-button':
        return (
          <div style={{ textAlign: widget.settings.alignment || 'right' }}>
            <button
              style={{
                backgroundColor: widget.settings.backgroundColor || '#3b82f6',
                color: widget.settings.textColor || '#ffffff',
                padding: widget.settings.padding || '12px 24px',
                borderRadius: widget.settings.borderRadius || '6px',
                border: 'none',
                fontSize: widget.settings.fontSize || '16px',
                fontWeight: widget.settings.fontWeight || '600',
                cursor: 'pointer'
              }}
            >
              {widget.content.text || 'Get Started'}
            </button>
          </div>
        );
      
      case 'video':
        return (
          <div style={{ textAlign: widget.settings.alignment || 'center' }}>
            {widget.content.url ? (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={widget.content.url}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="bg-black rounded-lg flex items-center justify-center h-64">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">Add Video URL</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'icon-box':
        return (
          <div style={{ textAlign: widget.settings.iconPosition || 'center' }}>
            <div className={`flex ${widget.settings.iconPosition === 'left' ? 'flex-row items-start' : 'flex-col items-center'} gap-4`}>
              <span style={{ fontSize: '40px', color: widget.settings.iconColor || '#6ec1e4' }}>
                {widget.content.icon === 'star' ? '⭐' : '📦'}
              </span>
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: widget.settings.titleColor || '#000' }}>
                  {widget.content.title || 'This is the heading'}
                </h3>
                <p style={{ color: widget.settings.descriptionColor || '#666' }}>
                  {widget.content.description || 'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor'}
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'star-rating':
        return (
          <div style={{ textAlign: widget.settings.alignment || 'left' }}>
            <div className="inline-flex gap-1">
              {Array.from({ length: widget.content.scale || 5 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: widget.settings.starSize || '24px',
                    color: i < (widget.content.rating || 5) ? (widget.settings.markedColor || '#f0ad4e') : (widget.settings.starColor || '#ccd6df')
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        );
      
      case 'image-box':
        return (
          <div className={`flex ${widget.settings.imagePosition === 'left' ? 'flex-row' : 'flex-col'} gap-4`}>
            {widget.content.image ? (
              <img
                src={widget.content.image}
                alt="Image"
                className="w-full max-w-xs rounded-lg"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-gray-200 rounded-lg flex items-center justify-center h-32 w-full max-w-xs">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {widget.content.title || 'This is the heading'}
              </h3>
              <p className="text-gray-600">
                {widget.content.description || 'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor'}
              </p>
            </div>
          </div>
        );
      
      case 'counter':
        return (
          <div style={{ textAlign: widget.settings.alignment || 'center' }}>
            <div className="inline-block">
              <div style={{ fontSize: widget.settings.numberSize || '48px', fontWeight: 'bold', color: widget.settings.numberColor || '#000' }}>
                {widget.content.prefix || ''}{widget.content.endingNumber || 100}{widget.content.suffix || ''}
              </div>
              <div style={{ fontSize: widget.settings.titleSize || '18px', color: widget.settings.titleColor || '#666', marginTop: '8px' }}>
                {widget.content.title || 'Counter'}
              </div>
            </div>
          </div>
        );
      
      case 'progress':
        return (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {widget.content.title || 'My Skill'}
              </span>
              <span className="text-sm text-gray-600">
                {widget.content.percentage || 80}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${widget.content.percentage || 80}%`,
                  backgroundColor: widget.settings.color || '#61ce70'
                }}
              />
            </div>
          </div>
        );
      
      case 'posts':
        return (
          <div className={`grid grid-cols-${widget.settings.columns || 3} gap-${widget.settings.gap || '20px'}`}>
            {Array.from({ length: widget.content.postsPerPage || 6 }, (_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Post Title {i + 1}</h3>
                  {widget.content.showExcerpt && (
                    <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'portfolio':
        return (
          <div>
            {widget.content.showFilter && (
              <div className="flex gap-2 mb-6 justify-center">
                <button className="px-4 py-2 bg-blue-500 text-white rounded">All</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Design</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Development</button>
              </div>
            )}
            <div className={`grid grid-cols-${widget.content.columns || 3} gap-4`}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="relative group overflow-hidden rounded-lg">
                  <div className="h-48 bg-gray-200"></div>
                  {widget.settings.hoverEffect === 'zoom' && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">View Project</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'testimonials':
        return (
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <p className="text-lg italic text-gray-700 mb-4">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
                </p>
                <div className="font-semibold">John Doe</div>
                <div className="text-sm text-gray-500">CEO, Company</div>
              </div>
              {widget.content.showDots && (
                <div className="flex gap-2 justify-center mt-4">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'contact-form':
        return (
          <div className="max-w-md mx-auto">
            <form className="space-y-4">
              {widget.content.fields?.includes('name') && (
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {widget.content.fields?.includes('email') && (
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {widget.content.fields?.includes('message') && (
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {widget.settings.submitText || 'Send Message'}
              </button>
            </form>
          </div>
        );

      case 'links':
      case 'footer-links':
        // Footer links widget
        const links = widget.content.links || [
          { label: 'About Us', url: '/about' },
          { label: 'Contact', url: '/contact' },
          { label: 'Privacy Policy', url: '/privacy' }
        ];
        
        return (
          <div style={getWidgetStyle({ textAlign: widget.settings.alignment || 'left' })}>
            {widget.content.title && (
              <h4 className="text-lg font-semibold mb-4" style={{ color: widget.settings.titleColor || '#374151' }}>
                {widget.content.title}
              </h4>
            )}
            <ul className="space-y-2">
              {links.map((link: any, index: number) => (
                <li key={index}>
                  <a 
                    href={link.url || '#'} 
                    className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    style={{ color: widget.settings.linkColor || '#6b7280' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'newsletter-signup':
      case 'footer-newsletter-signup':
      case 'newsletter':
        // Newsletter signup widget
        console.log('🔧 Newsletter widget debug:', {
          widgetType: widget.type,
          widgetContent: widget.content,
          widgetSettings: widget.settings
        });
        return (
          <div 
            style={getWidgetStyle({ textAlign: widget.settings?.alignment || 'left' })}
            className="newsletter-widget p-4 bg-gray-50 rounded-lg border"
          >
            <h4 className="text-lg font-semibold mb-2" style={{ color: widget.settings?.titleColor || '#374151' }}>
              {widget.content?.title || 'Newsletter'}
            </h4>
            <p className="text-sm text-gray-600 mb-4" style={{ color: widget.settings?.textColor || '#6b7280' }}>
              {widget.content?.description || 'Subscribe to get the latest updates and offers.'}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={widget.content?.placeholder || 'Enter your email'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors whitespace-nowrap"
                style={{ backgroundColor: widget.settings?.buttonColor || '#3b82f6' }}
              >
                {widget.content?.buttonText || widget.content?.button_text || 'Subscribe'}
              </button>
            </form>
            <div className="text-xs text-gray-400 mt-2">
              Newsletter Preview
            </div>
          </div>
        );

      case 'social-icons':
      case 'footer-social-icons':
        // Social icons widget
        const socialLinks = widget.content.social_links || [
          { platform: 'facebook', url: '#', icon: 'fab fa-facebook' },
          { platform: 'twitter', url: '#', icon: 'fab fa-twitter' },
          { platform: 'instagram', url: '#', icon: 'fab fa-instagram' }
        ];
        
        return (
          <div style={getWidgetStyle({ textAlign: widget.settings.alignment || 'left' })}>
            {widget.content.title && (
              <h4 className="text-lg font-semibold mb-4" style={{ color: widget.settings.titleColor || '#374151' }}>
                {widget.content.title}
              </h4>
            )}
            <div className="flex items-center space-x-3" style={{ justifyContent: widget.settings.alignment || 'left' }}>
              {socialLinks.map((social: any, index: number) => (
                <a key={index} href={social.url || '#'} className="text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {social.platform.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );

      case 'contact-info':
      case 'footer-contact-info':
        // Contact info widget
        return (
          <div style={getWidgetStyle({ textAlign: widget.settings.alignment || 'left' })}>
            {widget.content.title && (
              <h4 className="text-lg font-semibold mb-4" style={{ color: widget.settings.titleColor || '#374151' }}>
                {widget.content.title}
              </h4>
            )}
            <div className="space-y-2 text-sm">
              {widget.content.address && (
                <div className="flex items-start space-x-2">
                  <span className="text-gray-500">📍</span>
                  <span style={{ color: widget.settings.textColor || '#6b7280' }}>
                    {widget.content.address}
                  </span>
                </div>
              )}
              {widget.content.phone && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📞</span>
                  <span style={{ color: widget.settings.textColor || '#6b7280' }}>
                    {widget.content.phone}
                  </span>
                </div>
              )}
              {widget.content.email && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">✉️</span>
                  <span style={{ color: widget.settings.textColor || '#6b7280' }}>
                    {widget.content.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        // Debug unknown widget types
        console.log('❌ Unknown widget type:', widget.type, 'falling to default case');
        
        // Handle additional header elements and fallback rendering
        const renderHeaderElement = () => {
          switch (widget.type) {
            case 'social-icons':
              return (
                <div className="flex items-center space-x-3" style={{ justifyContent: widget.settings.alignment || 'left' }}>
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, index) => (
                    <a key={index} href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {social.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              );

            case 'contact-info':
              return (
                <div className="flex items-center space-x-4" style={{ justifyContent: widget.settings.alignment || 'left' }}>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span style={{ color: widget.settings.color || '#374151', fontSize: widget.settings.fontSize || '14px' }}>
                      {widget.content.phone || '+1 (555) 123-4567'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span style={{ color: widget.settings.color || '#374151', fontSize: widget.settings.fontSize || '14px' }}>
                      {widget.content.email || 'hello@example.com'}
                    </span>
                  </div>
                </div>
              );

            case 'language-switcher':
              return (
                <div className="flex" style={{ justifyContent: widget.settings.alignment || 'right' }}>
                  <div className="relative">
                    <button className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      <span className="text-sm">🌐</span>
                      <span style={{ color: widget.settings.color || '#374151', fontSize: widget.settings.fontSize || '14px' }}>
                        {widget.content.currentLanguage || 'EN'}
                      </span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );

            case 'breadcrumb':
              return (
                <nav className="flex" aria-label="Breadcrumb" style={{ justifyContent: widget.settings.alignment || 'left' }}>
                  <div className="flex items-center space-x-2 text-sm">
                    <a href="#" className="text-blue-600 hover:text-blue-800">Home</a>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <a href="#" className="text-blue-600 hover:text-blue-800">Products</a>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Current Page</span>
                  </div>
                </nav>
              );

            case 'site-logo':
              return (
                <div className="flex items-center" style={{ justifyContent: widget.settings.alignment || 'left' }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span
                      style={{
                        fontSize: widget.settings.fontSize || '20px',
                        fontWeight: widget.settings.fontWeight || 'bold',
                        color: widget.settings.color || '#1f2937'
                      }}
                    >
                      {widget.content.text || 'Site Name'}
                    </span>
                  </div>
                </div>
              );

            case 'nav-menu':
              // This is the existing nav-menu case that should render actual navigation
              return (
                <nav className="flex" style={{ 
                  justifyContent: widget.settings.alignment || 'left',
                  gap: widget.settings.gap || '30px'
                }}>
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">Home</a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">About</a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">Services</a>
                  <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">Contact</a>
                </nav>
              );

            default:
              // Final fallback for truly unknown widget types
              return (
                <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-blue-600 text-sm">
                    <span className="font-semibold">{widget.type}</span> element
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Preview not available
                  </div>
                </div>
              );
          }
        };

        return renderHeaderElement();
    }
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-1 ring-blue-500' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {renderWidgetContent()}
      
      {/* Widget Controls */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-gray-900 text-white px-2 py-0.5 rounded text-xs z-20">
          {widget.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
      )}
    </div>
  );
};

interface ColumnProps {
  column: ElementorColumn;
  isSelected: boolean;
  onClick: () => void;
  onAddWidget: (widget: any, position?: number) => void;
  selectedElement: {
    type: 'section' | 'column' | 'widget';
    id: string;
  } | null;
  setSelectedElement: (element: { type: 'section' | 'column' | 'widget'; id: string } | null) => void;
  onResizeColumn?: (columnId: string, newWidth: number) => void;
  isLastColumn?: boolean;
  onRemoveColumn?: (columnId: string) => void;
  showDeleteButton?: boolean;
  getResponsiveValue?: <T>(settings: ResponsiveSettings<T>, fallbackValue: T) => T;
  currentBreakpoint?: ResponsiveBreakpoint;
  sectionSettings?: SectionSettings;
}

const Column = ({ column, isSelected, onClick, onAddWidget, selectedElement, setSelectedElement, onResizeColumn, isLastColumn, onRemoveColumn, onDuplicateColumn, showDeleteButton, getResponsiveValue, currentBreakpoint, sectionSettings }: any) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ x: 0, y: 0 });
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'widget',
    drop: (item: any, monitor) => {
      if (!monitor.didDrop()) {
        onAddWidget({
          type: item.widgetType,
          content: item.content,
          settings: item.settings
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  // Get current responsive settings
  const columnSettings = getResponsiveValue ? getResponsiveValue(
    column.settings,
    {
      width: 100,
      padding: '20px',
      backgroundColor: 'transparent'
    }
  ) : column.settings.desktop || column.settings;

  return (
    <div
      ref={drop}
      className={`column-container min-h-24 border-2 border-dashed transition-all relative group ${
        isSelected
          ? 'border-blue-400 bg-blue-50'
          : isOver
          ? 'border-blue-500 bg-blue-100'
          : 'border-gray-300 hover:border-gray-400'
      } ${columnSettings.hidden ? 'hidden' : ''}`}
      style={{
        backgroundColor: columnSettings.backgroundColor,
        padding: columnSettings.padding || '20px',
        order: columnSettings.order || 0
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(); // Select the column
        
        // Get the position relative to the column element
        const rect = e.currentTarget.getBoundingClientRect();
        setDropdownPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setShowDropdown(true);
      }}
    >
      {/* Settings Button - Always visible on hover */}
      <div 
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(); // Select the column and open settings
            
            // Position dropdown at button location for 3-dot clicks
            const buttonRect = e.currentTarget.getBoundingClientRect();
            const columnRect = e.currentTarget.closest('.column-container')?.getBoundingClientRect() || buttonRect;
            setDropdownPosition({
              x: buttonRect.right - columnRect.left,
              y: buttonRect.bottom - columnRect.top
            });
            setShowDropdown(!showDropdown);
          }}
          className="p-1.5 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors"
          title="Column Options"
        >
          <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu - Moved outside of button container */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
          style={{
            left: `${dropdownPosition.x}px`,
            top: `${dropdownPosition.y}px`
          }}
        >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDuplicateColumn) {
                  onDuplicateColumn(column.id);
                }
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicate Column
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Clear all widgets in this column
                column.widgets.forEach(widget => {
                  // TODO: Implement clear all widgets functionality
                  console.log('Clear widget:', widget.id);
                });
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
              </svg>
              Clear Widgets
            </button>
            <div className="border-t border-gray-200 my-2"></div>
            {onRemoveColumn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveColumn(column.id);
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Column
              </button>
            )}
          </div>
        )}
      {column.widgets.length === 0 ? (
        <div 
          className="absolute inset-0 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElement(null); // Clear selection to show widgets panel
          }}
        >
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-sm">Drop widgets here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {column.widgets.map((widget) => (
            <WidgetRenderer
              key={widget.id}
              widget={widget}
              isSelected={selectedElement?.type === 'widget' && selectedElement.id === widget.id}
              onClick={() => setSelectedElement({ type: 'widget', id: widget.id })}
            />
          ))}
        </div>
      )}

      {/* Column Controls */}
      {isSelected && (
        <>
          {/* Column Resize Handle */}
          {!isLastColumn && onResizeColumn && (
            <div className="absolute top-0 right-0 bottom-0 w-1 bg-transparent hover:bg-blue-500 cursor-col-resize z-10 group">
              <div className="absolute top-1/2 -translate-y-1/2 -right-0.5 w-2 h-8 bg-blue-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface SectionProps {
  section: ElementorSection;
  isSelected: boolean;
  onClick: () => void;
  onAddSection: () => void;
  onDeleteSection: () => void;
  onDuplicateSection: () => void;
  onAddWidget: (columnId: string, widget: any, position?: number) => void;
  selectedElement: {
    type: 'section' | 'column' | 'widget';
    id: string;
  } | null;
  setSelectedElement: (element: { type: 'section' | 'column' | 'widget'; id: string } | null) => void;
  onResizeColumn?: (columnId: string, newWidth: number) => void;
  onAddColumn?: (sectionId: string) => void;
  onApplyLayout?: (sectionId: string, layout: any) => void;
  onRemoveColumn?: (sectionId: string, columnId: string) => void;
  onDuplicateColumn?: (sectionId: string, columnId: string) => void;
  getResponsiveValue?: <T>(settings: ResponsiveSettings<T>, fallbackValue: T) => T;
  currentBreakpoint?: ResponsiveBreakpoint;
}

const Section = ({
  section,
  isSelected,
  onClick,
  onAddSection,
  onDeleteSection,
  onDuplicateSection,
  onAddWidget,
  selectedElement,
  setSelectedElement,
  onResizeColumn,
  onAddColumn,
  onApplyLayout,
  onRemoveColumn,
  onDuplicateColumn,
  getResponsiveValue,
  currentBreakpoint
}: SectionProps) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ x: 0, y: 0 });
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);
  // Get current responsive settings
  const sectionSettings = getResponsiveValue ? getResponsiveValue(
    section.settings,
    {
      layout: 'boxed',
      contentWidth: '1140px',
      backgroundColor: 'transparent',
      padding: '60px 20px',
      margin: '0',
      columnsPerRow: section.columns.length,
      columnGap: '1rem',
      rowGap: '1rem',
      alignItems: 'stretch',
      justifyContent: 'start'
    }
  ) : section.settings.desktop || section.settings;


  return (
    <div
      className={`section-container relative group transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-400 shadow-lg' : ''
      }`}
      style={{
        backgroundColor: sectionSettings.backgroundColor,
        padding: sectionSettings.padding || '60px 20px',
        margin: sectionSettings.margin || '0'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(); // Select the section
        
        // Get the position relative to the section element
        const rect = e.currentTarget.getBoundingClientRect();
        setDropdownPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setShowDropdown(true);
      }}
    >
      {/* Settings Button - Always visible on hover */}
      <div 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[55]"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(); // Select the section and open settings
            
            // Position dropdown at button location for 3-dot clicks
            const buttonRect = e.currentTarget.getBoundingClientRect();
            const sectionRect = e.currentTarget.closest('.section-container')?.getBoundingClientRect() || buttonRect;
            setDropdownPosition({
              x: buttonRect.right - sectionRect.left,
              y: buttonRect.bottom - sectionRect.top
            });
            setShowDropdown(!showDropdown);
          }}
          className="p-2 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors"
          title="Section Options"
        >
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu - Moved outside of button container */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-[60]"
          style={{
            left: `${dropdownPosition.x}px`,
            top: `${dropdownPosition.y}px`
          }}
        >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSection();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Section After
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateSection();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicate Section
            </button>
            {onAddColumn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddColumn(section.id);
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                </svg>
                Add Column
              </button>
            )}
            {onApplyLayout && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyLayout(section.id);
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V17m0-10a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
                </svg>
                Column Layout
              </button>
            )}
            <div className="border-t border-gray-200 my-2"></div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('🗑️ Delete Section button clicked for section:', section.id);
                onDeleteSection();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Section
            </button>
          </div>
        )}

      {/* Section Controls */}
      {isSelected && (
        <>
          {/* Top Controls */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-white border border-gray-200 rounded px-2 py-1 shadow-sm z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSection();
              }}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Add Section"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateSection();
              }}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Duplicate Section"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            
            {/* Column Management */}
            {onAddColumn && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddColumn(section.id);
                }}
                className="p-1 text-gray-600 hover:bg-green-100 hover:text-green-600 rounded transition-colors"
                title="Add Column"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            )}
            
            {/* Layout Presets */}
            {onApplyLayout && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyLayout(section.id);
                }}
                className="p-1 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors"
                title="Column Layout Presets"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0V17m0-10a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
                </svg>
              </button>
            )}
            
            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1"></div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('🗑️ Delete Section (quick button) clicked for section:', section.id);
                onDeleteSection();
              }}
              className="p-1 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
              title="Delete Section"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Section Content */}
      <div 
        className={`mx-auto grid ${
          sectionSettings.layout === 'boxed' ? 'max-w-7xl' : 'w-full'
        }`}
        style={{
          maxWidth: sectionSettings.layout === 'boxed' ? sectionSettings.contentWidth : undefined,
          gap: sectionSettings.columnGap || '1rem',
          gridTemplateColumns: section.columns.map(column => {
            // Get width directly from column settings
            const width = column.settings?.desktop?.width || 
                         column.settings?.width || 
                         (100 / section.columns.length); // Equal width fallback
            
            console.log('Column settings:', column.settings);
            console.log('Extracted width:', width);
            
            // Convert percentage to fr units with precise mapping
            let frValue;
            if (width >= 65) {
              frValue = 2; // 66.67% -> 2fr
            } else if (width >= 30 && width <= 35) {
              frValue = 1; // 33.33% -> 1fr  
            } else if (width >= 48 && width <= 52) {
              frValue = 1; // 50% -> 1fr
            } else if (width >= 23 && width <= 27) {
              frValue = 1; // 25% -> 1fr
            } else {
              frValue = Math.round(width / 25) || 1; // Fallback
            }
            
            console.log(`Column width: ${width}% -> ${frValue}fr`);
            return `${frValue}fr`;
          }).join(' '),
          alignItems: sectionSettings.alignItems || 'stretch',
          justifyContent: sectionSettings.justifyContent || 'start',
          gridAutoRows: 'min-content',
        }}
      >
        {section.columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            isSelected={selectedElement?.type === 'column' && selectedElement.id === column.id}
            onClick={() => setSelectedElement({ type: 'column', id: column.id })}
            onAddWidget={(widget, position) => onAddWidget(column.id, widget, position)}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            onResizeColumn={onResizeColumn}
            isLastColumn={index === section.columns.length - 1}
            onRemoveColumn={onRemoveColumn ? (columnId) => onRemoveColumn(section.id, columnId) : undefined}
            onDuplicateColumn={onDuplicateColumn ? (columnId) => onDuplicateColumn(section.id, columnId) : undefined}
            showDeleteButton={section.columns.length > 1}
            getResponsiveValue={getResponsiveValue}
            currentBreakpoint={currentBreakpoint}
          />
        ))}
      </div>
    </div>
  );
};

export const ElementorCanvas = forwardRef<HTMLDivElement, ElementorCanvasProps>(({
  sections,
  setSections,
  selectedElement,
  setSelectedElement,
  devicePreview,
  isPreviewMode,
  onAddSection,
  onDeleteSection,
  onDuplicateSection,
  onAddWidget,
  onClearAllSections,
  saveHistory,
  headerData,
  footerData,
  onAddColumn,
  onApplyLayout,
  onRemoveColumn,
  onDuplicateColumn,
  onResizeColumn,
  getResponsiveValue,
  currentBreakpoint,
  layoutMode,
  onSelectLayout
}, ref) => {
  const getCanvasWidth = () => {
    switch (devicePreview) {
      case 'tablet':
        return '768px';
      case 'mobile':
        return '375px';
      default:
        return '100%';
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'widget',
    drop: () => {},
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <div
      ref={drop}
      className="flex-1 bg-gray-50 overflow-auto"
      onClick={() => setSelectedElement(null)}
    >
      <div className="p-6 min-h-full">
        <BrowserFrame 
          devicePreview={devicePreview}
          websiteUrl={headerData?.data?.site_title ? `https://${headerData.data.site_title.toLowerCase().replace(/\s+/g, '')}.com` : "https://yourwebsite.com"}
        >
          <div
            className="flex flex-col transition-all duration-300"
            style={{
              width: getCanvasWidth(),
              minHeight: devicePreview === 'desktop' ? '100vh' : '100%'
            }}
            ref={ref}
          >
            {/* Render based on layout mode */}
            {layoutMode === 'header' ? (
              <>
                {/* Header Builder Mode - Only show the header preview */}
                <HeaderPreviewRenderer
                  sections={sections}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  onAddSection={onAddSection}
                  onDeleteSection={onDeleteSection}
                  onDuplicateSection={onDuplicateSection}
                  onAddWidget={onAddWidget}
                  onAddColumn={onAddColumn}
                  onApplyLayout={onApplyLayout}
                  onRemoveColumn={onRemoveColumn}
                  onDuplicateColumn={onDuplicateColumn}
                  getResponsiveValue={getResponsiveValue}
                  currentBreakpoint={currentBreakpoint}
                  onSelectLayout={onSelectLayout}
                />
                {/* Website content placeholder */}
                <main className="bg-gray-50 py-16 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <h2 className="text-2xl font-medium mb-2">Your website content here</h2>
                    <p className="text-sm">This area will display your actual website content</p>
                  </div>
                </main>

              </>
            ) : layoutMode === 'footer' ? (
              <>
                {/* Website content placeholder */}
                <main className="bg-gray-50 py-16 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <h2 className="text-2xl font-medium mb-2">Your website content here</h2>
                    <p className="text-sm">This area will display your actual website content</p>
                  </div>
                </main>
                {/* Footer Builder Mode - Only show the footer preview */}
                <FooterPreviewRenderer
                  sections={sections}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  onAddSection={onAddSection}
                  onDeleteSection={onDeleteSection}
                  onDuplicateSection={onDuplicateSection}
                  onAddWidget={onAddWidget}
                  onAddColumn={onAddColumn}
                  onApplyLayout={onApplyLayout}
                  onRemoveColumn={onRemoveColumn}
                  onDuplicateColumn={onDuplicateColumn}
                  getResponsiveValue={getResponsiveValue}
                  currentBreakpoint={currentBreakpoint}
                  onSelectLayout={onSelectLayout}
                />
              </>
            ) : (
              <>
                {/* Normal Page Mode - Show header, content, footer */}
                <HeaderRenderer headerData={headerData} />
                
                {/* Main Content Area */}
                <main className="flex-1">
                  {sections.length === 0 ? (
                    <div className="flex items-center justify-center min-h-96 border-2 border-dashed border-gray-300 rounded-lg m-8">
                      <div className="text-center text-gray-500">
                        <h3 className="text-xl font-semibold mb-2">Start Building Your Page</h3>
                        <p className="text-sm mb-4">Choose a column layout to begin</p>
                        <ColumnSelectionInterface 
                          onSelectLayout={onSelectLayout}
                          position="top"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Clear All Button - Show when sections exist */}
                      {sections.length > 0 && onClearAllSections && (
                        <div className="flex justify-end p-4 bg-gray-50 border-b border-gray-200">
                          <button
                            onClick={onClearAllSections}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear All Sections
                          </button>
                        </div>
                      )}
                      
                      <div className="space-y-0">
                        {sections.map((section, index) => (
                          <React.Fragment key={section.id}>
                            <Section
                              section={section}
                              isSelected={selectedElement?.type === 'section' && selectedElement.id === section.id}
                              onClick={() => setSelectedElement({ type: 'section', id: section.id })}
                              onAddSection={() => onAddSection(section.id)}
                              onDeleteSection={() => onDeleteSection(section.id)}
                              onDuplicateSection={() => onDuplicateSection(section.id)}
                              onAddWidget={onAddWidget}
                              selectedElement={selectedElement}
                              setSelectedElement={setSelectedElement}
                              onAddColumn={onAddColumn}
                              onApplyLayout={onApplyLayout}
                              onRemoveColumn={onRemoveColumn}
                              onDuplicateColumn={onDuplicateColumn}
                              getResponsiveValue={getResponsiveValue}
                              currentBreakpoint={currentBreakpoint}
                            />
                            {/* Add section interface between sections */}
                            {index < sections.length - 1 && (
                              <ColumnSelectionInterface 
                                onSelectLayout={(layout) => onAddSection(section.id, layout)}
                                position="between"
                                afterSectionId={section.id}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      
                      {/* Column Selection Interface */}
                      <ColumnSelectionInterface 
                        onSelectLayout={onSelectLayout}
                        position="bottom"
                      />
                    </>
                  )}
                </main>
                
                <FooterRenderer footerData={footerData} />
              </>
            )}
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
});