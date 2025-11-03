// Library functions with explicit re-exports to resolve conflicts
export * from './ThemeBase';

// Vite renderer
export type { 
  PageData as VitePageData, 
  SectionData as ViteSectionData,
  RendererConfig as ViteRendererConfig
} from './renderer';

export { 
  createRenderer
} from './renderer';

// Next.js renderer
export type { 
  PageData as NextPageData, 
  SectionData as NextSectionData,
  NextjsRendererConfig as NextRendererConfig
} from './nextjs-renderer';

export { 
  createNextjsRenderer
} from './nextjs-renderer';