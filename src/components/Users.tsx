import React from 'react';
import { 
  Users as UsersIcon, 
  UserPlus,
  Search,
  Filter,
  Download,
  MoreVertical,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Mail,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Copy,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_USERS = [
  { id: '1', email: 'sarah.lee@merlin.io', familyUid: 'FL-8821-XP', nickname: '서울숲지기', region: 'Seoul', sourceApp: '금고지기', lastActive: '2 min ago', status: 'Active', verification: 'Verified', balance: '1,240.00 M', avatar: 'https://picsum.photos/seed/user1/64/64' },
  { id: '2', email: 'jiwon.park@gmail.com', familyUid: 'FL-3301-ZK', nickname: '박지원', region: 'Busan', sourceApp: '뭐먹지', lastActive: '3 days ago', status: 'Dormant', verification: 'Pending', balance: '850.25 M', avatar: 'https://picsum.photos/seed/user2/64/64' },
  { id: '3', email: 'tech_enthusiast@outlook.com', familyUid: 'FL-1156-MM', nickname: '얼리어답터', region: 'Incheon', sourceApp: '금고지기', lastActive: '1 week ago', status: 'Banned', verification: 'None', balance: '0.00 M', avatar: 'https://picsum.photos/seed/user3/64/64' },
  { id: '4', email: 'minho_trading@kakao.com', familyUid: 'FL-0092-RE', nickname: '차트장인', region: 'Jeju', sourceApp: '사진앱', lastActive: 'Just now', status: 'Active', verification: 'Verified', balance: '12,900.00 M', avatar: 'https://picsum.photos/seed/user4/64/64' },
];

export const Users = () => {
  const [toast, setToast] = React.useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast(`${text} 복사되었습니다`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-sm shadow-2xl border border-white/10 flex items-center gap-3"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#131b2e] tracking-tight">사용자 통합 관리</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Family OS 생태계 내 모든 서비스 통합 사용자 데이터베이스</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all">
            <Download size={14} />
            Excel 내보내기
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-200 transition-all">
            <UserPlus size={14} />
            사용자 추가
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "전체 사용자", value: "1,248,392명", sub: "통합 ID 발급 기준", icon: UsersIcon, color: "text-emerald-500", bg: "border-l-emerald-500" },
          { title: "신규 가입 (오늘)", value: "+4,102명", sub: "전체 앱 합산 유입", icon: UserPlus, color: "text-indigo-500", bg: "border-l-indigo-500" },
          { title: "실시간 접속", value: "18,529명", sub: "현재 활성 세션 수", icon: Zap, color: "text-amber-500", bg: "border-l-amber-500" },
          { title: "이메일 인증 성공률", value: "94.2%", sub: "최근 24시간 실시간 지표", icon: Mail, color: "text-indigo-400", bg: "border-l-indigo-400" },
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

      {/* Filter & Table Area */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="UID, 닉네임, 이메일 주소로 검색..." 
              className="bg-slate-50 border border-slate-200 rounded-sm pl-10 pr-4 py-2 text-xs w-80 outline-none focus:ring-1 focus:ring-indigo-200 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-sm text-slate-400 hover:bg-slate-50 transition-all">
              <Filter size={14} />
            </button>
            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">정렬: 가입 순</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-4">사용자 프로필</th>
                <th className="px-8 py-4">Family UID</th>
                <th className="px-8 py-4">지역</th>
                <th className="px-8 py-4">유입 앱</th>
                <th className="px-8 py-4">상태</th>
                <th className="px-8 py-4 text-right">잔액 (M)</th>
                <th className="px-8 py-4 text-center">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-9 h-9 rounded-sm border border-slate-200 object-cover" referrerPolicy="no-referrer" />
                      <div className="flex flex-col">
                        <button className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors text-left group flex items-center gap-1">
                          {user.nickname}
                          <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <span className="text-[11px] text-slate-400">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => copyToClipboard(user.familyUid)}
                      className="group flex items-center gap-2 text-[11px] font-black text-slate-500 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-sm transition-all"
                    >
                      {user.familyUid}
                      <Copy size={10} className="text-slate-300 group-hover:text-indigo-500" />
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                      <MapPin size={10} /> {user.region}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-sm border",
                      user.sourceApp === '금고지기' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}>
                      {user.sourceApp}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        user.status === 'Active' ? "text-emerald-500" : user.status === 'Dormant' ? "text-amber-500" : "text-rose-600"
                      )}>
                        {user.status}
                      </span>
                      <span className="text-[9px] text-slate-300 font-bold uppercase">{user.lastActive}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-[#131b2e] text-sm">
                    {user.balance.replace(' M', '')}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {user.status === 'Banned' ? (
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-wider transition-all shadow-sm">Unblock</button>
                      ) : user.status === 'Dormant' ? (
                        <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1">
                           <BellRing size={10} />
                           Remind
                        </button>
                      ) : (
                        <button className="text-slate-300 hover:text-slate-600 transition-all">
                          <Settings2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-10 py-6 bg-slate-50/10 border-t border-slate-50 flex items-center justify-between font-bold text-slate-400 text-[11px] uppercase tracking-widest">
           <div>검색 결과: <span className="text-slate-900">4</span> 명</div>
           <div className="flex gap-4">
              <button disabled className="opacity-30 cursor-not-allowed">이전</button>
              <button className="text-slate-900 border-b-2 border-slate-900">1</button>
              <button className="hover:text-slate-900">2</button>
              <button className="hover:text-slate-900">3</button>
              <button className="hover:text-slate-900">다음</button>
           </div>
        </div>
      </section>
    </div>
  );
};
