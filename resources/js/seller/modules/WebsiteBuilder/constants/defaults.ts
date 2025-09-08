export const DEFAULT_SECTION_SETTINGS = {
  layout: 'boxed',
  contentWidth: '1140px',
  backgroundColor: 'transparent',
  padding: '60px 20px',
  margin: '0',
  columnsPerRow: 1,
  columnGap: '1rem',
  rowGap: '1rem',
  alignItems: 'stretch'
} as const;

export const DEFAULT_COLUMN_SETTINGS = {
  width: 100,
  padding: '20px',
  backgroundColor: 'transparent'
} as const;

export const DEVICE_BREAKPOINTS = {
  desktop: 'desktop',
  tablet: 'tablet', 
  mobile: 'mobile'
} as const;

export const PANEL_TYPES = {
  content: 'content',
  style: 'style',
  settings: 'settings',
  widgets: 'widgets',
  navigator: 'navigator'
} as const;