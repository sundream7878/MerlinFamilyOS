import React from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity, 
  Database, 
  History, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  RefreshCcw,
  Search,
  Download,
  Settings2,
  Clock,
  Zap,
  DollarSign,
  X,
  Calendar,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_TRANSACTIONS = [
  { id: 'TX-8291', type: 'Credit In', user: 'sarah.lee', familyUid: 'FL-8821-XP', amount: '+1,240.00 M', app: '금고지기', status: 'Success', time: '방금 전', reason: '이메일 인증 보상 (신규 가입)' },
  { id: 'TX-8290', type: 'Cash Out', user: 'minho_t', familyUid: 'FL-0092-RE', amount: '-500.00 M', app: '사진앱', status: 'Pending', time: '5분 전', reason: '프리미엄 필터 팩 구매' },
  { id: 'TX-8289', type: 'Transfer', user: 'jiwon.p', familyUid: 'FL-3301-ZK', amount: '2,500.00 M', app: 'Internal', status: 'Success', time: '12분 전', reason: '계정 간 포인트 통합' },
  { id: 'TX-8288', type: 'Credit In', user: 'tech_00', familyUid: 'FL-1156-MM', amount: '+10,000.00 M', app: '뭐먹지', status: 'Failed', time: '24분 전', reason: '인앱 결제 승인 거절 (카드 한도 초과)' },
];

export const WalletPage = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const [isSettling, setIsSettling] = React.useState(false);
  const [selectedTx, setSelectedTx] = React.useState<typeof MOCK_TRANSACTIONS[0] | null>(null);
  const [appStats, setAppStats] = React.useState<string | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);

  // Live Sync Mock Animation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      {/* Settlement Confirmation Modal */}
      <AnimatePresence>
        {isSettling && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettling(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden p-8 border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">
                    <DollarSign size={20} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">정산 실행 (Settlement Process)</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">2단계 보안 승인이 필요합니다</p>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">정산 대상 기간 선택</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                       <option>오늘 (2026-04-18)</option>
                       <option>이번 주 (04.12 ~ 04.18)</option>
                       <option>이번 달 (2026-04)</option>
                       <option>직접 선택 (Custom Range)</option>
                    </select>
                 </div>
                 <div className="p-4 bg-amber-50 rounded border border-amber-100 flex gap-3">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                       정산 실행 시 해당 기간의 모든 미수금 데이터가 확정되며, 취소할 수 없습니다. 연결된 PG사 결제 API와의 대조 작업이 동시에 진행됩니다.
                    </p>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsSettling(false)}
                   className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-sm transition-all"
                 >
                   취소
                 </button>
                 <button className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-widest rounded-sm shadow-lg shadow-indigo-100 transition-all">
                   승인 및 실행
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction Detail Slide-over Panel */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-[90] pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 pointer-events-auto flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-xl font-black text-slate-900 tracking-tight underline decoration-indigo-500 decoration-4 underline-offset-4">상세 트랜잭션 조회</h2>
                 <button onClick={() => setSelectedTx(null)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                 <div className="p-6 bg-slate-50 border border-slate-100 rounded">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TX ID</p>
                    <p className="text-xl font-black text-slate-800 font-mono tracking-tighter">{selectedTx.id}</p>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-l-2 border-indigo-500 pl-2">사용자 정보 (User Details)</p>
                       <div className="flex items-center gap-3 mt-1">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">SM</div>
                          <div>
                             <p className="text-sm font-black text-slate-700">{selectedTx.user}</p>
                             <p className="text-[11px] text-slate-400 font-mono">{selectedTx.familyUid}</p>
                          </div>
                          <button 
                            onClick={() => onNavigate?.('Users')}
                            className="ml-auto text-indigo-500 hover:text-indigo-700 p-2"
                          >
                             <ExternalLink size={14} />
                          </button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">관련 서비스</p>
                          <p className="text-xs font-bold text-slate-700">{selectedTx.app}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">상태 (Status)</p>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border inline-block",
                            selectedTx.status === 'Success' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            selectedTx.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 text-rose-700 border-rose-100"
                          )}>
                            {selectedTx.status}
                          </span>
                       </div>
                    </div>

                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">상세 사유 / 비고</p>
                       <p className="text-xs font-bold text-slate-600 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100 italic">
                          "{selectedTx.reason}"
                       </p>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-slate-100">
                 <button className="w-full py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-sm hover:bg-black transition-all">
                    영수증 데이터 확인
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* App Stats Modal */}
      <AnimatePresence>
        {appStats && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAppStats(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-sm rounded-sm shadow-2xl p-6"
            >
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">[{appStats}] 서비스 통계</h3>
                  <button onClick={() => setAppStats(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
               </div>
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 rounded">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">오늘 총 매출</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight">₩128.4K</p>
                     </div>
                     <div className="p-4 bg-slate-50 rounded">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">활성 유저</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight">4.2K</p>
                     </div>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded">
                     <p className="text-[10px] font-bold text-indigo-700 flex items-center gap-2">
                        <Info size={12} /> 서비스 가용성 100% (Operational)
                     </p>
                  </div>
                  <button className="w-full py-2.5 text-[10px] font-black text-indigo-600 border border-indigo-200 rounded uppercase tracking-widest hover:bg-indigo-50 transition-colors">상세 리포토 열기</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#131b2e] tracking-tight text-nowrap">자산 및 크레딧 관리</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">시스템 내 모든 자산 흐름과 환전 내역 통합 관제</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all">
            <Download size={14} />
            내역 내보내기
          </button>
          <button 
            onClick={() => setIsSettling(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <DollarSign size={14} />
            정산 실행
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "총 자산 순환량", value: "₩84.2M", sub: "Family Tokens & Cash", icon: WalletIcon, color: "text-indigo-600", bg: "border-l-indigo-500" },
          { title: "오늘의 총 유입", value: "+1,842,000 M", sub: "이메일 인증 보상 및 구매 포함", icon: ArrowUpRight, color: "text-emerald-500", bg: "border-l-emerald-500" },
          { title: "오늘의 총 환전", value: "-429,100 M", sub: "실제 현금 인출량 및 정산 환전", icon: ArrowDownLeft, color: "text-rose-500", bg: "border-l-rose-500" },
          { title: "지급 대기 보상", value: "5,821,000 M", sub: "레퍼럴 정산 대기", icon: CreditCard, color: "text-amber-500", bg: "border-l-amber-500" },
        ].map((card, i) => (
          <div key={i} className={cn("bg-white p-5 rounded-sm border border-slate-200 shadow-sm border-l-4", card.bg)}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold text-slate-400">{card.title}</p>
              <card.icon size={18} className={card.color} />
            </div>
            <h3 className="text-2xl font-black text-[#131b2e] tracking-tighter">{card.value}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <section className={cn("bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-12 transition-all duration-700", isSyncing && "ring-4 ring-indigo-400 ring-opacity-20 shadow-indigo-100")}>
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <h3 className="text-sm font-black text-[#131b2e] uppercase tracking-widest">실시간 트랜잭션 로그</h3>
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
               <span className={cn("w-1.5 h-1.5 bg-emerald-500 rounded-full", isSyncing ? "animate-ping" : "animate-pulse")}></span>
               <span className="text-[9px] font-black text-emerald-700 uppercase">Live Sync</span>
             </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="TX ID, 사용자, 앱 이름 검색..." 
              className="bg-slate-50 border border-slate-200 rounded-sm pl-10 pr-4 py-2 text-xs w-80 outline-none focus:ring-1 focus:ring-indigo-200 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-4">구분 / ID</th>
                <th className="px-8 py-4">사용자</th>
                <th className="px-8 py-4 text-right">변동 금액 (M)</th>
                <th className="px-8 py-4">서비스</th>
                <th className="px-8 py-4">상태</th>
                <th className="px-8 py-4 text-right">시간</th>
                <th className="px-8 py-4 text-center">도구</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-sm flex items-center justify-center",
                        tx.amount.startsWith('+') ? "bg-emerald-50 text-emerald-600" : 
                        tx.amount.startsWith('-') ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                      )}>
                        {tx.amount.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{tx.type}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tx.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => onNavigate?.('Users')}
                      className="text-xs font-bold text-slate-600 uppercase tracking-tighter hover:text-indigo-600 transition-colors flex items-center gap-1 group"
                    >
                      {tx.user}
                      <ChevronRight size={10} className="text-slate-200 group-hover:text-indigo-400" />
                    </button>
                  </td>
                  <td className={cn(
                    "px-8 py-5 text-right font-black text-sm tabular-nums",
                    tx.amount.startsWith('+') ? "text-emerald-500" : tx.amount.startsWith('-') ? "text-rose-600" : "text-slate-900"
                  )}>
                    {tx.amount}
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => setAppStats(tx.app)}
                      className="text-[10px] font-black text-indigo-500 bg-indigo-50 hover:bg-indigo-100 transition-all px-2 py-0.5 rounded-sm uppercase tracking-tight"
                    >
                      {tx.app}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border",
                      tx.status === 'Success' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      tx.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 text-rose-700 border-rose-100"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-[10px] font-bold text-slate-400">{tx.time}</td>
                  <td className="px-8 py-5 text-center">
                    <button 
                      onClick={() => setSelectedTx(tx)}
                      className="text-slate-300 hover:text-indigo-500 transition-all p-1.5 hover:bg-indigo-50 rounded-sm"
                    >
                      <Settings2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-10 py-6 bg-slate-50/10 border-t border-slate-50 flex items-center justify-between font-bold text-slate-400 text-[11px] uppercase tracking-widest">
           <div>최근 24시간 내역: <span className="text-slate-900">128</span> 건</div>
           <div className="flex gap-4">
              <button disabled className="opacity-30 cursor-not-allowed">이전</button>
              <button className="text-slate-900 border-b-2 border-slate-900">1</button>
              <button className="hover:text-slate-900">2</button>
              <button className="hover:text-slate-900">다음</button>
           </div>
        </div>
      </section>
    </div>
  );
};
