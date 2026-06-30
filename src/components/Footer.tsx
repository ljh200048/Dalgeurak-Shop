import React from 'react';
import { Instagram, FileText, Compass, Phone } from 'lucide-react';

interface FooterProps {
  setView: (view: string) => void;
}

export default function Footer({ setView }: FooterProps) {
  return (
    <footer className="bg-[#F6EFE7] dark:bg-[#151210] text-[#2E2A27] dark:text-[#F3EFEA]/80 border-t border-[#E5D5C5] dark:border-[#3D3530] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C98C63] flex items-center justify-center text-white font-serif font-bold text-sm">
                달
              </div>
              <span className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">
                달그락 상점
              </span>
            </div>
            <p className="text-sm font-serif italic text-[#C98C63]">
              "손으로 만드는 작은 행복"
            </p>
            <p className="text-xs sm:text-sm text-[#2E2A27]/70 dark:text-[#F3EFEA]/60 max-w-sm leading-relaxed">
              달그락 상점은 바쁜 일상에서 벗어나 따뜻한 온기가 담긴 재료를 만지고 나만의 소품을 빚어내며 기억에 남을 행복을 완성하는 감성 가득 공방 공간입니다.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3 pt-2">
              <a 
                href="https://www.instagram.com/cozy_clink_114?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FFFDF9] dark:bg-[#2E2A27] flex items-center justify-center hover:bg-[#C98C63] dark:hover:bg-[#C98C63] hover:text-white dark:hover:text-white transition-all text-[#2E2A27] dark:text-[#F3EFEA]"
                title="인스타그램 공식 채널"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://open.kakao.com/o/sdZBgKBi" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#FFFDF9] dark:bg-[#2E2A27] flex items-center justify-center hover:bg-[#C98C63] dark:hover:bg-[#C98C63] hover:text-white dark:hover:text-white transition-all text-[#2E2A27] dark:text-[#F3EFEA]"
                title="카카오톡 1:1 오픈채팅 문의"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-sm tracking-widest text-[#C98C63] uppercase">
              공방 메뉴
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => setView('classes')} className="hover:text-[#C98C63] transition-colors cursor-pointer">
                  🎨 원데이 클래스 예약
                </button>
              </li>
              <li>
                <button onClick={() => setView('goods')} className="hover:text-[#C98C63] transition-colors cursor-pointer">
                  🛍 감성 편집 굿즈샵
                </button>
              </li>
              <li>
                <button onClick={() => setView('gallery')} className="hover:text-[#C98C63] transition-colors cursor-pointer">
                  📷 수강생 갤러리 피드
                </button>
              </li>
              <li>
                <button onClick={() => setView('reviews')} className="hover:text-[#C98C63] transition-colors cursor-pointer">
                  ⭐ 따뜻한 한 줄 후기
                </button>
              </li>
              <li>
                <button onClick={() => setView('notices')} className="hover:text-[#C98C63] transition-colors cursor-pointer">
                  📢 공지 및 이벤트
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: CS Center */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-sm tracking-widest text-[#C98C63] uppercase">
              고객 서비스
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-[#2E2A27]/80 dark:text-[#F3EFEA]/70">
              <p className="font-semibold text-base text-[#2E2A27] dark:text-[#F3EFEA]">
                010-9879-3491
              </p>
              <p>화요일 - 일요일: 11:00 ~ 20:00</p>
              <p>점심시간: 12:00 ~ 13:00</p>
              <p className="text-[#C98C63] font-medium">매주 월요일 정기 휴무</p>
              <button 
                onClick={() => setView('faq')}
                className="text-xs inline-flex items-center gap-1 hover:underline text-[#A26745] dark:text-[#D7A17E]"
              >
                <FileText className="w-3.5 h-3.5" />
                자주 묻는 질문(FAQ) 바로가기
              </button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-10 border-[#E5D5C5] dark:border-[#3D3530]" />

        {/* Footer Bottom / Biz Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-[#2E2A27]/60 dark:text-[#F3EFEA]/50 gap-4 leading-relaxed">
          <div className="space-y-1">
            <p className="font-semibold text-[#2E2A27]/80 dark:text-[#F3EFEA]/70">
              (주)달그락컴퍼니 | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890
            </p>
            <p>
              서울특별시 마포구 백범로 35 (달그락빌딩 2층 공방) | 통신판매업신고: 제 2026-서울마포-1004호
            </p>
            <p>
              개인정보관리책임자: 홍길동 | 호스팅 서비스 제공자: Google Cloud Run (AI Studio Build)
            </p>
          </div>
          <div className="flex space-x-4 text-xs font-medium">
            <a href="#rules" className="hover:text-[#C98C63] transition-colors">이용약관</a>
            <a href="#privacy" className="hover:text-[#C98C63] transition-all font-bold text-[#C98C63]">개인정보처리방침</a>
          </div>
        </div>

        <div className="text-center mt-8 text-[10px] text-[#2E2A27]/40 dark:text-[#F3EFEA]/30">
          &copy; 2026 달그락 상점 (Dalgeurak Shop). All Rights Reserved. Designed with warm craft vibes.
        </div>
      </div>
    </footer>
  );
}
