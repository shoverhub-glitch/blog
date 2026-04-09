-- Seed 5 random test blogs into the blogs table.
-- Safe to run multiple times because slugs include random suffixes.

INSERT INTO blogs (
  title,
  slug,
  content,
  excerpt,
  cover_image,
  author_name,
  category_id,
  published,
  featured,
  view_count,
  tags,
  published_at,
  created_at,
  updated_at
)
SELECT
  'Test Blog ' || g.n AS title,
  'test-blog-' || g.n || '-' || substr(md5(random()::text), 1, 6) AS slug,
  format(
    $article$
    <h1>Building Reliable Web Apps in 2026: Field Notes #%s</h1>
    <p>Modern web products are expected to feel instant, resilient, and polished across every device. In this long-form test article, we explore practical engineering choices that improve perceived performance, reliability, and maintainability without requiring a full platform rewrite.</p>
    <p>The goal is simple: ship features quickly while keeping operational risk low. Teams that succeed here usually invest in small, repeatable patterns such as predictable data contracts, narrow API payloads, and thoughtful defaults for caching and retries. None of these practices are flashy on their own, but together they compound into a noticeably better user experience.</p>

    <h2>1. Start with User-Centric Performance</h2>
    <p>Users do not measure your app by bundle reports or infrastructure dashboards. They judge by how quickly they can read, click, and complete a task. That means first contentful paint, interaction readiness, and smooth transitions matter far more than abstract technical scores. Focus your initial optimization on the primary route and defer lower-priority requests until after the page becomes useful.</p>
    <p>A practical approach is to classify requests into three tiers: critical, secondary, and background. Critical data is required for the first meaningful render. Secondary data enriches the page but can load shortly after. Background data supports future navigation and can be fetched lazily. This pattern keeps interfaces responsive, especially on slow networks.</p>

    <h2>2. Design Data Flows for Failure</h2>
    <p>Every API call can fail, timeout, or return partial data. Instead of treating failure as exceptional, design for it explicitly. Build your UI states around loading, empty, error, and success paths. This prevents brittle screens and makes troubleshooting much easier when a dependency is degraded.</p>
    <p>When possible, return partial content instead of failing the full page. If tags or recommendations are unavailable, show the article and degrade secondary modules gracefully. This keeps session continuity and helps users keep reading while systems recover.</p>

    <h2>3. Keep Schemas and Application Code Aligned</h2>
    <p>Many production incidents come from schema drift: code assumes one table shape while the database contains another. The safest habit is to encode schema decisions clearly in both SQL migrations and service-layer access patterns. If tags are stored as a comma-separated field, all read/write paths should consistently treat them that way until a migration changes the model.</p>
    <p>Consistency beats elegance when operating under deadlines. You can evolve to a more normalized model later, but mixed patterns in the same codebase are expensive to reason about and often cause subtle bugs in admin tools and analytics jobs.</p>

    <h2>4. Request Deduplication and Caching</h2>
    <p>Concurrent duplicate requests are a hidden tax. During route transitions and component mounts, the same query may fire multiple times. A lightweight in-flight request map can collapse these into one network call. Pair this with short-lived in-memory caching for paginated lists and category filters to reduce backend pressure while preserving freshness.</p>
    <p>Always define cache invalidation triggers. Content publishing, updates, and deletes should clear relevant cache keys. Without invalidation, stale data can linger and create confidence issues for editors and end users.</p>

    <h2>5. Editorial Quality and Structured Content</h2>
    <p>Long-form content should be easy to scan. Use informative headings, concise paragraphs, and purposeful lists. Rich structure improves accessibility, helps search engines interpret article hierarchy, and makes table-of-contents features more useful. A dense wall of text can discourage engagement even when the topic is strong.</p>
    <p>For technical articles, include concrete examples, trade-offs, and implementation notes. Readers value specificity: what changed, why it changed, and what measurable outcome followed. This pattern makes content credible and reusable across future projects.</p>

    <h2>6. Practical Checklist</h2>
    <ul>
      <li>Render critical content first and defer non-essential requests.</li>
      <li>Implement clear loading and fallback states for each module.</li>
      <li>Align service queries with the actual schema used in production.</li>
      <li>Deduplicate concurrent requests and cache high-frequency reads.</li>
      <li>Use semantic headings and accessible markup for long articles.</li>
      <li>Instrument key user journeys and review real-world timings weekly.</li>
    </ul>

    <h2>Conclusion</h2>
    <p>Reliable speed is the product of many small decisions made consistently. Teams that prioritize user-perceived performance, predictable data flows, and operational clarity are able to ship faster without sacrificing trust. The techniques in this article are intentionally incremental so they can be applied immediately in existing projects.</p>
    <p>This is generated test content entry #%s, designed to mimic real editorial length for layout, SEO, and rendering validation. It is intentionally verbose to help stress-test reading views, related-content modules, and content sanitization pipelines in development environments.</p>
    $article$,
    g.n,
    g.n
  ) AS content,
  'Auto-generated test excerpt for blog ' || g.n AS excerpt,
  '' AS cover_image,
  'ShoverHub Team' AS author_name,
  (
    SELECT id
    FROM categories
    ORDER BY random()
    LIMIT 1
  ) AS category_id,
  true AS published,
  (random() < 0.3) AS featured,
  floor(random() * 800)::int AS view_count,
  (
    ARRAY[
      'react, typescript',
      'seo, performance',
      'supabase, postgres',
      'ui, design',
      'testing, qa'
    ]
  )[1 + floor(random() * 5)::int] AS tags,
  now() - ((1 + floor(random() * 30)::int)::text || ' days')::interval AS published_at,
  now() AS created_at,
  now() AS updated_at
FROM generate_series(1, 5) AS g(n);
