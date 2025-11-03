import React from 'react';
import demoData from '../../demo.json';
import { PageRenderer } from '../../lib/page-renderer';

export default function ShopPage() {
  const rawPageData = demoData.import.pages.find(page => page.slug === '/shop');
  
  if (!rawPageData) {
    return <div>Page not found</div>;
  }

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