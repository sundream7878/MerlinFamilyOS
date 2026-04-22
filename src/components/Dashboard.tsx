import React from 'react';
import { 
  Users, 
  UserPlus,
  ShieldCheck, 
  Zap, 
  Wallet, 
  TrendingUp, 
  Share2,
  AlertCircle,
  Settings,
  MoreVertical,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronRight,
  Monitor,
  LayoutGrid,
  Database,
  ArrowRight,
  CreditCard,
  Bell
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

// --- Metrics Data ---

const METRICS = [
  { title: "총 사용자 수", value: "1,248,392", status: "정상 운영 중", sub: "인증 완료 사용자 기준 / 전월 대비 +12%", border: "border-l-[#10b981]", icon: Users, iconColor: "text-[#10b981]" },
  { title: "오늘 신규 인증 사용자", value: "4,102", status: "정상 운영 중", sub: "8.2% 어제 대비 증가", border: "border-l-[#10b981]", icon: UserPlus, iconColor: "text-[#10b981]" },
  { title: "현재 활성 사용자 수", value: "18,529", status: "사용 급증 주의", sub: "현재 접속 기준 (실시간)", border: "border-l-[#f59e0b]", icon: Zap, iconColor: "text-[#f59e0b]" },
  { title: "총 크레딧 잔액", value: "₩84,290,000", status: "정상 운영 중", sub: "전체 보유 잔액 (환불 비대상 포함)", border: "border-l-[#10b981]", icon: Wallet, iconColor: "text-[#10b981]" },
  { title: "오늘 크레딧 사용량", value: "₩3,124,500", status: "이상 트래픽 감지", sub: "위험: 단시간 내 대량 환전 시도 발생 / 최다 사용 앱: 금고지기", border: "border-l-[#ef4444]", icon: CreditCard, iconColor: "text-[#ef4444]" },
  { title: "추천 가입 수", value: "942", status: "정상 운영 중", sub: "이번 주 신규 추천 연결 및 보상 대상 포함", border: "border-l-[#10b981]", icon: Share2, iconColor: "text-[#10b981]" },
];

const APP_INFLOW = [
  { name: "금고지기", percent: 42, status: "정상" },
  { name: "어그로필터", percent: 28, status: "트래픽 급증", warning: true },
  { name: "뭐먹지", percent: 18, status: "정상" },
  { name: "사진앱", percent: 8, status: "" },
  { name: "기타/신규앱", percent: 4, status: "" },
];

const LOGS = [
  { id: 1, service: "Family Token Validator", status: "CRITICAL (장애)", latency: "TIMEOUT", time: "12분 전", color: "text-rose-600", bg: "bg-rose-600", icon: RotateCcw, btnText: "재시작", severity: 'critical' },
  { id: 2, service: "Notification Delivery Queue", status: "WARNING (지연)", latency: "1,240ms", time: "3분 전", color: "text-amber-500", bg: "bg-amber-500", icon: Settings, severity: 'warning' },
  { id: 3, service: "Auth OTP Service", status: "STABLE (정상)", latency: "8ms", time: "방금 전", color: "text-emerald-500", bg: "bg-emerald-500", icon: Settings, severity: 'stable' },
  { id: 4, service: "Wallet Transaction Engine", status: "STABLE (정상)", latency: "42ms", time: "1분 전", color: "text-emerald-500", bg: "bg-emerald-500", icon: Settings, severity: 'stable' },
  { id: 5, service: "Referral Reward Processor", status: "STABLE (정상)", latency: "15ms", time: "10분 전", color: "text-emerald-500", bg: "bg-emerald-500", icon: Settings, severity: 'stable' },
];

export const Dashboard = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const [filter, setFilter] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<any>({ total: 0, today: 0, session: 0, rate: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/apps/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { title: "총 사용자 수", value: stats.total.toLocaleString(), status: "정상 운영 중", sub: "인증 완료 사용자 기준", border: "border-l-[#10b981]", icon: Users, iconColor: "text-[#10b981]" },
    { title: "오늘 신규 인증 사용자", value: stats.today.toString(), status: "정상 운영 중", sub: "오늘 가입한 패밀리 멤버", border: "border-l-[#10b981]", icon: UserPlus, iconColor: "text-[#10b981]" },
    { title: "현재 활성 사용자 수", value: stats.session.toLocaleString(), status: "실시간 세션", sub: "현재 접속 기준 (가상)", border: "border-l-[#f59e0b]", icon: Zap, iconColor: "text-[#f59e0b]" },
    { title: "총 크레딧 잔액", value: "₩0", status: "준비 중", sub: "전체 보유 잔액", border: "border-l-slate-300", icon: Wallet, iconColor: "text-slate-300" },
    { title: "오늘 크레딧 사용량", value: "₩0", status: "준비 중", sub: "오늘의 트랜잭션", border: "border-l-slate-300", icon: CreditCard, iconColor: "text-slate-300" },
    { title: "추천 가입 수", value: "0", status: "정상", sub: "추천인 보상 대상 포함", border: "border-l-[#10b981]", icon: Share2, iconColor: "text-[#10b981]" },
  ];

  const filteredLogs = filter 
    ? LOGS.filter(log => log.severity === filter)
    : LOGS;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#131b2e] tracking-tight">Dashboard (통합 관제 대시보드)</h1>
          <p className="text-sm text-slate-500 mt-1">인증, 지갑, 추천, 앱 간 이동 흐름을 통합 관제하는 메인 보드</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full border border-rose-100 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse"></span>
            이상 탐지됨 (Action Required)
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 text-[11px] font-bold">
            <CheckBadge size={12} />
            Auth 정상
          </div>
          <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full border border-rose-100 text-[11px] font-bold cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => onNavigate?.('Wallet')}>
             <LayoutGrid size={12} />
            Wallet 에러
          </div>
          <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full border border-amber-100 text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => onNavigate?.('Notifications')}>
             <BellRing size={12} />
            Noti 주의
          </div>
          <div className="ml-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            LAST UPDATE: 14:02:45
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((m, i) => (
          <div 
            key={i} 
            onClick={() => {
              if (m.title.includes('사용자')) onNavigate?.('Users');
              if (m.title.includes('크레딧')) onNavigate?.('Wallet');
              if (m.title.includes('추천')) onNavigate?.('Referral');
            }}
            className={cn(
              "bg-white p-5 rounded-sm border border-slate-200 shadow-sm border-l-4 cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all", 
              m.border
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">{m.title}</p>
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-full border",
                  m.status.includes('정상') || m.status.includes('실시간') ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  m.status.includes('주의') || m.status.includes('준비') ? "bg-amber-50 text-amber-600 border-amber-100" :
                  "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                  {m.status}
                </span>
              </div>
              <div className={cn(m.iconColor)}>
                <m.icon size={20} strokeWidth={2.5} />
              </div>
            </div>
            <h2 className="text-4xl font-black text-[#131b2e] tracking-tighter mb-1">{m.value}</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {m.sub.split(' / ').map((t, idx) => (
                <span key={idx}>{idx > 0 && <span className="mx-1 text-slate-200">/</span>}{t}</span>
              ))}
            </p>
          </div>
        ))}
      </div>

      {/* Distribution & Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* App Inflow Distribution */}
        <section className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-black text-[#131b2e]">패밀리 앱 유입 분포</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">App Inflow Distribution (신규 유입 기준)</p>
          </div>
          
          <div className="space-y-6">
            {APP_INFLOW.map((app, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#131b2e] w-16">{app.name}</span>
                    {app.status && (
                      <span className={cn("text-[9px] font-black uppercase tracking-tighter", app.warning ? "text-amber-500" : "text-emerald-500")}>
                        {app.status}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-700">{app.percent}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-sm overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-1000", app.percent > 40 ? "bg-emerald-500" : app.percent > 20 ? "bg-amber-400" : "bg-slate-300")}
                    style={{ width: `${app.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-App Navigation Flow */}
        <section className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-lg font-black text-[#131b2e]">패밀리 앱 이동 흐름</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-2">
                Cross-App Navigation Flow
                <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">최근 1시간 기준</span>
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div className="w-8 border-t-2 border-dashed border-slate-200"></div>
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg relative">
                <LayoutGrid size={24} />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="w-8 border-t-2 border-dashed border-slate-200"></div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg border-2 border-emerald-100 flex items-center justify-center text-emerald-500">
                <LayoutGrid size={24} />
              </div>
              <div className="w-8 border-t-2 border-dashed border-slate-200"></div>
              <div className="w-12 h-12 bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-slate-300">
                <LayoutGrid size={24} />
              </div>
            </div>

            <div className="flex gap-4 mb-2">
              <div className="flex gap-2">
                 <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                 <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white"><LayoutGrid size={20} /></div>
                 <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100"><LayoutGrid size={20} /></div>
                 <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100"><LayoutGrid size={20} /></div>
              </div>
            </div>
            <div className="flex gap-16 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
               <span>금고지기</span>
               <span>어그로필터</span>
               <span>뭐먹지</span>
               <span>사진앱</span>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-4 pt-8 border-t border-slate-50">
             <div>
                <p className="text-[10px] font-black text-slate-900 mb-1">금고지기 → 어그로필터</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">가장 많은 이동 경로</p>
             </div>
             <div className="text-center">
                <p className="text-xl font-black text-slate-900 tracking-tighter">2.4개</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">평균 앱 전환 수</p>
             </div>
             <div className="text-right">
                <p className="text-xl font-black text-slate-900 tracking-tighter">1,284명</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">오늘 크로스앱 이동 사용자</p>
             </div>
          </div>
        </section>
      </div>

      {/* System Service Log */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-black text-[#131b2e]">시스템 상태로그</h3>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-3 py-1.5">
                <Search size={14} className="text-slate-400" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">정렬: 심각도 높은 순</span>
             </div>
             <div className="flex gap-1">
                <button 
                  onClick={() => setFilter(filter === 'critical' ? null : 'critical')}
                  className={cn("px-3 py-1 text-[11px] font-black rounded transition-all", filter === 'critical' ? "bg-rose-700 text-white scale-105 shadow-md" : "bg-rose-600 text-white hover:bg-rose-700")}
                >
                  심각 2
                </button>
                <button 
                  onClick={() => setFilter(filter === 'warning' ? null : 'warning')}
                  className={cn("px-3 py-1 text-[11px] font-black rounded transition-all", filter === 'warning' ? "bg-amber-600 text-white scale-105 shadow-md" : "bg-amber-500 text-white hover:bg-amber-600")}
                >
                  경고 5
                </button>
                <button 
                  onClick={() => setFilter(filter === 'stable' ? null : 'stable')}
                  className={cn("px-3 py-1 text-[11px] font-black rounded transition-all", filter === 'stable' ? "bg-emerald-200 text-emerald-800 scale-105 shadow-md" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200")}
                >
                  안정 128
                </button>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-5">서비스명</th>
                <th className="px-10 py-5">운영 상태</th>
                <th className="px-10 py-5">응답 속도</th>
                <th className="px-10 py-5">갱신 주기</th>
                <th className="px-10 py-5">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log) => (
                  <motion.tr 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white", log.bg)}>
                             <Database size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{log.service}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                         <span className={cn("w-2 h-2 rounded-full", log.status.includes('장애') ? "bg-rose-600" : log.status.includes('지연') ? "bg-amber-500" : "bg-emerald-500")}></span>
                         <span className={cn("text-[11px] font-black uppercase tracking-widest", log.color)}>{log.status}</span>
                      </div>
                    </td>
                    <td className={cn("px-10 py-6 font-bold text-xs", log.latency === 'TIMEOUT' ? "text-rose-600" : "text-slate-400")}>
                      {log.latency}
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-slate-400 capitalize">
                      {log.time}
                    </td>
                    <td className="px-10 py-6">
                       {log.btnText ? (
                         <button className="bg-[#ef4444] text-white px-4 py-1.5 rounded text-[11px] font-black uppercase tracking-wider">재시작</button>
                       ) : (
                         <button className="text-slate-300 hover:text-slate-600 p-1"><Settings size={18} /></button>
                       )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="py-8 bg-slate-50/30 text-center">
           <button className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600 transition-all">모든 장애 로그 분석 (VIEW ALL INCIDENTS)</button>
        </div>
      </section>
    </div>
  );
};

// --- Missing Icons Fix ---
const CheckBadge = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l3 3m0 0l3-3m-3 3v12m0 0l-3-3m3 3l3-3" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const BellRing = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
