import React from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download, 
  Settings2, 
  Zap, 
  DollarSign, 
  X,
  AlertCircle,
  Info,
  ChevronRight,
  CreditCard,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_TRANSACTIONS = [
  { id: 'TX-9912-AF', type: 'Credit In', user: '멀린공장장', familyUid: 'FL-9921-AF', amount: '+3,000 C', app: '어그로필터', status: '성공', time: '방금 전', reason: '최초 가입 환영 보상 (1단계)' },
  { id: 'TX-8291-AF', type: 'Credit Out', user: '멀린공장장', familyUid: 'FL-9921-AF', amount: '-100 C', app: '어그로필터', status: '성공', time: '12분 전', reason: '실전 어그로 분석 1회 차감' },
  { id: 'TX-8282-XP', type: 'Credit In', user: '서울숲지기', familyUid: 'FL-8821-XP', amount: '+1,240 C', app: '금고지기', status: '성공', time: '2시간 전', reason: '데일리 미션 완료 보상' },
  { id: 'TX-3301-ZK', type: 'Payment', user: '박지원', familyUid: 'FL-3301-ZK', amount: '+50,000 C', app: '외부충전', status: '대기중', time: '1일 전', reason: 'KCP 신용카드 일반 결제 (심사 대기)' },
];

export const WalletPage = () => {
  const [isSettling, setIsSettling] = React.useState(false);
  const [selectedTx, setSelectedTx] = React.useState<typeof MOCK_TRANSACTIONS[0] | null>(null);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
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
                 <div className="w-10 h-10 bg-[#2d5af0]/10 text-[#2d5af0] rounded flex items-center justify-center">
                    <DollarSign size={20} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">서비스 정산 실행</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">PG사 대조 및 허브 승인이 필요합니다</p>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">정산 대상 주기</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-300">
                       <option>오늘 (2026-04-22)</option>
                       <option>이번 주 합산 (04.16 ~ 04.22)</option>
                       <option>이번 달 (2026-04)</option>
                    </select>
                 </div>
                 <div className="p-4 bg-amber-50 rounded border border-amber-100 flex gap-3">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                       정산 실행 시 해당 기간의 모든 미수금 데이터가 확정되며, 취소할 수 없습니다. 현재 KCP 결제 모듈이 심사 중인 경우 외부 결제분 대조가 제한될 수 있습니다.
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
                 <button className="flex-1 px-4 py-3 bg-[#2d5af0] hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-widest rounded-sm shadow-lg shadow-indigo-100 transition-all">
                   승인 및 실행
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#131b2e] tracking-tight">자산 및 크레딧 통합 관제</h1>
          <p className="text-sm text-slate-400 font-bold italic opacity-80 underline underline-offset-4 decoration-indigo-200">Merlin Core Asset & Token Circulation Monitor</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all border border-slate-200">
            <Download size={14} /> 로그 내보내기
          </button>
          <button 
            onClick={() => setIsSettling(true)}
            className="flex items-center gap-2 bg-[#2d5af0] hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <DollarSign size={14} /> 정산 실행
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { title: "총 유통 크레딧", value: "8,442,000", unit: "C", icon: WalletIcon, color: "text-[#2d5af0]", border: "border-l-[#2d5af0]" },
          { title: "오늘의 신규 유입", value: "+1,420,000", unit: "C", icon: ArrowUpRight, color: "text-emerald-500", border: "border-l-emerald-500" },
          { title: "오늘의 전체 소모", value: "-429,100", unit: "C", icon: ArrowDownLeft, color: "text-rose-500", border: "border-l-rose-500" },
          { title: "PG 결제 승인 대기", value: "542,000", unit: "C", icon: CreditCard, color: "text-amber-500", border: "border-l-amber-500" },
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

      {/* Main Table Section */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#10b981] rounded-full" />
             <h3 className="text-[12px] font-black text-slate-600 uppercase tracking-[0.15em]">실시간 트랜잭션 감사 (Audit)</h3>
           </div>
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-sm border border-amber-100">
               <span className="animate-pulse w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
               <span className="text-[10px] font-black text-amber-700 uppercase">KCP Payment Reviewing...</span>
             </div>
             <div className="relative">
               <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="TX ID, 사용자, 앱 검색..." className="bg-white border border-slate-200 rounded-sm pl-9 pr-2 py-1.5 text-[11px] w-64 outline-none focus:ring-1 focus:ring-indigo-300 font-bold text-slate-600" />
             </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                <th className="pl-6 py-4 w-40">구분 / TX ID</th>
                <th className="px-4 py-4 w-48 text-left border-r border-slate-100">사용자</th>
                <th className="px-6 py-4 w-32 text-right">변동 금액 (C)</th>
                <th className="px-6 py-4 w-24 text-center">관련 앱</th>
                <th className="px-6 py-4 w-24 text-center">상태</th>
                <th className="px-4 py-4 w-32 text-right text-nowrap">시간</th>
                <th className="pr-6 py-4 text-left bg-blue-50/5">상세 사유 / 비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-all group border-l-4 border-transparent hover:border-l-indigo-500">
                  <td className="pl-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-sm flex items-center justify-center",
                        tx.amount.startsWith('+') ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                        tx.amount.startsWith('-') ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                      )}>
                        {tx.amount.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{tx.type}</span>
                        <span className="text-[9px] text-slate-300 font-mono italic">{tx.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5 border-r border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-black text-slate-700 tracking-tight flex items-center gap-1 group-hover:text-[#2d5af0] transition-colors cursor-pointer">
                        {tx.user}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 font-mono lowercase">{tx.familyUid}</span>
                    </div>
                  </td>
                  <td className={cn(
                    "px-6 py-5 text-right font-black text-[17px] tabular-nums tracking-tighter",
                    tx.amount.startsWith('+') ? "text-emerald-500" : tx.amount.startsWith('-') ? "text-rose-600" : "text-slate-900"
                  )}>
                    {tx.amount.replace(' C', '')}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border",
                      tx.app === '어그로필터' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      {tx.app}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                      tx.status === '성공' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                      tx.status === '대기중' ? "bg-amber-50 text-amber-600 border border-amber-100" : 
                      "bg-rose-50 text-rose-600 border border-rose-100"
                    )}>
                      {tx.status}
                    </div>
                  </td>
                  <td className="px-4 py-5 text-right text-[11px] font-bold text-slate-400 tabular-nums">
                    {tx.time}
                  </td>
                  <td className="pr-6 py-5 bg-blue-50/5">
                    <div className="flex items-center justify-between group/cell">
                      <span className="text-[12px] font-bold text-slate-500 italic max-w-[200px] truncate">"{tx.reason}"</span>
                      <button className="opacity-0 group-hover/cell:opacity-100 transition-opacity p-1.5 bg-white border border-slate-200 rounded-sm text-slate-400 hover:text-[#2d5af0]">
                        <History size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination/Status Bar */}
        <div className="px-8 py-5 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Showing Current Fiscal Integrity Data</p>
           </div>
           <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-[11px] font-black text-slate-400 hover:bg-slate-50">상세 내역 더보기</button>
           </div>
        </div>
      </section>
    </div>
  );
};
