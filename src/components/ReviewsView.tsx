import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ThumbsUp, MessageSquare, Send, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReviewsView() {
  const { reviews, classes, currentUser, addReview, likeReview, addCommentToReview } = useApp();
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [commentText, setCommentText] = useState<{ [reviewId: string]: string }>({});
  const [openComments, setOpenComments] = useState<{ [reviewId: string]: boolean }>({});

  // Compute average and breakdown
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 5, breakdown: [0, 0, 0, 0, 0], total: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sum / reviews.length).toFixed(1));
    
    const countStars = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      const idx = Math.min(4, Math.max(0, 5 - r.rating));
      countStars[idx]++;
    });

    const breakdown = countStars.map(count => reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0);

    return { avg, breakdown, total: reviews.length };
  }, [reviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) {
      alert('후기를 작성할 클래스를 선택해주세요.');
      return;
    }
    if (!reviewText.trim()) {
      alert('후기 내용을 정성스레 채워주세요.');
      return;
    }

    const selClass = classes.find(c => c.id === selectedClassId);
    if (!selClass) return;

    try {
      await addReview(selClass.id, selClass.name, rating, reviewText);
      setReviewText('');
      setSelectedClassId('');
      setRating(5);
      alert('후기가 정상 등록되었습니다! 500 포인트가 적립되었습니다.');
    } catch {
      alert('후기 작성 중 오류가 발생했습니다.');
    }
  };

  const toggleComments = (reviewId: string) => {
    setOpenComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleCommentSubmit = async (reviewId: string, e: React.FormEvent) => {
    e.preventDefault();
    const txt = commentText[reviewId];
    if (!txt || !txt.trim()) return;

    try {
      await addCommentToReview(reviewId, txt.trim());
      setCommentText(prev => ({ ...prev, [reviewId]: '' }));
    } catch {
      alert('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C98C63]/10 text-xs font-semibold text-[#C98C63] uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Dalgeurak Reviews
        </span>
        <h1 className="font-serif font-bold text-3xl text-[#2E2A27] dark:text-[#F3EFEA]">수강생 따뜻한 한 줄 후기</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          달그락 공방을 체험하고 가신 소중한 수강생 여러분들의 실제 평점과 향긋한 마음이 듬뿍 담긴 솔직한 수강 후기집입니다.
        </p>
      </div>

      {/* Stats Breakdown and Add review area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Rating Stats Card (1 Col) */}
        <div className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] p-6 rounded-2xl shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-base text-[#2E2A27] dark:text-[#F3EFEA]">전체 수강생 평점</h3>
          
          <div className="text-center space-y-2">
            <span className="text-4xl font-serif font-bold text-[#A26745] dark:text-[#D7A17E]">{stats.avg}</span>
            <div className="flex justify-center text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-5 h-5 ${s <= Math.round(stats.avg) ? 'fill-current' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            <p className="text-[11px] text-gray-400">총 {stats.total}명의 평점 누적 기준</p>
          </div>

          {/* Star breakdown bar chart */}
          <div className="space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((stars, idx) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-8 font-semibold text-gray-500">{stars}점</span>
                <div className="flex-1 bg-gray-50 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full" 
                    style={{ width: `${stats.breakdown[idx]}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-400 font-medium">{stats.breakdown[idx]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Panel or Guest Alert (2 Cols) */}
        <div className="lg:col-span-2">
          {currentUser ? (
            <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#2E2A27] dark:text-[#F3EFEA] flex items-center gap-1.5">
                ✍ 원데이 클래스 후기 쓰기
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Class selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 block">수강하신 클래스</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-[#FFFDF9] dark:bg-[#1F1B18] text-xs focus:ring-[#C98C63] text-gray-700 dark:text-gray-200"
                  >
                    <option value="">클래스 선택하기</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Rating selection stars */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 block">체험 만족도 별점</label>
                  <div className="flex items-center gap-1 py-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 cursor-pointer hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${s <= rating ? 'fill-current' : 'text-gray-200'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold pl-2 text-gray-500">{rating}점 만족</span>
                  </div>
                </div>
              </div>

              {/* Review Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 block">정성 어린 한 줄 소감</label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="선생님의 지도 태도, 공방 분위기, 완성된 작품 사진의 만족감 등을 솔직히 공유해주세요. 후기 작성 시 즉시 500 포인트를 증정합니다."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-[#FFFDF9] dark:bg-[#1F1B18] text-xs focus:outline-none focus:ring-1 focus:ring-[#C98C63] text-gray-700 dark:text-gray-200 resize-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#C98C63] hover:bg-[#A26745] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  수강후기 등록하기 (+500p)
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[#FFFDF9] dark:bg-[#27221E] border border-dashed border-[#E5D5C5] dark:border-[#3D3530] p-10 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-gray-400">후기를 직접 남기고 포인트를 적립하시려면 간편 로그인이 필요합니다.</p>
            </div>
          )}
        </div>

      </div>

      {/* Reviews list Area */}
      <div className="space-y-4 pt-4 border-t border-[#F6EFE7] dark:border-[#3D3530]">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">최신 한 줄 수강생 후기 ({reviews.length}건)</h3>
        
        <div className="space-y-6">
          {reviews.map((r) => {
            const isLiked = currentUser ? r.likedBy.includes(currentUser.uid) : false;
            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-[#27221E] border border-[#F6EFE7] dark:border-[#3D3530] rounded-2xl p-6 space-y-4 shadow-3xs"
              >
                {/* Header author and star */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-800 dark:text-gray-200">{r.userName}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{r.createdAt.split('T')[0]}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F6EFE7] dark:bg-[#322B27] text-[#C98C63] font-medium">
                      {r.className} 수강
                    </span>
                  </div>

                  {/* Rating display */}
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {r.content}
                </p>

                {/* Likes / Comments toggles */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-50 dark:border-zinc-800/40 text-xs text-gray-400">
                  <button
                    disabled={!currentUser}
                    onClick={() => likeReview(r.id)}
                    className={`flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                      isLiked ? 'text-[#C98C63]' : 'hover:text-rose-500'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>도움돼요 ({r.likes})</span>
                  </button>

                  <button
                    onClick={() => toggleComments(r.id)}
                    className="flex items-center gap-1 font-bold cursor-pointer hover:text-[#C98C63]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>공방 답글 ({r.comments.length})</span>
                  </button>
                </div>

                {/* Comments block Accordion */}
                {openComments[r.id] && (
                  <div className="bg-[#FFFDF9] dark:bg-[#1F1B18] p-4 rounded-xl border border-[#F6EFE7] dark:border-[#3D3530] space-y-3">
                    
                    {/* List of comments */}
                    {r.comments.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">아직 공방 답글이나 댓글이 없습니다.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {r.comments.map(comm => (
                          <div key={comm.id} className="text-xs border-b border-dashed border-gray-100 dark:border-zinc-800/40 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2 pb-0.5">
                              <span className="font-bold text-[#A26745]">{comm.userName}</span>
                              <span className="text-[9px] text-gray-400">{comm.createdAt.split('T')[0]}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{comm.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add reply form */}
                    {currentUser && (
                      <form 
                        onSubmit={(e) => handleCommentSubmit(r.id, e)}
                        className="flex gap-2 items-center pt-2 border-t border-gray-50 dark:border-zinc-800/40"
                      >
                        <input
                          type="text"
                          placeholder="공방 선생님이나 동료 수강생에게 댓글 남기기..."
                          value={commentText[r.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-xs focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="p-2 rounded-lg bg-[#C98C63] text-white hover:bg-[#A26745] transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    )}

                  </div>
                )}

              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
