import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  ChevronLeft, 
  Star, 
  AlertTriangle, 
  RotateCcw, 
  Gift, 
  Check, 
  Heart,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface ClassDetailModalProps {
  classId: string;
  setView: (view: string) => void;
  setSelectedClassId: (id: string | null) => void;
}

export default function ClassDetailModal({ classId, setView, setSelectedClassId }: ClassDetailModalProps) {
  const { 
    classes, 
    currentUser, 
    bookClass, 
    coupons, 
    wishlist, 
    toggleFavoriteClass 
  } = useApp();

  const selectedClass = classes.find(c => c.id === classId);

  if (!selectedClass) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">클래스를 찾을 수 없습니다.</p>
        <button onClick={() => setView('classes')} className="mt-4 px-4 py-2 bg-[#C98C63] text-white rounded-full">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // Booking states
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [headCount, setHeadCount] = useState<number>(1);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Guest booking states
  const [isGuestBooking, setIsGuestBooking] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const isFavorited = wishlist.includes(selectedClass.id);

  // Available slots for simulation
  const timeSlots = ['11:00', '13:30', '16:00', '18:30'];

  // Current calendar generation (Simple 7-day selector starting from today)
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
    return dates;
  };

  const bookingDates = getNext7Days();

  // Price calculations
  const basePrice = selectedClass.price * headCount;
  let finalPrice = basePrice;
  let couponDiscountLabel = '';

  const userCoupons = coupons.filter(cp => currentUser?.coupons.includes(cp.id));
  const activeCoupon = coupons.find(cp => cp.id === selectedCouponId);
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percent') {
      finalPrice = basePrice * (1 - activeCoupon.discountValue / 100);
      couponDiscountLabel = `${activeCoupon.discountValue}% 할인`;
    } else {
      finalPrice = Math.max(0, basePrice - activeCoupon.discountValue);
      couponDiscountLabel = `${activeCoupon.discountValue.toLocaleString()}원 할인`;
    }
  }

  const handleBooking = async () => {
    if (!selectedDate) {
      alert('체험 날짜를 선택해주세요.');
      return;
    }
    if (!selectedTime) {
      alert('체험 시간을 선택해주세요.');
      return;
    }

    if (!currentUser && isGuestBooking) {
      if (!guestName.trim()) {
        alert('예약자 성함을 입력해주세요.');
        return;
      }
      if (selectedClass.price > 0 && !guestEmail.trim()) {
        alert('이메일 주소를 입력해주세요.');
        return;
      }
      if (!guestPhone.trim()) {
        alert('휴대폰 번호를 입력해주세요.');
        return;
      }
    }

    setBookingLoading(true);
    try {
      const res = await bookClass(
        selectedClass.id, 
        selectedDate, 
        selectedTime, 
        headCount, 
        selectedCouponId || undefined,
        !currentUser ? guestName : undefined,
        !currentUser ? guestEmail : undefined,
        !currentUser ? guestPhone : undefined
      );
      setCreatedBookingId(res.id);
      setBookingSuccess(true);
      alert('예약이 완료되었습니다.');
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C98C63', '#F6EFE7', '#A26745', '#FFFDF9']
      });

    } catch (e: any) {
      alert(e.message || '예약 처리 중 오류가 발생했습니다.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedClassId(null);
    setView('classes');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back navigation */}
      <button 
        onClick={handleClose}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C98C63] hover:text-[#A26745] cursor-pointer focus:outline-none"
      >
        <ChevronLeft className="w-4 h-4" /> 클래스 목록으로 돌아가기
      </button>

      {bookingSuccess ? (
        /* Success Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto bg-white dark:bg-[#27221E] rounded-3xl border border-[#F6EFE7] dark:border-[#3D3530] p-8 text-center space-y-6 shadow-md my-10"
        >
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-[#2E2A27] dark:text-[#F3EFEA]">예약이 완료되었습니다!</h2>
            {!currentUser ? (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-500/15 max-w-md mx-auto">
                ⚠️ 비회원 체험 예약 완료! 예약번호와 입력하신 휴대폰 번호로 예약확인 탭에서 내역 조회가 가능합니다.
              </p>
            ) : (
              <p className="text-xs text-gray-400">달그락 상점을 찾아주셔서 고맙습니다.</p>
            )}
          </div>

          <div className="bg-[#FFFDF9] dark:bg-[#1F1B18] p-5 rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530] text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
              <span className="text-gray-400 font-medium">예약 번호</span>
              <span className="font-mono font-bold text-gray-700 dark:text-gray-200">{createdBookingId}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
              <span className="text-gray-400 font-medium">체험 클래스</span>
              <span className="font-bold text-[#C98C63]">{selectedClass.name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
              <span className="text-gray-400 font-medium">예약 일시</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedDate} / {selectedTime} 타임</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
              <span className="text-gray-400 font-medium">예약 인원</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">{headCount}명</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-400 font-medium">결제 및 확정금액</span>
              <span className="font-bold text-[#A26745] dark:text-[#D7A17E] text-base">{finalPrice === 0 ? '무료' : `${finalPrice.toLocaleString()}원`}</span>
            </div>
          </div>

          {/* QR code and notice */}
          <div className="space-y-3">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=DALGEURAK-RESERVE-${createdBookingId}`}
              alt="Booking QR" 
              className="mx-auto w-32 h-32 border p-1 rounded-lg bg-white"
            />
            <p className="text-[11px] text-gray-400 leading-relaxed">
              * 위 QR코드는 입장 시 필요합니다.<br />
              예약 확인 탭 또는 마이페이지에서 언제든 다시 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView('booking-check')}
              className="flex-1 py-3.5 bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              예약 확인하러 가기
            </button>
            <button
              onClick={() => {
                setSelectedClassId(null);
                setView('classes');
              }}
              className="px-6 py-3.5 bg-[#F6EFE7] dark:bg-[#3D3530] text-[#2E2A27] dark:text-[#F3EFEA] text-xs font-bold rounded-full hover:opacity-90 transition-all cursor-pointer"
            >
              다른 클래스 보기
            </button>
          </div>
        </motion.div>
      ) : (
        /* Regular Details Page layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left/Center: Content Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Header Title Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#C98C63]/10 text-[#C98C63] text-xs font-bold">
                  {selectedClass.level} 난이도
                </span>
                {selectedClass.categories.map(cat => (
                  <span key={cat} className="text-xs text-gray-400 font-medium">
                    #{cat}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-start gap-4">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2E2A27] dark:text-[#F3EFEA] leading-snug">
                  {selectedClass.name}
                </h1>
                
                {/* Heart wishlist */}
                <button
                  onClick={() => toggleFavoriteClass(selectedClass.id)}
                  className="p-2.5 rounded-full border border-gray-100 dark:border-zinc-800 shadow-xs hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-rose-500 transition-all cursor-pointer focus:outline-none"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <p className="text-[#2E2A27]/80 dark:text-[#F3EFEA]/80 text-sm leading-relaxed font-serif italic border-l-2 border-[#C98C63] pl-3">
                {selectedClass.description}
              </p>
            </div>

            {/* Large Image Sliders/Gallery placeholder */}
            <div className="aspect-16/10 rounded-2xl overflow-hidden shadow-xs border border-gray-100 dark:border-zinc-800 bg-gray-100">
              <img 
                src={selectedClass.imageUrl} 
                alt={selectedClass.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Accordion sections for descriptions */}
            <div className="space-y-8">
              
              {/* 1. 클래스 소개 */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA] border-b border-[#F6EFE7] dark:border-[#3D3530] pb-2">
                  🌿 클래스 소개
                </h3>
                <p className="text-xs sm:text-sm text-[#2E2A27]/80 dark:text-[#F3EFEA]/80 leading-relaxed whitespace-pre-wrap">
                  {selectedClass.intro}
                </p>
              </div>

              {/* 2. 완성품 & 제공 서비스 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F6EFE7]/50 dark:bg-[#3D3530]/20 p-6 rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530]">
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#A26745] dark:text-[#D7A17E]">
                    💝 완성해서 가져가는 선물
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-[#2E2A27] dark:text-[#F3EFEA]">
                    {selectedClass.completedItem}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#A26745] dark:text-[#D7A17E]">
                    🍵 웰컴 및 서비스 패키지
                  </h4>
                  <ul className="text-xs sm:text-sm list-disc pl-4 space-y-1 text-gray-600 dark:text-gray-300">
                    {selectedClass.provided.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3. 준비물 & 재료 세트 */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA] border-b border-[#F6EFE7] dark:border-[#3D3530] pb-2">
                  🛠 준비물 및 공방 재료
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedClass.materials.map((m, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-[#322B27] border border-gray-100 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-medium">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. 주의사항 */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA] border-b border-[#F6EFE7] dark:border-[#3D3530] pb-2">
                  ⚠️ 수강 시 주의사항
                </h3>
                <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  {selectedClass.precautions.map((p, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. 환불 규정 */}
              <div className="space-y-3 bg-red-500/5 p-5 rounded-2xl border border-red-500/10">
                <h4 className="text-xs font-bold text-red-500 flex items-center gap-1.5 uppercase">
                  <RotateCcw className="w-3.5 h-3.5" /> 취소 및 환불 안내
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {selectedClass.refundPolicy}
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Dynamic Booking Reservation Engine */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-white dark:bg-[#27221E] rounded-3xl p-6 border border-[#F6EFE7] dark:border-[#3D3530] shadow-sm space-y-6">
              
              {/* Specs Box */}
              <div className="space-y-3 pb-4 border-b border-[#F6EFE7]/80 dark:border-[#3D3530]/60">
                <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">실시간 예약하기</h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4 text-[#C98C63]" />
                    <div>
                      <span className="block text-[10px] text-gray-400">소요 시간</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedClass.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4 text-[#C98C63]" />
                    <div>
                      <span className="block text-[10px] text-gray-400">수강 정원</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">최대 {selectedClass.maxPeople}명</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1: Date Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 block">1. 체험 날짜 선택</label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {bookingDates.map((d) => (
                    <button
                      key={d.fullDate}
                      onClick={() => {
                        setSelectedDate(d.fullDate);
                        setSelectedTime(''); // clear time
                      }}
                      className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                        selectedDate === d.fullDate
                          ? 'bg-[#C98C63] border-[#C98C63] text-white font-bold'
                          : 'bg-[#FFFDF9] dark:bg-[#1F1B18] border-[#E5D5C5] dark:border-[#52473E] hover:border-[#C98C63]'
                      }`}
                    >
                      <span className={`text-[10px] block ${selectedDate === d.fullDate ? 'text-white/80' : 'text-gray-400'}`}>{d.label}</span>
                      <span className="text-sm font-semibold block">{d.day}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Time Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 block">2. 시간 타임 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      disabled={!selectedDate}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer ${
                        !selectedDate 
                          ? 'opacity-40 cursor-not-allowed'
                          : selectedTime === time
                            ? 'bg-[#C98C63] border-[#C98C63] text-white font-bold'
                            : 'bg-[#FFFDF9] dark:bg-[#1F1B18] border-[#E5D5C5] dark:border-[#52473E] hover:border-[#C98C63]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Headcount Counter */}
              <div className="flex items-center justify-between py-2 border-b border-[#F6EFE7]/80 dark:border-[#3D3530]/60 text-xs">
                <span className="font-bold text-gray-400">3. 예약 인원</span>
                <div className="flex items-center gap-3">
                  <button
                    disabled={headCount <= 1}
                    onClick={() => setHeadCount(c => c - 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center font-bold hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{headCount}</span>
                  <button
                    disabled={headCount >= selectedClass.maxPeople}
                    onClick={() => setHeadCount(c => c + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center font-bold hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Step 4: Apply Coupons */}
              {currentUser && userCoupons.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#C98C63]" /> 4. 보유 쿠폰 적용
                  </label>
                  <select
                    value={selectedCouponId}
                    onChange={(e) => setSelectedCouponId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E5D5C5] dark:border-[#52473E] bg-[#FFFDF9] dark:bg-[#1F1B18] text-xs focus:ring-[#C98C63]"
                  >
                    <option value="">쿠폰을 선택하지 않음</option>
                    {userCoupons.map(cp => (
                      <option key={cp.id} value={cp.id}>
                        [{cp.code}] {cp.name} ({cp.discountType === 'percent' ? `${cp.discountValue}%` : `${cp.discountValue}원`})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Bill Details */}
              <div className="bg-[#FFFDF9] dark:bg-[#1F1B18] p-4 rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">기본 단가 x {headCount}명</span>
                  <span className="font-semibold">{basePrice === 0 ? '무료' : `${basePrice.toLocaleString()}원`}</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between text-[#A26745] dark:text-[#D7A17E]">
                    <span>쿠폰 할인 ({activeCoupon.name})</span>
                    <span>-{couponDiscountLabel}</span>
                  </div>
                )}
                {currentUser && (
                  <div className="flex justify-between text-emerald-500 font-medium">
                    <span>예약 시 적립 예정 포인트 (5%)</span>
                    <span>+{Math.floor(finalPrice * 0.05).toLocaleString()}p</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-zinc-800 font-bold text-sm">
                  <span className="text-[#2E2A27] dark:text-[#F3EFEA]">총 결제 금액</span>
                  <span className="text-[#A26745] dark:text-[#D7A17E] text-base">{finalPrice === 0 ? '무료' : `${finalPrice.toLocaleString()}원`}</span>
                </div>
              </div>

              {/* Reserve Button */}
              {currentUser ? (
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="w-full py-4 rounded-full bg-[#C98C63] hover:bg-[#A26745] disabled:bg-gray-400 text-white font-bold text-sm shadow-md cursor-pointer transition-colors"
                >
                  {bookingLoading ? '처리 중...' : '원데이 클래스 예약하기'}
                </button>
              ) : isGuestBooking ? (
                <div className="space-y-3 bg-[#F6EFE7]/30 dark:bg-[#3D3530]/20 p-4 rounded-2xl border border-[#E5D5C5]/45">
                  <span className="text-xs font-bold text-[#A26745] dark:text-[#D7A17E] block">비회원 예약자 정보 입력</span>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 block">예약자 성함</label>
                    <input 
                      type="text" 
                      placeholder="성함을 입력하세요"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5D5C5] dark:border-[#52473E] bg-[#FFFDF9] dark:bg-[#1F1B18] text-[#2E2A27] dark:text-[#F3EFEA] focus:outline-none focus:ring-1 focus:ring-[#C98C63]"
                    />
                  </div>
                  
                  {selectedClass.price > 0 && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 block">이메일 주소</label>
                      <input 
                        type="email" 
                        placeholder="example@email.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5D5C5] dark:border-[#52473E] bg-[#FFFDF9] dark:bg-[#1F1B18] text-[#2E2A27] dark:text-[#F3EFEA] focus:outline-none focus:ring-1 focus:ring-[#C98C63]"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 block">휴대폰 번호 (예약 확인용)</label>
                    <input 
                      type="tel" 
                      placeholder="010-1234-5678"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5D5C5] dark:border-[#52473E] bg-[#FFFDF9] dark:bg-[#1F1B18] text-[#2E2A27] dark:text-[#F3EFEA] focus:outline-none focus:ring-1 focus:ring-[#C98C63]"
                    />
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="w-full py-3.5 mt-2 rounded-full bg-[#C98C63] hover:bg-[#A26745] disabled:bg-gray-400 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                  >
                    {bookingLoading ? '예약 처리 중...' : '비회원 체험 예약 완료하기'}
                  </button>

                  <button
                    onClick={() => setIsGuestBooking(false)}
                    className="w-full text-center text-[10px] text-gray-400 hover:underline pt-1 block focus:outline-none"
                  >
                    ← 로그인하고 가입 혜택 받기
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setView('login')}
                    className="w-full py-3.5 rounded-full bg-[#2E2A27] hover:opacity-90 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    로그인하고 예약하기
                  </button>
                  <button
                    onClick={() => setIsGuestBooking(true)}
                    className="w-full py-3.5 rounded-full bg-[#FFFDF9] dark:bg-[#1F1B18] border border-[#C98C63] hover:bg-[#F6EFE7]/40 text-[#C98C63] font-bold text-xs shadow-xs cursor-pointer"
                  >
                    비회원으로 무료 예약하기
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">
                    * 신규 가입 후 예약 시 2,000p 및 오픈 100% 쿠폰이 즉시 지급됩니다!
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
