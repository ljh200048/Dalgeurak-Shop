import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, ArrowRight, Star, ShoppingBag, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setView: (view: string) => void;
  setSelectedClassId: (id: string | null) => void;
}

export default function HomeView({ setView, setSelectedClassId }: HomeViewProps) {
  const { classes, notices } = useApp();

  const freeTrialClasses = classes.filter(c => c.isFreeTrial);
  const featuredClasses = classes.filter(c => !c.isFreeTrial && c.isFeatured).slice(0, 4);
  const heroImage = featuredClasses[0]?.imageUrl || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1600";

  const handleClassClick = (id: string) => {
    setSelectedClassId(id);
    setView('class-detail');
  };

  const promoBanner = notices.find(n => n.category === '이벤트') || notices[0];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with warm overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
          style={{ 
            backgroundImage: `url("${heroImage}")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent dark:from-black/80 dark:via-black/60 dark:to-transparent" />
        
        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 max-w-xl"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C98C63]/90 text-xs font-semibold tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Handcrafted Workshops
            </span>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight">
              손끝에서 시작되는<br />특별한 하루
            </h1>
            <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed max-w-md">
              따뜻한 조명이 감도는 아늑한 공방, 달그락 상점에서 자연을 닮은 재료를 매치하고 세상에 단 하나뿐인 소품을 직접 만들며 마음의 조각을 채워가세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <button
              onClick={() => setView('classes')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#C98C63] hover:bg-[#A26745] text-white text-sm font-semibold shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              체험 예약하기
            </button>
            <button
              onClick={() => setView('goods')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              오늘의 클래스 / 굿즈 보기
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Welcome Slogan Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="font-serif text-[#C98C63] font-medium tracking-widest text-xs uppercase block">
          DALGEURAK WORKSHOP & BOUTIQUE
        </span>
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2E2A27] dark:text-[#F3EFEA] tracking-tight">
          직접 만들고, 기억을 담아가는 공방.
        </h2>
        <div className="w-12 h-1 bg-[#C98C63] mx-auto rounded-full" />
        <p className="text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          달그락 상점은 누구나 수공예의 기쁨을 배우고 누릴 수 있도록 세심히 고안된 도구와 최고급 천연 재료, 친절한 1대1 코칭 서비스를 제공합니다. 비즈, 아로마 캔들, 플라워 디퓨저, 자수 에코백까지 나만의 다정한 감성을 달그락 조립해 보세요.
        </p>
      </section>

      {/* 2.5. Free Trial Section */}
      {freeTrialClasses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-[#FFFDF9] dark:bg-[#2A2420] border-2 border-dashed border-[#C98C63]/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
            <div className="absolute right-[-5%] top-[-5%] w-60 h-60 bg-[#C98C63]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center space-y-2 max-w-xl mx-auto relative z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C98C63] text-white text-[10px] font-bold tracking-widest uppercase animate-pulse">
                ★ 100% 무료 체험 특별 프로그램
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E2A27] dark:text-[#F3EFEA] tracking-tight">
                달그락 웰컴 무료 체험 클래스
              </h2>
              <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 leading-relaxed">
                달그락 상점의 따뜻한 감성을 부담 없이 맛보실 수 있도록 제공되는 무료 이벤트 세션입니다. <br className="hidden sm:inline" />
                <b>회원 로그인 시 계정당 일평생 단 1회</b>만 무료 예약 혜택을 제공받으실 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {freeTrialClasses.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleClassClick(item.id)}
                  className="group cursor-pointer bg-white dark:bg-[#1F1B18] rounded-2xl overflow-hidden border border-[#C98C63]/30 hover:border-[#C98C63] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-16/10 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#C98C63] text-white text-[10px] font-bold tracking-wide shadow-sm flex items-center gap-1 animate-pulse">
                        ★ 무료 체험
                      </span>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium tracking-wide">
                        {item.duration} 소요
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {item.categories.slice(0, 3).map(cat => (
                          <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded bg-[#C98C63]/10 text-[#C98C63] font-bold">
                            #{cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-serif font-bold text-[#2E2A27] dark:text-[#F3EFEA] text-base group-hover:text-[#C98C63] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#2E2A27]/60 dark:text-[#F3EFEA]/60 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-[#F6EFE7]/60 dark:border-[#3D3530]/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[#2E2A27] dark:text-[#F3EFEA]">{item.rating}</span>
                        <span className="text-gray-400">({item.reviewCount})</span>
                      </div>
                      <span className="font-extrabold text-[#C98C63] dark:text-[#E8AF8A]">0원 (무료 수강)</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Event / Announcement Banner */}
      {promoBanner && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => setView('notices')}
            className="cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-[#F6EFE7] to-[#E5D5C5] dark:from-[#322B27] dark:to-[#423933] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between border border-[#E5D5C5]/30 dark:border-[#52473E]/30 relative group shadow-sm hover:shadow-md transition-all"
          >
            <div className="absolute right-[-40px] top-[-20px] w-48 h-48 bg-[#C98C63]/5 rounded-full blur-2xl group-hover:bg-[#C98C63]/10 transition-all pointer-events-none" />
            <div className="space-y-2 max-w-xl">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C98C63] text-white text-[10px] font-bold tracking-widest uppercase animate-pulse">
                EVENT
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2E2A27] dark:text-[#F3EFEA]">
                친구와 함께 예약 시 10% 추가 힐링 할인!
              </h3>
              <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 leading-relaxed line-clamp-1">
                {promoBanner.title} - 지금 공지사항에서 이번 달 진행되는 스페셜 가입 쿠폰 및 클래스 할인을 확인해보세요.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-1.5 text-xs font-semibold text-[#A26745] dark:text-[#D7A17E] group-hover:translate-x-1 transition-transform">
              이달의 소식 더 보기 <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        </section>
      )}

      {/* 5. Popular Classes (Featured) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-serif font-semibold text-[#C98C63] tracking-wider uppercase block">
              RECOMMENDED CLASSES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E2A27] dark:text-[#F3EFEA]">
              달그락 인기 체험 클래스
            </h2>
          </div>
          <button 
            onClick={() => setView('classes')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C98C63] hover:text-[#A26745] group cursor-pointer focus:outline-none"
          >
            전체 원데이 클래스 보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Classes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredClasses.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleClassClick(item.id)}
              className="group cursor-pointer bg-white dark:bg-[#27221E] rounded-xl overflow-hidden border border-[#F6EFE7] dark:border-[#3D3530] shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Image box */}
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/95 dark:bg-[#1F1B18]/95 backdrop-blur-xs text-[10px] font-bold text-[#C98C63] shadow-xs">
                  {item.level} 난이도
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium tracking-wide">
                  {item.duration}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.categories.slice(0, 2).map(cat => (
                      <span key={cat} className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#F6EFE7] dark:bg-[#3D3530] text-[#C98C63] dark:text-[#D7A17E] font-semibold">
                        #{cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-serif font-bold text-[#2E2A27] dark:text-[#F3EFEA] text-base group-hover:text-[#C98C63] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#2E2A27]/60 dark:text-[#F3EFEA]/60 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F6EFE7]/60 dark:border-[#3D3530]/40">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-[#2E2A27] dark:text-[#F3EFEA]">{item.rating}</span>
                    <span className="text-[10px] text-gray-400">({item.reviewCount})</span>
                  </div>
                  <p className="text-sm font-bold text-[#A26745] dark:text-[#D7A17E]">
                    {item.price === 0 ? '무료 이벤트' : `${item.price.toLocaleString()}원~`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Quick Mini Services Grid (Muji concept cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-amber-500/5 border border-[#C98C63]/10 dark:border-amber-500/10 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#C98C63]/20 flex items-center justify-center text-[#C98C63]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">
              감성 공방 에디션 소품
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 leading-relaxed">
              달그락 강사들과 수강생들이 직접 선별한 부품 및 엽서, 소이 캔들을 편집샵 굿즈샵에서 정성 어린 가격에 바로 만나볼 수 있습니다.
            </p>
            <button onClick={() => setView('goods')} className="text-xs font-bold text-[#C98C63] hover:underline flex items-center gap-1 pt-1">
              에디션 굿즈샵 구경 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">
              공유하는 수공예 일상
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 leading-relaxed">
              다른 수강생들이 달그락 공방에서 남기고 간 아크릴 키링, 소이 캔들 등의 완성 갤러리를 구경하고 서로 하트를 주고받으며 즐겨보세요.
            </p>
            <button onClick={() => setView('gallery')} className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1 pt-1">
              커뮤니티 갤러리 피드 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">
              1:1 단체 예약 & 워크숍
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 leading-relaxed">
              회사 동아리, 학교 체험, 커플 데이트 스페셜 세션 등 단체 맞춤 대관 및 예약을 받고 있습니다. 혜택 쿠폰을 발행받아 부담 없이 시작하세요.
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
              <button onClick={() => setView('faq')} className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1">
                FAQ 문의 <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-gray-300 dark:text-zinc-700 hidden sm:inline">|</span>
              <a 
                href="https://open.kakao.com/o/sdZBgKBi" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-[#A26745] dark:text-[#D7A17E] hover:underline flex items-center gap-1"
              >
                카카오톡 문의 <ArrowRight className="w-3 h-3" />
              </a>
              <span className="text-gray-300 dark:text-zinc-700 hidden sm:inline">|</span>
              <a 
                href="https://www.instagram.com/cozy_clink_114?igsh=MWVucW1jcGFwa2J2bQ==" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1"
              >
                인스타 구경 <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
