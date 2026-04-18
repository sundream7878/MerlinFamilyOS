import React from 'react';

interface AlertBannerProps {
  message: string;
  onViewDetails: () => void;
}

export const AlertBanner = ({ message, onViewDetails }: AlertBannerProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-[#ef4444] text-white flex items-center justify-between px-6 z-[60] text-[11px] font-sans">
      <div className="flex items-center gap-2">
        <span className="text-[13px]">⚠️</span>
        <span className="font-bold tracking-tight uppercase">{message}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline font-medium opacity-80">발생 시각: 14:15:22</span>
        <button 
          onClick={onViewDetails}
          className="bg-white text-[#ef4444] px-3 py-0.5 rounded-[2px] font-black text-[10px] hover:bg-slate-100 transition-colors shadow-sm"
        >
          상세보기
        </button>
      </div>
    </div>
  );
};
