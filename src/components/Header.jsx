import React from 'react';
import { Clock, ShieldCheck, MessageCircle, Settings, Plus, LogOut, Sparkles } from 'lucide-react';

export default function Header({ 
  settings, 
  isAdmin, 
  onOpenSettings, 
  onOpenProductModal, 
  onOpenPromoModal, 
  onLogout 
}) {
  return (
    <header className="w-full">
      {/* Top Announcement Bar */}
      {settings.announcement && (
        <div className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white text-xs sm:text-sm font-medium py-1.5 px-4 overflow-hidden shadow-sm flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto text-center overflow-hidden">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-yellow-200" />
            <span className="truncate sm:whitespace-normal">{settings.announcement}</span>
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-yellow-200" />
          </div>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
        {/* Banner Card */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border-2 border-pink-100 bg-white">
          <div className="w-full aspect-[21/9] sm:aspect-[24/9] max-h-56 sm:max-h-72 overflow-hidden bg-pink-50">
            <img 
              src={settings.bannerUrl || '/images/banner.jpg'} 
              alt="Banner" 
              className="w-full h-full object-cover object-center"
              onError={(e) => { e.target.src = '/images/banner.jpg'; }}
            />
          </div>
        </div>

        {/* Profile Logo & Store Info */}
        <div className="relative -mt-12 sm:-mt-16 flex flex-col items-center text-center px-4">
          {/* Avatar with Verified Badge */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white p-1">
              <img 
                src={settings.logoUrl || '/images/logo.jpg'} 
                alt={settings.storeName} 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => { e.target.src = '/images/logo.jpg'; }}
              />
            </div>
            {/* Verified Tick Badge */}
            <div 
              className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-md flex items-center justify-center"
              title="ร้านค้าที่ได้รับการตรวจสอบแล้ว"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Store Name & Badge */}
          <div className="mt-3 flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 font-heading">
              {settings.storeName}
            </h1>
            {settings.badgeText && (
              <span className="mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 border border-pink-200 shadow-xs">
                {settings.badgeText}
              </span>
            )}
            <p className="mt-2 text-sm sm:text-base font-medium text-pink-600">
              {settings.description}
            </p>
            {settings.subDescription && (
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 max-w-md">
                {settings.subDescription}
              </p>
            )}
          </div>

          {/* Opening Hours & Guarantee Badges */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            {settings.openingHours && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-pink-100 text-slate-600 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-pink-500" />
                <span>{settings.openingHours}</span>
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>รับประกันดูแลตลอดการใช้งาน</span>
            </div>
          </div>

          {/* Contact Action Buttons & Quick Jump */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-md">
            <a 
              href={settings.lineUrl || `https://line.me/ti/p/~${settings.lineId?.replace('@', '')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>ติดต่อสั่งซื้อทาง LINE</span>
            </a>
            <a
              href="#rates"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-pink-50 text-pink-600 font-semibold text-sm border border-pink-200 shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              <span>ดูเรทราคา ↓</span>
            </a>
          </div>

          {/* Admin Management Bar (Visible only when Admin is logged in) */}
          {isAdmin && (
            <div className="mt-6 w-full max-w-2xl bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-amber-800 text-xs sm:text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <span>กำลังอยู่ในโหมดผู้ดูแลระบบ (Admin)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onLogout}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-medium hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากโหมด Admin</span>
                  </button>
                </div>
              </div>

              {/* Admin Action Buttons */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button 
                  onClick={onOpenProductModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มแอพ / เรทราคา</span>
                </button>
                <button 
                  onClick={onOpenPromoModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มโปรคู่สุดฮิต</span>
                </button>
                <button 
                  onClick={onOpenSettings}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-pink-200 hover:bg-pink-50 text-slate-700 font-medium text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-pink-500" />
                  <span>ตั้งค่าร้านค้า</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
