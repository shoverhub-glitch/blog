-- Delete only blogs created by seed_test_blogs.sql
-- Matching rules are intentionally strict to avoid deleting real content.

BEGIN;

WITH target AS (
  SELECT id, title, slug
  FROM blogs
  WHERE slug LIKE 'test-blog-%'
    AND title LIKE 'Test Blog %'
    AND excerpt LIKE 'Auto-generated test excerpt for blog %'
)
DELETE FROM blogs b
USING target t
WHERE b.id = t.id;

COMMIT;
