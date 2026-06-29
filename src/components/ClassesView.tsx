import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Star, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClassesViewProps {
  setView: (view: string) => void;
  setSelectedClassId: (id: string | null) => void;
}

export default function ClassesView({ setView, setSelectedClassId }: ClassesViewProps) {
  const { classes } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedLevel, setSelectedLevel] = useState<string>('전체');

  // Accumulate all tags
  const allCategories = useMemo(() => {
    const tagsSet = new Set<string>();
    classes.forEach(c => c.categories.forEach(cat => tagsSet.add(cat)));
    return ['전체', ...Array.from(tagsSet)];
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.intro.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '전체' || c.categories.includes(selectedCategory);
      const matchesLevel = selectedLevel === '전체' || c.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [classes, searchTerm, selectedCategory, selectedLevel]);

  const handleClassClick = (id: string) => {
    setSelectedClassId(id);
    setView('class-detail');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('전체');
    setSelectedLevel('전체');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C98C63]/10 text-xs font-semibold text-[#C98C63] tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Dalgeurak Classes
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#2E2A27] dark:text-[#F3EFEA]">
          감성 원데이 원스톱 클래스
        </h1>
        <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 leading-relaxed">
          초보자도, 손재주가 없는 분도 누구나 친절한 선생님의 코칭 아래 전문가 수준의 완제품을 완성해 가져가실 수 있는 달그락만의 커리큘럼입니다.
        </p>
      </div>

      {/* Filter Options Panel */}
      <div className="bg-white dark:bg-[#27221E] p-6 rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530] shadow-xs space-y-6">
        
        {/* Search Input & Basic Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Search bar */}
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#2E2A27]/40 dark:text-[#F3EFEA]/40" />
            <input
              type="text"
              placeholder="클래스 이름, 소개, 키워드로 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#FFFDF9] dark:bg-[#1F1B18] border border-[#E5D5C5] dark:border-[#52473E] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C98C63] text-[#2E2A27] dark:text-[#F3EFEA] transition-all"
            />
          </div>

          {/* Level selector */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#C98C63]" />
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">난이도:</span>
            <div className="flex gap-1.5 bg-[#F6EFE7] dark:bg-[#322B27] p-1 rounded-lg w-full lg:w-auto overflow-x-auto">
              {['전체', '입문', '초급', '중급', '고급'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedLevel === level
                      ? 'bg-[#C98C63] text-white'
                      : 'text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 hover:bg-white/50 dark:hover:bg-black/30'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Tags scroll box */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-500">태그 분류:</span>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#A26745] border-[#A26745] text-white shadow-xs'
                    : 'bg-[#FFFDF9] dark:bg-[#1F1B18] border-[#E5D5C5] dark:border-[#52473E] text-[#2E2A27]/80 dark:text-[#F3EFEA]/80 hover:border-[#C98C63]'
                }`}
              >
                {cat === '전체' ? '🏷 전체 태그' : `#${cat}`}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || selectedCategory !== '전체' || selectedLevel !== '전체') && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#F6EFE7] dark:border-[#3D3530]/60">
            <div>
              검색 필터 적용 중: <span className="text-[#C98C63] font-semibold">{filteredClasses.length}개</span>의 클래스 발견
            </div>
            <button 
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[#C98C63] font-semibold hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> 필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* Classes Grid */}
      <AnimatePresence mode="popLayout">
        {filteredClasses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-white dark:bg-[#27221E] rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530] space-y-4"
          >
            <span className="text-4xl block">🔍</span>
            <p className="text-sm font-semibold text-[#2E2A27]/60 dark:text-[#F3EFEA]/60">
              일치하는 공방 체험 클래스가 없습니다.
            </p>
            <button 
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-full bg-[#C98C63] text-white text-xs font-semibold hover:bg-[#A26745]"
            >
              모든 클래스 다시 보기
            </button>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredClasses.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                whileHover={{ y: -6 }}
                onClick={() => handleClassClick(item.id)}
                className="group bg-white dark:bg-[#27221E] rounded-2xl overflow-hidden border border-[#F6EFE7] dark:border-[#3D3530] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col h-full justify-between"
              >
                <div>
                  {/* Photo container */}
                  <div className="relative aspect-16/10 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Level Tag */}
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-[#FFFDF9] dark:bg-[#1F1B18] text-[10px] font-bold text-[#C98C63] dark:text-[#D7A17E] shadow-sm">
                      {item.level} 난이도
                    </span>

                    {/* Time limit badge */}
                    <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium">
                      ⏱ {item.duration} 소요
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-3">
                    {/* Tags list */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.categories.map(cat => (
                        <span key={cat} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F6EFE7] dark:bg-[#322B27] text-[#C98C63] dark:text-[#D7A17E] font-semibold">
                          #{cat}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA] group-hover:text-[#C98C63] transition-colors leading-tight">
                      {item.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-[#F6EFE7]/60 dark:border-[#3D3530]/40">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.rating}</span>
                      <span className="text-[10px] text-gray-400">후기 {item.reviewCount}개</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">체험 비용</span>
                      <span className="text-base font-bold text-[#A26745] dark:text-[#D7A17E]">
                        {item.price === 0 ? '무료 이벤트' : `${item.price.toLocaleString()}원~`}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
