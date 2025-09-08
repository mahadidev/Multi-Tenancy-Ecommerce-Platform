'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Website } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useRoutes } from '@/lib/routes';
import { AccountButton } from '@/components/auth/AccountButton';
import { NavigationMenu } from '@/components/navigation/NavigationMenu';

interface HeaderElement {
  id: string;
  type: 'logo' | 'nav' | 'navigation' | 'cta' | 'search' | 'cart' | 'account';
  content?: string;
  styles?: {
    // Typography
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    textDecoration?: string;
    color?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    
    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    
    // Border
    border?: {
      width?: { top?: string; right?: string; bottom?: string; left?: string; };
      style?: { top?: string; right?: string; bottom?: string; left?: string; };
      color?: { top?: string; right?: string; bottom?: string; left?: string; };
      radius?: { topLeft?: string; topRight?: string; bottomLeft?: string; bottomRight?: string; };
    };
    
    // Spacing
    padding?: { top?: string; right?: string; bottom?: string; left?: string; };
    margin?: { top?: string; right?: string; bottom?: string; left?: string; };
    
    // Layout
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    display?: string;
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    
    // Position
    position?: 'static' | 'relative' | 'absolute' | 'fixed';
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: string;
    
    // Effects
    opacity?: string;
    transform?: string;
    transition?: string;
    boxShadow?: string;
    filter?: string;
  };
  props?: any;
}

interface HeaderColumn {
  id: string;
  elements: HeaderElement[];
  alignment: 'left' | 'center' | 'right';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  flexDirection?: 'row' | 'column';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  width?: string;
  styles?: {
    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    
    // Border
    border?: {
      width?: { top?: string; right?: string; bottom?: string; left?: string; };
      style?: { top?: string; right?: string; bottom?: string; left?: string; };
      color?: { top?: string; right?: string; bottom?: string; left?: string; };
      radius?: { topLeft?: string; topRight?: string; bottomLeft?: string; bottomRight?: string; };
    };
    
    // Spacing
    padding?: { top?: string; right?: string; bottom?: string; left?: string; };
    margin?: { top?: string; right?: string; bottom?: string; left?: string; };
    
    // Layout
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    
    // Effects
    opacity?: string;
    transform?: string;
    transition?: string;
    boxShadow?: string;
    filter?: string;
  };
}

interface HeaderRow {
  id: string;
  name?: string;
  columns: HeaderColumn[];
  styles?: {
    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    
    // Border
    border?: {
      width?: { top?: string; right?: string; bottom?: string; left?: string; };
      style?: { top?: string; right?: string; bottom?: string; left?: string; };
      color?: { top?: string; right?: string; bottom?: string; left?: string; };
      radius?: { topLeft?: string; topRight?: string; bottomLeft?: string; bottomRight?: string; };
    };
    
    // Spacing
    padding?: { top?: string; right?: string; bottom?: string; left?: string; };
    margin?: { top?: string; right?: string; bottom?: string; left?: string; };
    
    // Layout
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    
    // Effects
    opacity?: string;
    transform?: string;
    transition?: string;
    boxShadow?: string;
    filter?: string;
  };
  
  // Deprecated - kept for backward compatibility
  padding?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  backgroundColor?: string;
  marginBottom?: string;
}

interface HeaderData {
  columns?: HeaderColumn[];
  rows?: HeaderRow[]; // New row-based structure
  elements?: HeaderElement[]; // For backward compatibility
  settings: {
    layout?: 'grid' | 'horizontal' | 'centered';
    columnCount?: number;
    backgroundColor: string;
    textColor: string;
    padding: string;
    maxWidth: string;
    sticky: boolean;
  };
}

interface HeaderRendererProps {
  website: Website;
}

// Helper function to convert styling structure to CSS
function stylesToCSS(styles: any): React.CSSProperties {
  if (!styles) return {};
  
  const css: React.CSSProperties = {};
  
  // Typography
  if (styles.fontSize) css.fontSize = styles.fontSize;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight;
  if (styles.textAlign) css.textAlign = styles.textAlign;
  if (styles.textDecoration) css.textDecoration = styles.textDecoration;
  if (styles.color) css.color = styles.color;
  if (styles.lineHeight) css.lineHeight = styles.lineHeight;
  if (styles.letterSpacing) css.letterSpacing = styles.letterSpacing;
  if (styles.textTransform) css.textTransform = styles.textTransform;
  
  // Background
  if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor;
  if (styles.backgroundImage) css.backgroundImage = styles.backgroundImage;
  if (styles.backgroundSize) css.backgroundSize = styles.backgroundSize;
  if (styles.backgroundPosition) css.backgroundPosition = styles.backgroundPosition;
  if (styles.backgroundRepeat) css.backgroundRepeat = styles.backgroundRepeat;
  
  // Border
  if (styles.border) {
    const border = styles.border;
    
    // Handle different border data structures
    // Structure 1: Individual side objects (from your data)
    // Structure 2: Nested width/style/color objects (expected format)
    
    let topWidth = '0', rightWidth = '0', bottomWidth = '0', leftWidth = '0';
    let topStyle = 'solid', rightStyle = 'solid', bottomStyle = 'solid', leftStyle = 'solid';
    let topColor = '#000000', rightColor = '#000000', bottomColor = '#000000', leftColor = '#000000';
    
    // Check for individual side objects (your data format)
    if (border.top) {
      topWidth = border.top.width || '0';
      topStyle = border.top.style || 'solid';
      topColor = border.top.color || '#000000';
    }
    if (border.right) {
      rightWidth = border.right.width || '0';
      rightStyle = border.right.style || 'solid';
      rightColor = border.right.color || '#000000';
    }
    if (border.bottom) {
      bottomWidth = border.bottom.width || '0';
      bottomStyle = border.bottom.style || 'solid';
      bottomColor = border.bottom.color || '#000000';
    }
    if (border.left) {
      leftWidth = border.left.width || '0';
      leftStyle = border.left.style || 'solid';
      leftColor = border.left.color || '#000000';
    }
    
    // Check for nested width/style/color objects (expected format)
    if (border.width) {
      topWidth = border.width.top || topWidth;
      rightWidth = border.width.right || rightWidth;
      bottomWidth = border.width.bottom || bottomWidth;
      leftWidth = border.width.left || leftWidth;
    }
    if (border.style) {
      topStyle = border.style.top || topStyle;
      rightStyle = border.style.right || rightStyle;
      bottomStyle = border.style.bottom || bottomStyle;
      leftStyle = border.style.left || leftStyle;
    }
    if (border.color) {
      topColor = border.color.top || topColor;
      rightColor = border.color.right || rightColor;
      bottomColor = border.color.bottom || bottomColor;
      leftColor = border.color.left || leftColor;
    }
    
    // Apply border properties only if width is greater than 0
    const hasTopBorder = topWidth && topWidth !== '0' && topWidth !== '0px';
    const hasRightBorder = rightWidth && rightWidth !== '0' && rightWidth !== '0px';
    const hasBottomBorder = bottomWidth && bottomWidth !== '0' && bottomWidth !== '0px';
    const hasLeftBorder = leftWidth && leftWidth !== '0' && leftWidth !== '0px';
    
    if (hasTopBorder) {
      css.borderTopWidth = topWidth;
      css.borderTopStyle = topStyle as React.CSSProperties['borderTopStyle'];
      css.borderTopColor = topColor;
    }
    if (hasRightBorder) {
      css.borderRightWidth = rightWidth;
      css.borderRightStyle = rightStyle as React.CSSProperties['borderRightStyle'];
      css.borderRightColor = rightColor;
    }
    if (hasBottomBorder) {
      css.borderBottomWidth = bottomWidth;
      css.borderBottomStyle = bottomStyle as React.CSSProperties['borderBottomStyle'];
      css.borderBottomColor = bottomColor;
    }
    if (hasLeftBorder) {
      css.borderLeftWidth = leftWidth;
      css.borderLeftStyle = leftStyle as React.CSSProperties['borderLeftStyle'];
      css.borderLeftColor = leftColor;
    }
    
    // Set border radius
    if (border.radius) {
      css.borderTopLeftRadius = border.radius.topLeft || '0';
      css.borderTopRightRadius = border.radius.topRight || '0';
      css.borderBottomLeftRadius = border.radius.bottomLeft || '0';
      css.borderBottomRightRadius = border.radius.bottomRight || '0';
    }
  }
  
  // Spacing
  if (styles.padding) {
    css.paddingTop = styles.padding.top || '0';
    css.paddingRight = styles.padding.right || '0';
    css.paddingBottom = styles.padding.bottom || '0';
    css.paddingLeft = styles.padding.left || '0';
  }
  if (styles.margin) {
    css.marginTop = styles.margin.top || '0';
    css.marginRight = styles.margin.right || '0';
    css.marginBottom = styles.margin.bottom || '0';
    css.marginLeft = styles.margin.left || '0';
  }
  
  // Layout
  if (styles.width) css.width = styles.width;
  if (styles.height) css.height = styles.height;
  if (styles.minWidth) css.minWidth = styles.minWidth;
  if (styles.minHeight) css.minHeight = styles.minHeight;
  if (styles.maxWidth) css.maxWidth = styles.maxWidth;
  if (styles.maxHeight) css.maxHeight = styles.maxHeight;
  if (styles.display) css.display = styles.display;
  if (styles.flexDirection) css.flexDirection = styles.flexDirection;
  if (styles.justifyContent) css.justifyContent = styles.justifyContent;
  if (styles.alignItems) css.alignItems = styles.alignItems;
  
  // Position
  if (styles.position) css.position = styles.position;
  if (styles.top) css.top = styles.top;
  if (styles.right) css.right = styles.right;
  if (styles.bottom) css.bottom = styles.bottom;
  if (styles.left) css.left = styles.left;
  if (styles.zIndex) css.zIndex = styles.zIndex;
  
  // Effects
  if (styles.opacity) css.opacity = styles.opacity;
  if (styles.transform) css.transform = styles.transform;
  if (styles.transition) css.transition = styles.transition;
  if (styles.boxShadow) css.boxShadow = styles.boxShadow;
  if (styles.filter) css.filter = styles.filter;
  
  return css;
}

// Helper function to convert page builder sections to header rows
function convertPageBuilderSectionsToRows(elements: any[]): HeaderRow[] {
  if (!elements || !Array.isArray(elements)) return [];
  
  // Check if this is page builder format (sections with columns and widgets)
  const isPageBuilderFormat = elements.length > 0 && 
    elements[0].columns && 
    Array.isArray(elements[0].columns);
  
  if (!isPageBuilderFormat) {
    // This is the old format, return as-is for backward compatibility
    return [];
  }
  
  // Convert page builder sections to header rows
  return elements.map((section, sectionIndex) => {
    const headerColumns: HeaderColumn[] = section.columns.map((column: any) => {
      // Convert widgets to header elements
      const headerElements: HeaderElement[] = column.widgets?.map((widget: any) => {
        // Map widget types to header element types
        let elementType = widget.type;
        
        // Map common widget types to header element types
        const typeMapping: { [key: string]: string } = {
          'site-logo': 'logo',
          'nav-menu': 'navigation',
          'navigation': 'navigation',
          'button': 'cta',
          'search-bar': 'search',
          'shopping-cart': 'cart',
          'user-account': 'account',
        };
        
        elementType = typeMapping[widget.type] || widget.type;
        
        return {
          id: widget.id,
          type: elementType,
          content: widget.content?.text || widget.content?.content || '',
          props: {
            ...widget.content,
            ...widget.props,
          },
          styles: widget.settings || widget.styles,
        };
      }) || [];
      
      // Get column settings for alignment and justification
      const columnSettings = column.settings?.desktop || column.settings;
      
      // Map justifyContent values from builder format to renderer format
      let justifyContent = columnSettings?.justifyContent || 'start';
      
      // Handle both flex and non-flex value formats from the builder
      const justifyContentMapping: { [key: string]: string } = {
        'flex-start': 'start',
        'flex-end': 'end',
        'space-between': 'between',
        'space-around': 'around',
        'space-evenly': 'evenly',
        'start': 'start',
        'center': 'center',
        'end': 'end',
        'between': 'between',
        'around': 'around',
        'evenly': 'evenly'
      };
      
      justifyContent = justifyContentMapping[justifyContent] || justifyContent;
      
      // Map alignment values (for backward compatibility)
      let alignment = 'left' as const;
      if (justifyContent === 'center') alignment = 'center' as const;
      if (justifyContent === 'end') alignment = 'right' as const;

      return {
        id: column.id,
        elements: headerElements,
        alignment: alignment,
        justifyContent: justifyContent as any,
        alignItems: columnSettings?.alignItems || 'center',
        flexDirection: columnSettings?.flexDirection || 'row',
        gap: columnSettings?.gap || 'md',
        styles: columnSettings,
      };
    });
    
    return {
      id: section.id || `row-${sectionIndex}`,
      name: `Row ${sectionIndex + 1}`,
      columns: headerColumns,
      styles: section.settings?.desktop || section.settings,
    };
  });
}

export function HeaderRenderer({ website }: HeaderRendererProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // header_data comes pre-parsed from the backend
  let headerData: HeaderData | null = null;
  if (website.header_data) {
    // Check if it's already an object or needs parsing
    if (typeof website.header_data === 'string') {
      try {
        headerData = JSON.parse(website.header_data);
      } catch (error) {
        console.warn('Failed to parse header_data:', error);
      }
    } else {
      headerData = website.header_data as HeaderData;
    }
  }

  // If no custom header data, fallback to original Navigation component logic
  if (!headerData) {
    return <DefaultHeaderNavigation website={website} />;
  }

  const { columns, rows, elements, settings } = headerData;
  
  // Ensure settings has default values for layout
  const headerSettings = {
    layout: 'horizontal', // Default to horizontal/flex layout
    backgroundColor: '#ffffff',
    textColor: '#374151',
    padding: '0',
    maxWidth: 'container',
    sticky: false,
    ...settings // Override with actual settings if provided
  };

  // Use rows if available, otherwise convert page builder elements, then fallback to columns
  let headerRows: HeaderRow[] = [];
  
  if (rows) {
    headerRows = rows;
  } else if (elements && elements.length > 0) {
    // Try to convert page builder elements to rows
    const convertedRows = convertPageBuilderSectionsToRows(elements);
    if (convertedRows.length > 0) {
      headerRows = convertedRows;
    } else {
      // Fallback to treating elements as legacy header elements
      headerRows = [{
        id: 'legacy-row',
        name: 'Main Row', 
        columns: [{ 
          id: 'legacy-column', 
          elements, 
          alignment: 'left' as const,
          justifyContent: 'start' as const
        }]
      }];
    }
  } else if (columns) {
    headerRows = [{ 
      id: 'legacy-row',
      name: 'Main Row',
      columns: columns
    }];
  }
  
  console.log('🏗️ HeaderRenderer Debug:', {
    originalData: headerData,
    hasRows: !!rows,
    hasElements: !!elements,
    elementsLength: elements?.length || 0,
    hasColumns: !!columns,
    finalHeaderRows: headerRows,
    headerRowsCount: headerRows.length
  });

  // Extract contentWidth from the first section's settings if available
  let contentWidth = headerSettings.maxWidth;
  if (headerRows.length > 0 && headerRows[0].styles) {
    const sectionSettings = headerRows[0].styles;
    if (sectionSettings.contentWidth) {
      contentWidth = sectionSettings.contentWidth;
    }
  }

  const headerStyle: React.CSSProperties = {
    backgroundColor: headerSettings.backgroundColor,
    color: headerSettings.textColor,
    padding: headerSettings.padding,
    position: headerSettings.sticky ? 'sticky' : 'static',
    top: headerSettings.sticky ? 0 : 'auto',
    zIndex: headerSettings.sticky ? 50 : 'auto',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  };

  // Handle max width - check for specific pixel values or use Tailwind classes
  let maxWidthClass = 'container mx-auto';
  let maxWidthStyle: React.CSSProperties = {};
  
  if (contentWidth === 'full') {
    maxWidthClass = 'w-full';
  } else if (contentWidth && contentWidth !== 'container' && contentWidth.includes('px')) {
    // Use inline styles for specific pixel values like '1140px'
    maxWidthClass = 'mx-auto';
    maxWidthStyle.maxWidth = contentWidth;
  }
  const hasNavElements = headerRows.some(row => 
    row.columns.some(col => 
      col.elements.some(el => el.type === 'nav' || el.type === 'navigation')
    )
  );

  return (
    <header style={headerStyle} className="border-b">
      <div className={`${maxWidthClass} px-4 relative`} style={maxWidthStyle}>
        {/* Render each row */}
        {headerRows.length > 0 ? (
            headerRows.map((row) => (
              <HeaderRowRenderer
                key={row.id}
                row={row}
                website={website}
                settings={headerSettings}
              />
            ))
        ) : (
          /* No rows - fallback */
          <div className="h-16 flex items-center justify-center w-full">
            <span className="text-gray-400">No header content</span>
          </div>
        )}

        {/* Mobile menu button - positioned absolutely */}
        {hasNavElements && (
          <div className="md:hidden absolute top-1/2 right-4 transform -translate-y-1/2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && hasNavElements && (
          <MobileMenu 
            website={website} 
            onClose={() => setMobileMenuOpen(false)} 
          />
        )}
      </div>
    </header>
  );
}

interface HeaderRowRendererProps {
  row: HeaderRow;
  website: Website;
  settings: HeaderData['settings'];
}

function HeaderRowRenderer({ row, website, settings }: HeaderRowRendererProps) {
  console.log('🏗️ HeaderRowRenderer Debug:', {
    layout: settings.layout,
    columnsCount: row.columns.length,
    willUseGrid: settings.layout === 'grid'
  });
  
  // Use new styling structure or fall back to legacy properties
  let rowStyle: React.CSSProperties = {};
  
  // Check both 'styles' and 'styling' properties for backward compatibility
  const styling = (row as any).styles || (row as any).styling;
  
  if (styling || row.padding || row.backgroundColor || row.marginBottom) {
    // Merge new comprehensive styling with legacy properties
    
    // Start with new comprehensive styling
    rowStyle = styling ? stylesToCSS(styling) : {};
    
    // Override/merge with legacy properties if they exist
    if (row.padding?.top) rowStyle.paddingTop = row.padding.top;
    if (row.padding?.bottom) rowStyle.paddingBottom = row.padding.bottom;
    if (row.padding?.left) rowStyle.paddingLeft = row.padding.left;
    if (row.padding?.right) rowStyle.paddingRight = row.padding.right;
    if (row.backgroundColor) rowStyle.backgroundColor = row.backgroundColor;
    if (row.marginBottom) rowStyle.marginBottom = row.marginBottom;
  } else {
    // No styling at all - use defaults
    rowStyle = {
      backgroundColor: 'transparent',
      padding: '0',
    };
  }

  return (
    <div style={rowStyle} className="min-h-[64px] flex flex-col justify-center">
      <div className="flex items-center h-full w-full">
        {/* Layout based on settings */}
        {row.columns.length > 0 ? (
          (settings.layout === 'grid') ? (
            /* Grid Layout - Equal width columns */
            <div 
              className="grid gap-4 w-full h-full" 
              style={{ 
                gridTemplateColumns: `repeat(${row.columns.length}, 1fr)`,
                alignItems: 'stretch'
              }}
            >
              {row.columns.map((column) => (
                <HeaderColumnRenderer
                  key={column.id}
                  column={column}
                  website={website}
                />
              ))}
            </div>
          ) : (
            /* Flex Layout - Flexible width columns */
            <div className="flex items-stretch justify-start w-full h-full gap-4">
              {row.columns.map((column) => {
                // Get column width from settings, default to equal flex
                const columnWidth = column.settings?.desktop?.width || (100 / row.columns.length);
                const columnStyle = {
                  flexBasis: `${columnWidth}%`,
                  flexGrow: 0,
                  flexShrink: 0
                };
                
                return (
                  <div key={column.id} style={columnStyle}>
                    <HeaderColumnRenderer
                      column={column}
                      website={website}
                    />
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* No columns - fallback */
          <div className="flex items-center justify-center w-full">
            <span className="text-gray-400">No content in this row</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface HeaderColumnRendererProps {
  column: HeaderColumn;
  website: Website;
}

function HeaderColumnRenderer({ column, website }: HeaderColumnRendererProps) {
  // Use the new flex properties or fall back to alignment
  const flexDirection = column.flexDirection || 'row';
  const justifyContent = column.justifyContent || (
    column.alignment === 'center' ? 'center' :
    column.alignment === 'right' ? 'end' : 'start'
  );
  const alignItems = column.alignItems || 'center';
  const gap = column.gap || 'md';
  

  const justifyClass = 
    justifyContent === 'center' ? 'justify-center' :
    justifyContent === 'end' ? 'justify-end' :
    justifyContent === 'between' ? 'justify-between' :
    justifyContent === 'around' ? 'justify-around' :
    justifyContent === 'evenly' ? 'justify-evenly' : 'justify-start';

  const alignClass = 
    alignItems === 'center' ? 'items-center' :
    alignItems === 'end' ? 'items-end' :
    alignItems === 'stretch' ? 'items-stretch' : 'items-start';

  const gapClass = 
    gap === 'none' ? 'gap-0' :
    gap === 'sm' ? 'gap-2' :
    gap === 'lg' ? 'gap-6' : 'gap-4';

  const flexClass = flexDirection === 'column' ? 'flex-col' : 'flex-row';

  // Apply column styling, but exclude width since it's handled by flex wrapper
  const columnStyle = column.styles ? stylesToCSS(column.styles) : {};
  const { width, ...filteredColumnStyle } = columnStyle;

  return (
    <div 
      className={`flex w-full h-full ${flexClass} ${justifyClass} ${alignClass} ${gapClass}`}
      style={filteredColumnStyle}
    >
      {column.elements.map((element) => (
        <HeaderElement
          key={element.id}
          element={element}
          website={website}
        />
      ))}
    </div>
  );
}

interface HeaderElementProps {
  element: HeaderElement;
  website: Website;
}

function HeaderElement({ element, website }: HeaderElementProps) {
  const { type, content, styles, props } = element;

  const elementStyle = styles ? stylesToCSS(styles) : {};

  switch (type) {
    case 'logo':
      return (
        <div className="flex items-center" style={elementStyle}>
          <Link href="/" className="flex items-center space-x-2">
            {website.store.logo && (
              <div className="relative w-8 h-8">
                <Image
                  src={website.store.logo}
                  alt={website.store.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-xl font-semibold">
              {content || website.store.name}
            </span>
          </Link>
        </div>
      );

    case 'nav':
    case 'navigation':
      const headerMenus = website.menus.filter(menu => menu.location === 'header');
      const primaryMenu = headerMenus[0];
      
      if (!primaryMenu) return null;

      return (
        <div style={elementStyle} className="flex items-center h-full">
          <NavigationMenu
            menu={primaryMenu}
            subdomain={website.subdomain}
            className="navigation-menu"
            orientation="horizontal"
            showDropdowns={true}
            mobileBreakpoint="md"
          />
        </div>
      );

    case 'cta':
      return (
        <div style={elementStyle}>
          <Link
            href={props?.href || '#'}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {content || 'Get Started'}
          </Link>
        </div>
      );

    case 'search':
      return (
        <div className="hidden md:block" style={elementStyle}>
          <div className="relative max-w-md">
            <input
              type="search"
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      );

    case 'cart':
      return (
        <div style={elementStyle}>
          <CartIcon subdomain={website.subdomain} />
        </div>
      );
    case 'account':
      return (
        <div style={elementStyle}>
          <AccountButton />
        </div>
      );

    default:
      return null;
  }
}

interface MobileMenuProps {
  website: Website;
  onClose: () => void;
}

function MobileMenu({ website, onClose }: MobileMenuProps) {
  const headerMenus = website.menus.filter(menu => menu.location === 'header');
  const primaryMenu = headerMenus[0];

  if (!primaryMenu) return null;

  return (
    <div className="md:hidden">
      <NavigationMenu
        menu={primaryMenu}
        subdomain={website.subdomain}
        className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t"
        orientation="vertical"
        showDropdowns={false}
        mobileBreakpoint="sm"
      />
    </div>
  );
}

// Fallback component that renders the original navigation logic
function DefaultHeaderNavigation({ website }: { website: Website }) {
  const headerMenus = website.menus.filter(menu => menu.location === 'header');
  const primaryMenu = headerMenus[0];

  if (!primaryMenu) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b" style={primaryMenu.styles}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {website.store.logo && (
                <div className="relative w-8 h-8">
                  <Image
                    src={website.store.logo}
                    alt={website.store.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-xl font-semibold text-gray-900">
                {website.store.name}
              </span>
            </Link>
          </div>

          {/* Desktop and Mobile Menu */}
          <NavigationMenu
            menu={primaryMenu}
            subdomain={website.subdomain}
            className=""
            orientation="horizontal"
            showDropdowns={true}
            mobileBreakpoint="md"
          />
        </div>
      </div>
    </nav>
  );
}

// Cart Icon Component with dynamic count
function CartIcon({ subdomain }: { subdomain: string }) {
  const { totalCount, items } = useCart();
  const routes = useRoutes(subdomain);

  return (
    <Link
      href={routes.buildPageUrl('cart')}
      className="relative inline-flex items-center p-2 text-gray-700 hover:text-blue-600"
      title={`Cart (${totalCount} items)`}
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5a1 1 0 00.95 1.25h9.3a1 1 0 001-.8L19 9M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
      </svg>
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalCount}
        </span>
      )}
    </Link>
  );
}