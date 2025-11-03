// Main export file for shared theme foundation

// Types
export * from './types';

// Hooks
export * from './hooks';

// Utilities
export * from './utils';

// Library functions
export * from './lib/ThemeBase';

// Renderers with explicit re-exports to resolve conflicts
export type { 
  PageData as VitePageData, 
  SectionData as ViteSectionData,
  RendererConfig as ViteRendererConfig
} from './lib/renderer';

export { 
  createRenderer
} from './lib/renderer';

export type { 
  PageData as NextPageData, 
  SectionData as NextSectionData,
  NextjsRendererConfig as NextRendererConfig
} from './lib/nextjs-renderer';

export { 
  createNextjsRenderer
} from './lib/nextjs-renderer';