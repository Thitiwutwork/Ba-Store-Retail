import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldAlert } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onLogin, currentPin }) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pin) {
      setError('กรุณากรอกรหัสผ่าน / PIN');
      return;
    }

    const expectedPin = currentPin || '1234';
    if (pin.trim() === expectedPin.trim()) {
      setError('');
      setPin('');
      onLogin();
      onClose();
    } else {
      setError('รหัสผ่าน PIN ไม่ถูกต้อง');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-pink-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-heading">
            เข้าสู่ระบบหลังบ้าน
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            กรุณากรอกรหัส PIN ผู้ดูแลระบบ
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              placeholder="กรอกรหัส PIN..."
              autoFocus
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-50 border border-slate-200 focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 outline-none text-center font-mono text-lg tracking-wider text-slate-800 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              tabIndex={-1}
            >
              {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              เข้าสู่ระบบ Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
