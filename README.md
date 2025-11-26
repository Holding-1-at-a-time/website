# One Detail At A Time - Auto Detailing Website

Modern Next.js website for One Detail At A Time auto detailing business in San Antonio, TX.

## Features

- ✅ Next.js 15 App Router with TypeScript (strict, no `any` types)
- ✅ 14 individual service pages (no dynamic routing)
- ✅ Dark mode with #00ae98 primary color
- ✅ Shadcn-ui components + Tailwind CSS
- ✅ React Server Components (RSC) where possible
- ✅ Advanced local SEO with Schema.org markup
- ✅ Contact form with Google Apps integration ready
- ✅ Booking form with Google Calendar integration ready
- ✅ 3D Review Carousel
- ✅ Mobile responsive navigation
- ✅ IDA certified business information

## Project Structure

```
one-detail-v2/
├── app/
│   ├── about/page.tsx
│   ├── booking/page.tsx
│   ├── contact/page.tsx
│   ├── services/
│   │   ├── page.tsx
│   │   ├── auto-detailing/page.tsx
│   │   ├── auto-interior-vacuuming/page.tsx
│   │   ├── car-wash/page.tsx
│   │   ├── car-waxing/page.tsx
│   │   ├── clay-bar-treatment/page.tsx
│   │   ├── engine-detailing/page.tsx
│   │   ├── full-body-wash/page.tsx
│   │   ├── full-detail-package/page.tsx
│   │   ├── headlight-polishing/page.tsx
│   │   ├── interior-scenting/page.tsx
│   │   ├── paint-repair/page.tsx
│   │   ├── seat-shampooing/page.tsx
│   │   ├── steam-cleaning/page.tsx
│   │   └── wheel-washing/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form-elements.tsx
│   │   ├── separator.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── use-toast.ts
│   ├── booking-form.tsx
│   ├── contact-form.tsx
│   ├── footer.tsx
│   ├── navigation.tsx
│   ├── review-carousel.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── data.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
pnpm build
pnpm start
```

## Configuration

### Google Forms Integration

Update the form submission URLs in:
- `components/contact-form.tsx` - line 20
- `components/booking-form.tsx` - line 29

### Google Calendar Integration

Update the booking calendar URL in:
- `components/booking-form.tsx` - line 29

### Google Maps

Update the map embed URL in:
- `app/contact/page.tsx` - line 108

## Services

All 14 services have individual SEO-optimized pages:

1. Auto Detailing
2. Auto Interior Vacuuming
3. Car Waxing
4. Clay Bar Treatment
5. Engine Detailing
6. Full Body Wash
7. Headlight Polishing
8. Interior Scenting
9. Paint Repair
10. Seat Shampooing
11. Steam Cleaning
12. Wheel Washing
13. Car Wash
14. Full Detail Package

## SEO Features

- Individual metadata for each page
- Schema.org LocalBusiness markup
- Service-specific Schema.org markup
- Semantic HTML structure
- San Antonio local SEO optimization
- Open Graph tags

## Tech Stack

- Next.js 15.1.8
- React 19
- TypeScript 5.7+
- Tailwind CSS 3.4+
- Shadcn-ui components
- Radix UI primitives
- Embla Carousel
- Lucide React icons
- Framer Motion
- Next Themes (dark mode)

## Business Information

- **Name**: One Detail At A Time LLC
- **Phone**: (726) 207-1007
- **Email**: rromerojr1@gmail.com
- **Address**: 11692 Bricken Circle, San Antonio, TX 78233
- **Service Areas**: Stone Oak, Alamo Heights, North Side, and all San Antonio areas
- **Certifications**: IDA Certified
- **Features**: Latino-Owned, LGBTQ+ Friendly, Mobile Service

## Deployment

Deploy to Hostinger or any hosting platform that supports Next.js:

1. Build the project: `pnpm build`
2. Upload the `.next` folder and `node_modules` to your server
3. Set up environment variables if needed
4. Run `pnpm start` on the server

## Next Steps

1. Add actual service images to `/public` directory
2. Update Google Maps coordinates
3. Set up Google Forms/Calendar integration
4. Configure domain and SSL on Hostinger
5. Add Google Analytics tracking
6. Submit sitemap to Google Search Console

## License

© 2025 One Detail At A Time LLC. All rights reserved.