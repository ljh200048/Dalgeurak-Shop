export interface WorkshopClass {
  id: string;
  name: string;
  description: string;
  categories: string[];
  level: '입문' | '초급' | '중급' | '고급';
  duration: string;
  maxPeople: number;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  intro: string;
  materials: string[];
  provided: string[];
  completedItem: string;
  precautions: string[];
  refundPolicy: string;
  isFeatured?: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: '키링' | '스티커' | '캔들' | '디퓨저' | '에코백' | '엽서' | '머그컵';
  stock: number;
  wishlistCount: number;
  isFeatured?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  classId: string;
  className: string;
  classImage: string;
  date: string;
  time: string;
  headCount: number;
  totalPrice: number;
  status: 'pending' | 'approved' | 'cancelled' | 'attended';
  qrCode: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  content: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[]; // List of user IDs who liked
  comments: {
    id: string;
    userName: string;
    content: string;
    createdAt: string;
  }[];
  classId: string;
  className: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  imageUrl: string;
  description: string;
  likes: number;
  likedBy: string[]; // List of user IDs who liked
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: '공지' | '이벤트' | '클래스';
  views: number;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  description: string;
  expiryDate: string;
  status: 'active' | 'used' | 'expired';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  points: number;
  coupons: string[]; // Coupon IDs
  favoriteClasses: string[]; // Class IDs
  cart: {
    productId: string;
    quantity: number;
  }[];
  createdAt: string;
}

export interface FAQItem {
  id: string;
  category: '예약' | '취소' | '환불' | '주차' | '반려동물' | '아이 동반' | '단체예약';
  question: string;
  answer: string;
}
