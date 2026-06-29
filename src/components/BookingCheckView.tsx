import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { Calendar, Clock, Sparkles, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingCheckViewProps {
  setView: (view: string) => void;
}

export default function BookingCheckView({ setView }: BookingCheckViewProps) {
  const { bookings, currentUser, cancelBooking } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter bookings for current logged-in user
  const userBookings = bookings.filter(b => b.userId === currentUser?.uid);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-amber-100 text-amber-700">예약 검토중</span>;
      case 'approved':
        return <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-700">예약 승인완료</span>;
      case 'attended':
        return <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-blue-100 text-blue-700">체험 참석완료</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-rose-100 text-rose-700">예약 취소됨</span>;
    }
  };

  const handleCancelClick = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('정말로 이 클래스 예약을 취소하시겠습니까?\n체험일 3일 전인 경우 100% 환불됩니다.')) {
      await cancelBooking(id);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* View Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C98C63]/10 text-xs font-semibold text-[#C98C63]">
          <Calendar className="w-3.5 h-3.5" /> Dalgeurak Reservations
        </span>
        <h1 className="font-serif font-bold text-3xl text-[#2E2A27] dark:text-[#F3EFEA]">나의 예약 확인 및 모바일 패스</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          달그락 상점 공방의 체험 예약 내역과 입장에 필요한 모바일 QR 입장권을 확인하실 수 있습니다.
        </p>
      </div>

      {!currentUser ? (
        <div className="text-center py-16 bg-white dark:bg-[#27221E] rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530] max-w-md mx-auto space-y-4">
          <p className="text-sm text-gray-400">예약 내역을 확인하시려면 먼저 로그인이 필요합니다.</p>
          <button
            onClick={() => setView('login')}
            className="px-6 py-2.5 bg-[#C98C63] text-white text-xs font-semibold rounded-full hover:bg-[#A26745]"
          >
            로그인하기
          </button>
        </div>
      ) : userBookings.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#27221E] rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530] max-w-lg mx-auto space-y-4">
          <span className="text-4xl block">📅</span>
          <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">예약된 클래스가 없습니다.</h3>
          <p className="text-xs text-gray-400">나만의 소품을 만들며 힐링하는 달그락 상점 클래스를 직접 구경해보세요!</p>
          <button
            onClick={() => setView('classes')}
            className="px-6 py-3 bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-bold rounded-full"
          >
            체험 클래스 예약하러 가기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Bookings List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">나의 체험 신청 목록 ({userBookings.length}건)</h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {userBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between ${
                    selectedBooking?.id === b.id
                      ? 'bg-white dark:bg-[#2E2A27] border-[#C98C63] shadow-md ring-1 ring-[#C98C63]'
                      : 'bg-white dark:bg-[#27221E] border-[#F6EFE7] dark:border-[#3D3530] hover:border-[#C98C63]/60'
                  }`}
                >
                  {/* Photo & Specs */}
                  <div className="flex gap-4 items-center">
                    <img 
                      src={b.classImage} 
                      alt={b.className} 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(b.status)}
                        <span className="text-[10px] text-gray-400 font-mono">{b.id}</span>
                      </div>
                      <h4 className="font-serif font-bold text-[#2E2A27] dark:text-[#F3EFEA] text-sm sm:text-base">{b.className}</h4>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#C98C63]" /> {b.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#C98C63]" /> {b.time}</span>
                        <span className="font-semibold text-gray-600 dark:text-gray-300">정원 {b.headCount}명</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-zinc-800">
                    <p className="text-sm font-bold text-[#A26745] dark:text-[#D7A17E] sm:text-right w-full sm:w-auto">
                      {b.totalPrice.toLocaleString()}원
                    </p>
                    {b.status === 'pending' && (
                      <button
                        onClick={(e) => handleCancelClick(b.id, e)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all border border-rose-500/10 focus:outline-none cursor-pointer"
                        title="예약 취소"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Booking Mobile Pass (1 Col) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">모바일 입장 패스</h3>
            
            <AnimatePresence mode="wait">
              {selectedBooking ? (
                <motion.div
                  key={selectedBooking.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-3xl p-6 text-center space-y-6 shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#C98C63]">DALGEURAK MOBILE PASS</span>
                    <h4 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">{selectedBooking.className}</h4>
                    <p className="text-xs text-gray-400">예약번호: {selectedBooking.id}</p>
                  </div>

                  {/* QR Image */}
                  <div className="bg-amber-500/5 p-4 rounded-2xl inline-block border border-[#C98C63]/10">
                    <img 
                      src={selectedBooking.qrCode} 
                      alt="Booking QR Code" 
                      className="w-36 h-36 mx-auto border p-1 rounded-lg bg-white shadow-xs"
                    />
                  </div>

                  {/* QR Info details */}
                  <div className="space-y-3 text-xs text-left bg-[#FFFDF9] dark:bg-[#1F1B18] p-4 rounded-xl border border-[#F6EFE7]">
                    <div className="flex justify-between">
                      <span className="text-gray-400">수강 회원</span>
                      <span className="font-semibold text-[#2E2A27] dark:text-[#F3EFEA]">{selectedBooking.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">체험 일자</span>
                      <span className="font-bold text-gray-700 dark:text-gray-200">{selectedBooking.date} ({selectedBooking.time})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">예약 상태</span>
                      <span>{getStatusBadge(selectedBooking.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">체험 장소</span>
                      <span className="font-medium text-[#C98C63] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 달그락 상점 본점 2층 공방
                      </span>
                    </div>
                  </div>

                  {selectedBooking.status === 'pending' && (
                    <button
                      onClick={(e) => handleCancelClick(selectedBooking.id, e as any)}
                      className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs font-bold rounded-full transition-all border border-rose-100 cursor-pointer"
                    >
                      예약 및 신청 취소하기
                    </button>
                  )}
                </motion.div>
              ) : (
                <div className="bg-[#FFFDF9] dark:bg-[#27221E]/40 border border-dashed border-[#E5D5C5] dark:border-zinc-800 rounded-3xl p-10 text-center text-gray-400 space-y-3">
                  <span className="text-3xl block">🎟</span>
                  <p className="text-xs">체험 예약 목록에서 원하시는 내역을 선택하시면 실시간 모바일 QR 입장 패스를 띄워 드립니다.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}

    </div>
  );
}
