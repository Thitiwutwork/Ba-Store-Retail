import React from 'react';
import { Smartphone, Tv, MessageCircle, Edit2, Trash2, CheckCircle2, Clock3, XCircle } from 'lucide-react';

export default function RateCard({
  product,
  settings,
  isAdmin,
  onEditProduct,
  onDeleteProduct,
  onToggleStock
}) {
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.inStock === false;
  const isWaiting = product.stockStatus === 'waiting';

  // Format prefilled message for LINE
  const getLineOrderUrl = (priceItem) => {
    const base = settings.lineUrl || `https://line.me/ti/p/~${settings.lineId?.replace('@', '')}`;
    const priceText = priceItem ? `${priceItem.label} ฿${priceItem.price}${priceItem.period ? ` (${priceItem.period})` : ''}` : `฿${product.price}`;
    const text = `สวัสดีค่ะ สนใจสั่งซื้อ ${product.name} [${priceText}] ค่ะ`;
    return `${base}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className={`relative bg-white rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
      isOutOfStock ? 'border-slate-200 opacity-80' : 'border-pink-100 hover:border-pink-200 hover:shadow-md'
    }`}>
      {/* Top Part: App Info & Specs */}
      <div>
        {/* Header Badges & Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Real App Icon */}
          <div className="w-14 h-14 rounded-2xl bg-white p-2 shadow-sm border border-pink-100 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={product.icon || '/logos/iqiyi.png'}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = '/logos/iqiyi.png'; }}
            />
          </div>

          {/* Status Badges */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {product.tag && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                  {product.tag}
                </span>
              )}
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                  <XCircle className="w-3 h-3 text-slate-400" />
                  <span>หมด</span>
                </span>
              ) : isWaiting ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock3 className="w-3 h-3 text-amber-500" />
                  <span>รอกด</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>พร้อมส่ง</span>
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              {product.category || 'ทั่วไป'}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-bold text-slate-800 font-heading mb-1 leading-snug">
          {product.name}
        </h3>

        {/* Sub detail */}
        {product.subDetail && (
          <p className="text-xs text-pink-600 font-medium mb-2.5">
            {product.subDetail}
          </p>
        )}

        {/* Device & Resolution Specs */}
        {(product.devices || product.resolution) && (
          <div className="space-y-1.5 text-xs text-slate-600 bg-pink-50/50 p-2.5 rounded-2xl border border-pink-100/60 mb-3">
            {product.devices && (
              <div className="flex items-start gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{product.devices}</span>
              </div>
            )}
            {product.resolution && (
              <div className="flex items-start gap-1.5">
                <Tv className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{product.resolution}</span>
              </div>
            )}
          </div>
        )}

        {/* Multi-line Package Bullets */}
        {product.packageDetails && (
          <div className="text-[12px] text-slate-500 whitespace-pre-line leading-relaxed mb-4 pl-1">
            {product.packageDetails}
          </div>
        )}
      </div>

      {/* Bottom Part: Pricing Tiers & Order Action */}
      <div>
        {/* Dynamic Price Tiers */}
        <div className="pt-3 border-t border-slate-100 mb-3 space-y-2">
          {product.prices && product.prices.length > 0 ? (
            product.prices.map((pTier) => (
              <div
                key={pTier.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100/80 hover:bg-pink-50/40 transition-colors"
              >
                <div>
                  <div className="text-xs font-medium text-slate-700">
                    {pTier.label}
                  </div>
                  {pTier.period && (
                    <div className="text-[10px] text-slate-400">
                      ระยะเวลา: {pTier.period}
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-pink-600 font-heading">
                    ฿{pTier.price}
                  </span>
                </div>
              </div>
            ))
          ) : (
            // Fallback for simple price
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">{product.priceLabel || 'ราคา'}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-pink-600 font-heading">
                  ฿{product.price}
                </span>
                {product.pricePeriod && (
                  <span className="text-xs text-slate-400">/ {product.pricePeriod}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order via LINE Button */}
        <a
          href={getLineOrderUrl(product.prices?.[0])}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-2xl font-medium text-xs sm:text-sm shadow-xs transition-all active:scale-98 ${
            !isOutOfStock
              ? 'bg-[#06C755] hover:bg-[#05b34c] text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed pointer-events-none'
          }`}
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>{!isOutOfStock ? 'สั่งซื้อทาง LINE' : 'สินค้าหมดชั่วคราว'}</span>
        </a>

        {/* Admin Quick Controls */}
        {isAdmin && (
          <div className="mt-2.5 pt-2.5 border-t border-dashed border-amber-200 flex items-center justify-between gap-1 text-xs">
            <button
              onClick={() => onToggleStock(product.id)}
              className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium transition-colors cursor-pointer"
            >
              {isOutOfStock ? 'เปลี่ยนเป็น: พร้อมส่ง' : 'เปลี่ยนเป็น: สินค้าหมด'}
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEditProduct(product)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="แก้ไขแอพ"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors cursor-pointer"
                title="ลบแอพ"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
