import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
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
    app1Name: 'iQIYI',
    app1Icon: '/logos/iqiyi.png',
    app1Devices: 'ดูพร้อมกันได้ 2 อุปกรณ์',
    app1Resolution: 'Full HD 1080p คมชัดระดับสูง',
    app2Name: 'Viu',
    app2Icon: '/logos/viu.png',
    app2Devices: 'ดูได้ 3 อุปกรณ์ ( ทรส 2 / เว็บ 1 )',
    app2Resolution: 'Full HD 1080p ไม่มีโฆษณาคั่น',
    originalPrice: '30',
    promoPrice: '25',
    pricePeriod: '/ 7 วัน',
    devices: '',
    resolution: '',
    packageDetails: '',
    inStock: true
  });

  useEffect(() => {
    if (promo) {
      setFormData({
        ...promo,
        inStock: promo.inStock !== false
      });
    } else {
      setFormData({
        id: `promo-${Date.now().toString(36)}`,
        name: 'แพ็กเกจคู่สุดคุ้ม',
        tag: '🔥 โปรคู่สุดฮิต',
        tagColor: 'rose',
        app1Name: 'Netflix',
        app1Icon: '/logos/netflix.png',
        app1Devices: '1 จอ คมชัด 4K',
        app1Resolution: 'Ultra HD 4K',
        app2Name: 'YouTube',
        app2Icon: '/logos/youtube.png',
        app2Devices: 'ใช้อีเมลตัวเอง',
        app2Resolution: 'ไม่มีโฆษณาคั่น',
        originalPrice: '150',
        promoPrice: '129',
        pricePeriod: '/ 30 วัน',
        devices: 'Netflix 1 จอ / YouTube เมลตัวเอง',
        resolution: 'Ultra HD 4K + ไม่มีโฆษณา',
        packageDetails: '• ได้รับ 2 แอพพร้อมกันสุดคุ้ม\n• บัญชีแท้ 100% จัดส่งไว\n• ดูแลตลอดอายุการใช้งาน',
        inStock: true
      });
    }
  }, [promo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.promoPrice) {
      alert('กรุณากรอกชื่อโปรโมชั่นและราคาโปรโมชั่น');
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
          <h2 className="text-xl font-bold text-slate-800 font-heading">
            {isEditing ? 'แก้ไขโปรโมชั่นพิเศษ' : 'เพิ่มโปรโมชั่นแพ็กคู่ใหม่'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการโปรโมชั่นแพ็กเกจรวม 2 แอพ พร้อมส่วนลดราคาพิเศษ
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
              placeholder="เช่น แพ็กคู่สุดคุ้ม: iQIYI + Viu"
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
                placeholder="เช่น 🔥 โปรคู่สุดฮิต, ⭐ เซฟคุ้มสุด"
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

          {/* App 1 Details */}
          <div className="p-3.5 bg-pink-50/40 rounded-2xl border border-pink-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">แอพที่ 1 ในแพ็กเกจ</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">ชื่อแอพที่ 1</label>
                <input
                  type="text"
                  value={formData.app1Name}
                  onChange={(e) => setFormData(prev => ({ ...prev, app1Name: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">สเปกอุปกรณ์ แอพที่ 1</label>
                <input
                  type="text"
                  value={formData.app1Devices}
                  onChange={(e) => setFormData(prev => ({ ...prev, app1Devices: e.target.value }))}
                  placeholder="เช่น ดูพร้อมกันได้ 2 อุปกรณ์"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-pink-400"
                />
              </div>
            </div>
            {/* Real Logo Select for App 1 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-500 shrink-0 mr-1">เลือกโลโก้จริง:</span>
              {APP_LOGOS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, app1Icon: item.path, app1Name: prev.app1Name || item.name }))}
                  className={`p-1 rounded-lg border transition-all cursor-pointer ${
                    formData.app1Icon === item.path ? 'border-pink-500 bg-white shadow-xs' : 'border-slate-200 opacity-60'
                  }`}
                  title={item.name}
                >
                  <img src={item.path} alt={item.name} className="w-5 h-5 object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* App 2 Details */}
          <div className="p-3.5 bg-rose-50/40 rounded-2xl border border-rose-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">แอพที่ 2 ในแพ็กเกจ</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">ชื่อแอพที่ 2</label>
                <input
                  type="text"
                  value={formData.app2Name}
                  onChange={(e) => setFormData(prev => ({ ...prev, app2Name: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">สเปกอุปกรณ์ แอพที่ 2</label>
                <input
                  type="text"
                  value={formData.app2Devices}
                  onChange={(e) => setFormData(prev => ({ ...prev, app2Devices: e.target.value }))}
                  placeholder="เช่น ดูได้ 3 อุปกรณ์"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-pink-400"
                />
              </div>
            </div>
            {/* Real Logo Select for App 2 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-500 shrink-0 mr-1">เลือกโลโก้จริง:</span>
              {APP_LOGOS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, app2Icon: item.path, app2Name: prev.app2Name || item.name }))}
                  className={`p-1 rounded-lg border transition-all cursor-pointer ${
                    formData.app2Icon === item.path ? 'border-rose-500 bg-white shadow-xs' : 'border-slate-200 opacity-60'
                  }`}
                  title={item.name}
                >
                  <img src={item.path} alt={item.name} className="w-5 h-5 object-contain" />
                </button>
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
                placeholder="เช่น 30"
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
                placeholder="เช่น 25"
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
              placeholder="• ได้รับ 2 แอพพร้อมกัน&#10;• บัญชีแท้ 100% จัดส่งไว&#10;• ดูแลตลอดการใช้งาน"
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
