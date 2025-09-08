import React, { useState, useEffect } from 'react';
import { UnifiedPageBuilderClean } from '../components/UnifiedPageBuilderClean';
import { useGetWebsiteQuery, useGetPageQuery, useGetComponentTypesQuery } from '../store/websiteBuilderApi';

// Type definitions for Elementor Builder
export type ResponsiveBreakpoint = 'desktop' | 'tablet' | 'mobile';

export interface ResponsiveSettings<T> {
  desktop: T;
  tablet?: Partial<T>;
  mobile?: Partial<T>;
}

export interface ElementorWidget {
  id: string;
  type: string;
  content?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface ElementorColumn {
  id: string;
  widgets: ElementorWidget[];
  settings: ResponsiveSettings<{
    width?: number;
    padding?: string;
    backgroundColor?: string;
    [key: string]: any;
  }>;
}

export interface ElementorSection {
  id: string;
  name?: string;
  columns: ElementorColumn[];
  settings: ResponsiveSettings<{
    layout?: 'boxed' | 'full-width';
    contentWidth?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    columnsPerRow?: number;
    columnGap?: string;
    rowGap?: string;
    alignItems?: string;
    [key: string]: any;
  }>;
}

// Main ElementorBuilder component props
interface ElementorBuilderProps {
  websiteId?: string;
  pageId?: string;
  onSave?: (data: any) => void;
  onExit?: () => void;
  initialSections?: ElementorSection[];
}

// Main ElementorBuilder component using the actual UnifiedPageBuilder
export function ElementorBuilder({ 
  websiteId = '1', // Default website ID
  pageId, 
  onSave, 
  onExit,
  initialSections = [] 
}: ElementorBuilderProps) {
  const [selectedComponent, setSelectedComponent] = useState(null);
  
  // Fetch data if websiteId and pageId are provided
  const { data: websiteData } = useGetWebsiteQuery(Number(websiteId), {
    skip: !websiteId
  });
  
  const { data: pageData } = useGetPageQuery(
    Number(pageId),
    { skip: !pageId }
  );
  
  const { data: componentTypes = [] } = useGetComponentTypesQuery();

  // Get sections from page data or use initial sections
  const sections = pageData?.sections || [];
  
  return (
    <UnifiedPageBuilderClean
      componentTypes={componentTypes}
      sections={sections}
      websiteId={Number(websiteId)}
      pageId={pageId ? Number(pageId) : undefined}
      pageData={pageData}
      onDropComponent={() => {}}
      onUpdateComponent={() => {}}
      onDeleteComponent={() => {}}
      onSelectComponent={setSelectedComponent}
      selectedComponent={selectedComponent}
      onSave={onSave}
      onExit={onExit}
    />
  );
}

export default ElementorBuilder;