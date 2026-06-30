import React, { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { Upload, ImageIcon, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface ProductImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  label: string;
}

export default function ProductImageUploader({
  imageUrl,
  onImageChange,
  label
}: ProductImageUploaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일(*.png, *.jpg, *.jpeg, *.webp)만 업로드할 수 있습니다.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(0);

    // Append Date.now() to ensure unique names and avoid browser caching
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storageRef = ref(storage, `products/${timestamp}_${safeFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(percent);
      },
      (err) => {
        console.error('Firebase Storage Upload Error:', err);
        setError(`업로드 실패: ${err.message}`);
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onImageChange(downloadUrl);
          setIsUploading(false);
          setProgress(100);
        } catch (err: any) {
          setError(`URL 취득 실패: ${err.message || err}`);
          setIsUploading(false);
        }
      }
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2 text-xs">
      <label className="font-bold text-gray-500 dark:text-gray-400">{label}</label>

      <div
        id="product-image-dropzone"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!isUploading ? triggerFileInput : undefined}
        className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 min-h-[160px] text-center ${
          isUploading ? 'cursor-not-allowed bg-gray-50/50 dark:bg-zinc-900/30' : 'cursor-pointer'
        } ${
          isDragActive
            ? 'border-[#C98C63] bg-amber-50/40 dark:bg-amber-950/20 scale-[0.99] shadow-inner'
            : 'border-[#F6EFE7] dark:border-amber-900/20 bg-[#FFFDF9] dark:bg-[#1F1B18] hover:border-amber-300 dark:hover:border-amber-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="w-full max-w-xs space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between text-xs font-semibold text-[#C98C63]">
              <span>이미지 업로드 중...</span>
              <span>{progress}%</span>
            </div>
            {/* Progress Bar Container */}
            <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C98C63] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400">
              Firebase Storage에 안전하게 보관 중입니다. 잠시만 기다려주세요.
            </p>
          </div>
        ) : imageUrl ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white/60 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xs">
            <div className="flex items-center gap-4 text-left w-full sm:w-auto">
              <img
                src={imageUrl}
                alt="굿즈 이미지 미리보기"
                className="w-20 h-20 rounded-xl object-cover border border-gray-200/50 dark:border-zinc-800 shrink-0 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                  <CheckCircle className="w-3 h-3" /> 저장 준비 완료
                </span>
                <p className="font-bold text-[#2E2A27] dark:text-[#FFFDF9] text-[11px] truncate max-w-[200px]">
                  업로드된 이미지 링크 수신됨
                </p>
                <p className="text-gray-400 text-[9px] truncate max-w-[200px]">
                  {imageUrl}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition text-[11px] font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 이미지 교체
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-950/20 text-[#C98C63]">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-gray-700 dark:text-gray-300">
                이미지 파일을 드롭하거나 클릭하여 업로드
              </p>
              <p className="text-gray-400 text-[10px]">
                PNG, JPG, JPEG, WEBP 이미지 형식을 지원합니다. <br/>
                업로드 시 파일명은 고유 코드로 자동 암호화 처리됩니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950 text-rose-600 dark:text-rose-400 rounded-lg flex items-center gap-1.5 text-[10px]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
