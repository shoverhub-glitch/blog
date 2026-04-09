-- Optimize blog search for scale.
-- Adds GIN indexes and an RPC endpoint for ranked full-text search with pagination.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_blogs_search_vector
ON blogs USING GIN (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
)
WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_blogs_title_trgm
ON blogs USING GIN (title gin_trgm_ops)
WHERE published = true;

CREATE OR REPLACE FUNCTION search_blogs(
  p_query text,
  p_limit integer DEFAULT 12,
  p_offset integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_query text := trim(coalesce(p_query, ''));
  v_tsquery tsquery;
  v_total bigint := 0;
  v_blogs jsonb := '[]'::jsonb;
BEGIN
  IF v_query = '' THEN
    RETURN jsonb_build_object('total', 0, 'blogs', '[]'::jsonb);
  END IF;

  BEGIN
    v_tsquery := websearch_to_tsquery('simple', v_query);
  EXCEPTION
    WHEN others THEN
      v_tsquery := plainto_tsquery('simple', v_query);
  END;

  WITH matched AS (
    SELECT
      b.id,
      b.title,
      b.slug,
      b.excerpt,
      b.cover_image,
      b.published_at,
      b.view_count,
      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      ts_rank_cd(
        to_tsvector('simple', coalesce(b.title, '') || ' ' || coalesce(b.excerpt, '')),
        v_tsquery
      ) AS rank
    FROM blogs b
    LEFT JOIN categories c ON c.id = b.category_id
    WHERE b.published = true
      AND (
        to_tsvector('simple', coalesce(b.title, '') || ' ' || coalesce(b.excerpt, '')) @@ v_tsquery
        OR b.title ILIKE '%' || v_query || '%'
        OR b.excerpt ILIKE '%' || v_query || '%'
      )
  ),
  counted AS (
    SELECT count(*)::bigint AS total FROM matched
  ),
  paged AS (
    SELECT *
    FROM matched
    ORDER BY rank DESC NULLS LAST, published_at DESC
    LIMIT GREATEST(p_limit, 1)
    OFFSET GREATEST(p_offset, 0)
  )
  SELECT
    counted.total,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', paged.id,
          'title', paged.title,
          'slug', paged.slug,
          'excerpt', paged.excerpt,
          'cover_image', paged.cover_image,
          'published_at', paged.published_at,
          'view_count', paged.view_count,
          'category',
            CASE
              WHEN paged.category_id IS NULL THEN NULL
              ELSE jsonb_build_object(
                'id', paged.category_id,
                'name', paged.category_name,
                'slug', paged.category_slug
              )
            END
        )
      ),
      '[]'::jsonb
    )
  INTO v_total, v_blogs
  FROM paged
  CROSS JOIN counted;

  RETURN jsonb_build_object(
    'total', COALESCE(v_total, 0),
    'blogs', COALESCE(v_blogs, '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION search_blogs(text, integer, integer)
TO anon, authenticated, service_role;
