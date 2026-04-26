import React, { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download, 
  Zap, 
  DollarSign, 
  X,
  AlertCircle,
  History,
  CreditCard,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// 거래 내역 타입 정의
interface Transaction {
  id: string;
  transaction_type: string;
  user_id: string;
  amount: number;
  app_id: string;
  display_text: string;
  created_at: string;
  balance_after?: number;
  user?: {
    email: string;
    nickname: string;
  };
}

export const WalletPage = () => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalCirculation: 0,
    todayIn: 0,
    todayOut: 0,
    pending: 0
  });

  // [수동 조정 폼 상태]
  const [adjustForm, setAdjustForm] = useState({
    userId: '',
    amount: 0,
    reason: ''
  });

  // 데이터 로드 (Master Ledger)
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      // 실제 구현 시 API 호출: const res = await fetch('/api/admin/coin-history');
      // 현재는 UI 구조 유지를 위해 이전 목데이터 형식을 실제 데이터 기반으로 시뮬레이션
      const mockData: Transaction[] = [
        { id: 'TX-9912-AF', transaction_type: 'EARN_WELCOME', user_id: 'a4478ded-b522-4662-86ae-61f10c51cb98', amount: 1000, app_id: 'MERLIN_HUB', display_text: '최초 가입 환영 보상', created_at: new Date().toISOString(), user: { email: 'chiu3@naver.com', nickname: '멀린' } },
        { id: 'TX-8291-AF', transaction_type: 'USE_AGGRO', user_id: 'a4478ded-b522-4662-86ae-61f10c51cb98', amount: -30, app_id: 'AGGRO_FILTER', display_text: '영상 분석 1회 차감', created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), user: { email: 'chiu3@naver.com', nickname: '멀린' } },
      ];
      setTransactions(mockData);
      setStats({
        totalCirculation: 8442000,
        todayIn: 1420000,
        todayOut: 429100,
        pending: 542000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!adjustForm.userId || !adjustForm.amount || !adjustForm.reason) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    console.log('[Admin] Adjusting coin:', adjustForm);
    // API 호출 로직: await fetch('/api/admin/coin-adjust', { method: 'POST', body: JSON.stringify(adjustForm) });
    
    alert(`UUID: ${adjustForm.userId} 유저에게 ${adjustForm.amount}C 조정이 완료되었습니다.`);
    setIsAdjusting(false);
    fetchHistory();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      {/* 🛠️ 코인 수동 조정 모달 (관리자용) */}
      <AnimatePresence>
        {isAdjusting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdjusting(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden p-8 border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center">
                    <Zap size={20} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">코인 수동 조정 (ADMIN)</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-wrap">UUID 기반 강제 자산 조정 모드입니다</p>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">대상 유저 UUID</label>
                    <input 
                      type="text"
                      value={adjustForm.userId}
                      onChange={(e) => setAdjustForm({...adjustForm, userId: e.target.value})}
                      placeholder="e.g. a4478ded-b522..."
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-300" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">조정 금액 (C)</label>
                      <input 
                        type="number"
                        value={adjustForm.amount}
                        onChange={(e) => setAdjustForm({...adjustForm, amount: Number(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-300" 
                      />
                    </div>
                    <div className="space-y-2 text-right">
                       <p className="text-[9px] text-slate-400 font-bold mb-1">양수: 지급(+) / 음수: 회수(-)</p>
                       <div className={cn("text-lg font-black", adjustForm.amount >= 0 ? "text-emerald-500" : "text-rose-500")}>
                         {adjustForm.amount >= 0 ? '+' : ''}{adjustForm.amount} C
                       </div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">조정 사유 (장부 기록용)</label>
                    <input 
                      type="text"
                      value={adjustForm.reason}
                      onChange={(e) => setAdjustForm({...adjustForm, reason: e.target.value})}
                      placeholder="예: 고객 불만 보상 지급"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-300" 
                    />
                 </div>
                 <div className="p-4 bg-rose-50 rounded border border-rose-100 flex gap-3">
                    <AlertCircle size={16} className="text-rose-600 shrink-0" />
                    <p className="text-[11px] text-rose-800 font-bold leading-relaxed">
                       본 조정 사항은 패밀리 통합 장부에 영구 기록됩니다. 회수(-) 처리 시 유저의 현재 잔액이 부족해도 차감될 수 있습니다.
                    </p>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsAdjusting(false)}
                   className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-sm transition-all"
                 >
                   취소
                 </button>
                 <button 
                   onClick={handleAdjust}
                   className="flex-1 px-4 py-3 bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-sm shadow-lg transition-all"
                 >
                   실행 및 기록
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#131b2e] tracking-tight">중앙 코인 관제 (Admin Hub)</h1>
          <p className="text-sm text-slate-400 font-bold italic opacity-80 underline underline-offset-4 decoration-indigo-200 uppercase tracking-tighter">Coin Integrity & Ledger Master Controller</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all border border-slate-200">
            <Download size={14} /> 로그 덤프
          </button>
          <button 
            onClick={() => setIsAdjusting(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg transition-all active:scale-95"
          >
            <Zap size={14} /> 코인 수동 조정
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { title: "총 유통 코인", value: stats.totalCirculation.toLocaleString(), unit: "C", icon: WalletIcon, color: "text-slate-900", border: "border-l-slate-900" },
          { title: "오늘의 유입 (Reward)", value: "+" + stats.todayIn.toLocaleString(), unit: "C", icon: ArrowUpRight, color: "text-emerald-500", border: "border-l-emerald-500" },
          { title: "오늘의 소모 (Usage)", value: "-" + stats.todayOut.toLocaleString(), unit: "C", icon: ArrowDownLeft, color: "text-rose-500", border: "border-l-rose-500" },
          { title: "미션 지급 대기", value: stats.pending.toLocaleString(), unit: "C", icon: CreditCard, color: "text-amber-500", border: "border-l-amber-500" },
        ].map((card, i) => (
          <div key={i} className={cn("bg-white p-5 rounded-sm border border-slate-200 shadow-sm border-l-4", card.border)}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-black text-[#131b2e] tracking-tighter">{card.value}</h3>
              <span className="text-xs font-bold text-slate-400">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Master Ledger Section */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
             <h3 className="text-[12px] font-black text-slate-600 uppercase tracking-[0.15em]">통합 코인 마스터 장부 (The Ledger)</h3>
           </div>
           <div className="flex items-center gap-4">
             <div className="relative">
               <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                type="text" 
                placeholder="UUID로 유저 활동 검색..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-sm pl-9 pr-2 py-1.5 text-[11px] w-80 outline-none focus:ring-1 focus:ring-slate-900 font-bold text-slate-600" 
               />
             </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                <th className="pl-6 py-4 w-44">발생 일시</th>
                <th className="px-4 py-4 w-52 text-left border-r border-slate-100">유저 ID (UUID) / 닉네임</th>
                <th className="px-6 py-4 w-32 text-center">앱 ID</th>
                <th className="px-6 py-4 w-32 text-center">유형</th>
                <th className="px-6 py-4 w-32 text-right">변동량 (C)</th>
                <th className="pr-6 py-4 text-left bg-blue-50/5">증빙 및 상세 사유</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="py-20 text-center text-xs font-bold text-slate-400">데이터를 불러오는 중...</td></tr>
              ) : transactions.filter(t => t.user_id.includes(searchQuery) || t.user?.nickname.includes(searchQuery)).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-all group border-l-4 border-transparent hover:border-l-slate-900">
                  <td className="pl-6 py-4 text-[11px] font-bold text-slate-400 tabular-nums">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 border-r border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-slate-700 tracking-tight flex items-center gap-1">
                        {tx.user?.nickname}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 font-mono">{tx.user_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm bg-slate-100 text-slate-500">
                      {tx.app_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-full border",
                      tx.transaction_type.startsWith('EARN') ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      tx.transaction_type.startsWith('USE') ? "bg-rose-50 text-rose-600 border-rose-100" :
                      "bg-indigo-50 text-indigo-600 border-indigo-100"
                    )}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-right font-black text-[16px] tabular-nums tracking-tighter",
                    tx.amount >= 0 ? "text-emerald-500" : "text-rose-600"
                  )}>
                    {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </td>
                  <td className="pr-6 py-4 bg-blue-50/5">
                    <span className="text-[12px] font-bold text-slate-500 italic">"{tx.display_text}"</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coin Integrity Monitoring Mode Active</p>
           </div>
           <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-[11px] font-black text-slate-400 hover:bg-slate-50">마스터 장부 전체 덤프 (CSV)</button>
           </div>
        </div>
      </section>
    </div>
  );
};
