# Supabase Migration Guide

Run these 3 files in order in Supabase SQL Editor:

## 1. `01_core_schema.sql`
Creates tables:
- `categories` - Blog categories
- `blogs` - Blog posts
- `admin_users` - Admin accounts
- `contact_messages` - Contact form
- Storage bucket `blog-images`

## 2. `02_security.sql`
Functions:
- `increment_view_count(uuid)` - Increments view count
- `is_admin(text)` - Checks admin by email
- `search_blogs(text, int, int)` - Search blogs

Policies:
- Public can read categories, published blogs
- Public can insert contact messages

## 3. `03_admin.sql`
- Admin full CRUD on all tables
- Admin storage management
- Function grants

---

## Add Admin User

```sql
INSERT INTO admin_users (email, full_name, role)
VALUES ('your-email@example.com', 'Your Name', 'admin');
```

Use your Supabase auth email.