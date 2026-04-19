import React from 'react';
import { 
  Package, 
  Box, 
  Cpu, 
  Database, 
  Activity, 
  Zap, 
  Shield, 
  Search, 
  Settings, 
  Play, 
  Square, 
  RefreshCcw,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Settings2,
  Trash2,
  Terminal,
  Server,
  DollarSign,
  Users,
  Grid,
  X,
  Check,
  AlertTriangle,
  Info,
  Layers,
  Power,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ScopeManager } from './ScopeManager';

const MOCK_APPS = [
  { id: 'APP-01', name: '금고지기 Main', status: 'Running', uptime: 12284902, cpu: '12%', mem: '1.2GB', instances: 4, type: 'Finance', mtnMode: false },
  { id: 'APP-02', name: '뭐먹지 API', status: 'Running', uptime: 3888000, cpu: '28%', mem: '840MB', instances: 2, type: 'Service', mtnMode: false },
  { id: 'APP-04', name: '사진앱 Storage', status: 'Stopped', uptime: 0, cpu: '0%', mem: '0MB', instances: 0, type: 'Media', error: true, mtnMode: false },
  { id: 'APP-05', name: '어그로필터 Engine', status: 'Running', uptime: 1036800, cpu: '85%', mem: '4.8GB', instances: 8, type: 'AI', mtnMode: true },
];

export const Apps = () => {
  const [apps, setApps] = React.useState(MOCK_APPS);
  const [selectedApp, setSelectedApp] = React.useState<typeof MOCK_APPS[0] | null>(null);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [wizardStep, setWizardStep] = React.useState(1);
  const [appToStop, setAppToStop] = React.useState<typeof MOCK_APPS[0] | null>(null);
  const [tick, setTick] = React.useState(0);
  const [glowActive, setGlowActive] = React.useState(false);
  const [isScopeManagerOpen, setIsScopeManagerOpen] = React.useState(false);

  // Real-time Uptime counter and Glow effect
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);

    const glowTimer = setInterval(() => {
      setGlowActive(true);
      setTimeout(() => setGlowActive(false), 2000);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(glowTimer);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    if (seconds === 0) return '-';
    const totalSeconds = seconds + tick;
    const d = Math.floor(totalSeconds / (3600 * 24));
    const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const toggleMtnMode = (id: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, mtnMode: !a.mtnMode } : a));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      {/* Glow Effect Overlay for Live OS */}
      <AnimatePresence>
        {glowActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[200] border-[16px] border-emerald-500/5 transition-colors duration-1000"
          />
        )}
      </AnimatePresence>

      {/* Allocation Wizard Modal */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => { setIsWizardOpen(false); setWizardStep(1); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center">
                       <Plus size={20} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black tracking-tight">신규 패밀리 앱 인스턴스 할당</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Family OS Integration Wizard</p>
                    </div>
                 </div>
                 <button onClick={() => { setIsWizardOpen(false); setWizardStep(1); }} className="p-1 hover:bg-white/20 rounded transition-all">
                    <X size={20} />
                 </button>
              </div>

              {/* Progress Bar */}
              <div className="h-1 w-full bg-slate-100">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(wizardStep / 3) * 100}%` }}
                    className="h-full bg-indigo-600"
                 />
              </div>

              <div className="p-8 min-h-[350px]">
                 <AnimatePresence mode="wait">
                    {wizardStep === 1 && (
                       <motion.div key="step1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-6">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Step 1: 기본 정보 정의</h4>
                          <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">서비스 명칭 (Service Name)</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" placeholder="예: 어그로필터 v2" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">서비스 타입</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                                   <option>Finance (금융)</option>
                                   <option>AI / Analysis (인공지능)</option>
                                   <option>Social Media (소셜)</option>
                                   <option>Utility (유틸리티)</option>
                                </select>
                             </div>
                          </div>
                       </motion.div>
                    )}
                    {wizardStep === 2 && (
                       <motion.div key="step2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-6">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Step 2: 리소스 아키텍처 설정</h4>
                          <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">초기 인스턴스 수</label>
                                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-indigo-100" defaultValue={2} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">메모리 제한 (Limit)</label>
                                <div className="grid grid-cols-3 gap-2">
                                   {['512MB', '1GB', '2GB'].map(m => (
                                      <button key={m} className={cn("py-2 text-[10px] font-black border rounded", m === '1GB' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-400 border-slate-200")}>{m}</button>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    )}
                    {wizardStep === 3 && (
                       <motion.div key="step3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-6">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Step 3: Family OS 연동 승인</h4>
                          <div className="p-6 bg-slate-50 rounded border border-slate-100 space-y-3">
                             <div className="flex items-center gap-3">
                                <Check className="text-emerald-500" size={18} />
                                <span className="text-xs font-bold text-slate-700">API Key 자동 발급 완료</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Check className="text-emerald-500" size={18} />
                                <span className="text-xs font-bold text-slate-700">Family Credit SDK 통합 대기</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Check className="text-emerald-500" size={18} />
                                <span className="text-xs font-bold text-slate-700">중앙 집중식 로깅 노드 연결</span>
                             </div>
                          </div>
                          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded flex gap-3 mt-4">
                             <Info size={16} className="text-indigo-600 shrink-0" />
                             <p className="text-[10px] text-indigo-800 font-bold leading-normal">
                                '인스턴스 활성화' 클릭 시 즉시 프로비저닝이 시작되며, 60초 내에 트래픽 수용이 가능해집니다.
                             </p>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                 {wizardStep > 1 && (
                    <button onClick={() => setWizardStep(wizardStep - 1)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded hover:bg-slate-100 transition-all">이전</button>
                 )}
                 <button 
                   onClick={() => wizardStep < 3 ? setWizardStep(wizardStep + 1) : (setIsWizardOpen(false), setWizardStep(1))}
                   className="flex-1 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded shadow-xl hover:bg-black transition-all"
                 >
                    {wizardStep === 3 ? '인스턴스 활성화' : '다음 단계로'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stop Command Safety Modal */}
      <AnimatePresence>
        {appToStop && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setAppToStop(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }} className="relative bg-white w-full max-w-sm rounded shadow-2xl p-8 border-t-4 border-rose-600">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded"><AlertTriangle size={24} /></div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">서비스 중단 경고</h3>
               </div>
               <p className="text-xs font-bold text-slate-600 leading-relaxed mb-8">
                  정말로 <span className="text-rose-600 font-black">[{appToStop.name}]</span> 서비스의 모든 인스턴스를 즉시 정지하시겠습니까? 이 작업은 현재 해당 서비스를 이용 중인 모든 유저의 연결을 차단합니다.
               </p>
               <div className="flex gap-3">
                  <button onClick={() => setAppToStop(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded">취소</button>
                  <button className="flex-1 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-rose-100">강제 정지 수행</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* App Deep-Dive Side Panel */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] pointer-events-none">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setSelectedApp(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto" />
            <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 pointer-events-auto flex flex-col"
            >
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                  <div>
                     <h2 className="text-xl font-black tracking-tight">{selectedApp.name}</h2>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Deep-Dive Management Panel</p>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/20 rounded-full"><X size={20} /></button>
               </div>

               <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                  <section>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">실시간 운영 요약</h4>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-slate-50 rounded border border-slate-100">
                           <p className="text-[9px] font-bold text-slate-400 uppercase">오늘의 매출</p>
                           <p className="text-lg font-black text-slate-900">4.2M M</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded border border-slate-100">
                           <p className="text-[9px] font-bold text-slate-400 uppercase">유저 세션</p>
                           <p className="text-lg font-black text-slate-900">1.8K</p>
                        </div>
                     </div>
                  </section>

                  <section>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">최근 사용자 활동 피드</h4>
                     <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="flex gap-3 text-[11px] border-b border-slate-50 pb-3">
                              <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center shrink-0">
                                 <Users size={12} className="text-indigo-600" />
                              </div>
                              <p className="text-slate-600">
                                 <span className="font-black text-slate-900 uppercase">user_0{i}</span>님이 <span className="font-bold text-indigo-500">크레딧 120M</span>을 소비했습니다.
                              </p>
                           </div>
                        ))}
                     </div>
                  </section>

                  <section>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">크레딧 소비 패턴</h4>
                     <div className="p-5 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div className="flex justify-between items-end gap-1 h-20 items-end">
                           {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 bg-indigo-400 rounded-t" />
                           ))}
                        </div>
                        <p className="text-[9px] font-black text-indigo-400 mt-3 text-center uppercase tracking-widest underline decoration-2 underline-offset-4">Last 7 Days Consumption</p>
                     </div>
                  </section>
               </div>

               <div className="p-8 border-t border-slate-100 flex gap-3">
                  <button className="flex-1 py-3 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded">서버 터미널 열기</button>
                  <button className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-indigo-100">설정 마이그레이션</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#131b2e] tracking-tight">생태계 앱 통합 관리</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">패밀리 서비스 인스턴스 및 리소스 운용 현황 통합 관제</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsScopeManagerOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold shadow-sm transition-all"
          >
            <Lock size={14} />
            권한 범위 관리
          </button>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all active:scale-95"
          >
            <Plus size={14} />
            새 인스턴스 할당
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-200 transition-all">
            <Zap size={14} />
            전체 엔진 최적화
          </button>
        </div>
      </section>

      {/* Scope Manager Modal */}
      <AnimatePresence>
        {isScopeManagerOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsScopeManagerOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <ScopeManager onCancel={() => setIsScopeManagerOpen(false)} onSave={() => setIsScopeManagerOpen(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Instance Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "오늘의 총 매출 (M)", value: "8,421,000 M", sub: "전체 서비스 통합 크레딧 매출", icon: DollarSign, color: "text-emerald-500", bg: "border-l-emerald-500" },
          { label: "전체 유저 세션 수", value: "482,901", sub: "최근 24시간 실시간 활성 세션", icon: Users, color: "text-indigo-600", bg: "border-l-indigo-500" },
          { label: "활성 서비스 비율", value: "92.4%", sub: "42개 중 38개 서비스 정상 가동", icon: Activity, color: "text-indigo-500", bg: "border-l-indigo-500" },
          { label: "평균 서버 부하 (Avg)", value: "31.4%", sub: "CPU/MEM 통합 기술 지표", icon: Cpu, color: "text-slate-400", bg: "border-l-slate-400 opacity-60" },
        ].map((card, i) => (
          <div key={i} className={cn("bg-white p-5 rounded-sm border border-slate-200 shadow-sm border-l-4", card.bg)}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{card.label}</p>
              <card.icon size={18} className={card.color} />
            </div>
            <h3 className="text-2xl font-black text-[#131b2e] tracking-tighter">{card.value}</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* App Instances Table */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <h3 className="text-sm font-black text-[#131b2e] uppercase tracking-widest">운용 앱 인스턴스 목록</h3>
           </div>
           <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="앱 이름, 타입 검색..." 
               className="bg-slate-50 border border-slate-200 rounded-sm pl-10 pr-4 py-2 text-xs w-80 outline-none focus:ring-1 focus:ring-indigo-200 transition-all font-medium"
             />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-4">인스턴스 타입 / ID</th>
                <th className="px-8 py-4">서비스명</th>
                <th className="px-8 py-4">상태</th>
                <th className="px-8 py-4">CPU / MEM</th>
                <th className="px-8 py-4 text-right">Uptime</th>
                <th className="px-8 py-4 text-center">컨트롤</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_APPS.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-sm flex items-center justify-center",
                        app.error ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                      )}>
                        <Package size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tight">{app.type}</span>
                        <span className="text-[9px] text-slate-300 font-mono font-bold leading-none">{app.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="text-xs font-black text-slate-900 hover:text-indigo-600 hover:underline decoration-2 underline-offset-4 transition-all uppercase tracking-tighter flex items-center gap-2 group"
                    >
                      {app.name}
                      <ExternalLink size={10} className="text-slate-300 group-hover:text-indigo-400" />
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className="relative">
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full flex shrink-0",
                            app.status === 'Running' ? "bg-emerald-500" : "bg-slate-300"
                          )}></span>
                          {app.status === 'Running' && (
                             <span className="absolute inset-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                          )}
                       </div>
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         app.status === 'Running' ? "text-emerald-700" : "text-slate-400"
                       )}>{app.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <div className="flex justify-between w-24 text-[9px] font-bold text-slate-400 mb-1">
                          <span>CPU {app.cpu}</span>
                          <span>MEM {app.mem}</span>
                       </div>
                       <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full", app.error ? "bg-rose-400" : "bg-indigo-500")} style={{ width: app.cpu }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right text-[10px] font-bold text-slate-400 tabular-nums">
                    {formatUptime(app.uptime)}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-4">
                       <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">MTN Mode</span>
                          <button 
                            onClick={() => toggleMtnMode(app.id)}
                            className={cn(
                              "w-8 h-4 rounded-full relative transition-colors duration-300 shrink-0",
                              app.mtnMode ? "bg-amber-400" : "bg-slate-200"
                            )}
                          >
                             <motion.div 
                               animate={{ x: app.mtnMode ? 16 : 0 }}
                               className="absolute w-4 h-4 bg-white rounded-full shadow-sm top-0 left-0"
                             />
                          </button>
                       </div>
                       <div className="flex gap-1">
                          <button className="p-1.5 text-slate-300 hover:text-emerald-500 transition-all"><Play size={14} /></button>
                          <button 
                            onClick={() => setAppToStop(app)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 transition-all"
                          >
                            <Square size={14} />
                          </button>
                          <button className="p-1.5 text-slate-300 hover:text-indigo-500 transition-all"><Settings2 size={14} /></button>
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-10 py-6 bg-slate-50/10 border-t border-slate-50 flex items-center justify-between font-bold text-slate-400 text-[11px] uppercase tracking-widest">
           <div>전체 인스턴스: <span className="text-slate-900">42</span></div>
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
