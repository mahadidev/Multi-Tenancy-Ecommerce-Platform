'use client';

import React, { Suspense } from 'react';
import Head from 'next/head';

// Base renderer for Next.js themes
export interface SectionData {
  id?: string;
  type: string;
  props?: Record<string, any>;
}

export interface PageData {
  title: string;
  slug: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  sections: SectionData[];
}

export interface NextjsRendererConfig {
  sections: Record<string, React.ComponentType<any>>;
  loadingComponent?: React.ComponentType;
}

export const createNextjsRenderer = (config: NextjsRendererConfig) => {
  const { sections: SECTIONS, loadingComponent: LoadingComponent } = config;

  const DefaultLoading = () => (
    <div className="section animate-pulse">
      <div className="container mx-auto px-4">
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    </div>
  );

  const Loading = LoadingComponent || DefaultLoading;

  const PageRenderer: React.FC<{ page: PageData }> = ({ page }) => {
    return (
      <>
        <Head>
          <title>{page.seo?.title || page.title}</title>
          {page.seo?.description && (
            <meta name="description" content={page.seo.description} />
          )}
          {page.seo?.keywords && (
            <meta name="keywords" content={page.seo.keywords.join(', ')} />
          )}
        </Head>
        <div className="page-content">
          {page.sections.map((section, index) => {
            const Component = SECTIONS[section.type];
            
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

  const SectionRenderer: React.FC<{ sections: SectionData[] }> = ({ sections }) => {
    return (
      <div>
        {sections.map((section, index) => {
          const Component = SECTIONS[section.type];
          
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
    );
  };

  return { PageRenderer, SectionRenderer };
};