import { supabase } from '../../lib/supabase';

const BUCKET_NAME = 'blog-images';
const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;
const QUALITY = 0.5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export const imageService = {
  validateImage(file: File): void {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ImageValidationError(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new ImageValidationError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
  },

  async compressAndOptimizeImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Could not compress image'));
              }
            },
            'image/webp',
            QUALITY
          );
        };

        img.onerror = () => reject(new Error('Could not load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  },

  async uploadBlogImage(blogId: string, file: File): Promise<string> {
    try {
      this.validateImage(file);
      const compressedBlob = await this.compressAndOptimizeImage(file);

      const fileName = `${Date.now()}.webp`;
      const filePath = `blogs/${blogId}/cover-image/${fileName}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, compressedBlob, {
          contentType: 'image/webp',
          upsert: false,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  },

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl) return;

      const urlParts = imageUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('blog-images') + 1).join('/');

      if (filePath && filePath.startsWith('blogs/')) {
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([filePath]);

        if (error && error.message !== 'The object does not exist') {
          console.warn('Failed to delete image:', error);
        }
      }
    } catch (error) {
      console.error('Image deletion failed:', error);
    }
  },

  async deleteImagesByBlogId(blogId: string): Promise<void> {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(`blogs/${blogId}/cover-image/`);

      if (error) {
        if (error.message.includes('not found')) {
          return;
        }
        throw error;
      }

      if (data && data.length > 0) {
        const filePaths = data.map((file) => `blogs/${blogId}/cover-image/${file.name}`);
        await supabase.storage.from(BUCKET_NAME).remove(filePaths);
      }
    } catch (error) {
      console.error('Failed to delete blog images:', error);
    }
  },

  getStorageUrl(path: string): string {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  },
};
