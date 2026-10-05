import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Download, Upload, RotateCcw } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onExportData,
  onImportData,
  onResetDefaults
}) {
  const [formData, setFormData] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'backup'

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  const handleFileUpload = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, [field]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-pink-100 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800 font-heading">
            ตั้งค่าระบบร้านค้า
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการข้อมูลหน้าร้าน แบนเนอร์ ลิงก์ LINE และรหัสผ่าน PIN
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 mb-5 gap-2">
          {[
            { id: 'store', label: 'ข้อมูลร้านค้า & ดีไซน์' },
            { id: 'backup', label: 'สำรอง & กู้คืนข้อมูล' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TAB 1: Store Information */}
          {activeTab === 'store' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อร้านค้า
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ป้ายข้อความใต้ชื่อร้าน
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  คำอธิบายร้าน (สีชมพู)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  คำอธิบายย่อยเพิ่มเติม
                </label>
                <input
                  type="text"
                  value={formData.subDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, subDescription: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ข้อความประกาศวิ่งด้านบน (Ticker Announcement)
                </label>
                <input
                  type="text"
                  value={formData.announcement}
                  onChange={(e) => setFormData(prev => ({ ...prev, announcement: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เวลาทำการ
                  </label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, openingHours: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    รหัส PIN ผู้ดูแลระบบ
                  </label>
                  <input
                    type="text"
                    value={formData.adminPin}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminPin: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 outline-none font-mono text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* LINE Contact Link */}
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-800 mb-2">ลิงก์และไอดี LINE สำหรับสั่งซื้อ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">LINE ID</label>
                    <input
                      type="text"
                      value={formData.lineId}
                      onChange={(e) => setFormData(prev => ({ ...prev, lineId: e.target.value }))}
                      placeholder="@bastore"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">URL ลิงก์ LINE</label>
                    <input
                      type="text"
                      value={formData.lineUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, lineUrl: e.target.value }))}
                      placeholder="https://line.me/ti/p/~@bastore"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Banner & Logo Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    รูปภาพแบนเนอร์ร้าน
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.bannerUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, bannerUrl: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none"
                    />
                    <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-600 cursor-pointer shrink-0">
                      <span>อัปโหลด</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload('bannerUrl', e)} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    รูปภาพโลโก้ร้าน
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none"
                    />
                    <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-600 cursor-pointer shrink-0">
                      <span>อัปโหลด</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload('logoUrl', e)} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Backup & Restore */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  สำรองและกู้คืนข้อมูล (Backup & Restore)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  คุณสามารถดาวน์โหลดข้อมูลเรทราคาทั้งหมดเก็บไว้เป็นไฟล์สำรอง (JSON) หรือนำไฟล์สำรองมานำเข้าได้ตลอดเวลา
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onExportData}
                  className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-pink-200 bg-pink-50/60 hover:bg-pink-100 text-pink-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>สำรองข้อมูล (Export JSON)</span>
                </button>

                <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>กู้คืนข้อมูล (Import JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImportData}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-rose-700">รีเซ็ตข้อมูลเป็นค่าเริ่มต้น</h4>
                    <p className="text-[11px] text-slate-400">ล้างข้อมูลและกลับไปใช้ข้อมูลตั้งต้นของ BA STORE</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น?')) {
                        onResetDefaults();
                        onClose();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>รีเซ็ตข้อมูล</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
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
              บันทึกการตั้งค่า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
