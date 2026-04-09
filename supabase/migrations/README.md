# Supabase Migration Order

All 9 files are **required** for the service. Here's the correct execution order:

## Execution Order (1-9)

| # | File | Purpose | Required For |
|---|------|---------|--------------|
| 1 | `001_create_blog_schema.sql` | Creates categories, tags, blogs, blog_tags tables + indexes | Core blog feature |
| 2 | `002_create_admin_system.sql` | Creates admin_users table + is_admin() function | Admin authentication |
| 3 | `003_create_comments_system.sql` | Creates comments, comment_likes tables + get_comments_count() | Blog comments |
| 4 | `004_create_site_settings.sql` | Creates site_settings table for feature toggles | Feature toggles |
| 5 | `005_create_storage_bucket.sql` | Creates blog-images bucket for image uploads | Cover images |
| 6 | `006_create_functions.sql` | Creates increment_view_count() function | View counting |
| 7 | `007_enable_rls.sql` | Enables RLS + creates all security policies | Security |
| 8 | `008_optimize_search.sql` | Creates search_blogs() RPC + GIN indexes | Search feature |
| 9 | `009_complete_schema_security.sql` | contact_messages table + is_admin_user() function + policy fixes | Contact form + security |

---

## File Analysis

### ✅ All Files Are Required

| File | Status | Reason |
|------|--------|--------|
| `create_blog_schema.sql` | ✅ Needed | Core tables: blogs, categories, tags |
| `create_admin_system.sql` | ✅ Needed | Admin users table + auth check function |
| `create_comments_system.sql` | ✅ Needed | Comments on BlogDetailPage.tsx |
| `create_site_settings.sql` | ✅ Needed | Feature toggle (admin_contact_messages_enabled) |
| `create_storage_bucket.sql` | ✅ Needed | Image uploads for cover_image |
| `create_functions.sql` | ✅ Needed | increment_view_count() used in blogService.ts |
| `enable_rls.sql` | ✅ Needed | Security policies for all tables |
| `optimize_search.sql` | ✅ Needed | search_blogs() RPC used in blogService.ts |
| `complete_schema_security.sql` | ✅ Needed | contact_messages table + is_admin_user() |

---

## Rename Instructions

Current filename → New filename:
```
create_blog_schema.sql          → 001_create_blog_schema.sql
create_admin_system.sql          → 002_create_admin_system.sql
create_comments_system.sql      → 003_create_comments_system.sql
create_site_settings.sql         → 004_create_site_settings.sql
create_storage_bucket.sql        → 005_create_storage_bucket.sql
create_functions.sql             → 006_create_functions.sql
enable_rls.sql                   → 007_enable_rls.sql
optimize_search.sql              → 008_optimize_search.sql
complete_schema_security.sql    → 009_complete_schema_security.sql
```

---

## Dependencies

```
001_create_blog_schema
       ↓
002_create_admin_system
       ↓
003_create_comments_system
       ↓
004_create_site_settings
       ↓
005_create_storage_bucket
       ↓
006_create_functions
       ↓
007_enable_rls
       ↓
008_optimize_search
       ↓
009_complete_schema_security
```

Run them in order 1-9. No skips allowed.