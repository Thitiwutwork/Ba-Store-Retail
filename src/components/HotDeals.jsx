import React from 'react';
import { Flame, Sparkles, Tv, Smartphone, MessageCircle, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function HotDeals({ 
  promotions, 
  settings, 
  isAdmin, 
  onEditPromo, 
  onDeletePromo, 
  onToggleStock 
}) {
  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mt-8">
      {/* Section Title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
          <Flame className="w-4 h-4 fill-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 font-heading">
              โปรโมชั่นพิเศษ
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-600 border border-rose-200 uppercase tracking-wide">
              HOT DEALS 🔥
            </span>
          </div>
          <p className="text-xs text-slate-500">
            จัดเซ็ตรวมแอพสุดคุ้ม หรือโค้ดยกล็อตราคาพิเศษ
          </p>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map((promo) => {
          const discount = Number(promo.originalPrice || 0) - Number(promo.promoPrice || 0);

          return (
            <div 
              key={promo.id}
              className="relative bg-white rounded-3xl p-5 border-2 border-pink-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Top: Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {promo.tag && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                        {promo.tag}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      promo.inStock !== false 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {promo.inStock !== false ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>พร้อมส่ง</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>สินค้าหมด</span>
                        </>
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                      ประหยัด ฿{discount}
                    </span>
                  )}
                </div>

                {/* Deal Title */}
                <h3 className="text-base font-bold text-slate-800 font-heading mb-3 line-clamp-2">
                  {promo.name}
                </h3>

                {/* 2 Apps Visual Combo */}
                <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-100 mb-3.5">
                  {/* App 1 */}
                  <div className="flex flex-col items-center gap-1 w-24 text-center">
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm border border-pink-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={promo.app1Icon || '/logos/iqiyi.png'} 
                        alt={promo.app1Name} 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/logos/iqiyi.png'; }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 truncate w-full">
                      {promo.app1Name}
                    </span>
                  </div>

                  {/* Plus Sign */}
                  <div className="w-7 h-7 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                    +
                  </div>

                  {/* App 2 */}
                  <div className="flex flex-col items-center gap-1 w-24 text-center">
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm border border-pink-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={promo.app2Icon || '/logos/viu.png'} 
                        alt={promo.app2Name} 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = '/logos/viu.png'; }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 truncate w-full">
                      {promo.app2Name}
                    </span>
                  </div>
                </div>

                {/* Device & Spec Badges */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                  {(promo.app1Devices || promo.devices) && (
                    <div className="flex items-start gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                      <span>{promo.devices || `${promo.app1Name}: ${promo.app1Devices}`}</span>
                    </div>
                  )}
                  {(promo.app1Resolution || promo.resolution) && (
                    <div className="flex items-start gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{promo.resolution || promo.app1Resolution}</span>
                    </div>
                  )}
                </div>

                {/* Package Details Bullets */}
                {promo.packageDetails && (
                  <div className="text-[12px] text-slate-500 whitespace-pre-line leading-relaxed mb-4 pl-1">
                    {promo.packageDetails}
                  </div>
                )}
              </div>

              {/* Card Bottom: Price and Order Button */}
              <div>
                <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 mb-3">
                  <div>
                    <span className="text-xs text-slate-400">ราคาพิเศษ</span>
                    {promo.originalPrice && (
                      <span className="ml-2 text-xs text-slate-400 line-through">
                        ฿{promo.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-rose-500 font-heading">
                      ฿{promo.promoPrice}
                    </span>
                    {promo.pricePeriod && (
                      <span className="text-xs text-slate-500 font-medium">
                        {promo.pricePeriod}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <a
                  href={`${settings.lineUrl || `https://line.me/ti/p/~${settings.lineId?.replace('@', '')}`}?text=${encodeURIComponent(`สวัสดีค่ะ สนใจสั่งซื้อ ${promo.name} ราคา ${promo.promoPrice} บาท`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-2xl font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-98 ${
                    promo.inStock !== false
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{promo.inStock !== false ? 'สั่งซื้อโปรนี้ทาง LINE' : 'สินค้าหมดชั่วคราว'}</span>
                </a>

                {/* Admin Quick Controls */}
                {isAdmin && (
                  <div className="mt-2.5 pt-2.5 border-t border-dashed border-amber-200 flex items-center justify-between gap-1 text-xs">
                    <button
                      onClick={() => onToggleStock(promo.id)}
                      className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium transition-colors cursor-pointer"
                    >
                      {promo.inStock !== false ? 'เปลี่ยนเป็น: สินค้าหมด' : 'เปลี่ยนเป็น: พร้อมส่ง'}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditPromo(promo)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="แก้ไขโปรโมชั่น"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePromo(promo.id)}
                        className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors cursor-pointer"
                        title="ลบโปรโมชั่น"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
