import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { APP_LOGOS } from '../data/defaultData';

export default function PromoModal({
  isOpen,
  onClose,
  onSave,
  promo = null
}) {
  const isEditing = Boolean(promo && promo.id);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    tag: '🔥 โปรคู่สุดฮิต',
    tagColor: 'rose',
    apps: [
      {
        id: 'app-1',
        name: 'Netflix',
        icon: '/logos/netflix.png',
        devices: '1 จอ คมชัด 4K',
        resolution: 'Ultra HD 4K'
      },
      {
        id: 'app-2',
        name: 'YouTube',
        icon: '/logos/youtube.png',
        devices: 'ใช้อีเมลตัวเอง',
        resolution: 'ไม่มีโฆษณาคั่น'
      }
    ],
    originalPrice: '150',
    promoPrice: '129',
    pricePeriod: '/ 30 วัน',
    devices: '',
    resolution: '',
    packageDetails: '',
    inStock: true
  });

  useEffect(() => {
    if (promo) {
      // Ensure apps array exists and is populated
      let apps = Array.isArray(promo.apps) && promo.apps.length > 0 ? promo.apps : [];
      if (apps.length === 0 && (promo.app1Name || promo.app2Name)) {
        apps = [
          {
            id: 'app-1',
            name: promo.app1Name || '',
            icon: promo.app1Icon || '/logos/iqiyi.png',
            devices: promo.app1Devices || '',
            resolution: promo.app1Resolution || ''
          },
          {
            id: 'app-2',
            name: promo.app2Name || '',
            icon: promo.app2Icon || '/logos/viu.png',
            devices: promo.app2Devices || '',
            resolution: promo.app2Resolution || ''
          }
        ].filter(a => a.name);
      }

      setFormData({
        ...promo,
        apps: apps.length > 0 ? apps : [
          { id: 'app-1', name: 'Netflix', icon: '/logos/netflix.png', devices: '', resolution: '' }
        ],
        inStock: promo.inStock !== false
      });
    } else {
      setFormData({
        id: `promo-${Date.now().toString(36)}`,
        name: 'แพ็กเกจรวมสุดคุ้ม',
        tag: '🔥 โปรคอมโบสุดฮิต',
        tagColor: 'rose',
        apps: [
          {
            id: `app-${Date.now()}-1`,
            name: 'Netflix',
            icon: '/logos/netflix.png',
            devices: '1 จอ คมชัด 4K',
            resolution: 'Ultra HD 4K'
          },
          {
            id: `app-${Date.now()}-2`,
            name: 'YouTube',
            icon: '/logos/youtube.png',
            devices: 'ใช้อีเมลตัวเอง',
            resolution: 'ไม่มีโฆษณาคั่น'
          },
          {
            id: `app-${Date.now()}-3`,
            name: 'Disney+',
            icon: '/logos/disney.png',
            devices: '1 จอ',
            resolution: 'Full HD'
          }
        ],
        originalPrice: '250',
        promoPrice: '199',
        pricePeriod: '/ 30 วัน',
        devices: '',
        resolution: '',
        packageDetails: '• ได้รับครบทุกแอพพร้อมกันสุดคุ้ม\n• บัญชีแท้ 100% จัดส่งไว\n• ดูแลตลอดอายุการใช้งาน',
        inStock: true
      });
    }
  }, [promo, isOpen]);

  if (!isOpen) return null;

  // Handlers for dynamic apps in the combo
  const handleAddApp = () => {
    const nextIdx = formData.apps.length + 1;
    const defaultPreset = APP_LOGOS[(nextIdx - 1) % APP_LOGOS.length];
    setFormData(prev => ({
      ...prev,
      apps: [
        ...prev.apps,
        {
          id: `app-${Date.now()}-${Math.random()}`,
          name: defaultPreset?.name || `แอพที่ ${nextIdx}`,
          icon: defaultPreset?.path || '/logos/iqiyi.png',
          devices: '',
          resolution: ''
        }
      ]
    }));
  };

  const handleUpdateApp = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.apps];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, apps: updated };
    });
  };

  const handleRemoveApp = (index) => {
    if (formData.apps.length <= 1) {
      alert('โปรโมชั่นต้องมีแอพอย่างน้อย 1 แอพ');
      return;
    }
    setFormData(prev => ({
      ...prev,
      apps: prev.apps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.promoPrice) {
      alert('กรุณากรอกชื่อโปรโมชั่นและราคาโปรโมชั่น');
      return;
    }

    if (formData.apps.length === 0) {
      alert('กรุณาเพิ่มแอพในโปรโมชั่นอย่างน้อย 1 แอพ');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-pink-100 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 font-heading">
              {isEditing ? 'แก้ไขโปรโมชั่นพิเศษ' : 'เพิ่มโปรโมชั่นแพ็กเกจใหม่'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-600">
              {formData.apps.length} แอพในเซ็ต
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            สามารถรวมแอพในแพ็กเกจได้มากกว่า 2 แอพ (เช่น เซ็ต 3 แอพ, 4 แอพ หรือคอมโบตามใจชอบ)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อโปรโมชั่น <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="เช่น เซ็ต 3 แอพสุดฟิน: Netflix + YouTube + Disney+"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ป้ายกำกับโปรโมชั่น
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                placeholder="เช่น 🔥 โปรเซ็ตสุดฮิต, ⭐ เซฟคุ้มสุด"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ระยะเวลา
              </label>
              <input
                type="text"
                value={formData.pricePeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePeriod: e.target.value }))}
                placeholder="เช่น / 7 วัน, / 30 วัน"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          {/* DYNAMIC APPS IN THIS PROMOTION */}
          <div className="p-4 bg-pink-50/40 rounded-2xl border border-pink-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  รายการแอพในแพ็กเกจ ({formData.apps.length} แอพ)
                </h4>
                <p className="text-[11px] text-slate-500">
                  เพิ่มแอพได้ไม่จำกัดจำนวน พร้อมระบุสเปกแยกตามแอพได้
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มแอพในเซ็ต</span>
              </button>
            </div>

            {/* List of Apps */}
            <div className="space-y-3 pt-1">
              {formData.apps.map((appItem, idx) => (
                <div key={appItem.id || idx} className="p-3 bg-white rounded-2xl border border-pink-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-[11px] font-bold">
                        {idx + 1}
                      </span>
                      <span>แอพที่ {idx + 1}: {appItem.name || 'ยังไม่ระบุชื่อ'}</span>
                    </span>
                    {formData.apps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveApp(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="ลบแอพนี้ออกจากแพ็กเกจ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* App Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">ชื่อแอพ</label>
                      <input
                        type="text"
                        value={appItem.name}
                        onChange={(e) => handleUpdateApp(idx, 'name', e.target.value)}
                        placeholder="เช่น Netflix 4K"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-pink-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">สเปกอุปกรณ์ / บัญชี</label>
                      <input
                        type="text"
                        value={appItem.devices}
                        onChange={(e) => handleUpdateApp(idx, 'devices', e.target.value)}
                        placeholder="เช่น 1 จอ / ใช้อีเมลตัวเอง"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>

                  {/* Real Logo Selector for this App */}
                  <div className="pt-1">
                    <label className="block text-[10px] text-slate-500 mb-1">เลือกโลโก้จริง:</label>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {APP_LOGOS.map((logo) => {
                        const isSelected = appItem.icon === logo.path;
                        return (
                          <button
                            key={logo.name}
                            type="button"
                            onClick={() => {
                              handleUpdateApp(idx, 'icon', logo.path);
                              if (!appItem.name || appItem.name.startsWith('แอพที่')) {
                                handleUpdateApp(idx, 'name', logo.name);
                              }
                            }}
                            className={`p-1 rounded-lg border transition-all cursor-pointer shrink-0 ${
                              isSelected ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-400 shadow-2xs' : 'border-slate-200 opacity-65 hover:opacity-100'
                            }`}
                            title={logo.name}
                          >
                            <img src={logo.path} alt={logo.name} className="w-5 h-5 object-contain" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ราคาปกติ (บาท)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                placeholder="เช่น 250"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ราคาโปรพิเศษ (บาท) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.promoPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, promoPrice: e.target.value }))}
                placeholder="เช่น 199"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800 font-bold text-rose-600"
                required
              />
            </div>
          </div>

          {/* Package Details Bullets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดโปรโมชั่นแบบข้อย่อย
            </label>
            <textarea
              rows={3}
              value={formData.packageDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, packageDetails: e.target.value }))}
              placeholder="• ได้รับครบทุกแอพพร้อมกัน&#10;• บัญชีแท้ 100% จัดส่งไว&#10;• ดูแลตลอดการใช้งาน"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-xs text-slate-800 font-mono leading-relaxed"
            />
          </div>

          {/* In stock toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="promoInStock"
              checked={formData.inStock}
              onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
              className="w-4 h-4 text-pink-500 rounded-sm focus:ring-pink-400"
            />
            <label htmlFor="promoInStock" className="text-xs font-medium text-slate-700 cursor-pointer">
              มีสินค้าพร้อมส่งทันที
            </label>
          </div>

          {/* Actions */}
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
              className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              {isEditing ? 'บันทึกโปรโมชั่น' : 'เพิ่มโปรโมชั่นทันที'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
