import { supabase } from '../../lib/supabase';

const SETTINGS_CACHE_DURATION = 5 * 60 * 1000;
const settingsCache = new Map<string, { value: string | null; timestamp: number }>();

const getCachedSetting = (key: string): string | null | undefined => {
  const cached = settingsCache.get(key);
  if (cached && Date.now() - cached.timestamp < SETTINGS_CACHE_DURATION) {
    return cached.value;
  }
  return undefined;
};

const setCachedSetting = (key: string, value: string | null) => {
  settingsCache.set(key, { value, timestamp: Date.now() });
};

export const settingsService = {
  async getSetting(key: string): Promise<boolean> {
    const cached = getCachedSetting(key);
    if (cached !== undefined) {
      return cached === 'true';
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (error) throw error;

      const value = data?.value || 'false';
      setCachedSetting(key, value);
      return value === 'true';
    } catch (error) {
      console.error(`Failed to get setting ${key}:`, error);
      return false;
    }
  },

  async setSetting(key: string, value: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key, 
          value: value.toString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;

      setCachedSetting(key, value.toString());
      return true;
    } catch (error) {
      console.error(`Failed to set setting ${key}:`, error);
      return false;
    }
  },

  clearCache() {
    settingsCache.clear();
  },
};