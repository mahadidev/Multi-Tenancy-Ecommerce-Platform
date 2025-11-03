'use client';

import React, { Suspense } from 'react';
import { sections } from '../sections';

interface SectionData {
  id?: string;
  type: string;
  props?: Record<string, any>;
}

interface PageData {
  title: string;
  slug: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  sections: SectionData[];
}

const Loading = () => (
  <div className="section animate-pulse">
    <div className="container mx-auto px-4">
      <div className="h-32 bg-gray-200 rounded" />
    </div>
  </div>
);

export const PageRenderer: React.FC<{ page: PageData }> = ({ page }) => {
  return (
    <>
      <div className="page-content">
        {page.sections.map((section, index) => {
          const Component = sections[section.type];
          
          if (!Component) {
            console.warn(`Section type "${section.type}" not found`);
            return null;
          }

          const sectionId = section.id || `${section.type}-${index}`;
          return (
            <Suspense key={sectionId} fallback={<Loading />}>
              <Component {...(section.props || {})} />
            </Suspense>
          );
        })}
      </div>
    </>
  );
};