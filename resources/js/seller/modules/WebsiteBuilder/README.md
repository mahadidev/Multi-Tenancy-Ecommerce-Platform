# WebsiteBuilder Module - Clean Architecture

This WebsiteBuilder module has been reorganized into smaller, reusable components with clear separation of concerns.

## Structure

### `/components`
- **UnifiedPageBuilder.tsx** - Original large component (1300+ lines)
- **UnifiedPageBuilderClean.tsx** - New clean version using extracted utilities
- **ui/** - Small, focused UI components
  - `BuilderTopBar.tsx` - Top navigation bar
  - `BuilderSidebar.tsx` - Left sidebar with widgets and settings
  - `SavingOverlay.tsx` - Loading overlay during saves

### `/hooks`
- `useBuilderHistory.ts` - Undo/redo functionality
- `useBuilderKeyboard.ts` - Keyboard shortcuts
- `useThemes.ts` - Theme-related hooks

### `/utils`
- `responsive.ts` - Responsive breakpoint utilities
- `sectionHelpers.ts` - Section manipulation functions
- `dataConversion.ts` - Data format conversion utilities

### `/services`
- `BuilderService.ts` - High-level builder operations
- `ElementorService.ts` - Elementor-specific operations
- `ThemeInstallationService.ts` - Theme installation logic

### `/types`
- `component.ts` - Component-related interfaces
- `template.ts` - Template-related interfaces  
- `website.ts` - Website and page interfaces
- `dragDrop.ts` - Drag & drop interfaces
- `state.ts` - State management interfaces

### `/constants`
- `defaults.ts` - Default values and settings

## Benefits

1. **Maintainability** - Smaller files are easier to understand and modify
2. **Reusability** - Components and utilities can be used across different parts of the app
3. **Testability** - Individual functions and components can be tested in isolation
4. **Type Safety** - Better organized types reduce duplication and improve IntelliSense
5. **Performance** - Tree-shaking can eliminate unused code more effectively

## Migration Path

To migrate from the old UnifiedPageBuilder to the new clean version:

1. Replace imports of `UnifiedPageBuilder` with `UnifiedPageBuilderClean`
2. The props interface remains the same for compatibility
3. All functionality is preserved but better organized

## Usage

```tsx
import { UnifiedPageBuilderClean as UnifiedPageBuilder } from './components/UnifiedPageBuilderClean';
// Or use the organized utilities directly:
import { ElementorService, BuilderService } from './services';
import { useBuilderHistory, useBuilderKeyboard } from './hooks';
```

The new architecture makes the codebase more maintainable while preserving all existing functionality.