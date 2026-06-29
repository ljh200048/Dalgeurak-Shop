import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
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
