import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';
import { Search, Calendar, User, Eye, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NoticeView() {
  const { notices } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const categories = ['전체', '공지', '이벤트', '클래스'];

  const filteredNotices = useMemo(() => {
    return notices.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            n.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '전체' || n.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notices, searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C98C63]/10 text-xs font-semibold text-[#C98C63]">
          <Bell className="w-3.5 h-3.5" /> Dalgeurak Announcements
        </span>
        <h1 className="font-serif font-bold text-3xl text-[#2E2A27] dark:text-[#F3EFEA]">공지사항 및 특별 이벤트</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          달그락 상점의 정기 런칭 혜택, 제휴 소식, 클래스 운영 안내 및 공방 특별 혜택 정보를 한곳에 모았습니다.
        </p>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#27221E] p-4 rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530]">
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#C98C63] text-white font-semibold'
                  : 'text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 hover:bg-[#F6EFE7]'
              }`}
            >
              {cat === '전체' ? '📢 전체공지' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="공지 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#FFFDF9] dark:bg-[#1F1B18] border border-[#E5D5C5] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C98C63] text-gray-700"
          />
        </div>
      </div>

      {/* Notice List */}
      <div className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl overflow-hidden shadow-2xs divide-y divide-[#F6EFE7]">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            게시된 공지사항이 아직 없습니다.
          </div>
        ) : (
          filteredNotices.map((n) => (
            <div
              key={n.id}
              onClick={() => setSelectedNotice(n)}
              className="p-5 sm:p-6 hover:bg-[#FFFDF9] dark:hover:bg-[#1F1B18] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    n.category === '이벤트'
                      ? 'bg-amber-100 text-amber-700'
                      : n.category === '공지'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {n.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">No.{n.id.split('-')[1] || n.id}</span>
                </div>

                <h3 className="font-serif font-bold text-sm sm:text-base text-[#2E2A27] dark:text-[#F3EFEA] hover:text-[#C98C63] transition-colors leading-snug">
                  {n.title}
                </h3>
              </div>

              {/* Meta information */}
              <div className="flex items-center gap-4 text-[11px] text-gray-400 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-dashed border-gray-100">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {n.createdAt.split('T')[0]}</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {n.author}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {n.views}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notice Detail Pop-up Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] max-w-2xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded bg-[#C98C63]/10 text-[#C98C63] text-[9px] font-bold">
                    {selectedNotice.category} 소식
                  </span>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-[#2E2A27] dark:text-[#F3EFEA] leading-snug">
                    {selectedNotice.title}
                  </h2>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span>작성일: {selectedNotice.createdAt.split('T')[0]}</span>
                    <span>•</span>
                    <span>작성자: {selectedNotice.author}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap py-2 font-light">
                {selectedNotice.content}
              </div>

              {/* Footer action */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2.5 rounded-full bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  확인 및 닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
