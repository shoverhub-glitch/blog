# sampleHub Quick Start Guide

This guide will help you get sampleHub running in minutes.

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment Variables

Create a `.env` file in the project root (if not already present) with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase Dashboard under **Project Settings** > **API**.

---

## 3. Database Setup

The migrations are already in place. The database schema includes:

- `blogs` - Blog posts with full content
- `categories` - Blog categories
- `tags` - Blog tags
- `blog_tags` - Tag associations
- `admin_users` - Admin authorization
- `blog-images` storage bucket - Image storage

All tables have Row Level Security (RLS) enabled for secure data access.

---

## 4. Create Your First Admin User

### Step 1: Create Auth User in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Users**
4. Click **Add User** (manual)
5. Enter:
   - **Email**: `admin@yourdomain.com` (use your real email)
   - **Password**: Create a strong password
6. Click **Create User**
7. **Copy the user's UUID** (you'll need this in the next step)

### Step 2: Add User to Admin Table

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query
3. Paste this SQL (replace `YOUR_USER_UUID` with the UUID from Step 1):

```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'YOUR_USER_UUID_HERE',  -- Replace with the UUID from Step 1
  'admin@yourdomain.com', -- Same email as above
  'Admin User',           -- Your name
  'admin'
);
```

4. Click **Run** or press `Ctrl+Enter`
5. You should see: "Success. No rows returned"

---

## 5. Add Sample Categories (Optional)

Run this SQL in Supabase SQL Editor to add starter categories:

```sql
INSERT INTO categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Tech news, tutorials, and insights'),
  ('Design', 'design', 'UI/UX, graphics, and creative content'),
  ('Business', 'business', 'Entrepreneurship and business strategies'),
  ('Lifestyle', 'lifestyle', 'Health, wellness, and personal growth')
ON CONFLICT (slug) DO NOTHING;
```

---

## 6. Add Sample Tags (Optional)

```sql
INSERT INTO tags (name, slug) VALUES
  ('Tutorial', 'tutorial'),
  ('Guide', 'guide'),
  ('News', 'news'),
  ('Review', 'review'),
  ('Tips', 'tips'),
  ('Best Practices', 'best-practices')
ON CONFLICT (slug) DO NOTHING;
```

---

## 7. Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

---

## 8. Access Admin Panel

1. Navigate to: `http://localhost:5173/shover-admin/login`
2. Enter your admin credentials:
   - **Email**: `admin@yourdomain.com`
   - **Password**: The password you set in Step 4.1
3. Click **Sign In**
4. You'll be redirected to the admin dashboard

---

## 9. Create Your First Blog Post

### In the Admin Panel:

1. Click **"Create Blog"** or go to **Blogs** > **New Blog**
2. Fill in the form:
   - **Title**: "Welcome to sampleHub"
   - **Slug**: (auto-generated, or edit it)
   - **Cover Image**: Upload an image (will be auto-compressed)
   - **Excerpt**: "A modern blog platform built with React and Supabase"
   - **Content**: Add your HTML/Markdown content
   - **Category**: Select a category
   - **Tags**: Click to select tags
3. Toggle **Published** to make it live
4. Toggle **Featured** to show it on homepage
5. Click **"Create Blog"**

---

## 10. View Your Blog

1. Navigate to the homepage: `http://localhost:5173`
2. You should see your published blog post
3. Click on it to view the full article

---

## Production Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

### Deploy

Deploy the `dist/` folder to your hosting provider:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **Cloudflare Pages**: Connect your repo
- **Any static host**: Upload `dist/` contents

### Environment Variables in Production

Make sure to set these environment variables in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Troubleshooting

### "Login failed" or "Invalid credentials"

- Verify the email and password are correct
- Check that the user exists in Supabase Auth
- Ensure the user is added to the `admin_users` table

### "403 Forbidden" when creating blogs

- Verify the user is in the `admin_users` table
- Check that RLS policies are enabled
- Run the migrations again if needed

### Images not uploading

- Check file size (must be <5MB)
- Verify file type (JPEG, PNG, WebP, GIF only)
- Check browser console for errors
- Verify storage bucket `blog-images` exists

### No categories/tags showing

- Run the sample SQL queries above
- Or create them manually in Supabase Dashboard

---

## Next Steps

1. **Customize Theme**: Edit `src/theme/theme.ts`
2. **Add More Content**: Create more blog posts
3. **Configure SEO**: Update meta tags in `index.html`
4. **Add Analytics**: Integrate Google Analytics or similar
5. **Enable Ads**: Configure AdSense in `AdPlaceholder` components
6. **Custom Domain**: Point your domain to your hosting provider

---

## Key Features to Explore

### Image Optimization
- Upload images in the admin panel
- Automatic compression (60-80% size reduction)
- Auto-resize to 1200x800px max
- Deleted when blog is deleted or replaced

### Content Management
- Draft/Publish toggle
- Featured posts on homepage
- Category filtering
- Tag organization
- Full-text search

### Security
- Row Level Security (RLS) on all tables
- Admin-only write access
- Public read for published content
- Secure image storage

---

## Support & Documentation

- **Full Admin Guide**: See [ADMIN_SETUP.md](./ADMIN_SETUP.md)
- **README**: See [README.md](./README.md)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

**You're all set! Start creating amazing content with sampleHub.**
