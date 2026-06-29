import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Gift, 
  Heart, 
  Star, 
  Compass, 
  History, 
  Settings, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  LogOut 
} from 'lucide-react';
import { motion } from 'motion/react';

interface MyPageViewProps {
  setView: (view: string) => void;
  setSelectedClassId: (id: string | null) => void;
}

export default function MyPageView({ setView, setSelectedClassId }: MyPageViewProps) {
  const { currentUser, logout, classes, bookings, coupons, wishlist } = useApp();

  const userBookings = bookings.filter(b => b.userId === currentUser?.uid);
  const favoritedClasses = classes.filter(c => wishlist.includes(c.id));
  const userCoupons = coupons.filter(cp => currentUser?.coupons.includes(cp.id));

  const handleClassClick = (id: string) => {
    setSelectedClassId(id);
    setView('class-detail');
  };

  const handleLogout = async () => {
    await logout();
    setView('home');
  };

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-gray-400">마이페이지 정보 조회를 위해 먼저 로그인이 필요합니다.</p>
        <button
          onClick={() => setView('login')}
          className="px-6 py-2.5 bg-[#C98C63] text-white text-xs font-semibold rounded-full"
        >
          로그인하기
        </button>
      </div>
    );
  }

  // Mock points log
  const pointsLog = [
    { label: '신규 회원 가입 웰컴 축하', points: '+2,000p', date: currentUser.createdAt.split('T')[0] },
    ...userBookings.map(b => ({
      label: `[체험적립] ${b.className}`,
      points: `+${Math.floor(b.totalPrice * 0.05).toLocaleString()}p`,
      date: b.createdAt.split('T')[0]
    }))
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Profile Welcome Banner */}
      <section className="bg-gradient-to-r from-[#F6EFE7] to-[#E5D5C5] dark:from-[#322B27] dark:to-[#423933] rounded-3xl p-6 sm:p-8 border border-[#E5D5C5]/30 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[#C98C63] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {currentUser.displayName.charAt(0)}
          </div>
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="font-serif font-bold text-xl text-[#2E2A27] dark:text-[#F3EFEA]">{currentUser.displayName} 수강생님</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[9px] font-bold text-[#A26745] dark:text-[#D7A17E]">
                {currentUser.role === 'admin' ? '공방 점장' : '달그락 우수회원'}
              </span>
            </div>
            <p className="text-xs text-gray-400">{currentUser.email}</p>
          </div>
        </div>

        {/* Quick widgets */}
        <div className="grid grid-cols-2 gap-4 shrink-0 w-full md:w-auto">
          <div className="bg-white/95 dark:bg-[#1F1B18]/90 p-4 rounded-2xl text-center shadow-2xs">
            <span className="text-[10px] text-gray-400 font-semibold block">가용 적립 포인트</span>
            <span className="text-lg font-bold text-[#C98C63] block font-serif">{currentUser.points.toLocaleString()}p</span>
          </div>
          <div className="bg-white/95 dark:bg-[#1F1B18]/90 p-4 rounded-2xl text-center shadow-2xs">
            <span className="text-[10px] text-gray-400 font-semibold block">보유 혜택 쿠폰</span>
            <span className="text-lg font-bold text-[#C98C63] block font-serif">{userCoupons.length}장</span>
          </div>
        </div>

      </section>

      {/* Main Grid layout: left/center list (2 Cols) and side information (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left lists */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Active Reservations (History) */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA] flex items-center gap-2">
                <History className="w-5 h-5 text-[#C98C63]" /> 나의 공방 수강 내역
              </h3>
              <button onClick={() => setView('booking-check')} className="text-xs text-[#C98C63] hover:underline font-semibold cursor-pointer">
                모든 예약 확인
              </button>
            </div>

            {userBookings.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl text-xs text-gray-400">
                수강 내역이 존재하지 않습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {userBookings.slice(0, 3).map(b => (
                  <div key={b.id} className="p-4 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex justify-between items-center text-xs">
                    <div className="flex gap-3 items-center">
                      <img src={b.classImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200">{b.className}</h4>
                        <span className="text-[10px] text-gray-400">{b.date} • {b.time}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                      b.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      b.status === 'attended' ? 'bg-blue-100 text-blue-700' :
                      b.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {b.status === 'approved' ? '예약승인' : b.status === 'attended' ? '수강완료' : b.status === 'cancelled' ? '취소완료' : '검토중'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorited classes (Wishlist) */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA] flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> 찜해둔 원데이 클래스 ({favoritedClasses.length}개)
            </h3>

            {favoritedClasses.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl text-xs text-gray-400">
                하트를 누르신 관심 공방 클래스가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoritedClasses.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleClassClick(c.id)}
                    className="p-4 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl hover:border-[#C98C63] cursor-pointer transition-all flex gap-3 items-center"
                  >
                    <img src={c.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs truncate text-[#2E2A27] dark:text-[#F3EFEA]">{c.name}</h4>
                      <span className="text-[10px] text-gray-400 block">{c.duration} 소요</span>
                      <span className="text-[11px] font-bold text-[#A26745]">{c.price.toLocaleString()}원~</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Side panels (Coupons and Points ledger) */}
        <div className="space-y-6">
          
          {/* Available Coupons list */}
          <div className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl p-6 space-y-4 shadow-3xs">
            <h3 className="font-serif font-bold text-sm text-[#C98C63] uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-4 h-4" /> 나의 사용가능 쿠폰 ({userCoupons.length})
            </h3>
            
            {userCoupons.length === 0 ? (
              <p className="text-xs text-gray-400 italic">보유 쿠폰이 존재하지 않습니다.</p>
            ) : (
              <div className="space-y-2.5">
                {userCoupons.map(cp => (
                  <div key={cp.id} className="p-3.5 bg-gradient-to-r from-amber-500/5 to-amber-600/5 border border-dashed border-[#C98C63]/30 rounded-xl space-y-1 relative">
                    <span className="absolute top-3.5 right-3.5 text-[9px] font-bold text-[#C98C63] bg-amber-100 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                    <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300">[{cp.code}] {cp.name}</h4>
                    <p className="text-[10px] text-gray-400">{cp.description}</p>
                    <p className="text-[9px] text-gray-400 font-mono">만료일: {cp.expiryDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Points History Log */}
          <div className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl p-6 space-y-4 shadow-3xs">
            <h3 className="font-serif font-bold text-sm text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> 포인트 획득 히스토리
            </h3>
            
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {pointsLog.map((log, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div>
                    <span className="font-semibold block text-gray-700 dark:text-gray-300">{log.label}</span>
                    <span className="text-[9px] text-gray-400 font-mono">{log.date}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-500">{log.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Log out option */}
          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-full border border-rose-500/20 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold text-xs transition-colors cursor-pointer"
          >
            안전하게 로그아웃하기
          </button>

        </div>

      </div>

    </div>
  );
}
