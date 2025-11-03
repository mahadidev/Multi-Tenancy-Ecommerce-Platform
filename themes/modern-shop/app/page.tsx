import React from 'react';
import demoData from '../demo.json';
import { PageRenderer } from '../lib/page-renderer';

export default function HomePage() {
  const rawPageData = demoData.import.pages.find(page => page.slug === '/');
  
  if (!rawPageData) {
    return <div>Page not found</div>;
  }

  // Transform the data to match PageData interface
  const pageData = {
    title: rawPageData.title,
    slug: rawPageData.slug,
    seo: {
      title: rawPageData.metaTitle,
      description: rawPageData.metaDescription,
      keywords: Array.isArray(rawPageData.metaKeywords) ? rawPageData.metaKeywords : []
    },
    sections: rawPageData.sections
  };
  
  return <PageRenderer page={pageData} />;
}