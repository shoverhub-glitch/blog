# Admin Panel Setup Guide

## Overview

The sampleHub admin panel is a secure, mobile-first content management system accessible via the `/shover-admin` route.

---

## Features

### Authentication & Security
- Email/password authentication via Supabase Auth
- Row Level Security (RLS) on all database tables
- Admin-only access to create/edit/delete operations
- Persistent sessions with automatic state management
- Protected routes with authentication guards

### Blog Management
- Create new blog posts
- Edit existing posts
- Delete posts (with automatic image cleanup)
- Toggle publish/draft status
- Mark posts as featured

### Image Management (Optimized for Storage Efficiency)
- **Client-side image compression** before upload
- **Automatic resizing** to max 1200x800px
- **Quality optimization** (75% JPEG compression)
- **Deferred uploads**: Images only upload on save/publish
- **Automatic cleanup**: Old images deleted when replaced
- **Cascade deletion**: All images removed when blog is deleted
- **Storage path structure**: `/blogs/{blog-id}/cover-image/`

### Content Editor
- Title with auto-slug generation
- Rich content editor (HTML/Markdown support)
- Excerpt field (300 char limit)
- Cover image upload with preview
- Category assignment
- Tag selection (multi-select)
- Publish/Draft toggle
- Featured post toggle

### Mobile-First Design
- Fully responsive across all devices
- Touch-optimized interface
- Clean, minimal UI using centralized theme system
- Dark mode support (inherits from site theme)

---

## Access

### Route
The admin panel is accessible at:
```
/shover-admin
```

This route automatically redirects to `/shover-admin/dashboard` when authenticated.

### Login Page
```
/shover-admin/login
```

---

## Creating an Admin User

Since you don't have an admin user yet, you'll need to create one via Supabase:

### Step 1: Create Auth User
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User**
4. Enter email and password
5. Copy the user's UUID

### Step 2: Add to Admin Users Table
Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'YOUR_USER_UUID_HERE',
  'admin@yourdomain.com',
  'Admin Name',
  'admin'
);
```

### Step 3: Login
1. Navigate to `/shover-admin/login`
2. Enter your credentials
3. You'll be redirected to the dashboard

---

## Admin Panel Structure

### Pages

#### Dashboard (`/shover-admin/dashboard`)
- Overview of admin actions
- Quick access to create/manage blogs
- User info display
- Sign out option

#### Blogs List (`/shover-admin/blogs`)
- Paginated table of all blogs (20 per page)
- Displays: Title, Category, Status, Creation Date
- Actions: Publish/Unpublish, Edit, Delete
- Create new blog button

#### Blog Editor (`/shover-admin/blogs/new` or `/shover-admin/blogs/:id/edit`)
- Complete blog editing form
- Image upload with compression
- Auto-slug generation
- Category selection
- Tag selection (multi-select)
- Draft/Publish toggle
- Featured toggle
- Save/Cancel actions

---

## Image Upload Workflow

### How It Works

1. **User selects image**: File is stored in component state
2. **Client-side compression**:
   - Resize to max 1200x800px (maintains aspect ratio)
   - Convert to JPEG with 75% quality
   - Reduces file size by 60-80% typically
3. **Preview shown**: Compressed image previewed locally
4. **Upload on save**: Only when user clicks "Save" or "Publish"
5. **Old image cleanup**: If replacing existing image, old one is deleted
6. **Blog deletion**: All associated images automatically removed

### Benefits

- **Saves storage space**: Compression reduces costs
- **Prevents orphaned files**: Cleanup on replace/delete
- **Better UX**: No unnecessary uploads on cancel
- **Faster loads**: Optimized images for web

---

## Database Schema

### Tables

#### `admin_users`
- Links auth users to admin role
- RLS enabled: Only admins can read this table
- Used for authorization checks

#### `blogs`
- Main content table
- RLS: Public can read published blogs, admins can manage all
- Author tracking via `author_id` and `updated_by`

#### `categories`
- Blog categories
- RLS: Public read, admin write

#### `tags`
- Blog tags
- RLS: Public read, admin write

#### `blog_tags`
- Many-to-many relationship
- RLS: Public read, admin write

### Storage

#### `blog-images` bucket
- Public bucket for blog cover images
- 5MB file size limit
- Allowed types: JPEG, PNG, WebP, GIF
- RLS: Public can view, admins can upload/delete

---

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- Public users: Can only read published content
- Admin users: Can create, update, delete all content
- Checks `admin_users` table for authorization

### Storage Security
- Upload/delete restricted to admin users
- Public can only view images
- File size and type restrictions enforced

### Protected Routes
- `ProtectedRoute` component guards admin pages
- Redirects to login if not authenticated
- Checks admin status before allowing access

### Session Management
- Automatic session persistence
- Auth state listeners for real-time updates
- Secure sign-in/sign-out flow

---

## Usage Tips

### Creating a Blog Post

1. Go to **Admin > Blogs**
2. Click **"New Blog"**
3. Fill in:
   - **Title**: Will auto-generate slug
   - **Slug**: Edit if needed (URL-friendly)
   - **Cover Image**: Upload and auto-compressed
   - **Excerpt**: Brief description (max 300 chars)
   - **Content**: Full HTML/Markdown content
   - **Category**: Select from dropdown
   - **Tags**: Click to select multiple
4. Toggle **Published** to make live
5. Toggle **Featured** to show on homepage
6. Click **"Create Blog"**

### Editing a Blog Post

1. Go to **Admin > Blogs**
2. Click **Edit** icon on the blog
3. Make changes
4. Click **"Update Blog"**
5. Old cover image (if replaced) automatically deleted

### Deleting a Blog Post

1. Go to **Admin > Blogs**
2. Click **Delete** icon
3. Confirm deletion
4. Blog and all associated images removed

### Publishing/Unpublishing

1. Go to **Admin > Blogs**
2. Click the **eye icon** to toggle
3. Changes immediately

---

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **React Router** for routing
- **Supabase Client** for API calls
- **Centralized theme system** (no CSS files)
- **Lucide React** for icons

### Services

#### `adminBlogService.ts`
- Blog CRUD operations
- Tag management
- Category fetching
- Slug generation
- Data validation

#### `imageService.ts`
- Image compression (client-side)
- Upload to Supabase Storage
- Delete from storage
- Batch cleanup operations

### Context

#### `AdminAuthContext.tsx`
- Authentication state management
- Admin authorization checks
- Sign in/out functions
- Session persistence

### Components

#### `ProtectedRoute.tsx`
- Route guard wrapper
- Auth/admin checks
- Loading states
- Redirect logic

---

## Storage Optimization

The image system is designed to minimize storage usage:

### Compression Stats
- **Original**: 3-5MB typical photo
- **Compressed**: 200-800KB (60-80% reduction)
- **Quality**: Minimal visual degradation
- **Format**: JPEG (best size/quality ratio)

### Cleanup Strategy
- **On replace**: Old image deleted before new upload
- **On delete**: All blog images removed
- **No orphans**: Structured paths prevent abandoned files

### Free Tier Friendly
Supabase free tier includes:
- 1GB storage
- With compression, ~1,000-5,000 blog images
- Efficient for most blogs

---

## Future Enhancements (Optional)

- Bulk operations (delete multiple blogs)
- Image gallery management
- Analytics dashboard
- Draft previews
- Scheduled publishing
- SEO score analyzer
- Content versioning

---

## Troubleshooting

### Can't Login
- Verify user exists in Supabase Auth
- Check `admin_users` table has matching UUID
- Ensure RLS policies are active

### Images Not Uploading
- Check file size (<5MB)
- Verify file type (JPEG, PNG, WebP, GIF)
- Ensure admin user has storage permissions

### 403 Errors
- Verify user is in `admin_users` table
- Check RLS policies are correct
- Confirm storage policies allow admin access

---

## API Reference

### Admin Blog Service

```typescript
// Create blog
await adminBlogService.createBlog({
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  cover_image: string,
  category_id: string | null,
  published: boolean,
  featured: boolean,
  tags: string[] // optional
});

// Update blog
await adminBlogService.updateBlog(blogId, { ...updates });

// Delete blog
await adminBlogService.deleteBlog(blogId, imageUrl);

// Get categories/tags
const categories = await adminBlogService.getCategories();
const tags = await adminBlogService.getTags();
```

### Image Service

```typescript
// Upload image (compressed)
const url = await imageService.uploadBlogImage(blogId, file);

// Delete image
await imageService.deleteImage(imageUrl);

// Delete all blog images
await imageService.deleteImagesByBlogId(blogId);
```

---

## Support

For issues or questions:
1. Check this documentation
2. Review Supabase logs
3. Check browser console for errors
4. Verify RLS policies in Supabase Dashboard

---

**Built with security, efficiency, and user experience in mind.**
