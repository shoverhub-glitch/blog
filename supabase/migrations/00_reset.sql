-- ============================================================================
-- RESET DATABASE - Run this FIRST to clear everything
-- ============================================================================

-- Simply drop all tables (CASCADE removes foreign keys, policies, etc.)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS increment_view_count(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_admin(text) CASCADE;
DROP FUNCTION IF EXISTS search_blogs(text, int, int) CASCADE;

-- NOTE: To delete storage bucket, go to Supabase Dashboard → Storage → Delete bucket
-- ============================================================================