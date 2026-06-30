import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Star, Sparkles, SlidersHorizontal, RefreshCw, Gift, ArrowRight, 
  X, Calendar as CalendarIcon, Clock as ClockIcon, User, Phone, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface ClassesViewProps {
  setView: (view: string) => void;
  setSelectedClassId: (id: string | null) => void;
  initialFilterFree?: boolean;
}

export default function ClassesView({ setView, setSelectedClassId, initialFilterFree = false }: ClassesViewProps) {
  const { classes, bookClass, currentUser, autoApproveBookings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilterFree ? '무료' : '전체');
  const [selectedLevel, setSelectedLevel] = useState<string>('전체');

  // When filtering free trials, also reset other filters
  useEffect(() => {
    if (initialFilterFree) {
      setSearchTerm('');
      setSelectedCategory('전체');
      setSelectedLevel('전체');
    }
  }, [initialFilterFree]);

  // Direct Guest Free Kit Booking Modal States
  const [showFreeKitModal, setShowFreeKitModal] = useState(false);
  const [guestName, setGuestName] = useState(currentUser?.displayName || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccessData, setBookingSuccessData] = useState<any>(null);

  // Simple 7-day selector starting from tomorrow
  const getNext7Days = () => {
    const dates = [];
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    for (let i = 1; i <= 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      // Skip Mondays (Monday is holiday)
      if (d.getDay() === 1) continue;

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateVal = String(d.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${dateVal}`;
      const dayLabel = weekdays[d.getDay()];

      dates.push({
        fullDate,
        day: d.getDate(),
        label: dayLabel,
        isWeekend: d.getDay() === 0 || d.getDay() === 6
      });
    }
    return dates.slice(0, 7); // take 7 days
  };

  const bookingDates = useMemo(() => getNext7Days(), []);
  const timeSlots = ['11:00', '13:30', '16:00', '18:30'];

  const handleFreeKitBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setBookingError('예약자 성함을 입력해주세요.');
      return;
    }
    if (!guestPhone.trim()) {
      setBookingError('연락처(휴대폰 번호)를 입력해주세요.');
      return;
    }
    const cleanPhone = guestPhone.replace(/[^0-9-]/g, '');
    if (cleanPhone.length < 9) {
      setBookingError('올바른 연락처 형식을 입력해주세요.');
      return;
    }
    if (!selectedDate) {
      setBookingError('체험 일자를 선택해주세요.');
      return;
    }
    if (!selectedTime) {
      setBookingError('체험 시간을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    setBookingError('');

    try {
      const freeKitClass = classes.find(c => c.id === 'class-free-kit');
      if (!freeKitClass) {
        throw new Error('달그락 키트 체험 클래스 상품을 찾을 수 없습니다.');
      }

      const generatedEmail = currentUser?.email || `${Date.now()}@guest.dallgrak.com`;

      const result = await bookClass(
        'class-free-kit',
        selectedDate,
        selectedTime,
        1, // headcount
        undefined, // coupon id
        guestName,
        generatedEmail,
        guestPhone
      );

      setBookingSuccessData(result);
      
      // Trigger success confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C98C63', '#F6EFE7', '#A26745', '#FFFDF9']
      });

    } catch (err: any) {
      setBookingError(err.message || '예약 신청 중 예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Accumulate all tags
  const allCategories = useMemo(() => {
    const tagsSet = new Set<string>();
    classes.forEach(c => c.categories.forEach(cat => tagsSet.add(cat)));
    return ['전체', ...Array.from(tagsSet)];
  }, [classes]);

  const filteredClasses = useMemo(() => {
    // For free trials, just show all classes with price === 0
    if (initialFilterFree) {
      return classes.filter(c => c.price === 0);
    }
    
    // For regular classes, apply all filters
    return classes.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.intro.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '전체' || c.categories.includes(selectedCategory);
      const matchesLevel = selectedLevel === '전체' || c.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [classes, searchTerm, selectedCategory, selectedLevel, initialFilterFree]);

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
          <Sparkles className="w-3.5 h-3.5" /> {initialFilterFree ? 'Dalgeurak Free Trials' : 'Dalgeurak Classes'}
        </span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#2E2A27] dark:text-[#F3EFEA]">
          {initialFilterFree ? '특별 오프닝 무료 체험 이벤트' : '감성 원데이 원스톱 클래스'}
        </h1>
        <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 leading-relaxed">
          {initialFilterFree 
            ? '달그락 상점의 시그니처 감성과 아기자기한 수공예 체험을 무상으로 편안하게 즐기실 수 있도록 특별히 선별한 100% 무료 시범 서비스 라인업입니다.' 
            : '초보자도, 손재주가 없는 분도 누구나 친절한 선생님의 코칭 아래 전문가 수준의 완제품을 완성해 가져가실 수 있는 달그락만의 커리큘럼입니다.'}
        </p>
      </div>

      {/* 🎁 Prominent Free Experience Banner for "달그락 상점 키트 체험" */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        onClick={() => handleClassClick('class-free-kit')}
        className="bg-[#FFFDF9] dark:bg-[#27221E] border-2 border-dashed border-[#C98C63] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs cursor-pointer transition-all hover:shadow-md hover:border-solid hover:border-[#C98C63]"
      >
        <div className="absolute right-[-5%] top-[-5%] w-48 h-48 bg-[#C98C63]/10 dark:bg-[#C98C63]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="space-y-3 text-center lg:text-left">
            <div className="flex flex-wrap gap-2 items-center justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C98C63] text-white text-[10px] font-bold tracking-wider uppercase animate-pulse">
                <Gift className="w-3 h-3" /> 100% 무료체험
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider">
                달그락 상점 키트 체험
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2E2A27] dark:text-[#F3EFEA] tracking-tight">
              [무료 체험] 달그락 상점 키트 체험 클래스
            </h2>
            <p className="text-xs sm:text-sm text-[#2E2A27]/80 dark:text-[#F3EFEA]/80 max-w-2xl leading-relaxed">
              달그락 상점의 인기 소품 키트를 직접 만져보고 손쉽게 조립하여 포근한 감성 인테리어 소품을 만들어 보실 수 있는 특별 무료 체험 클래스입니다. 무상으로 제공되는 DIY 시그니처 패키지 키트를 통해 세상에 하나뿐인 달그락 감성을 채워보세요! (소요 시간: 30분)
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClassClick('class-free-kit');
              }}
              className="px-5 py-3 border border-[#C98C63]/40 text-[#C98C63] dark:text-[#D7A17E] hover:bg-[#C98C63]/5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer text-center whitespace-nowrap"
            >
              상세 소개 보기
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFreeKitModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C98C63] hover:bg-[#A26745] text-white text-xs sm:text-sm font-bold rounded-full transition-all whitespace-nowrap shadow-xs hover:shadow-md cursor-pointer shrink-0"
            >
              <Gift className="w-4 h-4" /> '달그락 키트 무료체험' 신청하기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

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

        {/* Debug Info - Remove after testing */}
        <div className="text-xs text-gray-500 bg-yellow-50 dark:bg-yellow-950 p-2 rounded">
          {`Debug: initialFilterFree=${initialFilterFree}, classes=${classes.length}, filtered=${filteredClasses.length}, freeClasses=${classes.filter(c => c.price === 0).length}`}
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
            {filteredClasses.map((item) => {
              const isFreeTrial = !!item.isFreeTrial;
              const isFreeKit = item.id === 'class-free-kit';
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  whileHover={{ y: -6 }}
                  onClick={() => {
                    handleClassClick(item.id);
                  }}
                  className={`group rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col h-full justify-between relative ${
                    isFreeTrial
                      ? 'border-2 border-dashed border-[#C98C63] bg-[#FFFDF9] dark:bg-[#2A2420] ring-4 ring-[#C98C63]/10'
                      : 'bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530]'
                  }`}
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
                      
                      {/* Level Tag / Free trial indicator */}
                      <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm ${
                        isFreeTrial 
                          ? 'bg-[#C98C63] text-white animate-pulse'
                          : 'bg-[#FFFDF9] dark:bg-[#1F1B18] text-[#C98C63] dark:text-[#D7A17E]'
                      }`}>
                        {isFreeTrial ? '★ 무료 체험' : `${item.level} 난이도`}
                      </span>

                      {/* Time limit badge */}
                      <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium">
                        ⏱ {item.duration} 소요
                      </span>

                      {/* Sparkles / Gift overlay on free kit hover */}
                      {isFreeTrial && (
                        <div className="absolute top-4 right-4 z-10 px-2 py-1 rounded-full bg-[#A26745] text-white text-[9px] font-bold tracking-wider uppercase flex items-center gap-1">
                          <Gift className="w-3 h-3" /> {isFreeKit ? 'BEST' : 'FREE'}
                        </div>
                      )}
                    </div>

                    {/* Body Info */}
                    <div className="p-6 space-y-3">
                      {/* Tags list */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.categories.map(cat => (
                          <span key={cat} className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            isFreeTrial
                              ? 'bg-[#C98C63]/10 text-[#C98C63] dark:text-[#E8AF8A]'
                              : 'bg-[#F6EFE7] dark:bg-[#322B27] text-[#C98C63] dark:text-[#D7A17E]'
                          }`}>
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
                    {isFreeTrial ? (
                      <div className="pt-4 border-t border-[#C98C63]/30 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">혜택</span>
                            <span className="text-[10px] text-[#C98C63] font-bold bg-[#C98C63]/10 px-1.5 py-0.5 rounded-sm">
                              {isFreeKit ? '패키지 무상 증정' : '웰컴 체험 무료'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-[#C98C63] dark:text-[#E8AF8A]">무료 체험 프로그램</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClassClick(item.id);
                            }}
                            className="w-full bg-[#FFFDF9] dark:bg-[#1F1B18] hover:bg-[#F6EFE7] dark:hover:bg-[#322B27] border border-[#C98C63] text-[#C98C63] text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer focus:outline-none"
                          >
                            상세보기 🔍
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isFreeKit) {
                                setShowFreeKitModal(true);
                              } else {
                                handleClassClick(item.id);
                              }
                            }}
                            className="w-full bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer focus:outline-none"
                          >
                            <Gift className="w-3.5 h-3.5 animate-pulse" /> {isFreeKit ? '간편 신청 🎁' : '체험 예약 🎁'}
                          </button>
                        </div>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎁 비회원 간편 예약 모달 */}
      <AnimatePresence>
        {showFreeKitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSubmitting) {
                  setShowFreeKitModal(false);
                  setBookingSuccessData(null);
                  setBookingError('');
                }
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FFFDF9] dark:bg-[#27221E] w-full max-w-lg rounded-3xl overflow-hidden border border-[#E5D5C5] dark:border-[#52473E] shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#F6EFE7] dark:border-[#3D3530] flex items-center justify-between bg-white dark:bg-[#1F1B18]">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-[#C98C63]/10 text-[#C98C63] rounded-lg">
                    <Gift className="w-5 h-5 animate-bounce" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA] leading-tight">
                      달그락 키트 무료체험 비회원 예약
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      사용자 이름과 연락처 입력으로 간편하게 신청하세요!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowFreeKitModal(false);
                    setBookingSuccessData(null);
                    setBookingError('');
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Area */}
              <div className="overflow-y-auto p-6 space-y-6 flex-1">
                {bookingSuccessData ? (
                  /* Success View inside Modal */
                  <div className="text-center py-6 space-y-6">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-serif font-bold text-xl text-[#2E2A27] dark:text-[#F3EFEA]">
                        무료체험 예약이 완료되었습니다!
                      </h4>
                      <div className="py-1">
                        {autoApproveBookings ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                            <span>⚡ 실시간 즉시 승인 완료 (FAST PASS)</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-bold text-[10px] border border-amber-500/20">
                            <span>⏳ 예약 검토 대기 중 (관리자 확인 후 확정)</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 max-w-sm mx-auto leading-relaxed">
                        등록하신 성함과 연락처 정보로 정상 예약되었습니다. 예약 확인은 상단 <strong>'예약확인'</strong> 탭에서 언제든지 가능합니다.
                      </p>
                    </div>

                    {/* Receipt Details */}
                    <div className="bg-[#F6EFE7] dark:bg-[#322B27] p-5 rounded-2xl border border-[#E5D5C5]/30 text-left space-y-3.5 text-xs">
                      <div className="flex justify-between border-b border-[#E5D5C5]/20 pb-2">
                        <span className="text-gray-400">예약 상품</span>
                        <span className="font-bold text-[#2E2A27] dark:text-[#F3EFEA]">
                          [무료 체험] 달그락 키트 체험 클래스
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#E5D5C5]/20 pb-2">
                        <span className="text-gray-400">예약자 성함</span>
                        <span className="font-semibold text-[#2E2A27] dark:text-[#F3EFEA]">{guestName}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#E5D5C5]/20 pb-2">
                        <span className="text-gray-400">연락처</span>
                        <span className="font-semibold text-[#2E2A27] dark:text-[#F3EFEA]">{guestPhone}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#E5D5C5]/20 pb-2">
                        <span className="text-gray-400">예약 일정</span>
                        <span className="font-bold text-[#C98C63]">
                          {selectedDate} / {selectedTime} 타임
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-gray-400">체험 비용</span>
                        <span className="font-bold text-emerald-500">0원 (전액 무료체험)</span>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        onClick={() => {
                          setShowFreeKitModal(false);
                          setBookingSuccessData(null);
                          setBookingError('');
                          setView('booking-check');
                        }}
                        className="flex-1 py-3 bg-[#C98C63] hover:bg-[#A26745] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer text-center"
                      >
                        내 예약 확인하러 가기
                      </button>
                      <button
                        onClick={() => {
                          setShowFreeKitModal(false);
                          setBookingSuccessData(null);
                          setBookingError('');
                        }}
                        className="px-5 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer text-center"
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleFreeKitBookingSubmit} className="space-y-6 text-left">
                    {/* Guest Name & Phone fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#C98C63]" /> 예약자 이름
                        </label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="성함을 입력해주세요"
                          className="w-full px-3.5 py-2.5 bg-[#FFFDF9] dark:bg-[#1F1B18] border border-[#E5D5C5] dark:border-[#52473E] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C98C63] text-[#2E2A27] dark:text-[#F3EFEA]"
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#C98C63]" /> 연락처 (휴대폰 번호)
                        </label>
                        <input
                          type="tel"
                          required
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="예: 010-1234-5678"
                          className="w-full px-3.5 py-2.5 bg-[#FFFDF9] dark:bg-[#1F1B18] border border-[#E5D5C5] dark:border-[#52473E] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C98C63] text-[#2E2A27] dark:text-[#F3EFEA]"
                        />
                      </div>
                    </div>

                    {/* Step 1: Date picker */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#C98C63]" /> 1. 체험 일자 선택
                      </label>
                      <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                        {bookingDates.map((d) => (
                          <button
                            type="button"
                            key={d.fullDate}
                            onClick={() => {
                              setSelectedDate(d.fullDate);
                              setSelectedTime(''); // Reset time selection on date change
                            }}
                            className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                              selectedDate === d.fullDate
                                ? 'bg-[#C98C63] border-[#C98C63] text-white font-bold shadow-xs'
                                : 'bg-white dark:bg-[#1F1B18] border-[#E5D5C5] dark:border-[#52473E] hover:border-[#C98C63] text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className={`text-[9px] block ${selectedDate === d.fullDate ? 'text-white/80' : 'text-gray-400'}`}>{d.label}</span>
                            <span className="text-xs font-semibold block">{d.day}일</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Time slot selection */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5 text-[#C98C63]" /> 2. 체험 시간대 선택
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map(time => (
                          <button
                            type="button"
                            key={time}
                            disabled={!selectedDate}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer ${
                              !selectedDate 
                                ? 'opacity-40 cursor-not-allowed bg-gray-50 dark:bg-zinc-900 text-gray-400'
                                : selectedTime === time
                                  ? 'bg-[#C98C63] border-[#C98C63] text-white font-bold shadow-xs'
                                  : 'bg-white dark:bg-[#1F1B18] border-[#E5D5C5] dark:border-[#52473E] hover:border-[#C98C63] text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Booking warning card */}
                    <div className="bg-[#FFFDF9] dark:bg-[#201C19] border border-amber-500/10 p-4 rounded-xl flex gap-2.5 items-start">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-amber-600 block">무료 체험 유의사항</span>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                          달그락 키트 무료체험은 1인당 평생 1회만 제공됩니다. 불참 시 가급적 최소 하루 전에 예약 취소해 주세요!
                        </p>
                      </div>
                    </div>

                    {/* Error container */}
                    {bookingError && (
                      <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-500/10 rounded-xl text-rose-500 text-xs font-medium">
                        ⚠️ {bookingError}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowFreeKitModal(false);
                          setBookingError('');
                        }}
                        disabled={isSubmitting}
                        className="flex-1 py-3 border border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-[#C98C63] hover:bg-[#A26745] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            신청 중...
                          </>
                        ) : (
                          '무료체험 신청 완료'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
