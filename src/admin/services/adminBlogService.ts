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
  tags?: string;
}

export const adminBlogService = {
  async createBlog(data: BlogFormData): Promise<Blog> {
    try {
      const tagsString = data.tags || '';
      const tagNames = tagsString.split(',').map(t => t.trim()).filter(Boolean);
      
      const blogData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        cover_image: data.cover_image,
        category_id: data.category_id,
        published: data.published,
        featured: data.featured,
        author_name: 'ShoverHub Team',
        view_count: 0,
        tags: data.tags || '',
        published_at: data.published ? data.published_at || new Date().toISOString() : null,
      };

      const { data: blog, error } = await supabase
        .from('blogs')
        .insert(blogData)
        .select()
        .single();

      if (error) throw error;

      if (tagNames.length > 0) {
        for (const tagName of tagNames) {
          const { data: existingTags } = await supabase
            .from('tags')
            .select('*')
            .ilike('name', tagName)
            .limit(1);
          
          let existingTag = existingTags?.[0];
          
          if (!existingTag) {
            const { data: newTag } = await supabase
              .from('tags')
              .insert({ 
                name: tagName, 
                slug: tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') 
              })
              .select()
              .single();
            
            if (newTag) existingTag = newTag;
          }
          
          if (existingTag) {
            await supabase
              .from('blog_tags')
              .insert({ blog_id: blog.id, tag_id: existingTag.id });
          }
        }
      }

      return blog;
    } catch (err) {
      console.error('Create blog error:', err);
      throw err;
    }
  },

  async updateBlog(blogId: string, data: Partial<BlogFormData>): Promise<Blog> {
    try {
      const tagsString = data.tags;
      const tagNames = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];

      const { tags, ...blogData } = data as BlogFormData;

      const updateData: Record<string, unknown> = {
        ...blogData,
        ...(blogData?.published === true && !blogData?.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
        updated_at: new Date().toISOString(),
      };

      if (tagsString !== undefined) {
        delete updateData.tags;
      }

      const { data: blog, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', blogId)
        .select()
        .single();

      if (error) throw error;

      if (tagNames.length > 0 || tagsString === '') {
        await supabase.from('blog_tags').delete().eq('blog_id', blogId);

        for (const tagName of tagNames) {
          const { data: existingTags } = await supabase
            .from('tags')
            .select('*')
            .ilike('name', tagName)
            .limit(1);
          
          let existingTag = existingTags?.[0];
          
          if (!existingTag) {
            const { data: newTag } = await supabase
              .from('tags')
              .insert({ 
                name: tagName, 
                slug: tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') 
              })
              .select()
              .single();
            
            if (newTag) existingTag = newTag;
          }
          
          if (existingTag) {
            await supabase
              .from('blog_tags')
              .insert({ blog_id: blogId, tag_id: existingTag.id });
          }
        }
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
        data.tags_list = data.blog_tags.map((bt: { tag: Tag }) => bt.tag);
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

      await supabase.from('blog_tags').delete().eq('blog_id', blogId);

      const { error } = await supabase.from('blogs').delete().eq('id', blogId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete blog:', error);
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