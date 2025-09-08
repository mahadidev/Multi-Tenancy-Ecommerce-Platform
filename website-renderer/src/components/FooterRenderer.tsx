'use client';

import { Website } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface FooterColumn {
  id: string;
  title?: string;
  elements: FooterElement[];
  alignment: 'left' | 'center' | 'right';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  flexDirection?: 'row' | 'column';
  gap?: 'none' | 'sm' | 'md' | 'lg';
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

interface FooterElement {
  id: string;
  type: 'logo' | 'nav' | 'navigation' | 'contact' | 'social' | 'newsletter' | 'copyright' | 'text' | 'links';
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

interface FooterRow {
  id: string;
  name?: string;
  columns: FooterColumn[];
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

interface FooterData {
  columns?: FooterColumn[];
  rows?: FooterRow[]; // New row-based structure
  settings: {
    backgroundColor: string;
    textColor: string;
    layout: string;
    showCopyright: boolean;
    copyrightText?: string;
    _layoutRows?: FooterRow[]; // Backup row structure
  };
}

interface FooterRendererProps {
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

export function FooterRenderer({ website }: FooterRendererProps) {
  // footer_data comes pre-parsed from the backend
  let footerData: FooterData | null = null;
  if (website.footer_data) {
    // Check if it's already an object or needs parsing
    if (typeof website.footer_data === 'string') {
      try {
        footerData = JSON.parse(website.footer_data);
      } catch (error) {
        console.warn('Failed to parse footer_data:', error);
      }
    } else {
      footerData = website.footer_data as FooterData;
    }
  }

  // If no custom footer data, fallback to original Footer component logic
  if (!footerData) {
    return <DefaultFooter website={website} />;
  }

  const { columns, rows, settings } = footerData;
  const currentYear = new Date().getFullYear();

  // Use multiple fallback strategies to find row data
  let footerRows: FooterRow[] = [];

  if (rows) {
    footerRows = rows;
  } else if (settings._layoutRows) {
    footerRows = settings._layoutRows;
  } else if (columns) {
    // Try to reconstruct from column metadata
    const hasRowMetadata = columns.some((col: any) => col._rowId);

    if (hasRowMetadata) {
      const rowsMap = new Map<string, FooterRow>();

      columns.forEach((column: any) => {
        const rowId = column._rowId || 'legacy-row';
        const rowName = column._rowName || 'Main Row';

        if (!rowsMap.has(rowId)) {
          rowsMap.set(rowId, {
            id: rowId,
            name: rowName,
            columns: []
          });
        }

        // Remove row metadata from column
        const cleanColumn = { ...column };
        delete cleanColumn._rowId;
        delete cleanColumn._rowName;
        delete cleanColumn._rowPadding;
        delete cleanColumn._rowBackgroundColor;
        delete cleanColumn._rowMarginBottom;

        rowsMap.get(rowId)!.columns.push(cleanColumn);
      });

      footerRows = Array.from(rowsMap.values());
    } else {
      footerRows = [{
        id: 'legacy-row',
        name: 'Main Row',
        columns: columns
      }];
    }
  }

  const footerStyle: React.CSSProperties = {
    backgroundColor: settings.backgroundColor || '#1f2937',
    color: settings.textColor || '#ffffff',
  };

  return (
    <footer style={footerStyle}>
      <div className="container mx-auto px-4 pt-12">
        {/* Render each row */}
        <div className="space-y-0">
          {footerRows.map((row) => (
            <FooterRowRenderer
              key={row.id}
              row={row}
              website={website}
              settings={settings}
            />
          ))}
        </div>

        {/* Bottom Bar */}
        {settings.showCopyright && (
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              {settings.copyrightText || `© ${currentYear} ${website.store.name}. All rights reserved.`}
            </div>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-blue-400">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-blue-400">
                Terms of Service
              </Link>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

interface FooterRowRendererProps {
  row: FooterRow;
  website: Website;
  settings: FooterData['settings'];
}

function FooterRowRenderer({ row, website, settings }: FooterRowRendererProps) {
  // Use new styling structure or fall back to legacy properties
  let rowStyle: React.CSSProperties = {};

  // Check both 'styles' and 'styling' properties for backward compatibility
  const styling = (row as any).styles || (row as any).styling;

  if (styling || row.padding || row.backgroundColor || row.marginBottom) {
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
    <div style={rowStyle} className="w-full mb-8">
      <div className={`grid gap-8 ${getGridClass(row.columns?.length || 0)} w-full`}>
        {row.columns?.map((column) => (
          <FooterColumn key={column.id} column={column} website={website} />
        ))}
      </div>
    </div>
  );
}

interface FooterColumnProps {
  column: FooterColumn;
  website: Website;
}

function FooterColumn({ column, website }: FooterColumnProps) {
  // Use the new flex properties or fall back to alignment
  const flexDirection = column.flexDirection || 'column';
  const justifyContent = column.justifyContent || 'start';
  const alignItems = column.alignItems || 'start';
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

  const textAlignmentClass =
    column.alignment === 'center' ? 'text-center' :
    column.alignment === 'right' ? 'text-right' : 'text-left';

  // Apply column styling
  const columnStyle = column.styles ? stylesToCSS(column.styles) : {};

  return (
    <div
      className={`flex ${flexClass} ${justifyClass} ${alignClass} ${gapClass} ${textAlignmentClass}`}
      style={columnStyle}
    >
      {column.title && (
        <h3 className="text-lg font-semibold mb-4">{column.title}</h3>
      )}
      {column.elements?.map((element) => (
        <FooterElement
          key={element.id}
          element={element}
          website={website}
        />
      )) || []}
    </div>
  );
}

interface FooterElementProps {
  element: FooterElement;
  website: Website;
}

function FooterElement({ element, website }: FooterElementProps) {
  const { type, content, styles, props } = element;

  const elementStyle = styles ? stylesToCSS(styles) : {};

  // Safety check: if content is unexpectedly an object and not handled by the specific case
  // This helps catch any rendering issues early
  if (typeof content === 'object' && content !== null && !['newsletter', 'copyright'].includes(type)) {
    console.warn(`FooterElement: Content is an object for type '${type}':`, content);
  }

  switch (type) {
    case 'logo':
      return (
        <div className="mb-6" style={elementStyle}>
          <div className="flex items-center space-x-2 mb-4">
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
          </div>

          {website.store.description && (
            <p className="text-gray-300 max-w-md">
              {website.store.description}
            </p>
          )}
        </div>
      );

    case 'nav':
    case 'navigation':
      const footerMenus = website.menus.filter(menu => menu.location === 'footer');
      const footerMenu = footerMenus.find(menu => menu.id === props?.menuId) || footerMenus[0];

      if (!footerMenu) return null;

      return (
        <div style={elementStyle}>
          <h3 className="text-lg font-semibold mb-4">{footerMenu.name}</h3>
          <ul className="space-y-2">
            {footerMenu.items?.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  target={item.target || '_self'}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="text-gray-300 hover:text-blue-400 text-sm"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'text':
      // Handle case where content might be an object
      const textContent = typeof content === 'object' && content !== null
        ? JSON.stringify(content) // Fallback to showing the object as string for debugging
        : content || 'Custom text content';
        
      return (
        <div style={elementStyle}>
          {props?.title && (
            <h3 className="text-lg font-semibold mb-4">{props.title}</h3>
          )}
          <div className="text-gray-300 text-sm whitespace-pre-wrap">
            {textContent}
          </div>
        </div>
      );

    case 'contact':
      if (!website.store.contact_info) return null;

      return (
        <div style={elementStyle}>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          <div className="space-y-2 text-sm text-gray-300">
            {website.store.contact_info.address && (
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{website.store.contact_info.address}</span>
              </div>
            )}

            {website.store.contact_info.phone && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href={`tel:${website.store.contact_info.phone}`} className="hover:text-blue-400">
                  {website.store.contact_info.phone}
                </a>
              </div>
            )}

            {website.store.contact_info.email && (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href={`mailto:${website.store.contact_info.email}`} className="hover:text-blue-400">
                  {website.store.contact_info.email}
                </a>
              </div>
            )}
          </div>
        </div>
      );

    case 'social':
      if (!website.store.contact_info?.social_media) return null;

      return (
        <div style={elementStyle}>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {Object.entries(website.store.contact_info?.social_media || {}).map(([platform, url]) => (
              <a
                key={platform}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400"
                aria-label={`Follow us on ${platform}`}
              >
                <SocialIcon platform={platform} />
              </a>
            ))}
          </div>
        </div>
      );

    case 'newsletter':
      // Handle case where content might be an object with newsletter settings
      const newsletterContent = typeof content === 'object' && content !== null
        ? (content as any).description || 'Subscribe to get the latest updates and offers.'
        : content || 'Subscribe to get the latest updates and offers.';
      
      const newsletterTitle = typeof content === 'object' && content !== null
        ? (content as any).title || 'Newsletter'
        : 'Newsletter';
      
      const newsletterPlaceholder = typeof content === 'object' && content !== null
        ? (content as any).placeholder || 'Enter your email'
        : 'Enter your email';
      
      const newsletterButtonText = typeof content === 'object' && content !== null
        ? (content as any).buttonText || 'Subscribe'
        : 'Subscribe';
      
      return (
        <div style={elementStyle}>
          <h3 className="text-lg font-semibold mb-4">{newsletterTitle}</h3>
          <p className="text-gray-300 text-sm mb-4">
            {newsletterContent}
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder={newsletterPlaceholder}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {newsletterButtonText}
            </button>
          </div>
        </div>
      );

    case 'copyright':
      // Handle copyright content which can be a string or object
      let copyrightText = '';
      if (typeof content === 'object' && content !== null) {
        const copyrightContent = content as any;
        const year = copyrightContent.showYear ? new Date().getFullYear() : '';
        const company = copyrightContent.companyName || website.store.name;
        const text = copyrightContent.text || 'All rights reserved.';
        copyrightText = `${year ? '© ' + year + ' ' : ''}${company}. ${text}`;
      } else {
        copyrightText = content || `© ${new Date().getFullYear()} ${website.store.name}. All rights reserved.`;
      }
      
      return (
        <div style={elementStyle}>
          <p className="text-gray-400 text-sm">
            {copyrightText}
          </p>
        </div>
      );

    case 'links':
      const links = props?.links || [];
      return (
        <div style={elementStyle}>
          {props?.title && (
            <h3 className="text-lg font-semibold mb-4">{props.title}</h3>
          )}
          <ul className="space-y-2">
            {links.map((link: any, index: number) => (
              <li key={index}>
                <Link
                  href={link.url || '#'}
                  target={link.target || '_self'}
                  rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="text-gray-300 hover:text-blue-400 text-sm"
                >
                  {link.title || `Link ${index + 1}`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

function getGridClass(columnCount: number): string {
  switch (columnCount) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 3:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    case 5:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
    case 6:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
    default:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  }
}

// Fallback component that renders the original footer logic
function DefaultFooter({ website }: { website: Website }) {
  const footerMenus = website.menus.filter(menu => menu.location === 'footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
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
              <span className="text-xl font-semibold">{website.store.name}</span>
            </div>

            {website.store.description && (
              <p className="text-gray-300 mb-4 max-w-md">
                {website.store.description}
              </p>
            )}

            {/* Contact Info */}
            {website.store.contact_info && (
              <div className="space-y-2 text-sm text-gray-300">
                {website.store.contact_info.address && (
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{website.store.contact_info.address}</span>
                  </div>
                )}

                {website.store.contact_info.phone && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href={`tel:${website.store.contact_info.phone}`} className="hover:text-blue-400">
                      {website.store.contact_info.phone}
                    </a>
                  </div>
                )}

                {website.store.contact_info.email && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <a href={`mailto:${website.store.contact_info.email}`} className="hover:text-blue-400">
                      {website.store.contact_info.email}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Menus */}
          {footerMenus.map((menu) => (
            <div key={menu.id}>
              <h3 className="text-lg font-semibold mb-4">{menu.name}</h3>
              <ul className="space-y-2">
                {menu.items?.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      target={item.target || '_self'}
                      rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="text-gray-300 hover:text-blue-400 text-sm"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          {website.store.contact_info?.social_media && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {Object.entries(website.store.contact_info?.social_media || {}).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-blue-400"
                    aria-label={`Follow us on ${platform}`}
                  >
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © {currentYear} {website.store.name}. All rights reserved.
          </div>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-blue-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialIconProps {
  platform: string;
}

function SocialIcon({ platform }: SocialIconProps) {
  const iconClass = "w-5 h-5 fill-current";

  switch (platform.toLowerCase()) {
    case 'facebook':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.473-3.342-1.275-.894-.802-1.407-1.917-1.407-3.188 0-1.272.513-2.387 1.407-3.188.894-.802 2.045-1.275 3.342-1.275s2.448.473 3.342 1.275c.894.801 1.407 1.916 1.407 3.188 0 1.271-.513 2.386-1.407 3.188-.894.802-2.045 1.275-3.342 1.275zm7.718-6.943a1.522 1.522 0 01-1.522-1.522c0-.84.682-1.522 1.522-1.522s1.522.682 1.522 1.522c0 .84-.682 1.522-1.522 1.522z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-.293 1.355c-.199.93-.73 1.16-1.48.72l-3.64-2.673L9.68 9.68c-.28.28-.52.19-.72-.19l-1.355-2.293c-.28-.48-.12-.73.4-.56l13.085 5.085c.52.2.68.52.48 1.04z"/>
        </svg>
      );
  }
}
