import { Tag } from '../lib/supabase';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const readingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return 'Less than a minute';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
};

export const getTagsArray = (tags: string | Tag[] | undefined): Tag[] => {
  if (Array.isArray(tags)) {
    return tags;
  }
  if (typeof tags === 'string' && tags.trim()) {
    const unique = Array.from(new Set(
      tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    ));

    return unique.map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim() || name,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim() || name.toLowerCase(),
      created_at: new Date().toISOString(),
    }));
  }
  return [];
};
