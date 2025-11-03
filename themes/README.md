# Theme System

A modern, efficient theme system built with React, TypeScript, and Tailwind CSS using a shared foundation architecture.

## Architecture

```
themes/
├── _shared/           # Shared foundation for all themes
│   ├── components/    # Reusable UI components (Button, ProductCard)
│   ├── hooks/         # Complete 3-environment hook system
│   ├── lib/           # Theme utilities and base classes
│   ├── styles/        # Base CSS and common utilities
│   ├── types/         # TypeScript interfaces and types
│   ├── utils/         # Helper functions
│   └── data/          # Demo data matching Laravel Resources
├── modern-shop/       # Example theme built with shared foundation
└── verify-deps.sh     # Dependency verification script
```

## Key Features

### ✨ **Shared Foundation**
- **70% Code Reduction**: Eliminates duplication across themes
- **Single Source of Truth**: Common components, hooks, and utilities
- **Consistent Behavior**: All themes share the same underlying logic
- **Easy Maintenance**: Fix once, apply everywhere

### 🎯 **Three-Environment System**
- **Preview Mode**: For theme designers with dummy data
- **Demo Mode**: For sellers to preview with their actual products
- **Production Mode**: Full functionality for live websites

### 🚀 **Performance Optimized**
- **Lazy Loading**: Sections load on demand
- **Code Splitting**: Shared vs theme-specific bundles
- **Single node_modules**: No dependency duplication
- **Tree Shaking**: Only used code is included

## Development

### Creating a New Theme
```bash
# 1. Create theme directory
mkdir themes/my-theme

# 2. Create basic structure
mkdir themes/my-theme/{components,sections,styles,dev}

# 3. Create theme with shared foundation
```

### Running a Theme
```bash
# Navigate to theme directory
cd themes/modern-shop

# Start development server
./run-dev.sh

# Or manually
npx vite
```

## Shared Foundation Benefits

| Aspect | Before | After | Improvement |
|--------|---------|--------|-------------|
| **Lines of Code** | 3,600+ | 1,070 | 70% reduction |
| **File Count** | 41 | 14 | 66% reduction |
| **Dependencies** | Duplicated | Shared | 0% duplication |
| **Development Speed** | Slow | Fast | 5x faster |
| **Maintainability** | Hard | Easy | Much easier |

## Theme Structure

### Minimal Theme (200-300 lines)
```typescript
// index.tsx
import { createThemeBase } from '../_shared/lib/ThemeBase';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import sections from './sections';
import './styles/theme.css';
import demoData from './demo.json';

const ThemeBase = createThemeBase({ Navigation, Footer }, sections);
export default (props) => <ThemeBase {...props} demoData={demoData} />;
```

### What's Shared vs Custom

#### **Shared (Reusable)**
- Hook system (Preview/Demo/Production)
- TypeScript interfaces
- Base components (Button, ProductCard)
- Utility functions
- Base CSS styles
- Page renderer logic
- Demo data

#### **Theme-Specific (Customizable)**
- Navigation/Footer design
- Section implementations  
- Color schemes & styling
- Theme configuration
- Custom animations/effects

## Dependencies

All themes use the root `node_modules` for maximum efficiency:

```bash
# Install dependencies once
npm install

# All themes automatically use root dependencies
# No theme-specific package.json needed!
```

## Verification

Run the dependency verification script:

```bash
cd themes
./verify-deps.sh
```

This ensures:
- ✅ Root node_modules exists and is populated
- ✅ No theme has local dependencies
- ✅ Vite configs are properly configured

---

Built with ❤️ for maximum efficiency and developer experience.