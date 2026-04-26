import React from 'react';
import { 
  Users as UsersIcon, 
  UserPlus,
  Search,
  Filter,
  Download,
  MapPin,
  Zap,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  CalendarDays,
  LayoutGrid
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Users = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>({ total: 0, today: 0, session: 0, rate: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          fetch('/api/apps/users'),
          fetch('/api/apps/stats')
        ]);
        const usersData = await usersRes.json();
        const statsData = await statsRes.json();
        
        setUsers(usersData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch hub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      {/* Header Area */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#131b2e] tracking-tight">사용자 통합 제어</h1>
          <p className="text-sm text-slate-400 font-bold italic opacity-80 underline underline-offset-4 decoration-indigo-200">Merlin Ecosystem Universal Identity Manager</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all border border-slate-200">
            <Download size={14} /> 데이터 내보내기
          </button>
          <button className="flex items-center gap-2 bg-[#2d5af0] hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-100 transition-all">
            <UserPlus size={14} /> 신구 유저 등록
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { title: "전체 사용자", value: stats.total.toLocaleString(), unit: "명", icon: UsersIcon, color: "text-emerald-500", border: "border-l-emerald-500" },
          { title: "오늘 신규", value: `+${stats.today}`, unit: "명", icon: UserPlus, color: "text-[#2d5af0]", border: "border-l-[#2d5af0]" },
          { title: "실시간 세션", value: stats.session.toLocaleString(), unit: "건", icon: Zap, color: "text-amber-500", border: "border-l-amber-500" },
          { title: "인증 완료율", value: stats.rate.toString(), unit: "%", icon: ShieldCheck, color: "text-indigo-400", border: "border-l-indigo-400" },
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

      {/* User Table Section */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#2d5af0] rounded-full" />
             <h3 className="text-[12px] font-black text-slate-600 uppercase tracking-[0.15em]">통합 ID 발급 현황</h3>
           </div>
           <div className="flex items-center gap-4">
             <div className="relative">
               <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="UID, 이메일 검색..." className="bg-white border border-slate-200 rounded-sm pl-9 pr-2 py-1.5 text-[11px] w-64 outline-none focus:ring-1 focus:ring-indigo-300 font-bold text-slate-600" />
             </div>
             <button className="p-1.5 border border-slate-200 rounded-sm text-slate-400 hover:bg-slate-50">
               <Filter size={14} />
             </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                <th className="pl-4 py-2.5 w-10 text-center">#</th>
                <th className="px-2 py-2.5 w-32 text-center">HUB UUID</th>
                <th className="px-3 py-2.5 w-56 text-left border-r border-slate-100">사용자 프로필</th>
                <th className="px-4 py-2.5 w-28">최초 가입 앱</th>
                <th className="px-4 py-2.5 w-24 text-center">상태</th>
                <th className="px-4 py-2.5 w-20 text-center">앱 수</th>
                <th className="px-3 py-2.5 w-40 text-left border-l border-slate-100">지역 정보</th>
                <th className="pr-4 py-2.5 text-center w-32">최초 가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-xs font-bold text-slate-400 animate-pulse">
                    데이터를 실시간으로 동기화 중입니다...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-xs font-bold text-slate-400">
                    등록된 사용자가 없습니다.
                  </td>
                </tr>
              ) : users.map((user, idx) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group border-l-4 border-transparent hover:border-l-indigo-500 text-[13px]">
                  <td className="pl-4 py-3 font-black text-slate-300 text-center tabular-nums">{idx + 1}</td>
                  <td className="px-2 py-3 text-center">
                    <span 
                      className="inline-flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-sm cursor-copy hover:bg-slate-100 hover:text-indigo-600 transition-colors" 
                      title="클릭하여 전체 UUID 복사"
                      onClick={() => {
                        navigator.clipboard.writeText(user.id);
                        alert('UUID가 복사되었습니다.');
                      }}
                    >
                      {user.id.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="px-3 py-3 border-r border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md overflow-hidden border border-slate-100 shadow-sm p-0.5 bg-white shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} className="w-full h-full object-cover rounded-md" alt="" />
                        ) : (
                          <img src={`https://picsum.photos/seed/${user.email}/64/64`} className="w-full h-full object-cover rounded-md" alt="" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[14px] font-black text-slate-800 tracking-tight flex items-center gap-1 group-hover:text-[#2d5af0] transition-colors cursor-pointer truncate">
                          {user.nickname || user.email.split('@')[0]}
                          <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100" />
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 truncate opacity-70">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                       <LayoutGrid size={11} className="text-[#2d5af0] opacity-30" />
                       <span className="text-[12px] font-bold text-slate-600 truncate">
                         {(!user.first_app_id || user.first_app_id === 'APP-01' || user.first_app_id === 'UNKNOWN') ? '어그로필터' : '멀린앱'}
                       </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <ShieldCheck size={9} />
                        활성
                      </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-[11px] font-black text-[#2d5af0] border border-slate-100">
                      1
                    </div>
                  </td>
                  <td className="px-3 py-3 border-l border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      {user.region ? (
                        <>
                          <MapPin size={10} className="text-indigo-300" />
                          <span className="text-slate-600 truncate">{user.region}</span>
                        </>
                      ) : (
                        <span className="text-slate-200 italic text-[10px]">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="pr-4 py-3 text-center">
                     <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400">
                       <CalendarDays size={10} className="opacity-30" />
                       {new Date(user.created_at).toLocaleDateString()}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-8 py-5 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Showing 3 Root Identity Records</p>
           <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-[11px] font-black text-slate-400 hover:bg-slate-50">이전</button>
              <div className="flex items-center gap-1 px-4">
                 <span className="w-6 h-6 flex items-center justify-center bg-[#2d5af0] text-white text-[11px] font-black rounded-sm shadow-sm">1</span>
              </div>
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-[11px] font-black text-slate-400 hover:bg-slate-50">다음</button>
           </div>
        </div>
      </section>
    </div>
  );
};
