import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginViewProps {
  setView: (view: string) => void;
  initialMode?: 'login' | 'register';
}

export default function LoginView({ setView, initialMode = 'login' }: LoginViewProps) {
  const { loginWithEmail, signupWithEmail } = useApp();
  
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
        alert('성공적으로 로그인되었습니다!');
      } else {
        if (!name.trim()) {
          alert('이름을 입력해주세요.');
          setLoading(false);
          return;
        }
        if (role === 'admin' && email !== 'admin@dalgeurak.com' && email !== 'lch200048@gmail.com') {
          alert('공방 점장(관리자) 회원가입은 지정된 관리자 이메일(admin@dalgeurak.com 또는 lch200048@gmail.com)로만 가능합니다.');
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, name, role);
        alert('회원가입이 완료되었습니다! 웰컴 2,000 포인트가 적립되었습니다.');
      }
      setView('home');
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || '인증에 실패했습니다. 이메일과 비밀번호 형식을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (type: 'admin' | 'user') => {
    setLoading(true);
    setErrorMsg('');
    const targetEmail = type === 'admin' ? 'admin@dalgeurak.com' : 'user@example.com';
    const targetPass = type === 'admin' ? 'admin123' : 'user123';

    try {
      // Try to login directly, if user does not exist, auto signup!
      try {
        await loginWithEmail(targetEmail, targetPass);
      } catch {
        await signupWithEmail(targetEmail, targetPass, type === 'admin' ? '점장님' : '홍길동', type === 'admin' ? 'admin' : 'user');
      }
      alert(`${type === 'admin' ? '관리자 대시보드' : '수강생 모드'}로 빠른 로그인 성공!`);
      setView('home');
    } catch (err: any) {
      setErrorMsg('빠른 로그인 생성 실패: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Title logo */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#C98C63] flex items-center justify-center text-white font-serif font-bold text-xl mx-auto shadow-sm">
          달
        </div>
        <div className="space-y-1">
          <h1 className="font-serif font-bold text-2xl text-[#2E2A27] dark:text-[#F3EFEA]">
            {isLogin ? '달그락 상점 로그인' : '달그락 공방 회원가입'}
          </h1>
          <p className="text-xs text-gray-400">손으로 빚어내는 소박하고 따뜻한 원데이 클래스 예약 플랫폼</p>
        </div>
      </div>

      {/* Main Card Form */}
      <div className="bg-white dark:bg-[#27221E] rounded-3xl p-6 sm:p-8 border border-[#F6EFE7] dark:border-[#3D3530] shadow-sm space-y-6">
        
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/5 text-rose-500 text-xs border border-rose-500/10 leading-relaxed text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* Sign up name */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 block">이름 / 닉네임</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 dark:bg-zinc-800 text-xs text-gray-700"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 block">이메일 주소</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 dark:bg-zinc-800 text-xs text-gray-700"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 block">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 dark:bg-zinc-800 text-xs text-gray-700"
              />
            </div>
          </div>

          {/* Sign up: Select Role (Admin Simulation) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 block">회원 등급 구분</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-2.5 border border-gray-200 bg-gray-50 dark:bg-zinc-800 rounded-xl text-xs"
              >
                <option value="user">수강생 (일반 회원)</option>
                <option value="admin">공방 점장 (관리자 회원)</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#C98C63] hover:bg-[#A26745] disabled:bg-gray-400 text-white font-bold text-xs shadow-md transition-colors cursor-pointer mt-2"
          >
            {loading ? '인증 처리 중...' : isLogin ? '공방 로그인하기' : '회원가입 완료하기'}
          </button>

        </form>

        {/* View Toggle */}
        <div className="text-center text-xs text-gray-400 pt-2">
          {isLogin ? (
            <p>
              달그락이 처음이신가요?{' '}
              <button 
                onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                className="text-[#C98C63] font-bold hover:underline cursor-pointer"
              >
                회원가입하기
              </button>
            </p>
          ) : (
            <p>
              이미 계정이 있으신가요?{' '}
              <button 
                onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                className="text-[#C98C63] font-bold hover:underline cursor-pointer"
              >
                로그인하기
              </button>
            </p>
          )}
        </div>

        {/* 1-Click Fast accounts for testing */}
        <div className="border-t border-dashed border-gray-100 dark:border-zinc-800/60 pt-4 space-y-3">
          <span className="text-[10px] font-bold text-gray-400 block text-center uppercase tracking-wider">
            ⚡ 빠른 테스트 계정 연동 (1클릭)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('user')}
              disabled={loading}
              className="py-2.5 rounded-xl border border-[#C98C63]/30 text-[#C98C63] text-[11px] font-semibold hover:bg-[#F6EFE7]/30 cursor-pointer"
            >
              일반수강생 간편연동
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="py-2.5 rounded-xl bg-[#2E2A27] text-white text-[11px] font-semibold hover:opacity-90 cursor-pointer"
            >
              공방 점장님 간편연동
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
