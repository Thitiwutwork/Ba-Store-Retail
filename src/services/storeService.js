import { getSupabase } from './supabase';
import { DEFAULT_PRODUCTS, DEFAULT_PROMOTIONS, DEFAULT_SETTINGS } from '../data/defaultData';

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'bastore_products_v1',
  PROMOTIONS: 'bastore_promotions_v1',
  SETTINGS: 'bastore_settings_v1'
};

// Helper: Convert database snake_case to app camelCase for Product
const mapProductFromDB = (p) => ({
  id: p.id,
  name: p.name,
  category: p.category || 'ทั่วไป',
  tag: p.tag || '',
  tagColor: p.tag_color || p.tagColor || 'pink',
  devices: p.devices || '',
  resolution: p.resolution || '',
  packageDetails: p.package_details || p.packageDetails || '',
  subDetail: p.sub_detail || p.subDetail || '',
  priceLabel: p.price_label || p.priceLabel || 'ลูกค้า',
  price: p.price || '',
  hasSecondPrice: Boolean(p.has_second_price ?? p.hasSecondPrice),
  secondPriceLabel: p.second_price_label || p.secondPriceLabel || 'ร้าน',
  secondPrice: p.second_price || p.secondPrice || '',
  priceUnit: p.price_unit || p.priceUnit || '฿',
  pricePeriod: p.price_period || p.pricePeriod || '',
  icon: p.icon || '/logos/iqiyi.png',
  inStock: p.in_stock !== false && p.inStock !== false,
  stockStatus: p.stock_status || p.stockStatus || 'ready',
  prices: Array.isArray(p.prices) && p.prices.length > 0 ? p.prices : [
    { id: 'price-1', label: p.price_label || 'ลูกค้า', price: p.price || '', period: p.price_period || '', status: 'ready' }
  ],
  sortOrder: p.sort_order ?? 0
});

// Helper: Convert app camelCase to database snake_case for Product
const mapProductToDB = (p, idx = 0) => ({
  id: p.id,
  name: p.name,
  category: p.category || 'ทั่วไป',
  tag: p.tag || '',
  tag_color: p.tagColor || 'pink',
  devices: p.devices || '',
  resolution: p.resolution || '',
  package_details: p.packageDetails || '',
  sub_detail: p.subDetail || '',
  price_label: p.priceLabel || 'ลูกค้า',
  price: p.price || '',
  has_second_price: Boolean(p.hasSecondPrice),
  second_price_label: p.secondPriceLabel || 'ร้าน',
  second_price: p.secondPrice || '',
  price_unit: p.priceUnit || '฿',
  price_period: p.pricePeriod || '',
  icon: p.icon || '/logos/iqiyi.png',
  in_stock: p.inStock !== false,
  stock_status: p.stockStatus || 'ready',
  prices: p.prices || [],
  sort_order: p.sortOrder ?? idx,
  updated_at: new Date().toISOString()
});

// Helper: Convert database snake_case to app camelCase for Promotion
const mapPromotionFromDB = (p) => {
  let apps = Array.isArray(p.apps) && p.apps.length > 0 ? p.apps : [];
  if (apps.length === 0 && (p.app1_name || p.app1Name)) {
    apps = [
      {
        name: p.app1_name || p.app1Name || '',
        icon: p.app1_icon || p.app1Icon || '/logos/iqiyi.png',
        devices: p.app1_devices || p.app1Devices || '',
        resolution: p.app1_resolution || p.app1Resolution || ''
      },
      {
        name: p.app2_name || p.app2Name || '',
        icon: p.app2_icon || p.app2Icon || '/logos/viu.png',
        devices: p.app2_devices || p.app2Devices || '',
        resolution: p.app2_resolution || p.app2Resolution || ''
      }
    ].filter(a => a.name);
  }

  return {
    id: p.id,
    name: p.name,
    tag: p.tag || '🔥 โปรคู่สุดฮิต',
    tagColor: p.tag_color || p.tagColor || 'rose',
    apps,
    app1Name: apps[0]?.name || p.app1_name || '',
    app1Icon: apps[0]?.icon || p.app1_icon || '',
    app2Name: apps[1]?.name || p.app2_name || '',
    app2Icon: apps[1]?.icon || p.app2_icon || '',
    originalPrice: p.original_price || p.originalPrice || '',
    promoPrice: p.promo_price || p.promoPrice || '',
    pricePeriod: p.price_period || p.pricePeriod || '',
    devices: p.devices || '',
    resolution: p.resolution || '',
    packageDetails: p.package_details || p.packageDetails || '',
    inStock: p.in_stock !== false && p.inStock !== false
  };
};

// Helper: Convert app camelCase to database snake_case for Promotion
const mapPromotionToDB = (p) => {
  const apps = Array.isArray(p.apps) ? p.apps : [];
  return {
    id: p.id,
    name: p.name,
    tag: p.tag || '🔥 โปรคู่สุดฮิต',
    tag_color: p.tagColor || 'rose',
    apps,
    app1_name: apps[0]?.name || p.app1Name || '',
    app1_icon: apps[0]?.icon || p.app1Icon || '',
    app1_devices: apps[0]?.devices || p.app1Devices || '',
    app1_resolution: apps[0]?.resolution || p.app1Resolution || '',
    app2_name: apps[1]?.name || p.app2Name || '',
    app2_icon: apps[1]?.icon || p.app2Icon || '',
    app2_devices: apps[1]?.devices || p.app2Devices || '',
    app2_resolution: apps[1]?.resolution || p.app2Resolution || '',
    original_price: p.originalPrice || '',
    promo_price: p.promoPrice || '',
    price_period: p.pricePeriod || '',
    devices: p.devices || '',
    resolution: p.resolution || '',
    package_details: p.packageDetails || '',
    in_stock: p.inStock !== false,
    updated_at: new Date().toISOString()
  };
};

// Helper: Map store settings
const mapSettingsFromDB = (s) => ({
  storeName: s.store_name || s.storeName || DEFAULT_SETTINGS.storeName,
  badgeText: s.badge_text || s.badgeText || DEFAULT_SETTINGS.badgeText,
  description: s.description || DEFAULT_SETTINGS.description,
  subDescription: s.sub_description || s.subDescription || DEFAULT_SETTINGS.subDescription,
  openingHours: s.opening_hours || s.openingHours || DEFAULT_SETTINGS.openingHours,
  announcement: s.announcement || DEFAULT_SETTINGS.announcement,
  bannerUrl: s.banner_url || s.bannerUrl || DEFAULT_SETTINGS.bannerUrl,
  bannerFit: s.banner_fit || s.bannerFit || DEFAULT_SETTINGS.bannerFit,
  logoUrl: s.logo_url || s.logoUrl || DEFAULT_SETTINGS.logoUrl,
  lineId: s.line_id || s.lineId || DEFAULT_SETTINGS.lineId,
  lineUrl: s.line_url || s.lineUrl || DEFAULT_SETTINGS.lineUrl,
  badge1Title: s.badge1_title || s.badge1Title || DEFAULT_SETTINGS.badge1Title,
  badge1Sub: s.badge1_sub || s.badge1Sub || DEFAULT_SETTINGS.badge1Sub,
  badge2Title: s.badge2_title || s.badge2Title || DEFAULT_SETTINGS.badge2Title,
  badge2Sub: s.badge2_sub || s.badge2Sub || DEFAULT_SETTINGS.badge2Sub,
  badge3Title: s.badge3_title || s.badge3Title || DEFAULT_SETTINGS.badge3Title,
  badge3Sub: s.badge3_sub || s.badge3Sub || DEFAULT_SETTINGS.badge3Sub,
  adminPin: s.admin_pin || s.adminPin || DEFAULT_SETTINGS.adminPin
});

const mapSettingsToDB = (s) => ({
  id: 'default',
  store_name: s.storeName,
  badge_text: s.badgeText,
  description: s.description,
  sub_description: s.subDescription,
  opening_hours: s.openingHours,
  announcement: s.announcement,
  banner_url: s.bannerUrl,
  banner_fit: s.bannerFit,
  logo_url: s.logoUrl,
  line_id: s.lineId,
  line_url: s.lineUrl,
  badge1_title: s.badge1Title,
  badge1_sub: s.badge1Sub,
  badge2_title: s.badge2Title,
  badge2_sub: s.badge2Sub,
  badge3_title: s.badge3Title,
  badge3_sub: s.badge3Sub,
  admin_pin: s.adminPin,
  updated_at: new Date().toISOString()
});

export const storeService = {
  // 1. Load all initial data (LocalStorage + Supabase sync)
  async loadData() {
    // 1.1 Load cached or default data first for instant render
    let products = DEFAULT_PRODUCTS;
    let promotions = DEFAULT_PROMOTIONS;
    let settings = DEFAULT_SETTINGS;

    try {
      const cachedProducts = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      if (cachedProducts) products = JSON.parse(cachedProducts);

      const cachedPromos = localStorage.getItem(LOCAL_STORAGE_KEYS.PROMOTIONS);
      if (cachedPromos) promotions = JSON.parse(cachedPromos);

      const cachedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      if (cachedSettings) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(cachedSettings) };
    } catch (e) {
      console.warn('Failed to parse cached data from localStorage:', e);
    }

    // 1.2 Attempt to fetch latest from Supabase if connected
    const supabase = getSupabase();
    if (supabase) {
      try {
        const [prodRes, promoRes, setRes, dataRes] = await Promise.all([
          supabase.from('products').select('*').order('sort_order', { ascending: true }),
          supabase.from('promotions').select('*').order('created_at', { ascending: true }),
          supabase.from('store_settings').select('*').limit(1),
          supabase.from('store_data').select('*')
        ]);

        if (prodRes.data && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
          products = prodRes.data.map(mapProductFromDB);
          localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        }

        if (promoRes.data && Array.isArray(promoRes.data) && promoRes.data.length > 0) {
          promotions = promoRes.data.map(mapPromotionFromDB);
          localStorage.setItem(LOCAL_STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
        }

        if (setRes.data && setRes.data.length > 0) {
          settings = { ...DEFAULT_SETTINGS, ...mapSettingsFromDB(setRes.data[0]) };
          localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        }

        // Also check document table fallback if normalized tables were empty
        if (dataRes.data && Array.isArray(dataRes.data)) {
          dataRes.data.forEach(item => {
            if (item.key === 'products' && (!prodRes.data || prodRes.data.length === 0)) {
              products = item.data;
              localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
            }
            if (item.key === 'promotions' && (!promoRes.data || promoRes.data.length === 0)) {
              promotions = item.data;
              localStorage.setItem(LOCAL_STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
            }
            if (item.key === 'settings' && (!setRes.data || setRes.data.length === 0)) {
              settings = { ...DEFAULT_SETTINGS, ...item.data };
              localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            }
          });
        }
      } catch (err) {
        console.warn('Supabase fetch failed, continuing with local data:', err);
      }
    }

    return { products, promotions, settings };
  },

  // 2. Save products (Local + Supabase)
  async saveProducts(products) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage:', e);
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbRows = products.map((p, idx) => mapProductToDB(p, idx));
        await supabase.from('products').upsert(dbRows, { onConflict: 'id' });

        // Cleanup deleted products
        const currentIds = products.map(p => p.id);
        const { data: remoteData } = await supabase.from('products').select('id');
        if (remoteData) {
          const toDelete = remoteData.filter(r => !currentIds.includes(r.id)).map(r => r.id);
          if (toDelete.length > 0) {
            await supabase.from('products').delete().in('id', toDelete);
          }
        }

        // Backup to store_data document store
        await supabase.from('store_data').upsert({
          key: 'products',
          data: products,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
      } catch (err) {
        console.error('Failed to sync products with Supabase:', err);
      }
    }
  },

  // 3. Save promotions (Local + Supabase)
  async savePromotions(promotions) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
    } catch (e) {
      console.error('Failed to save promotions to localStorage:', e);
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbRows = promotions.map(mapPromotionToDB);
        await supabase.from('promotions').upsert(dbRows, { onConflict: 'id' });

        // Cleanup deleted promotions
        const currentIds = promotions.map(p => p.id);
        const { data: remoteData } = await supabase.from('promotions').select('id');
        if (remoteData) {
          const toDelete = remoteData.filter(r => !currentIds.includes(r.id)).map(r => r.id);
          if (toDelete.length > 0) {
            await supabase.from('promotions').delete().in('id', toDelete);
          }
        }

        // Backup to store_data
        await supabase.from('store_data').upsert({
          key: 'promotions',
          data: promotions,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
      } catch (err) {
        console.error('Failed to sync promotions with Supabase:', err);
      }
    }
  },

  // 4. Save store settings (Local + Supabase)
  async saveSettings(settings) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const dbRow = mapSettingsToDB(settings);
        await supabase.from('store_settings').upsert([dbRow], { onConflict: 'id' });

        await supabase.from('store_data').upsert({
          key: 'settings',
          data: settings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });
      } catch (err) {
        console.error('Failed to sync settings with Supabase:', err);
      }
    }
  },

  // 5. Realtime changes subscription
  subscribeToChanges(onUpdate) {
    const supabase = getSupabase();
    if (!supabase) return () => {};

    try {
      const channel = supabase.channel('bastore_realtime_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
          const { data } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
          if (data && Array.isArray(data)) {
            const mapped = data.map(mapProductFromDB);
            localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(mapped));
            onUpdate({ type: 'products', data: mapped });
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, async () => {
          const { data } = await supabase.from('promotions').select('*').order('created_at', { ascending: true });
          if (data && Array.isArray(data)) {
            const mapped = data.map(mapPromotionFromDB);
            localStorage.setItem(LOCAL_STORAGE_KEYS.PROMOTIONS, JSON.stringify(mapped));
            onUpdate({ type: 'promotions', data: mapped });
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, async (payload) => {
          if (payload.new) {
            const mapped = { ...DEFAULT_SETTINGS, ...mapSettingsFromDB(payload.new) };
            localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(mapped));
            onUpdate({ type: 'settings', data: mapped });
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Realtime subscription error:', err);
      return () => {};
    }
  },

  // 6. Reset all data to defaults
  resetToDefaults() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PROMOTIONS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SETTINGS);
    return {
      products: DEFAULT_PRODUCTS,
      promotions: DEFAULT_PROMOTIONS,
      settings: DEFAULT_SETTINGS
    };
  }
};
