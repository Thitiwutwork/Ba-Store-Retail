import React from 'react';
import { Search, X, Tag } from 'lucide-react';

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      {/* Search Input */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-pink-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาชื่อแอพ เช่น Netflix, YouTube, Viu, Canva..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-pink-100 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-sm text-slate-700 transition-all placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            title="ล้างคำค้นหา"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills & Count */}
      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-200 scale-102'
                    : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <div className="text-xs text-slate-500 flex items-center gap-1.5 ml-auto">
          <Tag className="w-3.5 h-3.5 text-pink-400" />
          <span>แสดง {filteredCount} จากทั้งหมด {totalCount} รายการ</span>
        </div>
      </div>
    </div>
  );
}
