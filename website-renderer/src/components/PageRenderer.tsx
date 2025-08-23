'use client';

import React from 'react';
import { WebsitePage, PageSection } from '@/types';
import { ComponentRenderer } from './ComponentRenderer';

interface PageRendererProps {
  page: WebsitePage;
  websiteSubdomain: string;
}

export function PageRenderer({ page, websiteSubdomain }: PageRendererProps) {
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

  return (
    <main className="min-h-screen">
      {sortedSections.map((section) => (
        <SectionRenderer 
          key={section.id} 
          section={section} 
          websiteSubdomain={websiteSubdomain}
        />
      ))}
    </main>
  );
}

interface SectionRendererProps {
  section: PageSection;
  websiteSubdomain: string;
}

function SectionRenderer({ section, websiteSubdomain }: SectionRendererProps) {
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

  return (
    <section 
      className={`${sectionClasses} ${responsiveClasses}`}
      style={section.container_styles}
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