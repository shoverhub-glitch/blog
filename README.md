# sampleHub - Modern Blog Platform

A production-ready, mobile-first blog platform with secure admin panel, built with React, TypeScript, and Supabase.

## Features

### Public Blog (Part 1)
- **Featured & Latest Articles** - Showcase important content and recent posts
- **Category Filtering** - Organize and browse content by topics
- **Full-Text Search** - Fast, responsive search across all articles
- **SEO Optimized** - Dynamic meta tags, clean URLs, proper heading hierarchy
- **Mobile-First Design** - Responsive layouts optimized for all devices
- **Dark Mode Support** - System-aware theme switching

### Admin Panel (Part 2) - `/shover-admin`
- **Secure Authentication** - Email/password login with Supabase Auth
- **Blog Management** - Create, edit, delete, publish/draft blogs
- **Optimized Image Upload** - Client-side compression, automatic cleanup
- **Rich Content Editor** - HTML/Markdown support with live preview
- **Category & Tag Management** - Organize content efficiently
- **Mobile-First Admin UI** - Manage content from any device

### Technical Highlights
- **TypeScript-First** - Fully typed codebase for better maintainability
- **Centralized Theme System** - All styling controlled via TypeScript (no CSS files)
- **Performance Optimized** - Lazy loading, code splitting, optimized queries
- **Row Level Security** - Secure data access with Supabase RLS
- **Storage Optimization** - Compressed images, automatic cleanup, efficient storage
- **AdSense-Ready Architecture** - Ad placements with no-gap policy (collapses when empty)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx       # Sticky navigation with search
│   ├── Footer.tsx       # Site footer
│   ├── BlogCard.tsx     # Blog post preview card
│   ├── SEO.tsx          # Dynamic meta tags
│   ├── AdPlaceholder.tsx # Ad component (no-gap design)
│   └── Skeleton.tsx     # Loading states
├── pages/               # Public route components
│   ├── HomePage.tsx     # Main blog listing
│   ├── BlogDetailPage.tsx # Article view
│   ├── SearchPage.tsx   # Search results
│   └── CategoriesPage.tsx # Category browser
├── admin/               # Admin panel (Part 2)
│   ├── pages/           # Admin route components
│   │   ├── AdminLoginPage.tsx      # Login page
│   │   ├── AdminDashboard.tsx      # Admin dashboard
│   │   ├── AdminBlogsPage.tsx      # Blog list management
│   │   └── AdminBlogEditorPage.tsx # Blog editor
│   ├── components/      # Admin UI components
│   │   └── ProtectedRoute.tsx      # Auth guard
│   ├── services/        # Admin API services
│   │   ├── adminBlogService.ts     # Blog CRUD operations
│   │   └── imageService.ts         # Image upload/compression
│   └── context/         # Admin state management
│       └── AdminAuthContext.tsx    # Auth state
├── services/            # Public API layer
│   └── blogService.ts   # Supabase queries
├── theme/               # Design system
│   ├── theme.ts         # Theme configuration
│   └── ThemeContext.tsx # Theme provider
├── hooks/               # Custom React hooks
│   └── useMediaQuery.ts # Responsive breakpoints
├── utils/               # Helper functions
│   └── helpers.ts       # Date, slug, text utilities
└── lib/                 # External integrations
    └── supabase.ts      # Supabase client
```

## Database Schema

### Tables
- **blogs** - Article content, metadata, and publication status
- **categories** - Content organization
- **tags** - Article tagging system
- **blog_tags** - Many-to-many relationship
- **admin_users** - Admin authorization (links to auth.users)

### Storage
- **blog-images** bucket - Stores compressed blog cover images
  - Public read access
  - Admin-only upload/delete
  - 5MB file size limit
  - Auto-compression on upload

### Key Features
- Row Level Security (RLS) enabled on all tables
- Admin-only write access, public read for published content
- Optimized indexes for fast queries
- View count tracking with atomic updates
- Secure image storage with automatic cleanup

## Ad Integration (AdSense-Ready)

The platform includes a complete ad system that:
- Uses `<AdPlaceholder>` components at strategic locations
- Automatically collapses when no ad is loaded (no gaps)
- Prevents layout shifts (CLS optimization)
- Supports multiple formats (horizontal, vertical, rectangle)

### Ad Placement Locations
1. **Homepage**: Top banner, in-feed ads
2. **Blog Detail**: Article top, mid-content, bottom
3. **No Empty Gaps**: Components collapse completely when unused

To enable ads, simply configure your AdSense account and populate the ad slots.

## SEO Optimization

- Clean URL structure with slugs
- Dynamic meta tags (title, description, OG tags)
- Proper heading hierarchy (H1, H2, H3)
- Fast loading with lazy-loaded images
- Mobile-friendly and responsive
- Structured data ready

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Admin Panel Access

### Route
Access the admin panel at `/shover-admin`

### First-Time Setup
1. Create an admin user in Supabase:
   ```sql
   -- First create the auth user in Supabase Dashboard (Authentication > Users)
   -- Then run this SQL with the user's UUID:
   INSERT INTO admin_users (id, email, full_name, role)
   VALUES (
     'YOUR_USER_UUID_HERE',
     'admin@yourdomain.com',
     'Admin Name',
     'admin'
   );
   ```

2. Login at `/shover-admin/login`

### Admin Features
- Create and publish blog posts
- Edit existing content
- Delete blogs (with automatic image cleanup)
- Toggle publish/draft status
- Mark posts as featured
- Upload and compress images
- Manage categories and tags

For detailed admin documentation, see [ADMIN_SETUP.md](./ADMIN_SETUP.md)

## Customization

### Theme
Edit `src/theme/theme.ts` to customize colors, typography, spacing, and more.

### Content Management
Use the admin panel at `/shover-admin` to manage:
- Blog posts
- Categories
- Tags
- Featured articles
- Cover images

## Performance

- Optimized bundle size (~108KB gzipped)
- Lazy loading for images
- Client-side image compression (60-80% size reduction)
- Efficient database queries with RLS
- Skeleton loading states
- Mobile-first responsive design
- Automatic storage cleanup (no orphaned files)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach

## License

MIT
