import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ClassesView from './components/ClassesView';
import BookingCheckView from './components/BookingCheckView';
import GoodsShopView from './components/GoodsShopView';
import GalleryView from './components/GalleryView';
import ReviewsView from './components/ReviewsView';
import NoticeView from './components/NoticeView';
import FAQView from './components/FAQView';
import MyPageView from './components/MyPageView';
import LoginView from './components/LoginView';
import AdminDashboardView from './components/AdminDashboardView';
import ClassDetailModal from './components/ClassDetailModal';

function AppContent() {
  const { dbError, setDbError } = useApp();
  const [currentView, setView] = useState<string>('home');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchToggle, setSearchToggle] = useState<boolean>(false);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setView={setView} setSelectedClassId={setSelectedClassId} />;
      case 'classes':
        return <ClassesView setView={setView} setSelectedClassId={setSelectedClassId} />;
      case 'freetrials':
        return <ClassesView setView={setView} setSelectedClassId={setSelectedClassId} initialFilterFree={true} />;
      case 'goods':
      case 'cart':
        return <GoodsShopView setView={setView} />;
      case 'gallery':
        return <GalleryView />;
      case 'reviews':
        return <ReviewsView />;
      case 'notices':
        return <NoticeView />;
      case 'faq':
        return <FAQView />;
      case 'favorites':
      case 'mypage':
        return <MyPageView setView={setView} setSelectedClassId={setSelectedClassId} />;
      case 'login':
        return <LoginView setView={setView} initialMode="login" />;
      case 'register':
        return <LoginView setView={setView} initialMode="register" />;
      case 'admin':
        return <AdminDashboardView />;
      case 'booking-check':
        return <BookingCheckView setView={setView} />;
      case 'class-detail':
        return selectedClassId ? (
          <ClassDetailModal
            classId={selectedClassId}
            setView={setView}
            setSelectedClassId={setSelectedClassId}
          />
        ) : (
          <ClassesView setView={setView} setSelectedClassId={setSelectedClassId} />
        );
      default:
        return <HomeView setView={setView} setSelectedClassId={setSelectedClassId} />;
    }
  };

  return (
    <div className={darkMode ? 'dark min-h-screen bg-[#1F1B18]' : 'min-h-screen bg-[#FFFDF9]'}>
      <Header
        currentView={currentView}
        setView={setView}
        onSearchToggle={() => setView('classes')} // Triggers navigate to class finder
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      
      {dbError && (
        <div id="db-error-banner" className="bg-red-50 border-b border-red-200 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-red-100 text-red-800">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-red-700 truncate text-sm">
                <span>{dbError}</span>
              </p>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                onClick={() => setDbError(null)}
                className="-mr-1 flex p-2 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              >
                <span className="sr-only">닫기</span>
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-[70vh] transition-colors duration-300">
        {renderView()}
      </main>

      <Footer setView={setView} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
