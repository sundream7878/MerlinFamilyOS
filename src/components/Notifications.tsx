import React from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Settings2,
  Download,
  SendHorizontal,
  ExternalLink,
  ChevronLeft,
  X,
  Target,
  Layout,
  Eye,
  RefreshCcw,
  MousePointer2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_NOTIFICATIONS = [
  { id: 'NOTIF-001', user: 'sarah.lee', channel: 'Push', service: '금고지기', template: 'Security Alert', status: 'Delivered', time: '방금 전', content: '새로운 환경에서 로그인이 감지되었습니다. 본인이 아니라면 즉시 비밀번호를 변경하세요.' },
  { id: 'NOTIF-002', user: 'minho_t', channel: 'Email', service: '사진앱', template: 'Sync Success', status: 'Opened', time: '5분 전', content: '모든 사진 동기화가 완료되었습니다. 이제 Merlin Family OS 어디서든 사진을 확인하세요!' },
  { id: 'NOTIF-003', user: 'jiwon.p', channel: 'SMS', service: '뭐먹지', template: 'Reward Auth', status: 'Failed', time: '12분 전', failed: true, errorLog: 'Carrier Gateway Timeout (error: 504) - 재시도 권장', content: '[Family OS] 인증번호 [4829]를 입력해주세요. 보상 크레딧이 즉시 지급됩니다.' },
  { id: 'NOTIF-004', user: 'anon-xf82', channel: 'Push', service: '어그로필터', template: 'Anomaly Discovery', status: 'Delivered', time: '42분 전', content: '어그로 필터가 새로운 이상 트래픽 패턴을 발견했습니다. 대시보드에서 확인하세요.' },
];

export const Notifications = () => {
  const [logs, setLogs] = React.useState(MOCK_NOTIFICATIONS);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = React.useState(false);
  const [dispatchStep, setDispatchStep] = React.useState(1);
  const [selectedError, setSelectedError] = React.useState<typeof MOCK_NOTIFICATIONS[0] | null>(null);
  const [previewTemplate, setPreviewTemplate] = React.useState<typeof MOCK_NOTIFICATIONS[0] | null>(null);
  const [highlightId, setHighlightId] = React.useState<string | null>(null);

  // Simulate real-time dispatch every 12 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newNotif = {
        id: `NOTIF-${Math.floor(Math.random() * 1000 + 100)}`,
        user: 'system_core',
        channel: 'Push',
        service: 'Base Engine',
        template: 'Health Check',
        status: 'Delivered',
        time: '방금 전',
        content: 'System health check completed successfully.'
      };
      setLogs(prev => [newNotif, ...prev.slice(0, 7)]);
      setHighlightId(newNotif.id);
      setTimeout(() => setHighlightId(null), 3000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      {/* Dispatch Workflow Modal */}
      <AnimatePresence>
        {isDispatchModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => { setIsDispatchModalOpen(false); setDispatchStep(1); }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden border border-slate-200"
            >
               <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
                  <div className="flex items-center gap-3">
                     <SendHorizontal size={20} />
                     <h3 className="text-lg font-black tracking-tight uppercase">전략적 즉시 알림 발송</h3>
                  </div>
                  <button onClick={() => { setIsDispatchModalOpen(false); setDispatchStep(1); }} className="p-1 hover:bg-white/20 rounded transition-all">
                     <X size={20} />
                  </button>
               </div>

               {/* Step Indicator */}
               <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 flex justify-center gap-8">
                  {[1, 2, 3].map(s => (
                     <div key={s} className="flex items-center gap-2">
                        <div className={cn(
                           "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                           dispatchStep >= s ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-100" : "bg-slate-200 text-slate-400"
                        )}>{s}</div>
                        <span className={cn("text-[9px] font-black uppercase tracking-widest", dispatchStep >= s ? "text-slate-900" : "text-slate-400")}>
                           {s === 1 ? 'Target' : s === 2 ? 'Message' : 'Preview'}
                        </span>
                     </div>
                  ))}
               </div>

               <div className="p-8 min-h-[300px]">
                  <AnimatePresence mode="wait">
                     {dispatchStep === 1 && (
                        <motion.div 
                          key="step1" 
                          initial={{ opacity: 0, x: 20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                           <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Step 1: 타겟 세그먼트 설정</h4>
                           <div className="grid grid-cols-2 gap-4">
                              {['전체 사용자', '금고지기 유저', '어그로필터 유저', '최근 7일 미접속자'].map(seg => (
                                 <button key={seg} className="p-4 bg-slate-50 border border-slate-200 rounded text-left hover:border-indigo-500 transition-all group">
                                    <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">{seg}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Approx. {Math.floor(Math.random() * 50000)} users</p>
                                 </button>
                              ))}
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">채널 선택</label>
                              <div className="flex gap-4">
                                 {['Push', 'Email', 'SMS'].map(c => (
                                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                                       <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
                                       <span className="text-xs font-bold text-slate-600">{c}</span>
                                    </label>
                                 ))}
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {dispatchStep === 2 && (
                        <motion.div 
                          key="step2" 
                          initial={{ opacity: 0, x: 20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                           <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Step 2: 메시지 본문 작성</h4>
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">템플릿 선택</label>
                                 <select className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                                    <option>신규 캠페인 안내</option>
                                    <option>보안 공지 (긴급)</option>
                                    <option>맞춤형 리워드 지급</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">본문 (Variable 지원: {"{username}"})</label>
                                 <textarea 
                                   className="w-full h-32 bg-slate-50 border border-slate-200 rounded p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
                                   placeholder="내용을 입력하세요..."
                                 ></textarea>
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {dispatchStep === 3 && (
                        <motion.div 
                          key="step3" 
                          initial={{ opacity: 0, x: 20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                           <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Step 3: 최종 미리보기 및 발송</h4>
                           <div className="p-6 bg-slate-900 rounded-lg text-white max-w-xs mx-auto shadow-2xl relative">
                              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                 <div className="flex items-center gap-2">
                                    <Bell size={12} className="text-indigo-400" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Family OS Notification</span>
                                 </div>
                                 <span className="text-[8px] opacity-40">방금 전</span>
                              </div>
                              <p className="text-[11px] font-bold leading-relaxed">
                                 [광고] Merlin Family OS와 함께하는 이번 주 혜택! 지금 { "{username}" }님만을 위한 특별 크레딧이 도착했습니다.
                              </p>
                              <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                                 <div className="w-6 h-1 bg-white/20 rounded-full"></div>
                              </div>
                           </div>
                           <div className="p-4 bg-amber-50 rounded border border-amber-100 flex gap-3 mt-4">
                              <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                              <p className="text-[10px] text-amber-800 font-bold leading-normal">
                                 정말 발송하시겠습니까? 대상 사용자 약 14,209명에게 즉시 푸시 알림이 전송됩니다. 발송 취소는 불가능합니다.
                              </p>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                  {dispatchStep > 1 && (
                     <button 
                       onClick={() => setDispatchStep(dispatchStep - 1)}
                       className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded transition-all hover:bg-slate-100"
                     >
                        이전
                     </button>
                  )}
                  <button 
                     onClick={() => {
                        if (dispatchStep < 3) setDispatchStep(dispatchStep + 1);
                        else { setIsDispatchModalOpen(false); setDispatchStep(1); }
                     }}
                     className="flex-1 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded shadow-xl hover:bg-indigo-700 transition-all"
                  >
                     {dispatchStep === 3 ? '발송 승인 및 실행' : '다음 단계로'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Diagnosis Popup */}
      <AnimatePresence>
        {selectedError && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedError(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-sm rounded-sm shadow-2xl p-8 border-t-4 border-rose-600">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded">
                     <AlertCircle size={24} />
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">발송 실패 진단 로그</h3>
                     <p className="text-[10px] text-slate-400 font-bold font-mono tracking-tighter mt-0.5">{selectedError.id}</p>
                  </div>
               </div>
               <div className="bg-slate-50 p-5 rounded border border-slate-200 mb-8">
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <XCircle size={12} /> ERROR_MESSAGE (CRITICAL)
                  </p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed font-mono italic">"{selectedError.errorLog}"</p>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setSelectedError(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded hover:bg-slate-200 transition-all">닫기</button>
                  <button className="flex-1 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                     <RefreshCcw size={12} /> 재발송 시도
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Preview Phone UI */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewTemplate(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
               initial={{ y: 50, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }} 
               exit={{ y: 50, opacity: 0 }} 
               className="relative bg-white w-[300px] h-[600px] rounded-[48px] border-[8px] border-slate-900 shadow-2xl overflow-hidden p-6"
            >
               {/* Phone Camera Notch */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 border-b-2 border-white/10 rounded-b-2xl z-20"></div>
               
               {/* Phone UI Content */}
               <div className="h-full bg-slate-50 flex flex-col pt-12">
                  <div className="px-4 py-3 flex justify-between items-center text-[10px] font-bold text-slate-900">
                     <span>9:41</span>
                     <div className="flex gap-1.5 items-center">
                        <Smartphone size={10} />
                        <Zap size={10} strokeWidth={3} />
                     </div>
                  </div>

                  <div className="flex-1 p-4">
                     <motion.div 
                       initial={{ y: -20, opacity: 0 }} 
                       animate={{ y: 0, opacity: 1 }} 
                       className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 mb-4"
                     >
                        <div className="flex justify-between items-center mb-2">
                           <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-[8px] text-white">M</div>
                              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Family OS</span>
                           </div>
                           <span className="text-[8px] text-slate-400 font-bold">1m ago</span>
                        </div>
                        <p className="text-[11px] font-black text-slate-900 tracking-tight leading-snug mb-1">{previewTemplate.template}</p>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-medium line-clamp-3">{previewTemplate.content}</p>
                     </motion.div>
                  </div>

                  <div className="p-8 text-center bg-slate-900/5 mt-auto">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setPreviewTemplate(null)}>
                        Preview Closing
                     </p>
                     <div className="mt-4 w-24 h-1 bg-slate-900/20 mx-auto rounded-full"></div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#131b2e] tracking-tight">알림 시스템 통합 관리</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">푸시, 이메일, 알림톡 발송 현황 및 템플릿 통합 관제</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all">
            <Download size={14} />
            로그 내보내기
          </button>
          <button 
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <SendHorizontal size={14} />
            즉시 알림 발송
          </button>
        </div>
      </section>

      {/* Channel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Push Notifications", volume: "4,821,029", sub: "오늘의 평균 오픈율: 12.4%", icon: Bell, color: "text-indigo-600", bg: "border-l-indigo-500", metric: "12.4%" },
          { label: "Email Broadcasts", volume: "12,109,241", sub: "CTR: 4.8% / 대기 큐 0.2%", icon: Mail, color: "text-slate-900", bg: "border-l-slate-900", metric: "4.8%" },
          { label: "SMS / Kakao Relay", volume: "₩1,248,392", sub: "유료 비즈 메시지 비중 92%", icon: Smartphone, color: "text-amber-500", bg: "border-l-amber-500", metric: "92%" },
        ].map((card, i) => (
          <div key={i} className={cn("bg-white p-5 rounded-sm border border-slate-200 shadow-sm border-l-4", card.bg)}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold text-slate-400">{card.label}</p>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl font-black text-[#131b2e] tracking-tighter">{card.volume}</h3>
              {card.metric && (
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                   <TrendingUp size={10} /> {card.metric}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Notification Logs Table */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <h3 className="text-sm font-black text-[#131b2e] uppercase tracking-widest">발송 로그 원장</h3>
           </div>
           <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="사용자, 서비스, 템플릿 검색..." 
               className="bg-slate-50 border border-slate-200 rounded-sm pl-10 pr-4 py-2 text-xs w-80 outline-none focus:ring-1 focus:ring-indigo-200 transition-all font-medium"
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-4">수신자 / 채널</th>
                <th className="px-8 py-4">발송 서비스</th>
                <th className="px-8 py-4">사용 템플릿</th>
                <th className="px-8 py-4">상태</th>
                <th className="px-8 py-4 text-right">발송 시간</th>
                <th className="px-8 py-4 text-center">도구</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {logs.map((notif) => (
                  <motion.tr 
                    key={notif.id}
                    initial={{ opacity: 0, scale: 0.98, x: -10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      x: 0,
                      backgroundColor: highlightId === notif.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      backgroundColor: { duration: 2 },
                      duration: 0.4 
                    }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-sm flex items-center justify-center",
                          notif.channel === 'Push' ? "bg-indigo-50 text-indigo-600" : 
                          notif.channel === 'Email' ? "bg-slate-100 text-slate-900" : "bg-amber-50 text-amber-600"
                        )}>
                          {notif.channel === 'Push' ? <Bell size={14} /> : notif.channel === 'Email' ? <Mail size={14} /> : <Smartphone size={14} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{notif.user}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{notif.channel}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-sm uppercase tracking-tight">{notif.service}</span>
                    </td>
                    <td className="px-8 py-5">
                      <button 
                         onClick={() => setPreviewTemplate(notif)}
                         className="text-xs font-bold text-slate-600 underline decoration-slate-200 underline-offset-4 hover:decoration-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-1"
                      >
                         {notif.template}
                         <Eye size={10} className="text-slate-300" />
                      </button>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <span className={cn(
                           "w-1.5 h-1.5 rounded-full",
                           notif.failed ? "bg-rose-500 animate-pulse" : 
                           notif.status === 'Opened' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-indigo-400"
                         )}></span>
                         <button 
                           onClick={() => { if (notif.failed) setSelectedError(notif); }}
                           className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             notif.failed ? "text-rose-600 hover:underline underline-offset-2" : notif.status === 'Opened' ? "text-emerald-700" : "text-indigo-600"
                           )}
                         >
                           {notif.status}
                         </button>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right text-[10px] font-bold text-slate-400">{notif.time}</td>
                    <td className="px-8 py-5 text-center">
                      <button className="text-slate-300 hover:text-slate-600 transition-all"><Settings2 size={16} /></button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="px-10 py-6 bg-slate-50/10 border-t border-slate-50 flex items-center justify-between font-bold text-slate-400 text-[11px] uppercase tracking-widest">
           <div>오늘 발송 합계: <span className="text-slate-900">17,751,712</span> 건</div>
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
