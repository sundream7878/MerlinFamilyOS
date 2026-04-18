import React from 'react';
import { 
  Users, 
  Share2, 
  TrendingUp, 
  Zap, 
  AlertCircle,
  Clock,
  ShieldCheck,
  Gift,
  Target,
  Trophy,
  Search,
  Filter,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  X,
  Star,
  Info,
  Calendar,
  ChevronDown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_HISTORY = [
  { id: 'REF-001', inviter: 'sarah.lee', invitee: 'alice_k', date: '방금 전', status: '인증 완료', reward: '500 M', app: '금고지기', invites: 14, verified: 12, contrib: 'High' },
  { id: 'REF-002', inviter: 'minho_t', invitee: 'bob_01', date: '3시간 전', status: '진행 중', reward: '-', app: '뭐먹지', invites: 3, verified: 1, contrib: 'Low' },
  { id: 'REF-003', inviter: 'jiwon.p', invitee: 'charlie_z', date: '1일 전', status: '위험 감지', reward: 'Blocked', app: '사진앱', danger: true, abuseReason: '중복 IP (IP: 121.168.0.42)', invites: 45, verified: 2, contrib: 'Critical' },
  { id: 'REF-004', inviter: 'sarah.lee', invitee: 'diana_x', date: '2일 전', status: '인증 완료', reward: '500 M', app: '금고지기', invites: 14, verified: 12, contrib: 'High' },
  { id: 'REF-005', inviter: 'tech_01', invitee: 'super_k', date: '3일 전', status: '위험 감지', reward: 'Blocked', app: '금고지기', danger: true, abuseReason: '가입 후 즉시 탈퇴 반복 패턴', invites: 2, verified: 0, contrib: 'None' },
];

const FAMILY_APPS = ['금고지기', '어그로필터', '뭐먹지', '사진앱', '내비게이션'];

export const Referral = () => {
  const [isCampaignModalOpen, setIsCampaignModalOpen] = React.useState(false);
  const [selectedInviter, setSelectedInviter] = React.useState<typeof MOCK_HISTORY[0] | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  const toggleService = (app: string) => {
    setSelectedServices(prev => 
      prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      {/* Campaign Creation Modal */}
      <AnimatePresence>
        {isCampaignModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCampaignModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden flex flex-col border border-slate-200"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded flex items-center justify-center shadow-lg shadow-indigo-100">
                       <TrendingUp size={20} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-slate-900 tracking-tight">전략적 레퍼럴 캠페인 생성</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Growth Campaign Setup</p>
                    </div>
                 </div>
                 <button onClick={() => setIsCampaignModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={20} /></button>
              </div>

              <div className="p-8 space-y-6">
                 {/* Reward Setting */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       보상 크레딧 설정 <Gift size={12} className="text-indigo-500" />
                    </label>
                    <div className="flex items-center gap-3">
                       <input 
                         type="number" 
                         placeholder="500"
                         className="flex-1 bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-indigo-100 transition-all tabular-nums"
                       />
                       <span className="text-sm font-black text-slate-400">M</span>
                    </div>
                 </div>

                 {/* Service Select (Multi) */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">적용 서비스 선택 (멀티 선택 가능)</label>
                    <div className="flex flex-wrap gap-2">
                       {FAMILY_APPS.map(app => (
                          <button 
                            key={app}
                            onClick={() => toggleService(app)}
                            className={cn(
                              "px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-2",
                              selectedServices.includes(app) 
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                                : "bg-slate-100 text-slate-400 border border-transparent hover:border-slate-300"
                            )}
                          >
                             {app}
                             {selectedServices.includes(app) && <Check size={12} />}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* End Date */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       종료 일자 설정 <Calendar size={12} className="text-indigo-500" />
                    </label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                 </div>
              </div>

              <div className="px-8 py-6 bg-slate-50 flex gap-4">
                 <button 
                   onClick={() => setIsCampaignModalOpen(false)}
                   className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded transition-all hover:bg-slate-100"
                 >
                    취소
                 </button>
                 <button className="flex-1 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded shadow-xl hover:bg-black transition-all">
                    캠페인 활성화
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inviter Contribution Slide Panel */}
      <AnimatePresence>
        {selectedInviter && (
          <div className="fixed inset-0 z-[100] pointer-events-none">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedInviter(null)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto"
            />
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 pointer-events-auto flex flex-col"
            >
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">기여도 분석</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Referral Contribution Analysis</p>
                  </div>
                  <button onClick={() => setSelectedInviter(null)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                    <X size={20} />
                  </button>
               </div>

               <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                  <div className="text-center pb-8 border-b border-slate-100">
                     <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                        <Users size={32} className="text-slate-300" />
                        {selectedInviter.verified >= 10 && (
                           <div className="absolute -top-1 -right-1 bg-amber-400 text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                              <Star size={14} fill="white" />
                           </div>
                        )}
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1">{selectedInviter.inviter}</h3>
                     <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Master Tier Influencer</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-5 rounded border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">총 초대 수</p>
                        <p className="text-xl font-black text-slate-900 tabular-nums">{selectedInviter.invites}건</p>
                     </div>
                     <div className="bg-slate-50 p-5 rounded border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">인증 완료 수</p>
                        <p className="text-xl font-black text-emerald-600 tabular-nums">{selectedInviter.verified}명</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">패밀리 기여 지표</h4>
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-slate-400 uppercase">Conversion Rate</span>
                              <span className="text-indigo-600">{Math.round((selectedInviter.verified / selectedInviter.invites) * 100)}%</span>
                           </div>
                           <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${(selectedInviter.verified / selectedInviter.invites) * 100}%` }}
                                className="h-full bg-indigo-500" 
                              />
                           </div>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded border border-emerald-100">
                           <p className="text-[11px] text-emerald-800 font-bold leading-relaxed flex items-center gap-2">
                              <Trophy size={14} className="text-emerald-600" />
                              이 사용자는 상위 1%의 실제 유저 전환 기여도를 기록하고 있습니다.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 border-t border-slate-100 flex gap-3">
                  <button className="flex-1 py-3 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-200 transition-all">활동 로그 보기</button>
                  <button className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">특별 리워드 지급</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#131b2e] tracking-tight">레퍼럴 네트워크 관리</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">사용자 간 초대 및 추천 생태계 분석 및 보상 관리</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all">
            <Download size={14} />
            통계 내보내기
          </button>
          <button 
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <TrendingUp size={14} />
            캠페인 생성
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "총 레퍼럴 발생", value: "28,491건", sub: "누적 초대 링크 발생 수", icon: Share2, color: "text-indigo-600", bg: "border-l-indigo-500" },
          { title: "인증 완료 사용자", value: "12,102명", sub: "최종 가입 및 인증 완료", icon: ShieldCheck, color: "text-emerald-500", bg: "border-l-emerald-500" },
          { title: "지급 완료 보상", value: "5.8M M", sub: "전체 앱 합산 리워드", icon: Gift, color: "text-amber-500", bg: "border-l-amber-500" },
          { title: "프로모션 참여율", value: "18.2%", sub: "활성 유저 대비 도달률", icon: Zap, color: "text-indigo-500", bg: "border-l-indigo-500" },
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

      {/* History Table */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <h3 className="text-sm font-black text-[#131b2e] uppercase tracking-widest">초대 및 가입 히스토리</h3>
           </div>
            <div className="flex gap-3 relative">
               <div className="relative">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="초대자, 피초대자 검색..." 
                   className="bg-slate-50 border border-slate-200 rounded-sm pl-10 pr-4 py-2 text-xs w-64 outline-none focus:ring-1 focus:ring-indigo-200 transition-all font-medium"
                 />
               </div>
               <div className="relative">
                  <button 
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className={cn("p-2 border rounded-sm transition-all", isFilterMenuOpen ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50")}
                  >
                    <Filter size={14} />
                  </button>
                  {isFilterMenuOpen && (
                     <div className="absolute right-0 top-10 w-48 bg-white shadow-2xl rounded border border-slate-100 z-50 py-2 overflow-hidden animate-in zoom-in-95 duration-200 ring-4 ring-black/5">
                        <div className="px-4 py-1.5 border-b border-slate-50 mb-1">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">퀵 필터 (Quick Filters)</p>
                        </div>
                        {[
                          { id: 'All', label: '전체 보기' },
                          { id: 'Success', label: '보상 지급 완료 건만' },
                          { id: 'Risk', label: '위험 감지 건만' },
                          { id: 'Pending', label: '진행 중인 건만' },
                        ].map(f => (
                           <button 
                             key={f.id}
                             onClick={() => { setActiveFilter(f.id); setIsFilterMenuOpen(false); }}
                             className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
                           >
                              {f.label}
                              {activeFilter === f.id && <Check size={12} />}
                           </button>
                        ))}
                     </div>
                  )}
               </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-4">ID / 시간</th>
                <th className="px-8 py-4">초대자</th>
                <th className="px-8 py-4">피초대자</th>
                <th className="px-8 py-4">대상 서비스</th>
                <th className="px-8 py-4">상태</th>
                <th className="px-8 py-4 text-right">보상</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_HISTORY.filter(log => {
                if (activeFilter === 'Success') return log.status === '인증 완료';
                if (activeFilter === 'Risk') return log.danger;
                if (activeFilter === 'Pending') return log.status === '진행 중';
                return true;
              }).map((log) => (
                <tr 
                  key={log.id} 
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors group",
                    log.danger && "bg-rose-50/30 hover:bg-rose-50/50"
                  )}
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">{log.id}</span>
                      <span className="text-[9px] text-slate-300 font-bold">{log.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <button 
                       onClick={() => setSelectedInviter(log)}
                       className="text-xs font-bold text-slate-700 uppercase hover:text-indigo-600 transition-colors flex items-center gap-2 group"
                     >
                        {log.inviter}
                        {log.verified >= 10 && <Trophy size={11} className="text-amber-400" />}
                     </button>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase">{log.invitee}</td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-sm uppercase tracking-tight">{log.app}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 relative group/badge">
                       <span className={cn(
                         "w-1.5 h-1.5 rounded-full",
                         log.danger ? "bg-rose-500 animate-pulse" : 
                         log.status === '인증 완료' ? "bg-emerald-500" : "bg-indigo-400"
                       )}></span>
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         log.danger ? "text-rose-600" : log.status === '인증 완료' ? "text-emerald-700" : "text-indigo-600"
                       )}>{log.status}</span>
                       
                       {/* Abuse Tooltip */}
                       {log.danger && log.abuseReason && (
                          <div className="absolute left-0 bottom-full mb-2 w-48 bg-slate-900 text-white p-3 rounded shadow-2xl opacity-0 group-hover/badge:opacity-100 transition-all pointer-events-none z-50 scale-95 group-hover/badge:scale-100">
                             <div className="flex items-center gap-2 mb-1 border-b border-white/10 pb-1">
                                <AlertCircle size={10} className="text-rose-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-rose-400">어뷰징 탐지 로직</span>
                             </div>
                             <p className="text-[10px] font-medium leading-relaxed opacity-80">{log.abuseReason}</p>
                             <div className="absolute top-full left-4 border-8 border-transparent border-t-slate-900" />
                          </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-sm text-slate-900">{log.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-10 py-6 bg-slate-50/10 border-t border-slate-50 flex items-center justify-between font-bold text-slate-400 text-[11px] uppercase tracking-widest">
           <div>전체 기록: <span className="text-slate-900">28,491</span> 건</div>
           <div className="flex gap-4">
              <button disabled className="opacity-30 cursor-not-allowed"><ChevronLeft size={16} /></button>
              <button className="text-slate-900 border-b-2 border-slate-900">1</button>
              <button className="hover:text-slate-900">2</button>
              <button className="hover:text-slate-900"><ChevronRight size={16} /></button>
           </div>
        </div>
      </section>
    </div>
  );
};
