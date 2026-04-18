import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { AlertBanner } from './components/layout/AlertBanner';
import { Dashboard } from './components/Dashboard';
import { Users } from './components/Users';
import { WalletPage } from './components/Wallet';
import { Referral } from './components/Referral';
import { Apps } from './components/Apps';
import { Notifications } from './components/Notifications';
import { AnimatePresence, motion } from 'motion/react';

const ALERT_MESSAGES: Record<string, string> = {
  'Dashboard': 'CRITICAL SYSTEM ALERT: 대규모 이상 트랜잭션 감지됨 (Wallet Engine: #TRX-8291)',
  'Users': 'CRITICAL SYSTEM ALERT: 유저 위험 상태 발생 - 1건 (즉시 조치 권고)',
  'Wallet': 'CRITICAL SYSTEM ALERT: 외부 IP로부터 대량 출금 시도 감지 (Frozen Status: 3)',
  'Referral': 'CRITICAL SYSTEM ALERT: 부정 추천인 링크 생성 차단 - 42건',
  'Notifications': 'CRITICAL SYSTEM ALERT: 푸시 서버 응답 지연 (Latent: 4.2s)',
  'Apps': 'CRITICAL SYSTEM ALERT: 서드파티 앱 권한 남용 의심 사례 보고됨',
};

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'Users':
        return <Users />;
      case 'Wallet':
        return <WalletPage onNavigate={setActivePage} />;
      case 'Referral':
        return <Referral />;
      case 'Apps':
        return <Apps />;
      case 'Notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <div className="flex">
        <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 w-full">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="mt-14 p-4 md:p-10 pt-4 max-w-[1600px] mx-auto min-h-[calc(100vh-5rem)] md:ml-64 transition-all duration-300">
            <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        {/* Global Footer info */}
        <footer className="mt-20 pt-10 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity pb-12">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Merlin Family OS Core Engine v8.42.1-stable</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Merlin Foundation • All Assets Encrypted</p>
          </div>
          <div className="flex gap-8">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Database: Synchronized</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">API: Operational</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
              <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">P2P Mesh: Connected (42 Nodes)</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  </div>
</div>
  );
}
