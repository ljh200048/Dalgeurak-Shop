import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, UploadCloud, Share2, Sparkles, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GalleryView() {
  const { gallery, currentUser, addGalleryItem, likeGalleryItem } = useApp();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedImgUrl, setSelectedImgUrl] = useState('');
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // Suggested pretty image URLs for convenient testing
  const suggestions = [
    { label: '비즈 공예', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600' },
    { label: '아로마 캔들', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600' },
    { label: '바다 레진', url: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=600' },
    { label: '식물 화분', url: 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&q=80&w=600' }
  ];

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImgUrl) {
      alert('이미지를 선택하거나 이미지 주소를 입력해 주세요.');
      return;
    }
    if (!description.trim()) {
      alert('완성 소감을 입력해 주세요.');
      return;
    }

    try {
      await addGalleryItem(selectedImgUrl, description);
      setDescription('');
      setSelectedImgUrl('');
      setUploadOpen(false);
    } catch {
      alert('갤러리 게시 중 오류가 발생했습니다.');
    }
  };

  const handleShare = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/#gallery-${id}`);
    setShareSuccess(id);
    setTimeout(() => setShareSuccess(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C98C63]/10 text-xs font-semibold text-[#C98C63]">
            <Sparkles className="w-3.5 h-3.5" /> Dalgeurak Showcase
          </span>
          <h1 className="font-serif font-bold text-3xl text-[#2E2A27] dark:text-[#F3EFEA]">수강생 감성 갤러리</h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg leading-relaxed">
            달그락 상점 공방에서 정성스레 만든 나만의 비즈, 캔들, 디퓨저 작품의 완성 사진을 자랑하고 서로 하트를 누르며 행복을 나눠보세요.
          </p>
        </div>

        {/* Upload Button */}
        {currentUser ? (
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-semibold shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer focus:outline-none"
          >
            <UploadCloud className="w-4 h-4" /> 나의 작품 업로드하기
          </button>
        ) : (
          <p className="text-xs text-gray-400 italic">로그인 시 갤러리에 본인 자랑 사진을 직접 게시하실 수 있습니다.</p>
        )}
      </div>

      {/* Masonry Columns Grid (Pinterest style) */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {gallery.map((item) => {
          const isLiked = currentUser ? item.likedBy.includes(currentUser.uid) : false;
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="break-inside-avoid bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl overflow-hidden p-4 space-y-4 shadow-2xs hover:shadow-md transition-all group"
            >
              {/* Photo Box */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={item.imageUrl} 
                  alt="Gallery item" 
                  className="w-full h-auto object-cover max-h-96"
                  referrerPolicy="no-referrer"
                />
                {/* Image Overlay for micro hover effects */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Text Description */}
              <p className="text-xs text-[#2E2A27]/80 dark:text-[#F3EFEA]/80 leading-relaxed">
                {item.description}
              </p>

              {/* Bottom bar: Author and interactions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800">
                <span className="text-[10px] font-semibold text-gray-400">
                  by {item.userName}
                </span>

                <div className="flex items-center gap-3">
                  {/* Hearts action */}
                  <button
                    disabled={!currentUser}
                    onClick={() => likeGalleryItem(item.id)}
                    className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors ${
                      isLiked 
                        ? 'text-rose-500' 
                        : 'text-gray-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{item.likes}</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(item.id)}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-600 transition-all cursor-pointer relative"
                    title="링크 공유"
                  >
                    {shareSuccess === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 animate-scale-up" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    {shareSuccess === item.id && (
                      <span className="absolute bottom-full right-0 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs mb-1.5 whitespace-nowrap">
                        링크 복사됨!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Upload creation Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#27221E] max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-[#F6EFE7]"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#2E2A27] dark:text-[#F3EFEA]">나의 달그락 자랑 업로드</h3>
              <button 
                onClick={() => setUploadOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              
              {/* Step 1: Suggested quick image picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 block">1. 자랑 이미지 선택</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={s.label}
                      onClick={() => setSelectedImgUrl(s.url)}
                      className={`p-2 rounded-xl text-center border text-[11px] font-medium transition-all ${
                        selectedImgUrl === s.url
                          ? 'bg-[#C98C63] border-[#C98C63] text-white font-bold'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Input Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 block">또는 이미지 주소 직접 입력</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={selectedImgUrl}
                  onChange={(e) => setSelectedImgUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#C98C63]"
                />
              </div>

              {/* Selected preview */}
              {selectedImgUrl && (
                <div className="aspect-16/9 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-h-40">
                  <img src={selectedImgUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Text Area details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 block">2. 완성 체험 소감 및 리뷰</label>
                <textarea
                  rows={4}
                  placeholder="공방에서의 행복했던 추억이나 작품의 디테일을 정성스레 소개해 주세요..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#C98C63] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-bold rounded-full cursor-pointer"
                >
                  게시물 등록하기
                </button>
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="px-5 py-3 bg-gray-100 text-gray-600 text-xs font-bold rounded-full cursor-pointer"
                >
                  취소
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
