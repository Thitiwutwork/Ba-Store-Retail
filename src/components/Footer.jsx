import React from 'react';
import { ShieldCheck, Clock, HeartHandshake, Lock } from 'lucide-react';

export default function Footer({ settings, onOpenAdminLogin, isAdmin }) {
  return (
    <footer className="w-full mt-16 pb-12 pt-8 border-t border-pink-100 bg-white/70">
      <div className="max-w-4xl mx-auto px-4">
        {/* Trust Badges 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-pink-50/50 border border-pink-100/70">
            <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {settings.badge1Title || 'ได้วันใช้งานครบ 100%'}
              </div>
              <div className="text-[11px] text-slate-500">
                {settings.badge1Sub || 'ของแท้ ปลอดภัย'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50/50 border border-rose-100/70">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {settings.badge2Title || 'ใช้เวลาตัดไม่นาน'}
              </div>
              <div className="text-[11px] text-slate-500">
                {settings.badge2Sub || 'เปิดบริการทุกวัน'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-100/70">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {settings.badge3Title || 'ดูแลตลอดการใช้งาน'}
              </div>
              <div className="text-[11px] text-slate-500">
                {settings.badge3Sub || 'ทีมงานพร้อมบริการ'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom: Copyright & Discreet Admin Access */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-4 border-t border-slate-100">
          <p>
            © {new Date().getFullYear()} {settings.storeName} • ร้านจำหน่ายแอพพรีเมียม ราคาปลีก
          </p>

          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบหลังบ้าน (Admin)</span>
              </button>
            ) : (
              <span className="text-[11px] text-emerald-600 font-medium">
                ● แอดมินออนไลน์
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
