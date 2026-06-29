import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductItem } from '../types';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  Check, 
  Tag, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface GoodsShopViewProps {
  setView: (view: string) => void;
}

export default function GoodsShopView({ setView }: GoodsShopViewProps) {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    checkoutCart, 
    currentUser, 
    coupons 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Categories list
  const categoriesList = ['전체', '키링', '스티커', '캔들', '디퓨저', '에코백', '엽서', '머그컵'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Compute Cart Items with product details
  const cartWithDetails = useMemo(() => {
    return cart.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return {
        ...item,
        details: p
      };
    }).filter(item => item.details !== undefined) as { productId: string; quantity: number; details: ProductItem }[];
  }, [cart, products]);

  // Pricing calculations
  const cartTotalRaw = cartWithDetails.reduce((sum, item) => sum + (item.details.price * item.quantity), 0);
  let finalCartPrice = cartTotalRaw;
  let discountLabel = '';

  const activeCoupon = coupons.find(cp => cp.id === selectedCouponId);
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percent') {
      finalCartPrice = cartTotalRaw * (1 - activeCoupon.discountValue / 100);
      discountLabel = `${activeCoupon.discountValue}% 할인`;
    } else {
      finalCartPrice = Math.max(0, cartTotalRaw - activeCoupon.discountValue);
      discountLabel = `${activeCoupon.discountValue.toLocaleString()}원 할인`;
    }
  }

  const userCoupons = coupons.filter(cp => currentUser?.coupons.includes(cp.id));

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setCheckoutLoading(true);
    // Simulate payment process delay
    setTimeout(async () => {
      try {
        await checkoutCart(selectedCouponId || undefined);
        setCheckoutSuccess(true);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C98C63', '#A26745', '#FFFDF9']
        });
      } catch (err) {
        alert('주문 처리 중 오류가 발생했습니다.');
      } finally {
        setCheckoutLoading(false);
      }
    }, 1200);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('전체');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C98C63]/10 text-xs font-semibold text-[#C98C63] uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Dalgeurak Boutique
        </span>
        <h1 className="font-serif font-bold text-3xl text-[#2E2A27] dark:text-[#F3EFEA]">달그락 감성 에디션 굿즈샵</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          달그락 공방 아티스트들이 자연주의 감성을 듬뿍 불어넣어 수수하고 따스하게 제작한 한정 수량 수공예 편집 굿즈입니다.
        </p>
      </div>

      {checkoutSuccess ? (
        /* Checkout Success screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto bg-white dark:bg-[#27221E] rounded-3xl border border-[#F6EFE7] dark:border-[#3D3530] p-8 text-center space-y-6 shadow-md"
        >
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/40 text-[#C98C63] rounded-full flex items-center justify-center mx-auto text-3xl">
            🛍
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-2xl text-[#2E2A27] dark:text-[#F3EFEA]">주문 및 결제가 완료되었습니다!</h2>
            <p className="text-xs text-gray-400">굿즈가 안전히 포장되어 신속하게 택배 배송됩니다.</p>
          </div>
          <div className="bg-[#FFFDF9] dark:bg-[#1F1B18] p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 text-left space-y-2 text-xs">
            <p className="text-gray-400">배송지 주소: 회원 가입 시 기입하신 정보 주소로 배송됩니다.</p>
            {currentUser && (
              <p className="text-emerald-500 font-semibold">
                * 적립 포인트: 이번 구매로 {Math.floor(finalCartPrice * 0.03).toLocaleString()}p가 추가 적립되었습니다.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setSelectedCouponId('');
              }}
              className="flex-1 py-3 bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-bold rounded-full cursor-pointer"
            >
              쇼핑 계속하기
            </button>
            <button
              onClick={() => setView('mypage')}
              className="px-6 py-3 bg-gray-100 dark:bg-zinc-800 text-[#2E2A27] dark:text-[#F3EFEA] text-xs font-bold rounded-full hover:bg-gray-200 cursor-pointer"
            >
              마이페이지 가기
            </button>
          </div>
        </motion.div>
      ) : (
        /* Regular Shop Layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Main Shop Products area (3 Cols) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Filter and Category Area */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#27221E] p-4 rounded-2xl border border-[#F6EFE7] dark:border-[#3D3530] shadow-xs">
              
              {/* Category selector */}
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3.5 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#C98C63] text-white font-semibold'
                        : 'text-[#2E2A27]/70 dark:text-[#F3EFEA]/70 hover:bg-[#F6EFE7]'
                    }`}
                  >
                    {cat === '전체' ? '🛍 전체보기' : cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="굿즈 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#FFFDF9] dark:bg-[#1F1B18] border border-[#E5D5C5] dark:border-[#52473E] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#C98C63] text-gray-700 dark:text-gray-200"
                />
              </div>

            </div>

            {/* Products grid */}
            <AnimatePresence mode="popLayout">
              {filteredProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 bg-white dark:bg-[#27221E] rounded-2xl border border-dashed border-gray-200 text-gray-400 space-y-3"
                >
                  <p className="text-xs">찾으시는 감성 굿즈 상품이 준비 중에 있습니다.</p>
                  <button onClick={handleResetFilters} className="text-xs text-[#C98C63] hover:underline flex items-center gap-1 mx-auto">
                    필터 초기화 <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => (
                    <motion.div
                      key={prod.id}
                      layout
                      whileHover={{ y: -5 }}
                      className="group bg-white dark:bg-[#27221E] rounded-2xl overflow-hidden border border-[#F6EFE7] dark:border-[#3D3530] shadow-xs flex flex-col justify-between h-full"
                    >
                      {/* Image Box */}
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {prod.stock === 0 ? (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs">
                            품절 (Sold Out)
                          </div>
                        ) : prod.stock < 5 ? (
                          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-bold shadow-xs animate-pulse">
                            품절임박 ({prod.stock}개 남음!)
                          </span>
                        ) : null}
                        
                        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-[9px] text-[#A26745] font-semibold shadow-xs">
                          {prod.category}
                        </span>
                      </div>

                      {/* Product Content info */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-[#2E2A27] dark:text-[#F3EFEA] text-sm sm:text-base group-hover:text-[#C98C63] transition-colors leading-tight line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        </div>

                        {/* Price & Add button */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                          <div>
                            <span className="text-[10px] text-gray-400 block">수공예 판매가</span>
                            <span className="text-sm font-bold text-[#A26745] dark:text-[#D7A17E]">
                              {prod.price.toLocaleString()}원
                            </span>
                          </div>
                          
                          <button
                            disabled={prod.stock === 0}
                            onClick={() => addToCart(prod.id, 1)}
                            className="p-2 rounded-full bg-[#F6EFE7] dark:bg-[#3D3530] text-[#C98C63] hover:bg-[#C98C63] hover:text-white disabled:bg-gray-200 disabled:text-gray-400 transition-all cursor-pointer focus:outline-none"
                            title="장바구니 담기"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

          </div>

          {/* Sidebar Cart & checkout panel (1 Col) */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-[#FFFDF9] dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[50vh]">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-serif font-bold text-base text-[#2E2A27] dark:text-[#F3EFEA] flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#C98C63]" /> 장바구니 리스트
                  </h3>
                  {cart.length > 0 && (
                    <button 
                      onClick={clearCart} 
                      className="text-[10px] text-gray-400 hover:text-rose-500 font-semibold cursor-pointer"
                    >
                      전체 비우기
                    </button>
                  )}
                </div>

                {/* Cart list scroll */}
                {cartWithDetails.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 space-y-2">
                    <span className="text-2xl block">🛒</span>
                    <p className="text-[10px]">장바구니에 담긴 굿즈 상품이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                    {cartWithDetails.map(item => (
                      <div key={item.productId} className="flex gap-2.5 items-center justify-between text-xs bg-white dark:bg-[#1F1B18] p-2.5 rounded-xl border border-gray-100">
                        <img 
                          src={item.details.imageUrl} 
                          alt={item.details.name} 
                          className="w-10 h-10 rounded-md object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-700 dark:text-gray-300 truncate">{item.details.name}</h4>
                          <span className="text-[10px] text-[#A26745] font-bold">{(item.details.price * item.quantity).toLocaleString()}원</span>
                        </div>
                        {/* +/- count controls */}
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-800 p-0.5 rounded-md text-[10px]">
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:text-rose-500 font-bold"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:text-emerald-500 font-bold"
                            disabled={item.quantity >= item.details.stock}
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout billing details */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs">
                {/* Coupon selector */}
                {currentUser && userCoupons.length > 0 && cart.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 block flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#C98C63]" /> 장바구니 쿠폰 적용
                    </label>
                    <select
                      value={selectedCouponId}
                      onChange={(e) => setSelectedCouponId(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#E5D5C5] bg-white dark:bg-[#1F1B18] text-[11px]"
                    >
                      <option value="">쿠폰 적용 안 함</option>
                      {userCoupons.map(cp => (
                        <option key={cp.id} value={cp.id}>
                          [{cp.code}] {cp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2 bg-[#FFFDF9]/80 dark:bg-[#1F1B18]/50 p-3 rounded-xl border border-gray-100 text-[11px]">
                  <div className="flex justify-between text-gray-500">
                    <span>주문합계</span>
                    <span>{cartTotalRaw.toLocaleString()}원</span>
                  </div>
                  {activeCoupon && (
                    <div className="flex justify-between text-rose-500">
                      <span>쿠폰할인 ({activeCoupon.name})</span>
                      <span>-{discountLabel}</span>
                    </div>
                  )}
                  {currentUser && (
                    <div className="flex justify-between text-emerald-500 font-medium">
                      <span>적립 포인트 (3%)</span>
                      <span>+{Math.floor(finalCartPrice * 0.03).toLocaleString()}p</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-gray-100 font-bold text-xs text-[#2E2A27] dark:text-[#F3EFEA]">
                    <span>최종 결제액</span>
                    <span className="text-[#A26745] dark:text-[#D7A17E] text-sm">{finalCartPrice.toLocaleString()}원</span>
                  </div>
                </div>

                {currentUser ? (
                  <button
                    disabled={cart.length === 0 || checkoutLoading}
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-full bg-[#C98C63] hover:bg-[#A26745] disabled:bg-gray-300 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
                  >
                    {checkoutLoading ? '결제 수단 연동 중...' : `${finalCartPrice.toLocaleString()}원 주문하기`}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setView('login')}
                      className="w-full py-3 rounded-full bg-[#2E2A27] text-white font-bold text-xs"
                    >
                      로그인 후 구매 가능
                    </button>
                    <p className="text-[9px] text-gray-400 text-center">
                      * 굿즈 구매는 회원 가입 수강생만 배송지 연동을 위해 이용하실 수 있습니다.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
