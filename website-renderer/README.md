# Website Renderer

A Next.js application that renders websites created with the Website Builder from your Laravel backend.

## Features

- Dynamic website rendering based on website builder data
- Support for various widgets/components:
  - Hero sections
  - Text blocks
  - Image blocks
  - Product grids
  - Contact forms
  - Video blocks
  - Testimonials
  - Feature lists
  - Newsletter signup
  - Custom buttons
- Responsive design
- SEO optimization
- Analytics integration
- Dynamic navigation and menus
- Form submissions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Your Laravel backend with Website Builder module running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Laravel API URL:
```
LARAVEL_API_BASE=http://localhost:8000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

### Development Mode

For development, you can test websites by adding the subdomain as a query parameter:

```
http://localhost:3000/?subdomain=example-store
http://localhost:3000/about?subdomain=example-store
```

### Production Mode

In production, the app will automatically extract the subdomain from the URL:

```
https://example-store.yourdomain.com
https://example-store.yourdomain.com/about
```

## API Integration

The app integrates with your Laravel backend through the following endpoints:

- `GET /api/website/render/{subdomain}` - Get homepage data
- `GET /api/website/render/{subdomain}/{slug}` - Get specific page data
- `GET /api/website/{subdomain}/products` - Get products for a store
- `POST /api/website/{subdomain}/forms/{formId}/submit` - Submit forms

## Widget System

The app includes a comprehensive widget system that supports:

### Core Widgets
- **Hero Section**: Full-width hero banners with background images/videos
- **Text Block**: Rich text content with customizable styling
- **Image Block**: Images with captions, links, and hover effects
- **Button Block**: Customizable call-to-action buttons

### E-commerce Widgets
- **Product Grid**: Display products in responsive grids
- **Categories**: Product category listings

### Interactive Widgets
- **Contact Form**: Dynamic forms with validation
- **Newsletter Signup**: Email subscription forms
- **Testimonials**: Customer testimonials and reviews

### Media Widgets
- **Video Block**: Embedded videos (YouTube, Vimeo, or direct uploads)
- **Image Gallery**: Image carousels and galleries

### Layout Widgets
- **Features List**: Feature highlights with icons
- **Content Sections**: Flexible content containers

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

The easiest way to deploy is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Make sure to set your environment variables in the Vercel dashboard.

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js applications:

- Netlify
- AWS Amplify
- Railway
- Digital Ocean App Platform

## Environment Variables

- `LARAVEL_API_BASE`: URL of your Laravel backend API (required)
- `NEXT_PUBLIC_APP_URL`: URL of this Next.js app (for absolute URLs)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
