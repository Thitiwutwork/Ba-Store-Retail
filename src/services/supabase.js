import { createClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  URL: 'bastore_supabase_url',
  ANON_KEY: 'bastore_supabase_anon_key'
};

export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem(STORAGE_KEYS.URL);
  const localKey = localStorage.getItem(STORAGE_KEYS.ANON_KEY);

  const url = (localUrl || envUrl || '').trim();
  const anonKey = (localKey || envKey || '').trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 20)
  };
};

export const saveSupabaseConfig = (url, anonKey) => {
  if (url) localStorage.setItem(STORAGE_KEYS.URL, url.trim());
  else localStorage.removeItem(STORAGE_KEYS.URL);

  if (anonKey) localStorage.setItem(STORAGE_KEYS.ANON_KEY, anonKey.trim());
  else localStorage.removeItem(STORAGE_KEYS.ANON_KEY);

  supabaseInstance = null; // Reset cached client
};

let supabaseInstance = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};
