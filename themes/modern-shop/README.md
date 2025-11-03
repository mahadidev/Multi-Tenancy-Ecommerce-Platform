# Modern Shop Theme - Next.js

A modern e-commerce theme built with Next.js 14 and the shared foundation architecture.

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

The theme will be available at http://localhost:3001

## Architecture

- **Next.js 14**: App directory with file-based routing
- **Shared Foundation**: Uses `@shared` for common components and hooks
- **JSON-driven**: Pages are defined in `demo.json` and rendered dynamically
- **Three-environment system**: Preview, Demo, and Production modes

## Pages

- `/` - Homepage
- `/shop` - Product listing
- `/product/[slug]` - Product details
- `/cart` - Shopping cart
- `/about` - About page
- `/contact` - Contact page

## Customization

- **Theme styles**: `styles/theme.css`
- **Components**: `components/` directory
- **Sections**: `sections/` directory
- **Demo data**: `demo.json`