import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  WorkshopClass, 
  ProductItem, 
  Booking, 
  Review, 
  GalleryItem, 
  Notice, 
  FAQItem, 
  Coupon, 
  UserProfile 
} from '../types';
import { 
  INITIAL_CLASSES, 
  INITIAL_PRODUCTS, 
  INITIAL_FAQS, 
  INITIAL_NOTICES, 
  INITIAL_GALLERY, 
  INITIAL_REVIEWS 
} from '../data';

interface AppContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  classes: WorkshopClass[];
  products: ProductItem[];
  bookings: Booking[];
  reviews: Review[];
  gallery: GalleryItem[];
  notices: Notice[];
  faqs: FAQItem[];
  coupons: Coupon[];
  cart: { productId: string; quantity: number }[];
  wishlist: string[];
  
  // Auth Functions
  loginWithEmail: (email: string, password: string) => Promise<UserProfile>;
  signupWithEmail: (email: string, password: string, name: string, role?: 'admin' | 'user') => Promise<UserProfile>;
  logout: () => Promise<void>;
  
  // App Functions
  bookClass: (
    classId: string, 
    date: string, 
    time: string, 
    headCount: number, 
    couponId?: string,
    guestName?: string,
    guestEmail?: string,
    guestPhone?: string
  ) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  toggleFavoriteClass: (classId: string) => void;
  claimCoupon: (couponId: string) => Promise<void>;
  
  // Cart Functions
  addToCart: (productId: string, quantity: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkoutCart: (couponId?: string) => Promise<void>;
  
  // Social & Content Functions
  addReview: (classId: string, className: string, rating: number, content: string, imageUrl?: string) => Promise<void>;
  likeReview: (reviewId: string) => Promise<void>;
  addCommentToReview: (reviewId: string, commentText: string) => Promise<void>;
  addGalleryItem: (imageUrl: string, description: string) => Promise<void>;
  likeGalleryItem: (galleryId: string) => Promise<void>;
  
  // Admin Functions
  adminAddClass: (newClass: Omit<WorkshopClass, 'id' | 'rating' | 'reviewCount'>) => Promise<void>;
  adminUpdateClass: (classId: string, updatedClass: Partial<WorkshopClass>) => Promise<void>;
  adminDeleteClass: (classId: string) => Promise<void>;
  adminApproveBooking: (bookingId: string) => Promise<void>;
  adminAttendBooking: (bookingId: string) => Promise<void>;
  adminCancelBooking: (bookingId: string) => Promise<void>;
  adminAddNotice: (notice: Omit<Notice, 'id' | 'createdAt' | 'views'>) => Promise<void>;
  adminDeleteNotice: (noticeId: string) => Promise<void>;
  adminDeleteReview: (reviewId: string) => Promise<void>;
  recreateAllClasses: () => Promise<void>;
  telegramConfig: { botToken: string; chatId: string; isEnabled: boolean };
  updateTelegramConfig: (config: { botToken: string; chatId: string; isEnabled: boolean }) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Main lists loaded from storage / firebase
  const [classes, setClasses] = useState<WorkshopClass[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  // Client only states that also sync to user profile
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [telegramConfig, setTelegramConfig] = useState<{ botToken: string; chatId: string; isEnabled: boolean }>({
    botToken: '',
    chatId: '',
    isEnabled: false
  });

  // Local storage backup keys
  const STORAGE_PREFIX = 'dalgeurak_';

  // Helper to load or set LocalStorage
  function getStorage<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  function setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // Initialize and Seed Data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load default FAQs
        setFaqs(INITIAL_FAQS);
        
        // Load core entities from firestore or fallback
        let loadedClasses: WorkshopClass[] = [];
        let loadedProducts: ProductItem[] = [];
        let loadedNotices: Notice[] = [];
        let loadedGallery: GalleryItem[] = [];
        let loadedReviews: Review[] = [];
        let loadedBookings: Booking[] = [];
        let loadedCoupons: Coupon[] = [];

        // Try Firestore first
        try {
          // Verify if classes exist, if not seed them
          const classesCol = collection(db, 'classes');
          const classesSnapshot = await getDocs(classesCol);
          if (classesSnapshot.empty) {
            loadedClasses = [...INITIAL_CLASSES];
            // Seed classes (silent try-catch to allow guest read access if write fails)
            try {
              for (const c of INITIAL_CLASSES) {
                await setDoc(doc(classesCol, c.id), c);
              }
            } catch (e) {
              console.warn("Guest user lacks Firestore write permission to seed classes. Using local fallback.");
            }
          } else {
            loadedClasses = classesSnapshot.docs.map(doc => doc.data() as WorkshopClass);
            // Merge INITIAL_CLASSES locally to guarantee latest classes are always available
            for (const initialClass of INITIAL_CLASSES) {
              const existingIdx = loadedClasses.findIndex(c => c.id === initialClass.id);
              if (existingIdx === -1) {
                loadedClasses.push(initialClass);
              } else {
                loadedClasses[existingIdx] = initialClass;
              }
            }
          }

          // Products
          const productsCol = collection(db, 'products');
          const productsSnapshot = await getDocs(productsCol);
          if (productsSnapshot.empty) {
            loadedProducts = [...INITIAL_PRODUCTS];
            try {
              for (const p of INITIAL_PRODUCTS) {
                await setDoc(doc(productsCol, p.id), p);
              }
            } catch (e) {
              console.warn("Guest lacks write permissions to seed products.");
            }
          } else {
            loadedProducts = productsSnapshot.docs.map(doc => doc.data() as ProductItem);
            for (const initialProduct of INITIAL_PRODUCTS) {
              const existingIdx = loadedProducts.findIndex(p => p.id === initialProduct.id);
              if (existingIdx === -1) {
                loadedProducts.push(initialProduct);
              } else {
                loadedProducts[existingIdx] = initialProduct;
              }
            }
          }

          // Notices
          const noticesCol = collection(db, 'notices');
          const noticesSnapshot = await getDocs(noticesCol);
          if (noticesSnapshot.empty) {
            loadedNotices = [...INITIAL_NOTICES];
            try {
              for (const n of INITIAL_NOTICES) {
                await setDoc(doc(noticesCol, n.id), n);
              }
            } catch (e) {
              console.warn("Guest lacks write permissions to seed notices.");
            }
          } else {
            loadedNotices = noticesSnapshot.docs.map(doc => doc.data() as Notice);
          }

          // Gallery
          const galleryCol = collection(db, 'gallery');
          const gallerySnapshot = await getDocs(galleryCol);
          if (gallerySnapshot.empty) {
            loadedGallery = [...INITIAL_GALLERY];
            try {
              for (const g of INITIAL_GALLERY) {
                await setDoc(doc(galleryCol, g.id), g);
              }
            } catch (e) {
              console.warn("Guest lacks write permissions to seed gallery.");
            }
          } else {
            loadedGallery = gallerySnapshot.docs.map(doc => doc.data() as GalleryItem);
          }

          // Reviews
          const reviewsCol = collection(db, 'reviews');
          const reviewsSnapshot = await getDocs(reviewsCol);
          if (reviewsSnapshot.empty) {
            loadedReviews = [...INITIAL_REVIEWS];
            try {
              for (const r of INITIAL_REVIEWS) {
                await setDoc(doc(reviewsCol, r.id), r);
              }
            } catch (e) {
              console.warn("Guest lacks write permissions to seed reviews.");
            }
          } else {
            loadedReviews = reviewsSnapshot.docs.map(doc => doc.data() as Review);
          }

          // Bookings
          const bookingsCol = collection(db, 'bookings');
          const bookingsSnapshot = await getDocs(bookingsCol);
          loadedBookings = bookingsSnapshot.docs.map(doc => doc.data() as Booking);

          // Coupons
          const couponsCol = collection(db, 'coupons');
          const couponsSnapshot = await getDocs(couponsCol);
          const initialCoupons: Coupon[] = [
            { id: 'coupon-welcome', code: 'WELCOME10', name: '가입 환영 10% 쿠폰', discountType: 'percent', discountValue: 10, description: '전체 클래스 10% 예약 할인', expiryDate: '2026-12-31', status: 'active' },
            { id: 'coupon-opening', code: 'DALGEURAK3000', name: '정식 오픈 3천원 할인권', discountType: 'amount', discountValue: 3000, description: '체험 예약 시 즉시 3,000원 할인', expiryDate: '2026-09-30', status: 'active' },
            { id: 'coupon-free-event', code: 'FREE100', name: '오픈 기념 100% 무료 체험 쿠폰', discountType: 'percent', discountValue: 100, description: '원하는 클래스 100% 무료 예약 가능!', expiryDate: '2026-12-31', status: 'active' }
          ];
          if (couponsSnapshot.empty) {
            loadedCoupons = initialCoupons;
            try {
              for (const cp of initialCoupons) {
                await setDoc(doc(couponsCol, cp.id), cp);
              }
            } catch (e) {
              console.warn("Guest lacks write permissions to seed coupons.");
            }
          } else {
            loadedCoupons = couponsSnapshot.docs.map(doc => doc.data() as Coupon);
            // Make sure FREE100 always exists locally
            if (!loadedCoupons.some(c => c.id === 'coupon-free-event')) {
              loadedCoupons.push(initialCoupons[2]);
            }
          }

        } catch (fsError) {
          console.warn("Firestore seeding/loading failed or offline, falling back to LocalStorage:", fsError);
          // Load from LocalStorage or fallback to seed
          loadedClasses = getStorage<WorkshopClass[]>('classes', INITIAL_CLASSES);
          for (const initialClass of INITIAL_CLASSES) {
            const existingIdx = loadedClasses.findIndex(c => c.id === initialClass.id);
            if (existingIdx === -1) {
              loadedClasses.push(initialClass);
            } else {
              const existing = loadedClasses[existingIdx];
              if (existing.imageUrl.includes('photo-1513519245088') || existing.imageUrl !== initialClass.imageUrl) {
                loadedClasses[existingIdx] = initialClass;
              }
            }
          }

          loadedProducts = getStorage<ProductItem[]>('products', INITIAL_PRODUCTS);
          for (const initialProduct of INITIAL_PRODUCTS) {
            const existingIdx = loadedProducts.findIndex(p => p.id === initialProduct.id);
            if (existingIdx === -1) {
              loadedProducts.push(initialProduct);
            } else {
              const existing = loadedProducts[existingIdx];
              if (existing.imageUrl.includes('photo-1513519245088') || existing.imageUrl !== initialProduct.imageUrl) {
                loadedProducts[existingIdx] = initialProduct;
              }
            }
          }
          loadedNotices = getStorage<Notice[]>('notices', INITIAL_NOTICES);
          loadedGallery = getStorage<GalleryItem[]>('gallery', INITIAL_GALLERY);
          loadedReviews = getStorage<Review[]>('reviews', INITIAL_REVIEWS);
          loadedBookings = getStorage<Booking[]>('bookings', []);
          loadedCoupons = getStorage<Coupon[]>('coupons', [
            { id: 'coupon-welcome', code: 'WELCOME10', name: '가입 환영 10% 쿠폰', discountType: 'percent', discountValue: 10, description: '전체 클래스 10% 예약 할인', expiryDate: '2026-12-31', status: 'active' },
            { id: 'coupon-opening', code: 'DALGEURAK3000', name: '정식 오픈 3천원 할인권', discountType: 'amount', discountValue: 3000, description: '체험 예약 시 즉시 3,000원 할인', expiryDate: '2026-09-30', status: 'active' },
            { id: 'coupon-free-event', code: 'FREE100', name: '오픈 기념 100% 무료 체험 쿠폰', discountType: 'percent', discountValue: 100, description: '원하는 클래스 100% 무료 예약 가능!', expiryDate: '2026-12-31', status: 'active' }
          ]);
        }

        // Apply sorted states
        setClasses(loadedClasses);
        setProducts(loadedProducts);
        setNotices(loadedNotices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setGallery(loadedGallery.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setReviews(loadedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setBookings(loadedBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setCoupons(loadedCoupons);

        // Load Telegram settings
        try {
          const telegramSnap = await getDoc(doc(db, 'settings', 'telegram'));
          if (telegramSnap.exists()) {
            setTelegramConfig(telegramSnap.data() as any);
          } else {
            const envToken = (import.meta as any).env.VITE_TELEGRAM_BOT_TOKEN || '';
            const envChatId = (import.meta as any).env.VITE_TELEGRAM_CHAT_ID || '';
            const isEnvEnabled = !!(envToken && envChatId);
            setTelegramConfig({
              botToken: envToken,
              chatId: envChatId,
              isEnabled: isEnvEnabled
            });
          }
        } catch (e) {
          console.warn("Failed to load telegram config from firestore:", e);
          const envToken = (import.meta as any).env.VITE_TELEGRAM_BOT_TOKEN || '';
          const envChatId = (import.meta as any).env.VITE_TELEGRAM_CHAT_ID || '';
          setTelegramConfig({
            botToken: getStorage<string>('telegram_token', envToken),
            chatId: getStorage<string>('telegram_chat_id', envChatId),
            isEnabled: getStorage<boolean>('telegram_enabled', !!(envToken && envChatId))
          });
        }

      } catch (err) {
        console.error("Critical initialization failure:", err);
      }
    };

    initializeData();
  }, []);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const userDoc = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDoc);
          
          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setCurrentUser(data);
            setCart(data.cart || []);
            setWishlist(data.favoriteClasses || []);
          } else {
            // Create user profile in Firestore
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '익명수강생',
              role: firebaseUser.email === 'admin@dalgeurak.com' || firebaseUser.email === 'lch200048@gmail.com' ? 'admin' : 'user',
              points: 2000, // Initial sign-up gift points
              coupons: ['coupon-welcome', 'coupon-opening', 'coupon-free-event'],
              favoriteClasses: [],
              cart: [],
              createdAt: new Date().toISOString()
            };
            await setDoc(userDoc, newProfile);
            setCurrentUser(newProfile);
            setCart([]);
            setWishlist([]);
          }
        } catch (e) {
          console.warn("Firestore user profile fetch failed, creating local profile:", e);
          // Mock local user profile
          const mockProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '수강생',
            role: firebaseUser.email === 'admin@dalgeurak.com' || firebaseUser.email === 'lch200048@gmail.com' ? 'admin' : 'user',
            points: 2000,
            coupons: ['coupon-welcome', 'coupon-opening', 'coupon-free-event'],
            favoriteClasses: [],
            cart: [],
            createdAt: new Date().toISOString()
          };
          setCurrentUser(mockProfile);
          setCart([]);
          setWishlist([]);
        }
      } else {
        setCurrentUser(null);
        setCart([]);
        setWishlist([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Synchronize local fallback storage whenever states change
  useEffect(() => {
    if (classes.length > 0) setStorage('classes', classes);
  }, [classes]);
  useEffect(() => {
    if (products.length > 0) setStorage('products', products);
  }, [products]);
  useEffect(() => {
    if (bookings.length > 0) setStorage('bookings', bookings);
  }, [bookings]);
  useEffect(() => {
    if (reviews.length > 0) setStorage('reviews', reviews);
  }, [reviews]);
  useEffect(() => {
    if (gallery.length > 0) setStorage('gallery', gallery);
  }, [gallery]);
  useEffect(() => {
    if (notices.length > 0) setStorage('notices', notices);
  }, [notices]);
  useEffect(() => {
    if (coupons.length > 0) setStorage('coupons', coupons);
  }, [coupons]);

  // Auth Action: Log in with email
  const loginWithEmail = async (email: string, password: string): Promise<UserProfile> => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;
    
    // Fetch profile
    let profile: UserProfile;
    try {
      const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userSnap.exists()) {
        profile = userSnap.data() as UserProfile;
      } else {
        throw new Error("No profile document");
      }
    } catch {
      // Return guest/local backup
      profile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || email.split('@')[0],
        role: email === 'admin@dalgeurak.com' || email === 'lch200048@gmail.com' ? 'admin' : 'user',
        points: 2000,
        coupons: ['coupon-welcome', 'coupon-opening', 'coupon-free-event'],
        favoriteClasses: [],
        cart: [],
        createdAt: new Date().toISOString()
      };
    }
    setCurrentUser(profile);
    return profile;
  };

  // Auth Action: Sign up with email
  const signupWithEmail = async (email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): Promise<UserProfile> => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: name,
      role: email === 'admin@dalgeurak.com' || email === 'lch200048@gmail.com' ? 'admin' : 'user',
      points: 2000, // 2000 pts welcome
      coupons: ['coupon-welcome', 'coupon-opening', 'coupon-free-event'],
      favoriteClasses: [],
      cart: [],
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
    } catch (e) {
      console.warn("Could not save user profile in Firestore:", e);
    }

    setCurrentUser(userProfile);
    return userProfile;
  };

  // Auth Action: Log out
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
  };

  // User Action: Booking a class
  const bookClass = async (
    classId: string, 
    date: string, 
    time: string, 
    headCount: number,
    couponId?: string,
    guestName?: string,
    guestEmail?: string,
    guestPhone?: string
  ): Promise<Booking> => {
    const selClass = classes.find(c => c.id === classId);
    if (!selClass) throw new Error("선택하신 클래스가 존재하지 않습니다.");

    const basePrice = selClass.price * headCount;
    let finalPrice = basePrice;
    
    // Process discount
    if (couponId && currentUser) {
      const activeCoupon = coupons.find(cp => cp.id === couponId);
      if (activeCoupon) {
        if (activeCoupon.discountType === 'percent') {
          finalPrice = basePrice * (1 - activeCoupon.discountValue / 100);
        } else {
          finalPrice = Math.max(0, basePrice - activeCoupon.discountValue);
        }
      }
    }

    const bookingId = `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newBooking: Booking = {
      id: bookingId,
      userId: currentUser?.uid || `guest-${Date.now()}`,
      userName: currentUser?.displayName || guestName || '비회원 수강생',
      userEmail: currentUser?.email || guestEmail || 'guest@example.com',
      classId: selClass.id,
      className: selClass.name,
      classImage: selClass.imageUrl,
      date,
      time,
      headCount,
      totalPrice: finalPrice,
      status: 'pending',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DALGEURAK-RESERVE-${bookingId}`,
      createdAt: new Date().toISOString(),
      guestPhone: guestPhone
    };

    // Update locally
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);

    // Save to Firestore if connected
    try {
      await setDoc(doc(db, 'bookings', bookingId), newBooking);
      
      // Update User profile (Points & Used coupon)
      if (currentUser) {
        const updatedPoints = currentUser.points + Math.floor(finalPrice * 0.05); // 5% points reward
        const updatedUserCoupons = couponId 
          ? currentUser.coupons.filter(cid => cid !== couponId) 
          : currentUser.coupons;

        const updatedProfile: UserProfile = {
          ...currentUser,
          points: updatedPoints,
          coupons: updatedUserCoupons
        };
        
        await setDoc(doc(db, 'users', currentUser.uid), updatedProfile);
        setCurrentUser(updatedProfile);
      }

      // Send Telegram Notification
      sendTelegramNotification(newBooking);
    } catch (e) {
      console.warn("Firestore booking write failed, saved locally:", e);
      // Fallback update
      if (currentUser) {
        const updatedProfile = {
          ...currentUser,
          points: currentUser.points + Math.floor(finalPrice * 0.05),
          coupons: couponId ? currentUser.coupons.filter(cid => cid !== couponId) : currentUser.coupons
        };
        setCurrentUser(updatedProfile);
      }

      // Try sending Telegram Notification as fallback
      sendTelegramNotification(newBooking);
    }

    return newBooking;
  };

  const sendTelegramNotification = async (booking: Booking) => {
    const config = telegramConfig;
    if (!config.isEnabled || !config.botToken || !config.chatId) {
      return;
    }
    
    const message = `🔔 *[달그락 공방 - 새로운 예약 알림]*\n\n` +
      `• *클래스명*: ${booking.className}\n` +
      `• *예약자명*: ${booking.userName}\n` +
      `• *연락처*: ${booking.guestPhone || '미기재'}\n` +
      `• *예약일시*: ${booking.date} (${booking.time})\n` +
      `• *예약인원*: ${booking.headCount}명\n` +
      `• *결제금액*: ${booking.totalPrice === 0 ? '무료 체험' : booking.totalPrice.toLocaleString() + '원'}\n` +
      `• *예약번호*: ${booking.id}`;
      
    try {
      await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.error("Failed to send telegram notification:", err);
    }
  };

  const updateTelegramConfig = async (config: { botToken: string; chatId: string; isEnabled: boolean }) => {
    setTelegramConfig(config);
    setStorage('telegram_token', config.botToken);
    setStorage('telegram_chat_id', config.chatId);
    setStorage('telegram_enabled', config.isEnabled);
    try {
      await setDoc(doc(db, 'settings', 'telegram'), config);
    } catch (e) {
      console.warn("Could not save telegram config to Firestore:", e);
    }
  };

  // User Action: Cancel booking
  const cancelBooking = async (bookingId: string) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b);
    setBookings(updated);

    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
    } catch (e) {
      console.warn("Firestore cancel failed, updated locally:", e);
    }
  };

  // User Action: Toggle Wishlist
  const toggleFavoriteClass = async (classId: string) => {
    let newWishlist: string[];
    if (wishlist.includes(classId)) {
      newWishlist = wishlist.filter(id => id !== classId);
    } else {
      newWishlist = [...wishlist, classId];
    }
    
    setWishlist(newWishlist);

    if (currentUser) {
      const updatedProfile = { ...currentUser, favoriteClasses: newWishlist };
      setCurrentUser(updatedProfile);

      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { favoriteClasses: newWishlist });
      } catch (e) {
        console.warn("Firestore wishlist sync failed:", e);
      }
    }
  };

  // User Action: Claim Coupon
  const claimCoupon = async (couponId: string) => {
    if (!currentUser) throw new Error("로그인이 필요합니다.");
    if (currentUser.coupons.includes(couponId)) {
      throw new Error("이미 보유 중인 쿠폰입니다.");
    }
    const updatedCoupons = [...currentUser.coupons, couponId];
    const updatedProfile = { ...currentUser, coupons: updatedCoupons };
    setCurrentUser(updatedProfile);
    try {
      await setDoc(doc(db, 'users', currentUser.uid), updatedProfile);
    } catch (e) {
      console.warn("Firestore claim coupon failed, saved locally:", e);
    }
  };

  // Cart Management
  const addToCart = async (productId: string, quantity: number) => {
    let updatedCart = [...cart];
    const existing = updatedCart.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      updatedCart.push({ productId, quantity });
    }
    setCart(updatedCart);

    if (currentUser) {
      const updatedProfile = { ...currentUser, cart: updatedCart };
      setCurrentUser(updatedProfile);
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { cart: updatedCart });
      } catch (e) {
        console.warn("Cart sync failed:", e);
      }
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    const updatedCart = cart.map(item => item.productId === productId ? { ...item, quantity } : item).filter(item => item.quantity > 0);
    setCart(updatedCart);

    if (currentUser) {
      const updatedProfile = { ...currentUser, cart: updatedCart };
      setCurrentUser(updatedProfile);
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { cart: updatedCart });
      } catch (e) {
        console.warn("Cart update sync failed:", e);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);

    if (currentUser) {
      const updatedProfile = { ...currentUser, cart: updatedCart };
      setCurrentUser(updatedProfile);
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { cart: updatedCart });
      } catch (e) {
        console.warn("Cart remove sync failed:", e);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (currentUser) {
      const updatedProfile = { ...currentUser, cart: [] };
      setCurrentUser(updatedProfile);
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { cart: [] });
      } catch (e) {
        console.warn("Cart clear sync failed:", e);
      }
    }
  };

  // Checkout Cart
  const checkoutCart = async (couponId?: string) => {
    // Reduce stock and reward points
    let totalSpent = 0;
    const updatedProducts = products.map(prod => {
      const cartItem = cart.find(item => item.productId === prod.id);
      if (cartItem) {
        totalSpent += prod.price * cartItem.quantity;
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
      }
      return prod;
    });

    if (couponId && currentUser) {
      const activeCoupon = coupons.find(cp => cp.id === couponId);
      if (activeCoupon) {
        if (activeCoupon.discountType === 'percent') {
          totalSpent = totalSpent * (1 - activeCoupon.discountValue / 100);
        } else {
          totalSpent = Math.max(0, totalSpent - activeCoupon.discountValue);
        }
      }
    }

    setProducts(updatedProducts);
    
    // Reward 3% points
    if (currentUser) {
      const updatedPoints = currentUser.points + Math.floor(totalSpent * 0.03);
      const updatedUserCoupons = couponId 
        ? currentUser.coupons.filter(cid => cid !== couponId) 
        : currentUser.coupons;

      const updatedProfile = {
        ...currentUser,
        points: updatedPoints,
        coupons: updatedUserCoupons,
        cart: []
      };
      setCurrentUser(updatedProfile);

      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          points: updatedPoints,
          coupons: updatedUserCoupons,
          cart: []
        });

        // Update product stock in Firestore
        for (const prod of updatedProducts) {
          await updateDoc(doc(db, 'products', prod.id), { stock: prod.stock });
        }
      } catch (e) {
        console.warn("Firestore checkout update failed, saved locally:", e);
      }
    }

    setCart([]);
  };

  // Social & Review Actions
  const addReview = async (
    classId: string, 
    className: string, 
    rating: number, 
    content: string, 
    imageUrl?: string
  ) => {
    const reviewId = `rev-${Date.now()}`;
    const newReview: Review = {
      id: reviewId,
      userId: currentUser?.uid || 'guest-user',
      userName: currentUser?.displayName || '익명수강생',
      userEmail: currentUser?.email || 'guest@example.com',
      rating,
      content,
      imageUrl,
      likes: 0,
      likedBy: [],
      comments: [],
      classId,
      className,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Update average class ratings
    const classReviews = updatedReviews.filter(r => r.classId === classId);
    const avgRating = parseFloat((classReviews.reduce((sum, r) => sum + r.rating, 0) / classReviews.length).toFixed(1));
    
    const updatedClasses = classes.map(c => c.id === classId 
      ? { ...c, rating: avgRating, reviewCount: classReviews.length } 
      : c
    );
    setClasses(updatedClasses);

    try {
      await setDoc(doc(db, 'reviews', reviewId), newReview);
      await updateDoc(doc(db, 'classes', classId), {
        rating: avgRating,
        reviewCount: classReviews.length
      });
      
      // Reward 500 points on writing review!
      if (currentUser) {
        const updatedPoints = currentUser.points + 500;
        const updatedProfile = { ...currentUser, points: updatedPoints };
        setCurrentUser(updatedProfile);
        await updateDoc(doc(db, 'users', currentUser.uid), { points: updatedPoints });
      }
    } catch (e) {
      console.warn("Firestore review write failed, updated locally:", e);
    }
  };

  const likeReview = async (reviewId: string) => {
    if (!currentUser) return;
    const uid = currentUser.uid;

    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        const liked = r.likedBy.includes(uid);
        const likedBy = liked ? r.likedBy.filter(id => id !== uid) : [...r.likedBy, uid];
        const likes = liked ? r.likes - 1 : r.likes + 1;
        return { ...r, likedBy, likes };
      }
      return r;
    });

    setReviews(updated);

    try {
      const rDoc = updated.find(r => r.id === reviewId);
      if (rDoc) {
        await updateDoc(doc(db, 'reviews', reviewId), {
          likedBy: rDoc.likedBy,
          likes: rDoc.likes
        });
      }
    } catch (e) {
      console.warn("Firestore like review sync failed:", e);
    }
  };

  const addCommentToReview = async (reviewId: string, commentText: string) => {
    const commentId = `comm-${Date.now()}`;
    const newComment = {
      id: commentId,
      userName: currentUser?.displayName || '익명수강생',
      content: commentText,
      createdAt: new Date().toISOString()
    };

    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return { ...r, comments: [...r.comments, newComment] };
      }
      return r;
    });

    setReviews(updated);

    try {
      const rDoc = updated.find(r => r.id === reviewId);
      if (rDoc) {
        await updateDoc(doc(db, 'reviews', reviewId), {
          comments: rDoc.comments
        });
      }
    } catch (e) {
      console.warn("Firestore comment review sync failed:", e);
    }
  };

  // Gallery Management
  const addGalleryItem = async (imageUrl: string, description: string) => {
    const galleryId = `gal-${Date.now()}`;
    const newItem: GalleryItem = {
      id: galleryId,
      userId: currentUser?.uid || 'guest',
      userName: currentUser?.displayName || '익명수강생',
      userEmail: currentUser?.email || '',
      imageUrl,
      description,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString()
    };

    setGallery([newItem, ...gallery]);

    try {
      await setDoc(doc(db, 'gallery', galleryId), newItem);
    } catch (e) {
      console.warn("Firestore gallery write failed:", e);
    }
  };

  const likeGalleryItem = async (galleryId: string) => {
    if (!currentUser) return;
    const uid = currentUser.uid;

    const updated = gallery.map(item => {
      if (item.id === galleryId) {
        const liked = item.likedBy.includes(uid);
        const likedBy = liked ? item.likedBy.filter(id => id !== uid) : [...item.likedBy, uid];
        const likes = liked ? item.likes - 1 : item.likes + 1;
        return { ...item, likedBy, likes };
      }
      return item;
    });

    setGallery(updated);

    try {
      const target = updated.find(item => item.id === galleryId);
      if (target) {
        await updateDoc(doc(db, 'gallery', galleryId), {
          likedBy: target.likedBy,
          likes: target.likes
        });
      }
    } catch (e) {
      console.warn("Firestore like gallery failed:", e);
    }
  };

  // Admin Operations
  const adminAddClass = async (newClass: Omit<WorkshopClass, 'id' | 'rating' | 'reviewCount'>) => {
    const classId = `class-${Date.now()}`;
    const fullClass: WorkshopClass = {
      ...newClass,
      id: classId,
      rating: 5.0,
      reviewCount: 0
    };

    setClasses([fullClass, ...classes]);

    try {
      await setDoc(doc(db, 'classes', classId), fullClass);
    } catch (e) {
      console.warn("Admin add class failed:", e);
    }
  };

  const adminUpdateClass = async (classId: string, updatedClass: Partial<WorkshopClass>) => {
    const updated = classes.map(c => c.id === classId ? { ...c, ...updatedClass } : c);
    setClasses(updated);

    try {
      await updateDoc(doc(db, 'classes', classId), updatedClass);
    } catch (e) {
      console.warn("Admin update class failed:", e);
    }
  };

  const adminDeleteClass = async (classId: string) => {
    const updated = classes.filter(c => c.id !== classId);
    setClasses(updated);

    try {
      await deleteDoc(doc(db, 'classes', classId));
    } catch (e) {
      console.warn("Admin delete class failed:", e);
    }
  };

  const adminApproveBooking = async (bookingId: string) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'approved' as const } : b);
    setBookings(updated);

    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'approved' });
    } catch (e) {
      console.warn("Admin approve failed:", e);
    }
  };

  const adminAttendBooking = async (bookingId: string) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'attended' as const } : b);
    setBookings(updated);

    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'attended' });
    } catch (e) {
      console.warn("Admin attend failed:", e);
    }
  };

  const adminCancelBooking = async (bookingId: string) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b);
    setBookings(updated);

    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
    } catch (e) {
      console.warn("Admin cancel failed:", e);
    }
  };

  const adminAddNotice = async (notice: Omit<Notice, 'id' | 'createdAt' | 'views'>) => {
    const noticeId = `notice-${Date.now()}`;
    const fullNotice: Notice = {
      ...notice,
      id: noticeId,
      createdAt: new Date().toISOString(),
      views: 1
    };

    setNotices([fullNotice, ...notices]);

    try {
      await setDoc(doc(db, 'notices', noticeId), fullNotice);
    } catch (e) {
      console.warn("Admin add notice failed:", e);
    }
  };

  const adminDeleteNotice = async (noticeId: string) => {
    const updated = notices.filter(n => n.id !== noticeId);
    setNotices(updated);

    try {
      await deleteDoc(doc(db, 'notices', noticeId));
    } catch (e) {
      console.warn("Admin delete notice failed:", e);
    }
  };

  const adminDeleteReview = async (reviewId: string) => {
    const updated = reviews.filter(r => r.id !== reviewId);
    setReviews(updated);

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (e) {
      console.warn("Admin delete review failed:", e);
    }
  };

  const recreateAllClasses = async () => {
    try {
      const classesCol = collection(db, 'classes');
      
      // Delete extra classes that are not in INITIAL_CLASSES
      const snapshot = await getDocs(classesCol);
      const initialIds = INITIAL_CLASSES.map(c => c.id);
      for (const d of snapshot.docs) {
        if (!initialIds.includes(d.id)) {
          await deleteDoc(doc(classesCol, d.id));
        }
      }

      // Overwrite/Create all INITIAL_CLASSES
      for (const initialClass of INITIAL_CLASSES) {
        await setDoc(doc(classesCol, initialClass.id), initialClass);
      }

      // Force set local state to clean initial copy
      setClasses([...INITIAL_CLASSES]);
      setStorage<WorkshopClass[]>('classes', INITIAL_CLASSES);
    } catch (err) {
      console.error("Recreate classes failed:", err);
      // Local fallback
      setClasses([...INITIAL_CLASSES]);
      setStorage<WorkshopClass[]>('classes', INITIAL_CLASSES);
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      loading,
      classes,
      products,
      bookings,
      reviews,
      gallery,
      notices,
      faqs,
      coupons,
      cart,
      wishlist,
      
      loginWithEmail,
      signupWithEmail,
      logout,
      
      bookClass,
      cancelBooking,
      toggleFavoriteClass,
      claimCoupon,
      
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      checkoutCart,
      
      addReview,
      likeReview,
      addCommentToReview,
      addGalleryItem,
      likeGalleryItem,
      
      adminAddClass,
      adminUpdateClass,
      adminDeleteClass,
      adminApproveBooking,
      adminAttendBooking,
      adminCancelBooking,
      adminAddNotice,
      adminDeleteNotice,
      adminDeleteReview,
      recreateAllClasses,
      telegramConfig,
      updateTelegramConfig
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
