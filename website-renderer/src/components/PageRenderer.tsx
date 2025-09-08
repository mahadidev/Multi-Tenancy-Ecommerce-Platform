'use client';

import React from 'react';
import { WebsitePage, PageSection, WebsiteMenu } from '@/types';
import { ComponentRenderer } from './ComponentRenderer';

interface PageRendererProps {
  page: WebsitePage;
  websiteSubdomain: string;
  websiteMenus?: WebsiteMenu[];
}

export function PageRenderer({ page, websiteSubdomain, websiteMenus = [] }: PageRendererProps) {
  // Prioritize theme sections over legacy Elementor content
  // If page has theme sections, use those instead of content
  if (page.sections && Array.isArray(page.sections) && page.sections.length > 0) {
    // Use theme sections (new system)
    // Continue with normal section rendering below
  } else if (page.content) {
    // Fall back to legacy Elementor content only if no theme sections exist
    try {
      const elementorData = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
      if (elementorData?.sections && Array.isArray(elementorData.sections)) {
        return <ElementorPageRenderer sections={elementorData.sections} />;
      }
    } catch (error) {
      console.error('Failed to parse Elementor content:', error);
      // Fall through to the no content message below
    }
  }

  if (!page.sections || !Array.isArray(page.sections)) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Content Available</h2>
          <p className="text-gray-500">This page has no sections to display.</p>
        </div>
      </main>
    );
  }
  
  // Sort sections by sort_order
  const sortedSections = [...page.sections].sort((a, b) => a.sort_order - b.sort_order);

  if (sortedSections.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Empty Page</h2>
          <p className="text-gray-500">This page has no sections configured.</p>
        </div>
      </main>
    );
  }

  // Check if this is an auth page that needs special layout
  const hasAuthCenterSection = sortedSections.some(section => section.type === 'auth-center');
  
  return (
    <main className={hasAuthCenterSection ? '' : 'min-h-screen'}>
      {sortedSections.map((section) => (
        <SectionRenderer 
          key={section.id} 
          section={section} 
          websiteSubdomain={websiteSubdomain}
          websiteMenus={websiteMenus}
        />
      ))}
    </main>
  );
}

interface SectionRendererProps {
  section: PageSection;
  websiteSubdomain: string;
  websiteMenus?: WebsiteMenu[];
}

function SectionRenderer({ section, websiteSubdomain, websiteMenus = [] }: SectionRendererProps) {
  // Treat undefined as visible (default to true if not explicitly set to false)
  const isVisible = section.is_visible !== false;
  
  if (!isVisible) {
    return null;
  }

  if (!section.components || !Array.isArray(section.components)) {
    return (
      <section className="py-4 border border-yellow-300 bg-yellow-50">
        <div className="container mx-auto px-4">
          <p className="text-yellow-700">Section "{section.name}" has no components</p>
        </div>
      </section>
    );
  }

  // Sort components by sort_order
  const sortedComponents = [...section.components].sort((a, b) => a.sort_order - b.sort_order);

  const sectionClasses = getSectionClasses(section);
  const responsiveClasses = getResponsiveClasses(section.responsive_settings);
  const containerStyles = getContainerStyles(section.container_styles);

  return (
    <section 
      className={`${sectionClasses} ${responsiveClasses}`}
      style={containerStyles}
      data-section-type={section.type}
      data-section-name={section.name}
    >
      {section.type === 'container' ? (
        <div className="container mx-auto px-4">
          {sortedComponents.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              websiteSubdomain={websiteSubdomain}
              websiteMenus={websiteMenus}
            />
          ))}
        </div>
      ) : (
        <>
          {sortedComponents.map((component) => (
            <ComponentRenderer
              key={component.id}
              component={component}
              websiteSubdomain={websiteSubdomain}
              websiteMenus={websiteMenus}
            />
          ))}
        </>
      )}
    </section>
  );
}

function getSectionClasses(section: PageSection): string {
  const classes: string[] = [];

  switch (section.type) {
    case 'header':
      classes.push('header-section');
      break;
    case 'footer':
      classes.push('footer-section');
      break;
    case 'hero':
      classes.push('hero-section');
      break;
    case 'content':
      classes.push('content-section', 'py-8');
      break;
    case 'auth-center':
      classes.push('auth-center-section', 'min-h-screen', 'flex', 'items-center', 'justify-center', 'py-8');
      break;
    case 'sidebar':
      classes.push('sidebar-section');
      break;
    case 'full-width':
      classes.push('full-width-section');
      break;
    case 'container':
      classes.push('container-section', 'py-8');
      break;
    default:
      classes.push('section', 'py-4');
  }

  return classes.join(' ');
}

function getResponsiveClasses(responsiveSettings?: Record<string, any>): string {
  if (!responsiveSettings) return '';

  const classes: string[] = [];

  if (responsiveSettings.hidden_mobile) {
    classes.push('hidden md:block');
  }
  if (responsiveSettings.hidden_tablet) {
    classes.push('md:hidden lg:block');
  }
  if (responsiveSettings.hidden_desktop) {
    classes.push('lg:hidden');
  }

  // Responsive spacing
  if (responsiveSettings.mobile_padding) {
    classes.push(`p-${responsiveSettings.mobile_padding}`);
  }
  if (responsiveSettings.tablet_padding) {
    classes.push(`md:p-${responsiveSettings.tablet_padding}`);
  }
  if (responsiveSettings.desktop_padding) {
    classes.push(`lg:p-${responsiveSettings.desktop_padding}`);
  }

  return classes.join(' ');
}

function getContainerStyles(containerStyles?: any): React.CSSProperties {
  if (!containerStyles) return {};
  
  // If it's already an object, return it
  if (typeof containerStyles === 'object' && containerStyles !== null) {
    return containerStyles;
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof containerStyles === 'string') {
    try {
      const parsed = JSON.parse(containerStyles);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      // If JSON parsing fails, return empty styles
      return {};
    }
  }
  
  return {};
}

// Elementor Page Renderer - renders Elementor sections
interface ElementorPageRendererProps {
  sections: any[];
}

function ElementorPageRenderer({ sections }: ElementorPageRendererProps) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Content Available</h2>
          <p className="text-gray-500">This page has no Elementor sections to display.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {sections.map((section) => (
        <ElementorSectionRenderer key={section.id} section={section} />
      ))}
    </main>
  );
}

// Elementor Section Renderer
interface ElementorSectionRendererProps {
  section: any;
}

function ElementorSectionRenderer({ section }: ElementorSectionRendererProps) {
  const desktopSettings = section.settings?.desktop || {};
  const tabletSettings = { ...desktopSettings, ...(section.settings?.tablet || {}) };
  const mobileSettings = { ...desktopSettings, ...(section.settings?.mobile || {}) };
  
  const containerStyle: React.CSSProperties = {
    backgroundColor: desktopSettings.backgroundColor || 'transparent',
    padding: desktopSettings.padding || '60px 20px',
    margin: desktopSettings.margin || '0',
  };

  // Generate unique class name for this section
  const sectionId = `elementor-section-${section.id}`;
  
  // Generate responsive CSS
  const responsiveCSS = `
    .${sectionId} {
      grid-template-columns: repeat(${desktopSettings.columnsPerRow || section.columns?.length || 1}, 1fr);
    }
    
    @media (max-width: 1024px) {
      .${sectionId} {
        grid-template-columns: repeat(${tabletSettings.columnsPerRow || desktopSettings.columnsPerRow || section.columns?.length || 1}, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .${sectionId} {
        grid-template-columns: repeat(${mobileSettings.columnsPerRow || 1}, 1fr);
      }
    }
  `;

  return (
    <section style={containerStyle}>
      <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />
      <div 
        className={`mx-auto grid ${desktopSettings.layout === 'boxed' ? 'max-w-7xl' : 'w-full'} ${sectionId}`}
        style={{
          maxWidth: desktopSettings.layout === 'boxed' ? desktopSettings.contentWidth : undefined,
          gap: desktopSettings.columnGap || '1rem',
          alignItems: desktopSettings.alignItems || 'stretch',
          gridAutoRows: 'min-content',
        }}
      >
        {section.columns?.map((column: any) => (
          <ElementorColumnRenderer key={column.id} column={column} />
        ))}
      </div>
    </section>
  );
}

// Elementor Column Renderer
interface ElementorColumnRendererProps {
  column: any;
}

function ElementorColumnRenderer({ column }: ElementorColumnRendererProps) {
  const columnSettings = column.settings?.desktop || {};
  
  const columnStyle: React.CSSProperties = {
    backgroundColor: columnSettings.backgroundColor || 'transparent',
    padding: columnSettings.padding || '20px',
    order: columnSettings.order || 0,
  };

  return (
    <div style={columnStyle}>
      {column.widgets?.map((widget: any) => (
        <ElementorWidgetRenderer key={widget.id} widget={widget} />
      ))}
    </div>
  );
}

// Elementor Widget Renderer
interface ElementorWidgetRendererProps {
  widget: any;
}

function ElementorWidgetRenderer({ widget }: ElementorWidgetRendererProps) {
  const renderWidget = () => {
    switch (widget.type) {
      case 'heading':
        const HeadingTag = (widget.content.tag || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={{
              color: widget.settings.color || '#000000',
              fontSize: widget.settings.fontSize || '36px',
              fontWeight: widget.settings.fontWeight || 'bold',
              textAlign: widget.settings.textAlign || 'left'
            }}
          >
            {widget.content.text || 'Add Your Heading Text Here'}
          </HeadingTag>
        );
      
      case 'text-editor':
        return (
          <div
            style={{
              color: widget.settings.color || '#666666',
              fontSize: widget.settings.fontSize || '16px',
              lineHeight: widget.settings.lineHeight || '1.6',
              textAlign: widget.settings.textAlign || 'left'
            }}
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
      
      case 'button':
        return (
          <div style={{ textAlign: widget.settings.alignment || 'left' }}>
            <button
              style={{
                backgroundColor: widget.settings.backgroundColor || '#61ce70',
                color: widget.settings.textColor || '#ffffff',
                padding: widget.settings.padding || '12px 24px',
                borderRadius: widget.settings.borderRadius || '4px',
                border: 'none',
                fontSize: widget.settings.fontSize || '16px',
                fontWeight: widget.settings.fontWeight || 'normal',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              {widget.content.text || 'Click here'}
            </button>
          </div>
        );
      
      case 'spacer':
        return (
          <div
            style={{
              height: widget.settings.height || '50px',
              width: '100%'
            }}
          />
        );
      
      default:
        return (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">
              Widget type "{widget.type}" not supported in renderer
            </p>
          </div>
        );
    }
  };

  return (
    <div className="mb-4">
      {renderWidget()}
    </div>
  );
}