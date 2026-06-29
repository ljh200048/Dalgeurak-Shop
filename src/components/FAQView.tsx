import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAQItem } from '../types';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQView() {
  const { faqs } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const categories = ['전체', '예약', '취소', '환불', '주차', '반려동물', '아이 동반', '단체예약'];

  const filteredFaqs = faqs.filter(f => selectedCategory === '전체' || f.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C98C63]/10 text-xs font-semibold text-[#C98C63]">
          <HelpCircle className="w-3.5 h-3.5" /> Dalgeurak Support
        </span>
        <h1 className="font-serif font-bold text-3xl text-[#2E2A27] dark:text-[#F3EFEA]">자주 묻는 질문 (FAQ)</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          달그락 상점 공방의 체험 예약, 환불 규정, 주차 지원, 아이 동반 수강 및 워크숍 단체 예약에 관한 대표 FAQ입니다.
        </p>
      </div>

      {/* Category selector slider */}
      <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-none justify-start md:justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setOpenFaqId(null); // Close all active on category switch
            }}
            className={`text-xs px-4 py-2.5 rounded-full font-medium border transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#A26745] border-[#A26745] text-white font-bold shadow-xs'
                : 'bg-white dark:bg-[#27221E] border-[#E5D5C5] dark:border-[#3D3530] text-[#2E2A27]/80 dark:text-[#F3EFEA]/80 hover:border-[#C98C63]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion list */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl overflow-hidden shadow-3xs"
            >
              {/* Question Bar trigger */}
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 flex items-center justify-between text-left gap-4 hover:bg-[#FFFDF9] dark:hover:bg-[#1F1B18] transition-colors focus:outline-none cursor-pointer"
              >
                <div className="flex gap-3 items-start">
                  <span className="font-serif font-bold text-[#C98C63] text-lg select-none">Q</span>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#F6EFE7] dark:bg-[#322B27] text-[9px] font-bold text-[#A26745] dark:text-[#D7A17E] mb-1.5">
                      {faq.category}
                    </span>
                    <h3 className="font-semibold text-xs sm:text-sm text-[#2E2A27] dark:text-[#F3EFEA] leading-relaxed">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C98C63]' : ''}`} 
                />
              </button>

              {/* Collapsible Answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden bg-[#FFFDF9] dark:bg-[#1F1B18] border-t border-gray-100 dark:border-zinc-800/40"
                  >
                    <div className="p-5 flex gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                      <span className="font-serif font-bold text-amber-600 text-lg select-none">A</span>
                      <p className="pt-0.5">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>

      {/* Direct Contact Inquiries */}
      <div className="bg-[#FFFDF9] dark:bg-[#27221E] border border-[#E5D5C5] dark:border-[#3D3530] rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-3xs">
        <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">더 궁금한 점이 있으신가요?</h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          달그락 상점의 원데이 클래스, 단체 및 출강 워크숍, 소품 굿즈 구매에 관한 개별 문의사항은 카카오톡이나 인스타그램 공식 채널을 통해 1:1로 신속하고 따뜻하게 상담 받으실 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="https://open.kakao.com/o/sdZBgKBi"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FEE500] text-[#191919] text-xs font-bold hover:opacity-95 transition-all shadow-3xs cursor-pointer"
          >
            💬 카카오톡 1:1 오픈채팅 문의
          </a>
          <a
            href="https://www.instagram.com/cozy_clink_114?igsh=MWVucW1jcGFwa2J2bQ=="
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white text-xs font-bold hover:opacity-95 transition-all shadow-3xs cursor-pointer"
          >
            📸 인스타그램 공식 DM 문의
          </a>
        </div>
      </div>

    </div>
  );
}
