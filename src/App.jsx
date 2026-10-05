import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HotDeals from './components/HotDeals';
import CategoryFilter from './components/CategoryFilter';
import RateCard from './components/RateCard';
import ProductModal from './components/ProductModal';
import PromoModal from './components/PromoModal';
import SettingsModal from './components/SettingsModal';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import { storeService } from './services/storeService';
import { Plus, Tag, SearchX } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Load initial data and subscribe to Supabase Realtime changes
  useEffect(() => {
    let unsubscribe = () => {};

    async function init() {
      setIsLoading(true);
      const data = await storeService.loadData();
      setProducts(data.products || []);
      setPromotions(data.promotions || []);
      setSettings(data.settings);
      setIsLoading(false);

      // Realtime subscription
      unsubscribe = storeService.subscribeToChanges(({ type, data: updatedData }) => {
        if (type === 'products') setProducts(updatedData);
        if (type === 'promotions') setPromotions(updatedData);
        if (type === 'settings') setSettings(updatedData);
      });
    }

    init();
    return () => unsubscribe();
  }, []);

  // Compute Categories from products
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ['ทั้งหมด', ...Array.from(set)];
  }, [products]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subDetail?.toLowerCase().includes(q) ||
        p.packageDetails?.toLowerCase().includes(q)
      );
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // --- Handlers for Products ---
  const handleSaveProduct = async (productData) => {
    let updated;
    const exists = products.some(p => p.id === productData.id);
    if (exists) {
      updated = products.map(p => p.id === productData.id ? productData : p);
    } else {
      updated = [productData, ...products];
    }
    setProducts(updated);
    await storeService.saveProducts(updated);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('คุณต้องการลบแอพนี้ใช่หรือไม่?')) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    await storeService.saveProducts(updated);
  };

  const handleToggleProductStock = async (id) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextStatus = p.stockStatus === 'out_of_stock' ? 'ready' : 'out_of_stock';
        return {
          ...p,
          stockStatus: nextStatus,
          inStock: nextStatus !== 'out_of_stock'
        };
      }
      return p;
    });
    setProducts(updated);
    await storeService.saveProducts(updated);
  };

  // --- Handlers for Promotions ---
  const handleSavePromo = async (promoData) => {
    let updated;
    const exists = promotions.some(p => p.id === promoData.id);
    if (exists) {
      updated = promotions.map(p => p.id === promoData.id ? promoData : p);
    } else {
      updated = [promoData, ...promotions];
    }
    setPromotions(updated);
    await storeService.savePromotions(updated);
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm('คุณต้องการลบโปรโมชั่นนี้ใช่หรือไม่?')) return;
    const updated = promotions.filter(p => p.id !== id);
    setPromotions(updated);
    await storeService.savePromotions(updated);
  };

  const handleTogglePromoStock = async (id) => {
    const updated = promotions.map(p => {
      if (p.id === id) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    setPromotions(updated);
    await storeService.savePromotions(updated);
  };

  // --- Handlers for Settings ---
  const handleSaveSettings = async (newSettings) => {
    setSettings(newSettings);
    await storeService.saveSettings(newSettings);
  };

  // --- Backup & Restore ---
  const handleExportData = () => {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      settings,
      products,
      promotions
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bastore_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.products) {
          setProducts(imported.products);
          await storeService.saveProducts(imported.products);
        }
        if (imported.promotions) {
          setPromotions(imported.promotions);
          await storeService.savePromotions(imported.promotions);
        }
        if (imported.settings) {
          setSettings(imported.settings);
          await storeService.saveSettings(imported.settings);
        }
        alert('นำเข้าข้อมูลสำเร็จเรียบร้อยแล้ว');
      } catch (err) {
        alert('ไฟล์ข้อมูลไม่ถูกต้อง: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    const defaults = storeService.resetToDefaults();
    setProducts(defaults.products);
    setPromotions(defaults.promotions);
    setSettings(defaults.settings);
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FDF5F8]">
        <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">กำลังโหลดข้อมูลเรทราคา...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF5F8] text-[#374151]">
      {/* 1. Header (Banner, Logo, Title, LINE button, NO OTP) */}
      <Header
        settings={settings}
        isAdmin={isAdmin}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenProductModal={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
        onOpenPromoModal={() => { setEditingPromo(null); setIsPromoModalOpen(true); }}
        onLogout={() => setIsAdmin(false)}
      />

      {/* 2. Hot Deals Special Combos */}
      <HotDeals
        promotions={promotions}
        settings={settings}
        isAdmin={isAdmin}
        onEditPromo={(promo) => { setEditingPromo(promo); setIsPromoModalOpen(true); }}
        onDeletePromo={handleDeletePromo}
        onToggleStock={handleTogglePromoStock}
      />

      {/* 3. Search Bar and Category Tabs */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={products.length}
        filteredCount={filteredProducts.length}
      />

      {/* 4. Rates Grid Section */}
      <main id="rates" className="w-full max-w-4xl mx-auto px-4 mt-6 flex-1 scroll-mt-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-heading">
              เรทราคาขายปลีกปัจจุบัน
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
              {filteredProducts.length} รายการ
            </span>
          </div>

          {/* Admin Add Product Quick Button */}
          {isAdmin && (
            <button
              onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มแอพ</span>
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => (
              <RateCard
                key={prod.id}
                product={prod}
                settings={settings}
                isAdmin={isAdmin}
                onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
                onDeleteProduct={handleDeleteProduct}
                onToggleStock={handleToggleProductStock}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="w-full py-16 px-4 bg-white rounded-3xl border border-pink-100 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-400 flex items-center justify-center mb-3">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-heading">
              ไม่พบรายการแอพที่คุณค้นหา
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
              ลองค้นหาด้วยคำค้นหาอื่น หรือเลือกหมวดหมู่อื่นดูนะคะ
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-pink-100 text-pink-700 hover:bg-pink-200 text-xs font-medium transition-colors cursor-pointer"
              >
                ล้างคำค้นหา
              </button>
            )}
          </div>
        )}
      </main>

      {/* 5. Footer with Trust Badges & Discreet Admin Login */}
      <Footer
        settings={settings}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Modals */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={() => setIsAdmin(true)}
        currentPin={settings.adminPin}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        product={editingProduct}
        existingCategories={categories}
      />

      <PromoModal
        isOpen={isPromoModalOpen}
        onClose={() => { setIsPromoModalOpen(false); setEditingPromo(null); }}
        onSave={handleSavePromo}
        promo={editingPromo}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
