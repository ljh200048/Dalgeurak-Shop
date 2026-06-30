import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { WorkshopClass, Booking, Notice, Review, ProductItem } from '../types';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  FileText,
  Sparkles,
  AlertCircle,
  Clock,
  Send,
  RefreshCw,
  Download,
  Upload,
  Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboardView() {
  const { 
    classes, 
    products,
    bookings, 
    reviews, 
    notices, 
    adminAddClass, 
    adminUpdateClass, 
    adminDeleteClass, 
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminApproveBooking, 
    adminAttendBooking, 
    adminCancelBooking, 
    adminAddNotice, 
    adminDeleteNotice, 
    adminDeleteReview,
    recreateAllClasses,
    telegramConfig,
    updateTelegramConfig,
    autoApproveBookings,
    setAutoApproveBookings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'classes' | 'products' | 'bookings' | 'notices' | 'reviews' | 'telegram'>('stats');

  // Telegram Integration local states
  const [telegramBotToken, setTelegramBotToken] = useState(telegramConfig.botToken || '');
  const [telegramChatId, setTelegramChatId] = useState(telegramConfig.chatId || '');
  const [telegramEnabled, setTelegramEnabled] = useState(telegramConfig.isEnabled || false);
  const [testSending, setTestSending] = useState(false);

  // Sync state if context config updates
  React.useEffect(() => {
    setTelegramBotToken(telegramConfig.botToken);
    setTelegramChatId(telegramConfig.chatId);
    setTelegramEnabled(telegramConfig.isEnabled);
  }, [telegramConfig]);

  // Dialog / Edit states
  const [classFormOpen, setClassFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<WorkshopClass | null>(null);
  const [isRecreating, setIsRecreating] = useState(false);
  
  // New Class state
  const [className, setClassName] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [classLevel, setClassLevel] = useState<'입문' | '초급' | '중급' | '고급'>('입문');
  const [classPrice, setClassPrice] = useState(20000);
  const [classDuration, setClassDuration] = useState('1시간 30분');
  const [classMaxPeople, setClassMaxPeople] = useState(6);
  const [classImageUrl, setClassImageUrl] = useState('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600');
  const [classIsFreeTrial, setClassIsFreeTrial] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('file');
  const [isDragOver, setIsDragOver] = useState(false);
  const imageFileInputRef = React.useRef<HTMLInputElement>(null);

  // New Product states
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(15000);
  const [productCategory, setProductCategory] = useState<ProductItem['category']>('키링');
  const [productDesc, setProductDesc] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600');
  const [productStock, setProductStock] = useState(10);
  const [productIsFeatured, setProductIsFeatured] = useState(false);
  const [isProductDragOver, setIsProductDragOver] = useState(false);
  const productImageFileInputRef = React.useRef<HTMLInputElement>(null);

  const processImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 900;
        let { width, height } = img;
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        setClassImageUrl(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const processProductImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 900;
        let { width, height } = img;
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX; }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        setProductImageUrl(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleProductImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsProductDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processProductImageFile(file);
  };

  // New Notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'공지' | '이벤트' | '클래스'>('공지');

  // Computed Statistics
  const stats = useMemo(() => {
    const totalBookingsCount = bookings.length;
    const activeBookings = bookings.filter(b => b.status === 'approved' || b.status === 'pending');
    const attendedBookings = bookings.filter(b => b.status === 'attended');
    
    const totalSales = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    // Group bookings count by class
    const popularClassesMap: { [name: string]: number } = {};
    bookings.forEach(b => {
      popularClassesMap[b.className] = (popularClassesMap[b.className] || 0) + 1;
    });

    const popularClassesSorted = Object.entries(popularClassesMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalBookingsCount,
      activeCount: activeBookings.length,
      attendedCount: attendedBookings.length,
      totalSales,
      popularClassesSorted
    };
  }, [bookings]);

  // Handle Class Create or Update
  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !classDesc.trim()) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    const classPayload = {
      name: className,
      description: classDesc,
      categories: classIsFreeTrial ? ['커스텀', '무료', '체험'] : ['커스텀', '아트'],
      level: classLevel,
      duration: classDuration,
      maxPeople: classMaxPeople,
      price: classIsFreeTrial ? 0 : classPrice,
      isFreeTrial: classIsFreeTrial,
      imageUrl: classImageUrl,
      intro: classDesc,
      materials: ['기본 공방 자재 세트'],
      provided: ['음료 서비스'],
      completedItem: '나만의 오리지널 완성작 1종',
      precautions: ['공구 오사용에 의한 상해에 주의하세요.'],
      refundPolicy: classIsFreeTrial ? '무료 체험 프로그램으로 취소 위약금이 없습니다.' : '체험 3일 전 100% 환불'
    };

    try {
      if (editingClass) {
        await adminUpdateClass(editingClass.id, classPayload);
        alert('클래스 정보가 성공적으로 변경되었습니다.');
      } else {
        await adminAddClass(classPayload);
        alert('신규 클래스가 성공적으로 출시되었습니다.');
      }
      
      // Reset Form
      setClassFormOpen(false);
      setEditingClass(null);
      setClassName('');
      setClassDesc('');
      setPriceAndMetaDefaults();
    } catch {
      alert('작업 처리 중 오류가 발생했습니다.');
    }
  };

  const setPriceAndMetaDefaults = () => {
    setClassPrice(20000);
    setClassDuration('1시간 30분');
    setClassMaxPeople(6);
    setClassIsFreeTrial(false);
  };

  const handleEditClassClick = (cls: WorkshopClass) => {
    setEditingClass(cls);
    setClassName(cls.name);
    setClassDesc(cls.description);
    setClassLevel(cls.level);
    setClassPrice(cls.price);
    setClassDuration(cls.duration);
    setClassMaxPeople(cls.maxPeople);
    setClassImageUrl(cls.imageUrl);
    setClassIsFreeTrial(cls.isFreeTrial || false);
    setImageInputMode(cls.imageUrl.startsWith('data:') ? 'file' : 'url');
    setClassFormOpen(true);
  };

  const handleDeleteClassClick = async (id: string) => {
    if (confirm('이 원데이 클래스를 상점에서 전면 영구 삭제하시겠습니까?')) {
      await adminDeleteClass(id);
    }
  };

  // Handle Product Create or Update
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDesc.trim()) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    const productPayload = {
      name: productName,
      price: productPrice,
      imageUrl: productImageUrl,
      description: productDesc,
      category: productCategory,
      stock: productStock,
      isFeatured: productIsFeatured
    };

    try {
      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, productPayload);
        alert('상품 정보가 성공적으로 변경되었습니다.');
      } else {
        await adminAddProduct(productPayload);
        alert('신규 상품이 성공적으로 등록되었습니다.');
      }
      
      // Reset Form
      setProductFormOpen(false);
      setEditingProduct(null);
      setProductName('');
      setProductDesc('');
      setProductPrice(15000);
      setProductCategory('키링');
      setProductImageUrl('https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600');
      setProductStock(10);
      setProductIsFeatured(false);
    } catch {
      alert('작업 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEditProductClick = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProductName(prod.name);
    setProductDesc(prod.description);
    setProductPrice(prod.price);
    setProductCategory(prod.category);
    setProductImageUrl(prod.imageUrl);
    setProductStock(prod.stock);
    setProductIsFeatured(prod.isFeatured || false);
    setProductFormOpen(true);
  };

  const handleDeleteProductClick = async (id: string) => {
    if (confirm('이 굿즈 상품을 완전히 삭제하시겠습니까?')) {
      await adminDeleteProduct(id);
    }
  };

  const handleRecreateAll = async () => {
    if (confirm('모든 클래스를 공방 초기 상태 데이터(10종 및 무료체험 3종)로 완전히 복원하고, 다른 커스텀 등록 클래스는 삭제하시겠습니까?')) {
      setIsRecreating(true);
      try {
        await recreateAllClasses();
        alert('모든 클래스가 성공적으로 공방 기본 원데이 클래스로 복원 완료되었습니다!');
      } catch (e) {
        alert('복원 처리 중 오류가 발생했습니다.');
      } finally {
        setIsRecreating(false);
      }
    }
  };

  const handleExportXML = () => {
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<classes-catalog>\n`;
    xmlContent += `  <shop>\n`;
    xmlContent += `    <name>달그락 상점</name>\n`;
    xmlContent += `    <description>손으로 만드는 작은 행복, 감성 공방 예약 플랫폼 및 에디션 편집숍</description>\n`;
    xmlContent += `    <homepage>https://ais-pre-pvsqmwdg5spjv3c3yeazr3-554240967075.asia-northeast1.run.app/</homepage>\n`;
    xmlContent += `  </shop>\n\n`;

    classes.forEach(c => {
      xmlContent += `  <class>\n`;
      xmlContent += `    <id>${c.id}</id>\n`;
      xmlContent += `    <name>${c.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</name>\n`;
      xmlContent += `    <isFreeTrial>${!!c.isFreeTrial}</isFreeTrial>\n`;
      xmlContent += `    <price>${c.price}</price>\n`;
      xmlContent += `    <level>${c.level}</level>\n`;
      xmlContent += `    <duration>${c.duration}</duration>\n`;
      xmlContent += `    <maxPeople>${c.maxPeople}</maxPeople>\n`;
      xmlContent += `    <imageUrl>${c.imageUrl.replace(/&/g, '&amp;')}</imageUrl>\n`;
      xmlContent += `    <rating>${c.rating || 0}</rating>\n`;
      xmlContent += `    <reviewCount>${c.reviewCount || 0}</reviewCount>\n`;
      xmlContent += `    <categories>\n`;
      c.categories.forEach(cat => {
        xmlContent += `      <category>${cat}</category>\n`;
      });
      xmlContent += `    </categories>\n`;
      const cleanIntro = (c.description || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      xmlContent += `    <intro>${cleanIntro}</intro>\n`;
      xmlContent += `  </class>\n`;
    });
    xmlContent += `</classes-catalog>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dalgurak_classes_${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Notice Posting
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      alert('제목과 내용을 모두 작성해주세요.');
      return;
    }

    try {
      await adminAddNotice({
        title: noticeTitle,
        content: noticeContent,
        category: noticeCategory,
        author: '점장'
      });
      setNoticeTitle('');
      setNoticeContent('');
      alert('공지사항이 정상 게시되었습니다.');
    } catch {
      alert('공지 게시 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A26745]/10 text-[#A26745] text-xs font-semibold uppercase">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Dalgeurak Command Center
        </span>
        <h1 className="font-serif font-bold text-3xl text-[#2E2A27] dark:text-[#F3EFEA]">공방 통합 관리자 페이지</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          달그락 상점의 실시간 매출, 수강생 예약 상태를 한눈에 파악하고 클래스 및 공지사항을 편리하게 관리하세요.
        </p>
      </div>

      {/* Tabs navigation bar */}
      <div className="border-b border-[#F6EFE7] dark:border-[#3D3530] flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
        {[
          { id: 'stats', label: '📊 종합 분석 대시보드' },
          { id: 'classes', label: '🎨 클래스 상품 관리' },
          { id: 'products', label: '🛍 굿즈 상품 관리' },
          { id: 'bookings', label: '📅 수강 예약 승인/출석' },
          { id: 'notices', label: '📢 공지 & 배너 작성' },
          { id: 'reviews', label: '⭐ 수강 후기 모니터링' },
          { id: 'telegram', label: '✈️ 텔레그램 알림 연동' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs sm:text-sm px-4 py-3 font-semibold transition-all border-b-2 cursor-pointer focus:outline-none whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#C98C63] text-[#C98C63]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels content */}
      <div className="min-h-[50vh]">
        
        {/* TAB 1: stats (종합 분석) */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* KPI cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">공방 총 매출액</span>
                  <span className="text-2xl font-bold font-serif text-[#A26745] dark:text-[#D7A17E]">
                    {stats.totalSales.toLocaleString()}원
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-[#C98C63] flex items-center justify-center font-bold">
                  ₩
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">누적 체험 예약건수</span>
                  <span className="text-2xl font-bold font-serif text-[#2E2A27] dark:text-[#F3EFEA]">
                    {stats.totalBookingsCount}건
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">출석 검증 완료</span>
                  <span className="text-2xl font-bold font-serif text-emerald-500">
                    {stats.attendedCount}건
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block">활성 예약수 (검토/승인)</span>
                  <span className="text-2xl font-bold font-serif text-[#C98C63]">
                    {stats.activeCount}건
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 text-[#C98C63] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

            </div>

            {/* Popular classes Chart widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] p-6 rounded-2xl space-y-6">
                <h3 className="font-serif font-bold text-base text-[#2E2A27] dark:text-[#F3EFEA]">
                  🏆 체험 클래스 별 누적 인기 점유도 (예약수 기준)
                </h3>

                {stats.popularClassesSorted.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-10 text-center">예약 통계 정보가 축적되지 않았습니다.</p>
                ) : (
                  <div className="space-y-4">
                    {stats.popularClassesSorted.map((item, idx) => {
                      const maxCount = Math.max(...stats.popularClassesSorted.map(c => c.count));
                      const percentWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                      return (
                        <div key={idx} className="space-y-1.5 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span>{item.name}</span>
                            <span className="text-[#C98C63]">{item.count}건 예약</span>
                          </div>
                          <div className="h-3 bg-gray-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#C98C63] to-[#A26745] h-full rounded-full"
                              style={{ width: `${percentWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Notice panel summary */}
              <div className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] p-6 rounded-2xl space-y-4">
                <h3 className="font-serif font-bold text-base text-[#2E2A27] dark:text-[#F3EFEA]">
                  📢 점장님 긴급 조치 가이드
                </h3>
                <div className="text-xs text-gray-500 space-y-3 leading-relaxed">
                  <p>
                    • <b>신규 예약 승인:</b> 수강생이 실시간 예약을 하면 <span className="text-[#C98C63] font-bold">수강 예약 관리</span> 탭에서 입금을 확인한 후 승인 처리를 하십시오.
                  </p>
                  <p>
                    • <b>출석 및 체크인:</b> QR 입장권을 소지한 회원이 도착하면 "체험 완료" 상태로 조치하여 적립 포인트를 안전히 최종 정산시켜주세요.
                  </p>
                  <p>
                    • <b>신규 클래스 출시:</b> 시즌 특강 및 재료 단가 변동이 있는 경우 수공예 체험 상품 탭에서 CRUD 기능을 즉각 조치하십시오.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: classes (클래스 관리) */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="font-serif font-bold text-base text-[#2E2A27]">공방 운영 클래스 목록 ({classes.length}종)</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportXML}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full cursor-pointer focus:outline-none border border-blue-500/20"
                >
                  <Download className="w-3.5 h-3.5" /> XML 내보내기
                </button>
                <button
                  type="button"
                  onClick={handleRecreateAll}
                  disabled={isRecreating}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-[#A26745] text-xs font-bold rounded-full cursor-pointer focus:outline-none border border-amber-500/20 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRecreating ? 'animate-spin' : ''}`} /> 
                  {isRecreating ? '복원 중...' : '기본 클래스 전체 복원'}
                </button>
                <button
                  onClick={() => { setEditingClass(null); setPriceAndMetaDefaults(); setClassFormOpen(true); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#C98C63] text-white text-xs font-bold rounded-full cursor-pointer focus:outline-none"
                >
                  <Plus className="w-3.5 h-3.5" /> 신규 클래스 개설 출시
                </button>
              </div>
            </div>

            {/* Class Form dialog */}
            {classFormOpen && (
              <form onSubmit={handleClassSubmit} className="bg-white dark:bg-[#2E2A27] border border-[#C98C63]/40 p-6 rounded-2xl space-y-4 shadow-sm max-w-2xl">
                <h4 className="font-serif font-bold text-sm text-[#C98C63]">
                  {editingClass ? '🎨 클래스 세부 내역 변경' : '🎨 신규 런칭 클래스 명세 작성'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">클래스 이름</label>
                    <input 
                      type="text" 
                      required
                      placeholder="예시: 감성 자수 파우치 메이킹" 
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">구분 (무료/유료)</label>
                    <select
                      value={classIsFreeTrial ? 'free' : 'paid'}
                      onChange={(e) => {
                        const isFree = e.target.value === 'free';
                        setClassIsFreeTrial(isFree);
                        if (isFree) {
                          setClassPrice(0);
                        } else if (classPrice === 0) {
                          setClassPrice(20000);
                        }
                      }}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18] font-bold text-[#C98C63]"
                    >
                      <option value="paid">유료 원데이 클래스</option>
                      <option value="free">★ 무료 체험 클래스</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">수강 요금 (원)</label>
                    <input 
                      type="number" 
                      required
                      disabled={classIsFreeTrial}
                      placeholder="수강 금액을 입력해주세요"
                      value={classIsFreeTrial ? 0 : classPrice}
                      onChange={(e) => setClassPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18] disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-zinc-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">체험 난이도</label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value as any)}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                    >
                      <option value="입문">입문</option>
                      <option value="초급">초급</option>
                      <option value="중급">중급</option>
                      <option value="고급">고급</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">최대 정원 (명)</label>
                    <input 
                      type="number" 
                      value={classMaxPeople}
                      onChange={(e) => setClassMaxPeople(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-gray-400">클래스 대표 이미지 URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="이미지 주소를 입력하세요 (예: https://images.unsplash.com/...)" 
                      value={classImageUrl}
                      onChange={(e) => setClassImageUrl(e.target.value)}
                      className="flex-1 p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                    />
                    {classImageUrl && (
                      <img 
                        src={classImageUrl} 
                        alt="미리보기" 
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600';
                        }}
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Unsplash 등 무료 이미지 주소를 넣으시면 클래스 카드 디자인에 반영됩니다.
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-gray-400">클래스 상세 소개</label>
                  <textarea
                    rows={3}
                    placeholder="수강생들에게 보여줄 자세한 작품 가공과정과 공방 매력을 기입해주세요..."
                    value={classDesc}
                    onChange={(e) => setClassDesc(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                  />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-gray-400 block">클래스 대표 이미지</label>

                  {/* Toggle: file vs URL */}
                  <div className="flex gap-1.5 bg-gray-100 dark:bg-[#1F1B18] p-1 rounded-lg w-fit">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('file')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        imageInputMode === 'file'
                          ? 'bg-white dark:bg-[#2E2A27] text-[#C98C63] shadow-xs'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Upload className="w-3 h-3" /> 파일 업로드
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        imageInputMode === 'url'
                          ? 'bg-white dark:bg-[#2E2A27] text-[#C98C63] shadow-xs'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Link className="w-3 h-3" /> URL 직접 입력
                    </button>
                  </div>

                  {imageInputMode === 'file' ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleImageDrop}
                      onClick={() => imageFileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-2 w-full py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all select-none
                        ${isDragOver
                          ? 'border-[#C98C63] bg-[#C98C63]/10 scale-[1.01]'
                          : 'border-[#C98C63]/40 bg-[#FFFDF9] dark:bg-[#1F1B18] hover:border-[#C98C63] hover:bg-[#C98C63]/5'
                        }`}
                    >
                      <input
                        ref={imageFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <Upload className={`w-6 h-6 transition-colors ${isDragOver ? 'text-[#C98C63]' : 'text-[#C98C63]/60'}`} />
                      <p className="text-[11px] font-bold text-[#C98C63]">
                        {isDragOver ? '여기에 놓으세요!' : '이미지를 드래그하거나 클릭해서 선택'}
                      </p>
                      <p className="text-[10px] text-gray-400">JPG, PNG, WEBP 등 이미지 파일</p>
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={classImageUrl}
                      onChange={(e) => setClassImageUrl(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18] font-mono text-[11px]"
                    />
                  )}

                  {/* Preview */}
                  {classImageUrl && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#E5D5C5] dark:border-[#52473E]">
                      <img
                        src={classImageUrl}
                        alt="미리보기"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 text-white text-[9px] rounded-full">미리보기</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="px-5 py-2 rounded-full bg-[#C98C63] text-white text-xs font-bold cursor-pointer">
                    {editingClass ? '변경사항 반영' : '상점 신규 출시하기'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setClassFormOpen(false); setEditingClass(null); }}
                    className="px-5 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}

            {/* Classes Grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((c) => (
                <div key={c.id} className="p-4 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex gap-3 items-center min-w-0">
                    <img src={c.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#C98C63] font-bold">
                        {c.level} • {c.duration} {c.isFreeTrial && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-[#C98C63]/15 text-[#C98C63] text-[9px] font-extrabold animate-pulse">★ 무료 체험</span>}
                      </span>
                      <h4 className="font-bold text-[#2E2A27] dark:text-[#F3EFEA] truncate">{c.name}</h4>
                      <span className="font-semibold text-gray-500 block">
                        {c.isFreeTrial ? '0원 (무료 체험)' : `${c.price.toLocaleString()}원`}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEditClassClick(c)}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-100 cursor-pointer"
                      title="클래스 수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClassClick(c.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-100 cursor-pointer"
                      title="클래스 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB: products (굿즈 상품 관리) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="font-serif font-bold text-base text-[#2E2A27]">공방 굿즈 상품 목록 ({products.length}종)</h3>
              <button
                onClick={() => { 
                  setEditingProduct(null); 
                  setProductName('');
                  setProductDesc('');
                  setProductPrice(15000);
                  setProductCategory('키링');
                  setProductImageUrl('https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600');
                  setProductStock(10);
                  setProductIsFeatured(false);
                  setProductFormOpen(true); 
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#C98C63] text-white text-xs font-bold rounded-full cursor-pointer focus:outline-none"
              >
                <Plus className="w-3.5 h-3.5" /> 신규 굿즈 상품 등록
              </button>
            </div>

            {/* Product Form dialog */}
            {productFormOpen && (
              <form onSubmit={handleProductSubmit} className="bg-white dark:bg-[#2E2A27] border border-[#C98C63]/40 p-6 rounded-2xl space-y-4 shadow-sm max-w-2xl">
                <h4 className="font-serif font-bold text-sm text-[#C98C63]">
                  {editingProduct ? '🛍 굿즈 상품 정보 변경' : '🛍 신규 굿즈 상품 등록'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">상품 이름</label>
                    <input 
                      type="text" 
                      required
                      placeholder="예시: 감성 도자기 수제 머그컵" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">카테고리 구분</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value as any)}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18] font-bold text-[#C98C63]"
                    >
                      <option value="키링">키링</option>
                      <option value="스티커">스티커</option>
                      <option value="캔들">캔들</option>
                      <option value="디퓨저">디퓨저</option>
                      <option value="에코백">에코백</option>
                      <option value="엽서">엽서</option>
                      <option value="머그컵">머그컵</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">판매 금액 (원)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="판매 금액을 입력해주세요"
                      value={productPrice}
                      onChange={(e) => setProductPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">재고 수량 (개)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="재고를 입력해주세요"
                      value={productStock}
                      onChange={(e) => setProductStock(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="font-bold text-gray-400 block">굿즈 대표 이미지</label>

                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsProductDragOver(true); }}
                    onDragEnter={(e) => { e.preventDefault(); setIsProductDragOver(true); }}
                    onDragLeave={() => setIsProductDragOver(false)}
                    onDrop={handleProductImageDrop}
                    onClick={() => productImageFileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 w-full py-5 border-2 border-dashed rounded-xl cursor-pointer transition-all select-none
                      ${isProductDragOver
                        ? 'border-[#C98C63] bg-[#C98C63]/10 scale-[1.01]'
                        : 'border-[#C98C63]/40 bg-[#FFFDF9] dark:bg-[#1F1B18] hover:border-[#C98C63] hover:bg-[#C98C63]/5'
                      }`}
                  >
                    <input
                      ref={productImageFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) processProductImageFile(f); }}
                    />
                    <Upload className={`w-5 h-5 transition-colors ${isProductDragOver ? 'text-[#C98C63]' : 'text-[#C98C63]/60'}`} />
                    <p className="text-[11px] font-bold text-[#C98C63]">
                      {isProductDragOver ? '여기에 놓으세요!' : '이미지를 드래그하거나 클릭해서 선택'}
                    </p>
                    <p className="text-[10px] text-gray-400">JPG, PNG, WEBP 등 이미지 파일</p>
                  </div>

                  {/* URL 직접 입력 */}
                  <input
                    type="text"
                    placeholder="또는 이미지 URL 직접 입력 (https://...)"
                    value={productImageUrl}
                    onChange={(e) => setProductImageUrl(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18] font-mono text-[11px]"
                  />

                  {/* Preview */}
                  {productImageUrl && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#E5D5C5] dark:border-[#52473E]">
                      <img
                        src={productImageUrl}
                        alt="미리보기"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=600';
                        }}
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/50 text-white text-[9px] rounded-full">미리보기</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <input 
                    type="checkbox" 
                    id="productIsFeatured" 
                    checked={productIsFeatured}
                    onChange={(e) => setProductIsFeatured(e.target.checked)}
                    className="rounded border-[#C98C63] text-[#C98C63] focus:ring-[#C98C63]"
                  />
                  <label htmlFor="productIsFeatured" className="font-bold text-gray-600 dark:text-gray-300 cursor-pointer">이 상품을 추천 굿즈로 등록하기</label>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-gray-400">상품 상세 설명</label>
                  <textarea 
                    rows={2}
                    placeholder="소비자들에게 다가갈 세부 수공예 특징을 적어주세요..."
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-[#FFFDF9] dark:bg-[#1F1B18]"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="px-5 py-2 rounded-full bg-[#C98C63] text-white text-xs font-bold cursor-pointer">
                    {editingProduct ? '변경사항 반영' : '굿즈숍 출시 등록'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setProductFormOpen(false); setEditingProduct(null); }}
                    className="px-5 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}

            {/* Products Grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex gap-3 items-center min-w-0">
                    <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-serif font-bold text-gray-900 dark:text-gray-100 truncate text-sm">{p.name}</span>
                        <span className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-[#A26745] font-semibold rounded text-[10px] shrink-0">
                          {p.category}
                        </span>
                        {p.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-500 font-semibold rounded text-[10px] shrink-0">
                            추천
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>
                      <div className="flex gap-3 text-[10px] text-gray-500 mt-1">
                        <span>단가: <b className="text-gray-700 dark:text-gray-300">{p.price.toLocaleString()}원</b></span>
                        <span>재고: <b className={p.stock === 0 ? "text-rose-500 font-bold" : "text-gray-700 dark:text-gray-300"}>{p.stock}개</b></span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEditProductClick(p)}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-100 cursor-pointer"
                      title="상품 수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProductClick(p.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-100 cursor-pointer"
                      title="상품 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: bookings (수강 예약 관리) */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2E2A27]">실시간 체험 예약 신청 장부 ({bookings.length}건)</h3>

            {/* Auto Approval Control */}
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-[#F6EFE7] dark:border-amber-900/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${autoApproveBookings ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${autoApproveBookings ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </span>
                  <p className="font-bold text-[#2E2A27] dark:text-[#FFFDF9] flex items-center gap-1">
                    실시간 예약 초고속 자동 승인 시스템
                    <span className="text-[10px] bg-amber-100 text-[#A26745] px-1.5 py-0.5 rounded-sm font-semibold">⚡ FAST PASS</span>
                  </p>
                </div>
                <p className="text-gray-500 text-[10px]">
                  {autoApproveBookings 
                    ? "활성화됨: 수강생이 클래스를 예약하면 관리자 승인 단계를 건너뛰고 '예약 승인완료(approved)'로 즉시 확정됩니다." 
                    : "비활성화됨: 수강생이 클래스를 예약하면 '대기 중(pending)' 상태가 되며, 관리자가 우측의 '예약 승인' 버튼을 눌러야 확정됩니다."}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAutoApproveBookings(!autoApproveBookings)}
                  className={`px-4 py-2 rounded-full font-bold cursor-pointer transition-all duration-300 text-xs shadow-2xs ${
                    autoApproveBookings 
                      ? 'bg-[#C98C63] text-white hover:bg-[#B37B53]' 
                      : 'bg-gray-200 dark:bg-[#3D3530] text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  }`}
                >
                  {autoApproveBookings ? '⚡ 실시간 자동 승인 중 (ON)' : '⏸ 수동 승인 모드 (OFF)'}
                </button>
              </div>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-10 text-center">신청 들어온 예약 내역이 없습니다.</p>
            ) : (
              <div className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl overflow-hidden shadow-2xs divide-y divide-[#F6EFE7]">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                    
                    {/* User and class meta */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          b.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          b.status === 'attended' ? 'bg-blue-100 text-blue-700' :
                          b.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">예약번호: {b.id}</span>
                      </div>

                      <h4 className="font-bold text-sm text-[#2E2A27] dark:text-[#F3EFEA]">{b.className}</h4>
                      
                      <div className="flex flex-wrap items-center gap-3 text-gray-500">
                        <span>회원: <b>{b.userName}</b> ({b.userEmail})</span>
                        <span>•</span>
                        <span>체험일시: <b>{b.date} / {b.time}</b></span>
                        <span>•</span>
                        <span>정원: <b>{b.headCount}명</b></span>
                        <span>•</span>
                        <span>결제액: <b>{b.totalPrice.toLocaleString()}원</b></span>
                      </div>
                    </div>

                    {/* QR Attendance simulation and actions */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 w-full md:w-auto">
                      
                      {b.status === 'pending' && (
                        <button
                          onClick={() => adminApproveBooking(b.id)}
                          className="flex-1 md:flex-initial px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] cursor-pointer"
                        >
                          예약 승인하기
                        </button>
                      )}

                      {b.status === 'approved' && (
                        <button
                          onClick={() => adminAttendBooking(b.id)}
                          className="flex-1 md:flex-initial px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-[11px] cursor-pointer"
                        >
                          출석 확인 (QR Check-In)
                        </button>
                      )}

                      {b.status !== 'cancelled' && b.status !== 'attended' && (
                        <button
                          onClick={() => adminCancelBooking(b.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-100 font-bold text-[11px] cursor-pointer"
                        >
                          거절/취소
                        </button>
                      )}

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: notices (공지사항 작성) */}
        {activeTab === 'notices' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form Composer (2 Cols) */}
            <div className="lg:col-span-2">
              <form onSubmit={handleNoticeSubmit} className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#2E2A27] dark:text-[#F3EFEA] flex items-center gap-1.5">
                  📝 공지사항 및 이벤트 보드 포스팅
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">공지 분류 구분</label>
                    <select
                      value={noticeCategory}
                      onChange={(e) => setNoticeCategory(e.target.value as any)}
                      className="w-full p-2.5 border rounded-xl bg-gray-50 dark:bg-[#1F1B18]"
                    >
                      <option value="공지">📢 정기 공지 (Notice)</option>
                      <option value="이벤트">🎁 스페셜 이벤트 (Event)</option>
                      <option value="클래스">🎨 특강 교육 소식 (Class)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-400">공지사항 헤드라인 제목</label>
                    <input
                      type="text"
                      required
                      placeholder="제목 입력..."
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-gray-50 dark:bg-[#1F1B18]"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-gray-400">상세 게시글 작성</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="게시물의 세부 본문을 친절하고 상세하게 기록해주세요..."
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-[#1F1B18] resize-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-bold cursor-pointer"
                  >
                    공지사항 보드에 게재하기
                  </button>
                </div>
              </form>
            </div>

            {/* List of active notices to delete (1 Col) */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#C98C63] uppercase tracking-wider">등록된 게시물 관리</h3>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {notices.map(n => (
                  <div key={n.id} className="p-4 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex justify-between items-center text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="text-[9px] text-[#C98C63] font-bold">{n.category}</span>
                      <h4 className="font-bold text-gray-700 dark:text-gray-300 truncate">{n.title}</h4>
                      <span className="text-[9px] text-gray-400 block">{n.createdAt.split('T')[0]}</span>
                    </div>
                    <button
                      onClick={() => adminDeleteNotice(n.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-100 shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: reviews (수강후기 모니터링) */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2E2A27]">스팸/부적절 리뷰 검토 모니터링 ({reviews.length}건)</h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-10 text-center">등록된 수강평 후기가 존재하지 않습니다.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="p-4 bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#A26745]">{r.userName} 수강생</span>
                        <span className="text-gray-400 font-mono">{r.createdAt.split('T')[0]}</span>
                        <span className="text-amber-400 font-bold">★ {r.rating}점</span>
                      </div>
                      <h4 className="font-bold text-[#2E2A27] dark:text-[#F3EFEA]">{r.className}</h4>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light">{r.content}</p>
                    </div>

                    <button
                      onClick={() => adminDeleteReview(r.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-semibold text-[10px] rounded-lg shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 후기 영구삭제
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: telegram (텔레그램 연동 설정) */}
        {activeTab === 'telegram' && (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-[#2E2A27] dark:text-[#F3EFEA]">✈️ 실시간 텔레그램 예약 알림 연동</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                수강생이 체험 또는 일반 예약을 완료할 때마다 관리자의 개인 텔레그램 채팅방/채널로 상세 예약 정보를 즉시 푸시 알림으로 수신합니다.
              </p>
            </div>

            <div className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl p-6 space-y-6 shadow-2xs">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-850 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#2E2A27] dark:text-[#F3EFEA]">실시간 알림 사용 여부</h4>
                  <p className="text-[11px] text-gray-400">활성화 시, 예약 발생 즉시 지정된 봇이 메시지를 발송합니다.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTelegramEnabled(!telegramEnabled)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
                    telegramEnabled ? 'bg-[#C98C63]' : 'bg-gray-300 dark:bg-zinc-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${
                      telegramEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Bot Token */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-gray-500 dark:text-gray-400 block">1. 텔레그램 봇 토큰 (Bot Token)</label>
                <input
                  type="password"
                  placeholder="예: 5938201948:AAEtR7z_eXo-f921H8_gO-E31m8yZ..."
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5D5C5] dark:border-[#52473E] bg-[#FFFDF9] dark:bg-[#1F1B18] text-[#2E2A27] dark:text-[#F3EFEA] focus:outline-none focus:ring-1 focus:ring-[#C98C63] font-mono"
                />
                <p className="text-[10px] text-gray-400">
                  텔레그램에서 <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-[#C98C63] underline">@BotFather</a>를 검색하여 새 봇을 생성하고 받은 HTTP API Token을 입력해주세요.
                </p>
              </div>

              {/* Chat ID */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-gray-500 dark:text-gray-400 block">2. 수신 대상 채팅 ID (Chat ID)</label>
                <input
                  type="text"
                  placeholder="예: 123456789"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5D5C5] dark:border-[#52473E] bg-[#FFFDF9] dark:bg-[#1F1B18] text-[#2E2A27] dark:text-[#F3EFEA] focus:outline-none focus:ring-1 focus:ring-[#C98C63] font-mono"
                />
                <p className="text-[10px] text-gray-400">
                  메시지를 수신할 사용자의 고유 ID입니다. 생성한 봇에 /start 메시지를 보낸 후, <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-[#C98C63] underline">@userinfobot</a> 등에서 ID를 확인해 입력하십시오.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!telegramBotToken || !telegramChatId) {
                      alert("테스트 발송을 위해 봇 토큰과 채팅 ID를 입력해주세요.");
                      return;
                    }
                    setTestSending(true);
                    try {
                      const msg = `🛎️ *[달그락 공방 - 테스트 메시지]*\n\n텔레그램 알림 봇 연동에 성공했습니다! 수강생 예약 시 이 채널로 실시간 알림이 전송됩니다.`;
                      const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          chat_id: telegramChatId,
                          text: msg,
                          parse_mode: 'Markdown'
                        })
                      });
                      if (res.ok) {
                        alert("테스트 메시지를 성공적으로 전송했습니다! 텔레그램 채팅방을 확인해 주세요.");
                      } else {
                        const errText = await res.text();
                        alert(`전송 실패 (상태코드: ${res.status}): ${errText}`);
                      }
                    } catch (e: any) {
                      alert(`오류 발생: ${e.message}`);
                    } finally {
                      setTestSending(false);
                    }
                  }}
                  disabled={testSending}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-[#C98C63] text-[#C98C63] hover:bg-[#C98C63] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {testSending ? '테스트 전송 중...' : '알림 테스트 발송'}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await updateTelegramConfig({
                      botToken: telegramBotToken,
                      chatId: telegramChatId,
                      isEnabled: telegramEnabled
                    });
                    alert("설정이 안전하게 저장되었습니다.");
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#C98C63] hover:bg-[#A26745] text-white transition-colors cursor-pointer"
                >
                  설정 저장 완료
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
