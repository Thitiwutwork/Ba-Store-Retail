import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { APP_LOGOS } from '../data/defaultData';

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product = null,
  existingCategories = []
}) {
  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'ซีรีส์ / หนัง',
    tag: '',
    tagColor: 'pink',
    devices: '',
    resolution: '',
    packageDetails: '',
    subDetail: '',
    icon: '/logos/iqiyi.png',
    inStock: true,
    stockStatus: 'ready',
    prices: [
      { id: 'price-1', label: 'เมลล์ลูกค้า', price: '', period: '30 วัน', status: 'ready' }
    ]
  });

  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        category: product.category || 'ซีรีส์ / หนัง',
        tag: product.tag || '',
        tagColor: product.tagColor || 'pink',
        devices: product.devices || '',
        resolution: product.resolution || '',
        packageDetails: product.packageDetails || '',
        subDetail: product.subDetail || '',
        icon: product.icon || '/logos/iqiyi.png',
        inStock: product.inStock !== false,
        stockStatus: product.stockStatus || 'ready',
        prices: Array.isArray(product.prices) && product.prices.length > 0
          ? product.prices
          : [{ id: 'price-1', label: product.priceLabel || 'ลูกค้า', price: product.price || '', period: product.pricePeriod || '', status: 'ready' }]
      });
      setIsCustomCategory(!existingCategories.includes(product.category) && product.category !== 'ทั้งหมด');
    } else {
      setFormData({
        id: `prod-${Date.now().toString(36)}`,
        name: '',
        category: existingCategories[1] || 'ซีรีส์ / หนัง',
        tag: '',
        tagColor: 'pink',
        devices: 'ดูพร้อมกันได้ 1 อุปกรณ์',
        resolution: 'ความคมชัดระดับ Full HD 1080p',
        packageDetails: '- บัญชีแท้ ปลอดภัย 100%\n- ดูแลตลอดการใช้งาน\n- จัดส่งรวดเร็ว',
        subDetail: '',
        icon: '/logos/netflix.png',
        inStock: true,
        stockStatus: 'ready',
        prices: [
          { id: `price-${Date.now()}-1`, label: 'เมลล์ลูกค้า', price: '', period: '30 วัน', status: 'ready' }
        ]
      });
      setIsCustomCategory(false);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, icon: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Price tier handlers
  const handleAddPriceTier = () => {
    setFormData(prev => ({
      ...prev,
      prices: [
        ...prev.prices,
        { id: `price-${Date.now()}-${Math.random()}`, label: 'ราคาใหม่', price: '', period: '', status: 'ready' }
      ]
    }));
  };

  const handleUpdatePriceTier = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.prices];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, prices: updated };
    });
  };

  const handleRemovePriceTier = (index) => {
    if (formData.prices.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('กรุณากรอกชื่อแอพ');
      return;
    }

    const finalCategory = isCustomCategory && customCategory.trim() 
      ? customCategory.trim() 
      : formData.category;

    const firstPrice = formData.prices[0];

    const finalData = {
      ...formData,
      category: finalCategory,
      price: firstPrice ? firstPrice.price : '',
      priceLabel: firstPrice ? firstPrice.label : 'ราคา',
      pricePeriod: firstPrice ? firstPrice.period : '',
      inStock: formData.stockStatus !== 'out_of_stock'
    };

    onSave(finalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-pink-100 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800 font-heading">
            {isEditing ? 'แก้ไขข้อมูลแอพและเรทราคา' : 'เพิ่มแอพ / เรทราคาใหม่'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            กำหนดรายละเอียด สเปก และช่วงราคาขายปลีกสำหรับแอพนี้
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. App Icon Selection (Real Authentic Logos) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              เลือกโลโก้จริงของแอพ (หรืออัปโหลดรูปภาพ)
            </label>
            <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
              {/* Preset Logos Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
                {APP_LOGOS.map((item) => {
                  const isSelected = formData.icon === item.path;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          icon: item.path,
                          name: prev.name ? prev.name : item.name
                        }));
                      }}
                      className={`relative flex flex-col items-center p-2 rounded-xl border bg-white transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-pink-500 ring-2 ring-pink-300 shadow-xs scale-103' 
                          : 'border-slate-200 hover:border-pink-200'
                      }`}
                    >
                      <img src={item.path} alt={item.name} className="w-8 h-8 object-contain" />
                      <span className="text-[10px] font-medium text-slate-600 truncate mt-1 w-full text-center">
                        {item.name}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Upload or Custom URL */}
              <div className="flex items-center gap-3 pt-2 border-t border-pink-100/80">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-pink-500" />
                  <span>อัปโหลดรูปจากเครื่อง</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="หรือวาง URL รูปภาพ..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 outline-none focus:border-pink-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อแอพ / แพ็กเกจ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="เช่น Netflix 4K, YouTube พรีเมียม"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมวดหมู่
              </label>
              <div className="flex items-center gap-2">
                {!isCustomCategory ? (
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setIsCustomCategory(true);
                      } else {
                        setFormData(prev => ({ ...prev, category: e.target.value }));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800 bg-white"
                  >
                    {existingCategories.filter(c => c !== 'ทั้งหมด').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__new__">+ เพิ่มหมวดหมู่ใหม่...</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-1.5 w-full">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="พิมพ์หมวดหมู่ใหม่..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-400 outline-none text-sm text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="px-2.5 py-2 rounded-xl bg-slate-100 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Sub Detail & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                คำอธิบายย่อย (สีชมพู)
              </label>
              <input
                type="text"
                value={formData.subDetail}
                onChange={(e) => setFormData(prev => ({ ...prev, subDetail: e.target.value }))}
                placeholder="เช่น จอส่วนตัว มีรหัสล็อคโปรไฟล์"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ป้ายกำกับพิเศษ (Tag)
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                placeholder="เช่น 🔥 ฮิตสุด, ⭐ แนะนำ, ลดพิเศษ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          {/* 4. Specs: Devices & Resolution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ข้อมูลอุปกรณ์ (Devices)
              </label>
              <input
                type="text"
                value={formData.devices}
                onChange={(e) => setFormData(prev => ({ ...prev, devices: e.target.value }))}
                placeholder="เช่น ดูพร้อมกันได้ 2 อุปกรณ์"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ความคมชัด / คุณภาพ (Resolution)
              </label>
              <input
                type="text"
                value={formData.resolution}
                onChange={(e) => setFormData(prev => ({ ...prev, resolution: e.target.value }))}
                placeholder="เช่น Ultra HD 4K + Spatial Audio"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          {/* 5. Package Details Bullets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดสเปกแบบข้อย่อย (พิมพ์บรรทัดละ 1 ข้อ)
            </label>
            <textarea
              rows={3}
              value={formData.packageDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, packageDetails: e.target.value }))}
              placeholder="- ไม่มีโฆษณาคั่น&#10;- รับชมพร้อมกันได้ 1 จอ&#10;- ดูแลตลอดการใช้งาน"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-xs text-slate-800 leading-relaxed font-mono"
            />
          </div>

          {/* 6. Dynamic Pricing Tiers */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                รายการเรทราคา (เพิ่มได้หลายเรท เช่น เมลล์ลูกค้า, เมลล์ร้าน, 7 วัน, 30 วัน)
              </label>
              <button
                type="button"
                onClick={handleAddPriceTier}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-medium transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มแถวราคา</span>
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {formData.prices.map((tier, idx) => (
                <div key={tier.id} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={tier.label}
                      onChange={(e) => handleUpdatePriceTier(idx, 'label', e.target.value)}
                      placeholder="ชื่อเรท เช่น เมลล์ลูกค้า / 30 วัน"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-pink-400"
                    />
                  </div>
                  <div className="w-24">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-2 flex items-center text-xs text-slate-400 font-bold">฿</span>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => handleUpdatePriceTier(idx, 'price', e.target.value)}
                        placeholder="ราคา"
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-pink-600 outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={tier.period}
                      onChange={(e) => handleUpdatePriceTier(idx, 'period', e.target.value)}
                      placeholder="ระยะเวลา เช่น 30 วัน"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 outline-none focus:border-pink-400"
                    />
                  </div>
                  {formData.prices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePriceTier(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="ลบแถวราคานี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7. Stock Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              สถานะสต็อกสินค้า
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'ready', label: 'พร้อมส่ง', color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
                { value: 'waiting', label: 'รอกด', color: 'border-amber-500 text-amber-700 bg-amber-50' },
                { value: 'out_of_stock', label: 'สินค้าหมด', color: 'border-rose-500 text-rose-700 bg-rose-50' }
              ].map(st => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, stockStatus: st.value }))}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    formData.stockStatus === st.value
                      ? `${st.color} font-bold shadow-xs`
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มแอพทันที'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
