import { supabase, Blog, Category, Tag } from '../../lib/supabase';
import { imageService } from './imageService';

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  category_id: string | null;
  published: boolean;
  published_at?: string | null;
  featured: boolean;
}

export const adminBlogService = {
  async createBlog(data: BlogFormData & { tags?: string[] }): Promise<Blog> {
    try {
      const { tags, ...blogData } = data;
      const normalizedData = {
        ...blogData,
        author_name: 'sampleHub Team',
        view_count: 0,
        published_at: blogData.published
          ? blogData.published_at || new Date().toISOString()
          : null,
      };

      const { data: blog, error } = await supabase
        .from('blogs')
        .insert([normalizedData])
        .select('*')
        .single();

      if (error) throw error;

      if (tags && tags.length > 0 && blog) {
        await this.updateBlogTags(blog.id, tags);
      }

      return blog;
    } catch (error) {
      console.error('Failed to create blog:', error);
      throw error;
    }
  },

  async updateBlog(
    blogId: string,
    data: Partial<BlogFormData> & { tags?: string[] }
  ): Promise<Blog> {
    try {
      const { tags, ...blogData } = data;

      const updateData = {
        ...blogData,
        ...(blogData.published === true && !blogData.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
        updated_at: new Date().toISOString(),
      };

      const { data: blog, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', blogId)
        .select('*')
        .single();

      if (error) throw error;

      if (tags && blog) {
        await this.updateBlogTags(blogId, tags);
      }

      return blog;
    } catch (error) {
      console.error('Failed to update blog:', error);
      throw error;
    }
  },

  async getBlogById(blogId: string): Promise<Blog | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          category:categories(*),
          blog_tags(tag:tags(*))
        `)
        .eq('id', blogId)
        .maybeSingle();

      if (error) throw error;

      if (data && data.blog_tags) {
        data.tags = data.blog_tags.map((bt: any) => bt.tag);
        delete data.blog_tags;
      }

      return data;
    } catch (error) {
      console.error('Failed to get blog:', error);
      throw error;
    }
  },

  async getAllAdminBlogs(
    page: number = 1,
    limit: number = 20
  ): Promise<{ blogs: Blog[]; total: number }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('blogs')
        .select(`
          *,
          category:categories(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return { blogs: data || [], total: count || 0 };
    } catch (error) {
      console.error('Failed to get blogs:', error);
      throw error;
    }
  },

  async deleteBlog(blogId: string, imageUrl?: string): Promise<void> {
    try {
      if (imageUrl) {
        await imageService.deleteImage(imageUrl);
      }

      const { error } = await supabase.from('blogs').delete().eq('id', blogId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete blog:', error);
      throw error;
    }
  },

  async updateBlogTags(blogId: string, tagIds: string[]): Promise<void> {
    try {
      await supabase.from('blog_tags').delete().eq('blog_id', blogId);

      if (tagIds.length > 0) {
        const tagRecords = tagIds.map((tagId) => ({
          blog_id: blogId,
          tag_id: tagId,
        }));

        const { error } = await supabase.from('blog_tags').insert(tagRecords);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Failed to update tags:', error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw error;
    }
  },

  async getTags(): Promise<Tag[]> {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to get tags:', error);
      throw error;
    }
  },

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 100);
  },

  validateBlogData(data: BlogFormData): string | null {
    if (!data.title?.trim()) return 'Title is required';
    if (!data.slug?.trim()) return 'Slug is required';
    if (!data.content?.trim()) return 'Content is required';
    if (!data.excerpt?.trim()) return 'Excerpt is required';
    if (data.title.length > 200) return 'Title must be less than 200 characters';
    if (data.excerpt.length > 300) return 'Excerpt must be less than 300 characters';
    if (data.slug.length > 100) return 'Slug must be less than 100 characters';
    return null;
  },
};
