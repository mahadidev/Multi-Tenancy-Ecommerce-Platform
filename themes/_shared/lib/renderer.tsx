import React, { Suspense } from 'react';

// Base renderer that can be extended by themes
export interface SectionData {
  id: string;
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

export interface RendererConfig {
  sections: Record<string, React.ComponentType<any>>;
  loadingComponent?: React.ComponentType;
}

export const createRenderer = (config: RendererConfig) => {
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
    // Set document title and meta
    React.useEffect(() => {
      if (typeof document !== 'undefined') {
        document.title = page.seo?.title || page.title;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && page.seo?.description) {
          metaDescription.setAttribute('content', page.seo.description);
        }
      }
    }, [page]);

    return (
      <div className="page-content">
        {page.sections.map((section) => {
          const Component = SECTIONS[section.type];
          
          if (!Component) {
            console.warn(`Section type "${section.type}" not found`);
            return null;
          }

          return (
            <Suspense key={section.id} fallback={<Loading />}>
              <Component {...(section.props || {})} />
            </Suspense>
          );
        })}
      </div>
    );
  };

  const SectionRenderer: React.FC<{ sections: SectionData[] }> = ({ sections }) => {
    return (
      <div>
        {sections.map((section) => {
          const Component = SECTIONS[section.type];
          
          if (!Component) {
            console.warn(`Section type "${section.type}" not found`);
            return null;
          }

          return (
            <Suspense key={section.id} fallback={<Loading />}>
              <Component {...(section.props || {})} />
            </Suspense>
          );
        })}
      </div>
    );
  };

  return { PageRenderer, SectionRenderer };
};