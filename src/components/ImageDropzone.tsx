import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link2, AlertCircle, X } from 'lucide-react';

interface ImageDropzoneProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  label: string;
  defaultFallbackUrl: string;
}

export default function ImageDropzone({
  imageUrl,
  onImageChange,
  label,
  defaultFallbackUrl
}: ImageDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image client-side to fit within storage limits and maximize loading speed
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Limit maximum dimension to 1200px for balanced look and compact storage size
            const MAX_DIM = 1200;
            if (width > MAX_DIM || height > MAX_DIM) {
              if (width > height) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              } else {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(event.target?.result as string);
              return;
            }
            
            // Fill background with white to handle transparency correctly when converting to jpeg
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG with 0.8 quality
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(compressedDataUrl);
          } catch (err) {
            // Fallback to original if canvas operations fail
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => {
          reject(new Error('이미지를 불러오는 중 오류가 발생했습니다.'));
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
      reader.readAsDataURL(file);
    });
  };

  // Process File
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // Safe limit for very large file crashes (e.g. 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('너무 큰 파일입니다. 20MB 이하의 이미지 파일을 업로드해주세요.');
      return;
    }

    setError(null);
    setIsCompressing(true);

    try {
      const compressedDataUrl = await compressImage(file);
      onImageChange(compressedDataUrl);
    } catch (err: any) {
      setError(err?.message || '이미지 압축 중에 오류가 발생했습니다.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    // Try to get dropped URL first (from other tabs or web pages)
    const urlData = e.dataTransfer.getData('text/plain');
    if (urlData && (urlData.startsWith('http://') || urlData.startsWith('https://') || urlData.startsWith('data:image/'))) {
      setError(null);
      onImageChange(urlData.trim());
      return;
    }

    // Otherwise try to get files
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClickZone = () => {
    fileInputRef.current?.click();
  };

  // Clipboard Paste handler
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && (pastedText.startsWith('http://') || pastedText.startsWith('https://') || pastedText.startsWith('data:image/'))) {
      setError(null);
      onImageChange(pastedText.trim());
      return;
    }

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(defaultFallbackUrl);
    setError(null);
  };

  return (
    <div className="space-y-2 text-xs" onPaste={handlePaste}>
      <div className="flex justify-between items-center">
        <label className="font-bold text-gray-500 dark:text-gray-400">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#C98C63] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          {showUrlInput ? '드롭존 보기' : '웹 이미지 URL 입력'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="space-y-1">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://images.unsplash.com/... 또는 base64 이미지 코드"
              value={imageUrl}
              onChange={(e) => {
                setError(null);
                onImageChange(e.target.value);
              }}
              className="flex-1 p-2.5 border border-[#F6EFE7] dark:border-amber-900/30 rounded-xl bg-[#FFFDF9] dark:bg-[#1F1B18] text-xs focus:ring-1 focus:ring-[#C98C63] outline-none"
            />
            {imageUrl && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-500 dark:text-gray-400 rounded-xl transition cursor-pointer flex items-center justify-center"
                title="기본 이미지로 리셋"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-gray-400">
            직접 이미지 URL 주소를 복사해서 붙여넣으실 수도 있습니다.
          </p>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleClickZone}
          className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer min-h-[140px] text-center ${
            isDragActive
              ? 'border-[#C98C63] bg-amber-50/40 dark:bg-amber-950/20 scale-[0.99] shadow-inner'
              : 'border-[#F6EFE7] dark:border-amber-900/20 bg-[#FFFDF9] dark:bg-[#1F1B18] hover:border-amber-300 dark:hover:border-amber-800/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {isCompressing ? (
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-950/40 text-[#C98C63]">
                <div className="w-5 h-5 border-2 border-[#C98C63] border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-gray-700 dark:text-gray-300 animate-bounce">
                  이미지 최적화 압축 진행 중...
                </p>
                <p className="text-gray-400 text-[10px]">
                  대용량 원본 이미지를 데이터 저장에 알맞은 최적 크기로 자동 변환 중입니다.
                </p>
              </div>
            </div>
          ) : imageUrl ? (
            <div className="w-full flex items-center justify-between gap-4 p-2 bg-white/60 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="업로드 미리보기"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200/50 dark:border-zinc-800 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultFallbackUrl;
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="text-left space-y-0.5">
                  <p className="font-bold text-[#2E2A27] dark:text-[#FFFDF9] text-[11px] truncate max-w-[150px] sm:max-w-[240px]">
                    {imageUrl.startsWith('data:') ? '📂 직접 업로드된 이미지' : '🔗 외부 웹 이미지'}
                  </p>
                  <p className="text-gray-400 text-[10px]">
                    {imageUrl.startsWith('data:') ? `${Math.round(imageUrl.length * 0.75 / 1024)} KB` : '웹 링크 연결됨'}
                  </p>
                  <p className="text-[#C98C63] font-medium text-[9px]">
                    클릭 또는 드래그하여 이미지 변경 가능 (대용량 파일 자동 압축)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-lg transition shrink-0 cursor-pointer"
                title="기본 이미지로 리셋"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/20 text-[#C98C63]">
                <Upload className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-gray-700 dark:text-gray-300">
                  이미지 파일을 드롭하거나 클릭하여 업로드
                </p>
                <p className="text-gray-400 text-[10px]">
                  모든 크기의 PNG, JPG, WEBP 이미지 지원 (대용량 자동 최적화 압축) <br/>
                  다른 웹 페이지의 이미지나 URL을 직접 끌어다 놓으셔도 됩니다.
                </p>
              </div>
            </div>
          )}

          {/* Quick Info text on the bottom */}
          {imageUrl && !imageUrl.startsWith('data:') && (
            <div className="absolute bottom-1 right-2 opacity-50 hover:opacity-100 transition">
              <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                <ImageIcon className="w-2.5 h-2.5" /> preview
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-1.5 text-[10px]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
