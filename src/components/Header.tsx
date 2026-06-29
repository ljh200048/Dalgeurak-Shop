import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Sun, 
  Moon, 
  Settings 
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  onSearchToggle: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ currentView, setView, onSearchToggle, darkMode, setDarkMode }: HeaderProps) {
  const { currentUser, logout, cart } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: '홈', view: 'home' },
    { label: '체험예약', view: 'classes' },
    { label: '굿즈샵', view: 'goods' },
    { label: '갤러리', view: 'gallery' },
    { label: '후기', view: 'reviews' },
    { label: '공지사항', view: 'notices' },
    { label: 'FAQ', view: 'faq' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/90 dark:bg-[#1F1B18]/90 backdrop-blur-md border-b border-[#F6EFE7] dark:border-[#3D3530] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-[#C98C63] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm transition-transform group-hover:rotate-12">
                달
              </div>
              <div>
                <span className="font-serif font-bold text-lg sm:text-xl text-[#2E2A27] dark:text-[#F3EFEA] tracking-tight group-hover:text-[#C98C63] transition-colors">
                  달그락 상점
                </span>
                <span className="hidden sm:block text-[9px] text-[#C98C63] dark:text-[#D7A17E] font-medium tracking-widest uppercase">
                  Dalgeurak Shop
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`text-sm font-medium tracking-wide transition-colors relative py-2 cursor-pointer focus:outline-none ${
                  currentView === item.view 
                    ? 'text-[#C98C63] dark:text-[#D7A17E]' 
                    : 'text-[#2E2A27]/80 dark:text-[#F3EFEA]/80 hover:text-[#C98C63] dark:hover:text-[#D7A17E]'
                }`}
              >
                {item.label}
                {currentView === item.view && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C98C63] dark:bg-[#D7A17E] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* User Controls (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Search */}
            <button 
              onClick={onSearchToggle}
              className="p-2 rounded-full hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-[#2E2A27] dark:text-[#F3EFEA] transition-colors cursor-pointer focus:outline-none"
              title="검색"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-[#2E2A27] dark:text-[#F3EFEA] transition-colors cursor-pointer focus:outline-none"
              title={darkMode ? "라이트 모드" : "다크 모드"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <button 
              onClick={() => handleNavClick('cart')}
              className="p-2 rounded-full hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-[#2E2A27] dark:text-[#F3EFEA] transition-colors relative cursor-pointer focus:outline-none"
              title="장바구니"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-[#C98C63] dark:bg-[#D7A17E] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Dependent Controls */}
            {currentUser ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-[#F6EFE7] dark:border-[#3D3530]">
                {currentUser.role === 'admin' ? (
                  <button 
                    onClick={() => handleNavClick('admin')}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#A26745] text-white hover:bg-[#C98C63] transition-all cursor-pointer focus:outline-none"
                    title="관리자 대시보드"
                  >
                    <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                    관리자
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('mypage')}
                    className="p-2 rounded-full hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-[#2E2A27] dark:text-[#F3EFEA] transition-colors cursor-pointer focus:outline-none"
                    title="마이페이지"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}

                <button 
                  onClick={() => handleNavClick('mypage')}
                  className="text-xs font-medium text-[#2E2A27]/80 dark:text-[#F3EFEA]/80 hover:text-[#C98C63] cursor-pointer"
                >
                  <span className="font-semibold text-[#2E2A27] dark:text-[#F3EFEA]">{currentUser.displayName}</span>님
                </button>

                <button 
                  onClick={() => handleNavClick('favorites')}
                  className="p-2 rounded-full hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-[#2E2A27] dark:text-[#F3EFEA] transition-colors cursor-pointer focus:outline-none"
                  title="찜한 클래스"
                >
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-rose-500 transition-colors cursor-pointer focus:outline-none"
                  title="로그아웃"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-[#F6EFE7] dark:border-[#3D3530]">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-xs font-semibold px-4 py-2 rounded-full text-[#2E2A27] dark:text-[#F3EFEA] hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] transition-all cursor-pointer focus:outline-none"
                >
                  로그인
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="text-xs font-semibold px-4 py-2 rounded-full bg-[#C98C63] hover:bg-[#A26745] text-white transition-all shadow-sm cursor-pointer focus:outline-none"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-[#2E2A27] dark:text-[#F3EFEA] transition-colors cursor-pointer focus:outline-none"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => handleNavClick('cart')}
              className="p-2 rounded-full hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] text-[#2E2A27] dark:text-[#F3EFEA] transition-colors relative cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-[#C98C63] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#2E2A27] dark:text-[#F3EFEA] hover:bg-[#F6EFE7] dark:hover:bg-[#3D3530] focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] dark:bg-[#1F1B18] border-t border-[#F6EFE7] dark:border-[#3D3530] py-4 px-6 animate-fade-in">
          <div className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`block w-full text-left py-2 text-base font-medium border-b border-[#F6EFE7]/40 dark:border-[#3D3530]/40 ${
                  currentView === item.view ? 'text-[#C98C63]' : 'text-[#2E2A27]/80 dark:text-[#F3EFEA]/80'
                }`}
              >
                {item.label}
              </button>
            ))}

            {currentUser ? (
              <div className="pt-4 space-y-3">
                <div className="text-sm font-medium text-[#2E2A27] dark:text-[#F3EFEA]">
                  <span className="font-bold text-[#C98C63]">{currentUser.displayName}</span>님 반갑습니다.
                </div>
                
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full bg-[#A26745] text-white text-sm font-semibold shadow-sm"
                  >
                    <Settings className="w-4 h-4" />
                    관리자 대시보드
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('mypage')}
                    className="py-2 px-4 rounded-full bg-[#F6EFE7] dark:bg-[#3D3530] text-center text-sm font-semibold text-[#2E2A27] dark:text-[#F3EFEA]"
                  >
                    마이페이지
                  </button>
                  <button
                    onClick={() => handleNavClick('favorites')}
                    className="py-2 px-4 rounded-full bg-[#F6EFE7] dark:bg-[#3D3530] text-center text-sm font-semibold text-[#2E2A27] dark:text-[#F3EFEA]"
                  >
                    찜한 클래스
                  </button>
                </div>

                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-full border border-rose-500/30 text-rose-500 text-sm font-semibold mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="block w-full py-2.5 px-4 rounded-full border border-[#C98C63] text-center text-sm font-semibold text-[#C98C63]"
                >
                  로그인
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="block w-full py-2.5 px-4 rounded-full bg-[#C98C63] text-center text-sm font-semibold text-white"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
