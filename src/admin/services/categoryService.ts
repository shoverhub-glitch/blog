import { supabase, Category } from '../../lib/supabase';

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
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

  async getById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get category:', error);
      throw error;
    }
  },

  async create(data: CategoryFormData): Promise<Category> {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .insert([data])
        .select('*')
        .single();

      if (error) throw error;
      return category;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<CategoryFormData>): Promise<Category> {
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return category;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  },

  async getBlogCount(categoryId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('blogs')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Failed to get blog count:', error);
      return 0;
    }
  },

  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  },

  validateCategoryData(data: CategoryFormData): string | null {
    if (!data.name?.trim()) return 'Name is required';
    if (!data.slug?.trim()) return 'Slug is required';
    if (data.name.length > 100) return 'Name must be less than 100 characters';
    if (data.slug.length > 100) return 'Slug must be less than 100 characters';
    if (data.description.length > 500) return 'Description must be less than 500 characters';
    return null;
  },
};
