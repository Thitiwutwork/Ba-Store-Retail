-- ==============================================================================
-- BA STORE - Supabase Database Schema & Setup Script
-- ==============================================================================
-- คำแนะนำ: นำโค้ดทั้งหมดนี้ไปรันใน Supabase -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. ตาราง products (รายการแอพและเรทราคา)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'ทั่วไป',
    tag TEXT DEFAULT '',
    tag_color TEXT DEFAULT 'pink',
    devices TEXT DEFAULT '',
    resolution TEXT DEFAULT '',
    package_details TEXT DEFAULT '',
    sub_detail TEXT DEFAULT '',
    price_label TEXT DEFAULT 'ลูกค้า',
    price TEXT DEFAULT '',
    has_second_price BOOLEAN DEFAULT false,
    second_price_label TEXT DEFAULT 'ร้าน',
    second_price TEXT DEFAULT '',
    price_unit TEXT DEFAULT '฿',
    price_period TEXT DEFAULT '',
    icon TEXT NOT NULL,
    order_link TEXT DEFAULT '',
    in_stock BOOLEAN DEFAULT true,
    stock_status TEXT DEFAULT 'ready',
    stock_status_text TEXT DEFAULT '',
    prices JSONB DEFAULT '[]'::jsonb,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ตาราง promotions (โปรโมชั่นแพ็กเกจคู่ / Hot Deals)
CREATE TABLE IF NOT EXISTS public.promotions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tag TEXT DEFAULT '🔥 โปรคู่สุดฮิต',
    tag_color TEXT DEFAULT 'rose',
    app1_name TEXT NOT NULL,
    app1_icon TEXT NOT NULL,
    app1_devices TEXT DEFAULT '',
    app1_resolution TEXT DEFAULT '',
    app2_name TEXT NOT NULL,
    app2_icon TEXT NOT NULL,
    app2_devices TEXT DEFAULT '',
    app2_resolution TEXT DEFAULT '',
    original_price TEXT NOT NULL,
    promo_price TEXT NOT NULL,
    price_period TEXT DEFAULT '',
    devices TEXT DEFAULT '',
    resolution TEXT DEFAULT '',
    package_details TEXT DEFAULT '',
    order_link TEXT DEFAULT '',
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ตาราง store_settings (ตั้งค่าร้านค้า)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT DEFAULT 'BA STORE',
    badge_text TEXT DEFAULT 'จำหน่ายแอพพรีเมียม ราคาปลีก',
    description TEXT DEFAULT 'ขายแอพพรีเมียมราคาปลีกสุดคุ้ม 💖',
    sub_description TEXT DEFAULT 'บริการรวดเร็ว ปลอดภัย ได้วันใช้งานครบแน่นอน',
    opening_hours TEXT DEFAULT 'เปิด 09:00 - 23:00 น.',
    announcement TEXT DEFAULT '⚡ จัดส่งรวดเร็วทันใจภายใน 5 - 15 นาที • รับประกันดูแลตลอดการใช้งาน',
    banner_url TEXT DEFAULT '/images/banner.jpg',
    banner_fit TEXT DEFAULT 'auto',
    banner_position TEXT DEFAULT 'center',
    logo_url TEXT DEFAULT '/images/logo.jpg',
    line_id TEXT DEFAULT '@bastore',
    line_url TEXT DEFAULT 'https://line.me/ti/p/~@bastore',
    badge1_title TEXT DEFAULT 'ได้วันใช้งานครบ 100%',
    badge1_sub TEXT DEFAULT 'ของแท้ ปลอดภัย',
    badge2_title TEXT DEFAULT 'ใช้เวลาตัดไม่นาน',
    badge2_sub TEXT DEFAULT 'เปิดบริการทุกวัน',
    badge3_title TEXT DEFAULT 'ดูแลตลอดการใช้งาน',
    admin_pin TEXT DEFAULT '1234',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ตาราง store_data (JSON Document Store สำรองข้อมูลความเร็วสูง และ Realtime Sync)
CREATE TABLE IF NOT EXISTS public.store_data (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ความปลอดภัย (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_data ENABLE ROW LEVEL SECURITY;

-- สิทธิ์การอ่าน (SELECT) สำหรับลูกค้าทั่วไป (Public / Anon Read-Only)
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read promotions" ON public.promotions;
CREATE POLICY "Public read promotions" ON public.promotions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read store_settings" ON public.store_settings;
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read store_data" ON public.store_data;
CREATE POLICY "Public read store_data" ON public.store_data FOR SELECT USING (true);

-- สิทธิ์การเขียน แก้ไข ลบ (INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow write products" ON public.products;
CREATE POLICY "Allow write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow write promotions" ON public.promotions;
CREATE POLICY "Allow write promotions" ON public.promotions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow write store_settings" ON public.store_settings;
CREATE POLICY "Allow write store_settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow write store_data" ON public.store_data;
CREATE POLICY "Allow write store_data" ON public.store_data FOR ALL USING (true) WITH CHECK (true);

-- เปิดระบบ Realtime สำหรับการเปลี่ยนแปลงข้อมูล (ป้องกัน Error ซ้ำซ้อนอย่างปลอดภัย)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'promotions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.promotions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'store_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'store_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.store_data;
  END IF;
END $$;

-- ==============================================================================
-- ข้อมูลเริ่มต้น (Seed Data - ตัด OTP ออกแล้วอย่างสมบูรณ์ และใช้ภาพแท้)
-- ==============================================================================

-- เพิ่มข้อมูลตั้งค่าร้านค้า
INSERT INTO public.store_settings (id, store_name, badge_text, description, sub_description, opening_hours, announcement, banner_url, logo_url, line_id, line_url, admin_pin)
VALUES (
    'default',
    'BA STORE',
    'จำหน่ายแอพพรีเมียม ราคาปลีก',
    'ขายแอพพรีเมียมราคาปลีกสุดคุ้ม 💖',
    'บริการรวดเร็ว ปลอดภัย ได้วันใช้งานครบแน่นอน',
    'เปิด 09:00 - 23:00 น.',
    '⚡ จัดส่งรวดเร็วทันใจภายใน 5 - 15 นาที • รับประกันดูแลตลอดการใช้งาน',
    '/images/banner.jpg',
    '/images/logo.jpg',
    '@bastore',
    'https://line.me/ti/p/~@bastore',
    '1234'
) ON CONFLICT (id) DO NOTHING;

-- เพิ่มโปรโมชั่นแพ็กเกจคู่
INSERT INTO public.promotions (id, name, tag, tag_color, app1_name, app1_icon, app1_devices, app1_resolution, app2_name, app2_icon, app2_devices, app2_resolution, original_price, promo_price, price_period, devices, resolution, package_details, in_stock)
VALUES 
(
    'promo-1',
    'แพ็กคู่สุดคุ้ม: iQIYI (7 วัน) + Viu Premium (7 วัน)',
    '🔥 โปรคู่สุดฮิต',
    'rose',
    'iQIYI',
    '/logos/iqiyi.png',
    'ดูพร้อมกันได้ 2 อุปกรณ์',
    'Full HD 1080p คมชัดระดับสูง',
    'Viu',
    '/logos/viu.png',
    'ดูได้ 3 อุปกรณ์ ( ทรส 2 / เว็บ 1 )',
    'Full HD 1080p ไม่มีโฆษณาคั่น',
    '30',
    '25',
    '/ 7 วัน',
    'iQIYI 2 อุปกรณ์ / Viu 3 อุปกรณ์',
    'Full HD 1080p คมชัดระดับสูง',
    '• ได้รับ 2 แอพพร้อมกัน: iQIYI 7 วัน + Viu 7 วัน
• iQIYI: ดูพร้อมกันได้ 2 อุปกรณ์
• Viu: ดูได้ 3 อุปกรณ์ (ทรส 2 / เว็บ 1)
• ประหยัดทันที ฿5 จากราคาปกติ ฿30 เหลือเพียง ฿25
• บัญชีแท้ 100% จัดส่งไว ดูแลตลอดการใช้งาน',
    true
),
(
    'promo-2',
    'แพ็กคู่บันเทิงคูณสอง: Netflix 4K + YouTube Premium (30 วัน)',
    '⭐ เซฟคุ้มสุด',
    'amber',
    'Netflix',
    '/logos/netflix.png',
    '1 จอ (ล็อกอินได้มือถือ / แท็บเล็ต / ทีวี)',
    'Ultra HD 4K + ระบบเสียง Spatial Audio',
    'YouTube',
    '/logos/youtube.png',
    'ใช้อีเมลตัวเอง ดูได้ทุกอุปกรณ์',
    'ไม่มีโฆษณาคั่น ฟังเพลงจอดับได้',
    '250',
    '219',
    '/ 30 วัน',
    'Netflix 1 จอ / YouTube ใช้อีเมลตัวเอง',
    'Ultra HD 4K + ไม่มีโฆษณา',
    '• แพ็กเกจสุดฮิตตลอดกาล Netflix 4K + YouTube Premium
• Netflix: รับชมได้ 1 จอ ความคมชัด Ultra HD 4K
• YouTube: ใช้อีเมลตัวเอง ฟังเพลงจอดับได้ ไม่มีโฆษณาคั่น
• ประหยัดทันที ฿31 คุ้มกว่าซื้อแยกเดี่ยว
• บัญชีแท้ ไม่เด้ง ดูแลตลอด 30 วันเต็ม',
    true
) ON CONFLICT (id) DO NOTHING;

-- เพิ่มรายการแอพและเรทราคา (ตัด OTP ออก)
INSERT INTO public.products (id, name, category, tag, tag_color, devices, resolution, package_details, sub_detail, price_label, price, has_second_price, second_price_label, second_price, price_unit, price_period, icon, in_stock, stock_status, prices, sort_order)
VALUES
(
    'prod-iqiyi-90',
    'iQIYI มาตรฐาน ( 90 วัน )',
    'ซีรีส์ / หนัง',
    '',
    'pink',
    'ดูพร้อมกันได้ 2 อุปกรณ์',
    'ความคมชัด 1080P (Full HD)',
    '- ไม่มีโฆษณาคั่น
- รับชมหนังสุดฮอตก่อนใคร
- ระบบเสียง Dolby',
    'ใช้ได้หลายอุปกรณ์',
    'เมลล์ลูกค้า',
    '206',
    true,
    'เมลล์ร้าน',
    '209',
    '฿',
    '90 วัน',
    '/logos/iqiyi.png',
    true,
    'ready',
    '[{"id":"price-1","label":"เมลล์ลูกค้า","price":"206","period":"90 วัน","status":"ready"},{"id":"price-2","label":"เมลล์ร้าน","price":"209","period":"90 วัน","status":"ready"}]'::jsonb,
    1
),
(
    'prod-iqiyi-30',
    'iQIYI มาตรฐาน ( 30 วัน )',
    'ซีรีส์ / หนัง',
    '',
    'pink',
    'ดูพร้อมกันได้ 2 อุปกรณ์',
    'ความคมชัด 1080P (Full HD)',
    '- ไม่มีโฆษณาคั่น
- รับชมหนังสุดฮอตก่อนใคร
- ระบบเสียง Dolby',
    'ใช้ได้หลายอุปกรณ์',
    'เมลล์ลูกค้า',
    '56',
    true,
    'เมลล์ร้าน',
    '59',
    '฿',
    '30 วัน',
    '/logos/iqiyi.png',
    true,
    'ready',
    '[{"id":"price-1","label":"เมลล์ลูกค้า","price":"56","period":"30 วัน","status":"ready"},{"id":"price-2","label":"เมลล์ร้าน","price":"59","period":"30 วัน","status":"ready"}]'::jsonb,
    2
),
(
    'prod-iqiyi-7',
    'iQIYI มาตรฐาน ( 7 วัน )',
    'ซีรีส์ / หนัง',
    '',
    'pink',
    'ดูพร้อมกันได้ 2 อุปกรณ์',
    'ความคมชัด 1080P (Full HD)',
    '- ไม่มีโฆษณาคั่น
- รับชมหนังสุดฮอตก่อนใคร
- ระบบเสียง Dolby',
    'ใช้ได้หลายอุปกรณ์',
    'เมลล์ลูกค้า',
    '15',
    true,
    'เมลล์ร้าน',
    '15',
    '฿',
    '7 วัน',
    '/logos/iqiyi.png',
    true,
    'ready',
    '[{"id":"price-1","label":"เมลล์ลูกค้า","price":"15","period":"7 วัน","status":"ready"},{"id":"price-2","label":"เมลล์ร้าน","price":"15","period":"7 วัน","status":"ready"}]'::jsonb,
    3
),
(
    'prod-youtube-short',
    'Youtube พรีเมียม',
    'ฟังเพลง',
    '🔥 ฮิตสุด',
    'rose',
    'ใช้อีเมลตัวเอง ดูได้ทุกอุปกรณ์',
    'ไม่มีโฆษณาคั่น ฟังเพลงจอดับได้',
    '- ใช้อีเมลส่วนตัว ไม่ต้องย้ายเมล
- ฟังเพลง YouTube Music ได้ฟรี
- ปลดล็อคฟีเจอร์พรีเมียมครบถ้วน',
    'ตัดเมลลูกค้า / ปลดยืนยันสิทธิ์',
    'ตัดพรีเมี่ยมเมลล์ลูกค้า',
    '10',
    true,
    'ปลดยืนยันสิทธิ์',
    '7',
    '฿',
    '',
    '/logos/youtube.png',
    true,
    'ready',
    '[{"id":"price-1","label":"ตัดพรีเมี่ยมเมลล์ลูกค้า","price":"10","period":"","status":"ready"},{"id":"price-2","label":"ปลดยืนยันสิทธิ์","price":"7","period":"","status":"ready"},{"id":"price-3","label":"ปลดยืนยันสิทธิ์ + ตัดพรีเมี่ยม","price":"14","period":"","status":"ready"}]'::jsonb,
    4
),
(
    'prod-netflix-4k',
    'Netflix 4K Ultra HD',
    'ซีรีส์ / หนัง',
    '⭐ แนะนำ',
    'amber',
    '1 จอ (ล็อกอินได้มือถือ / แท็บเล็ต / ทีวี)',
    'Ultra HD 4K + Spatial Audio',
    '- รับชมพร้อมกันได้ 1 จอ
- ภาพคมชัดระดับสูงสุด 4K UHD
- ระบบเสียงตามตำแหน่ง Spatial Audio',
    'จอส่วนตัว มีรหัสล็อคโปรไฟล์',
    'จอส่วนตัว 30 วัน',
    '129',
    true,
    'จอส่วนตัว 7 วัน',
    '39',
    '฿',
    '30 วัน',
    '/logos/netflix.png',
    true,
    'ready',
    '[{"id":"price-1","label":"จอส่วนตัว 30 วัน","price":"129","period":"30 วัน","status":"ready"},{"id":"price-2","label":"จอส่วนตัว 7 วัน","price":"39","period":"7 วัน","status":"ready"}]'::jsonb,
    5
),
(
    'prod-disney-plus',
    'Disney+ Hotstar',
    'ซีรีส์ / หนัง',
    '',
    'blue',
    '1 จอ ดูได้ทุกอุปกรณ์',
    'Full HD / 4K UHD',
    '- หนัง Marvel, Disney, Pixar ครบทุกเรื่อง
- บัญชีแท้ ไม่เด้ง
- ดูแลตลอดอายุการใช้งาน',
    'พรีเมียมราคาประหยัด',
    'แพ็กเกจ 30 วัน',
    '89',
    false,
    '',
    '',
    '฿',
    '30 วัน',
    '/logos/disney.png',
    true,
    'ready',
    '[{"id":"price-1","label":"แพ็กเกจ 30 วัน","price":"89","period":"30 วัน","status":"ready"}]'::jsonb,
    6
),
(
    'prod-viu-premium',
    'Viu Premium',
    'ซีรีส์ / หนัง',
    '',
    'amber',
    'ดูพร้อมกันได้ 3 อุปกรณ์',
    'Full HD 1080p ไม่มีโฆษณา',
    '- ซีรีส์เกาหลี พากย์ไทย และซับไทยไวที่สุด
- ดูออฟไลน์ได้ไม่จำกัด
- บัญชีแท้ 100%',
    'ดูได้หลายอุปกรณ์พร้อมกัน',
    '30 วัน',
    '45',
    true,
    '7 วัน',
    '15',
    '฿',
    '30 วัน',
    '/logos/viu.png',
    true,
    'ready',
    '[{"id":"price-1","label":"30 วัน","price":"45","period":"30 วัน","status":"ready"},{"id":"price-2","label":"7 วัน","price":"15","period":"7 วัน","status":"ready"}]'::jsonb,
    7
),
(
    'prod-canva-pro',
    'Canva Pro',
    'ทำงาน / AI',
    '⭐ นิยม',
    'emerald',
    'ใช้บนคอมพิวเตอร์ / ไอแพด / มือถือ',
    'ปลดล็อคเทมเพลต และฟอนต์ระดับ Pro',
    '- เข้าถึงภาพและกราฟิกระดับพรีเมียมกว่า 100 ล้านรายการ
- ลบพื้นหลังในคลิกเดียว (Magic Eraser)
- ใช้อีเมลตัวเอง ปลอดภัย งานไม่หาย',
    'ดึงเข้าทีมโปร / อีเมลตัวเอง',
    '30 วัน',
    '39',
    true,
    '1 ปี (365 วัน)',
    '199',
    '฿',
    '30 วัน',
    '/logos/canva.png',
    true,
    'ready',
    '[{"id":"price-1","label":"30 วัน","price":"39","period":"30 วัน","status":"ready"},{"id":"price-2","label":"1 ปี (365 วัน)","price":"199","period":"1 ปี","status":"ready"}]'::jsonb,
    8
),
(
    'prod-spotify-prem',
    'Spotify Premium',
    'ฟังเพลง',
    '',
    'emerald',
    'ใช้อีเมลตัวเอง ฟังได้ทุกอุปกรณ์',
    'คุณภาพเสียง Very High (320kbps)',
    '- ฟังเพลงไม่มีโฆษณาคั่น
- ข้ามเพลงได้ไม่จำกัด
- ดาวน์โหลดฟังออฟไลน์ได้',
    'ดึงเข้าครอบครัว / เมลเดิม',
    '30 วัน',
    '49',
    false,
    '',
    '',
    '฿',
    '30 วัน',
    '/logos/spotify.png',
    true,
    'ready',
    '[{"id":"price-1","label":"30 วัน","price":"49","period":"30 วัน","status":"ready"}]'::jsonb,
    9
) ON CONFLICT (id) DO NOTHING;
