import React from 'react';
import { Menu, Bell, Settings, Activity, Zap } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar = ({ onMenuClick }: TopBarProps) => {
  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 h-14 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-slate-100 rounded-sm transition-all text-slate-500"
        >
          <Menu size={20} />
        </button>

        {/* System Ticker (Replaces Search) */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-sm overflow-hidden flex-1 max-w-2xl relative group">
           <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-white px-2 py-0.5 rounded shadow-sm z-10">
              <Activity size={12} className="animate-pulse" />
              LIVE OS
           </div>
           <div className="flex-1 overflow-hidden relative h-4">
              <div className="absolute whitespace-nowrap animate-marquee flex items-center gap-12">
                 <p className="text-[10px] font-medium text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    전체 앱 통합 상태: <span className="text-slate-900 font-black">20개 중 18개 정상 가동 중</span>
                 </p>
                 <p className="text-[10px] font-medium text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    인증 서버 무장애 운영: <span className="text-slate-900 font-black">428시간 경과</span>
                 </p>
                 <p className="text-[10px] font-medium text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    지갑 엔진 밸런스 체크: <span className="text-slate-900 font-black">정상 완료 (Sync: 2s ago)</span>
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-sm transition-all text-slate-500 relative">
            <Bell size={18} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-sm transition-all text-slate-500">
            <Settings size={18} />
          </button>
        </div>
        
        <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-[11px] font-black text-merlin-dark uppercase tracking-tighter">ADMINISTRATOR</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">Session: 04h 12m</p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Admin" 
              className="w-9 h-9 rounded-sm border border-slate-200 shadow-sm object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
