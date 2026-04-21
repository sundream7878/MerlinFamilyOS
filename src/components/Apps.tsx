import React from 'react';
import { 
  Search, 
  Plus,
  Zap,
  Lock,
  CheckCircle2,
  XCircle,
  Settings2
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_APPS = [
  { no: 1, id: 'APP-01', logo: '', name: '어그로필터', status: '준비중', openDate: '26년 5월 예정', authStatus: true, walletStatus: true, secretTail: '777-v1' },
  { no: 2, id: 'APP-02', logo: '', name: '금고지기', status: '준비중', openDate: '26년 7월 예정', authStatus: false, walletStatus: false, secretTail: '123-x5' },
  { no: 3, id: 'APP-03', logo: '', name: '뭐먹지', status: '준비중', openDate: '26년 8월 예정', authStatus: false, walletStatus: false, secretTail: 'abc-00' },
  { no: 4, id: 'APP-04', logo: '', name: '사진앱', status: '준비중', openDate: '26년 9월 예정', authStatus: false, walletStatus: false, secretTail: 'err-99' },
];

export const Apps = () => {
  const [apps, setApps] = React.useState(MOCK_APPS);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [tempStates, setTempStates] = React.useState<any>({});

  const startEdit = (app: any) => {
    setEditingId(app.id);
    setTempStates({ authStatus: app.authStatus, walletStatus: app.walletStatus });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempStates({});
  };

  const saveEdit = (id: string) => {
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, ...tempStates };
      }
      return app;
    }));
    setEditingId(null);
    setTempStates({});
  };

  const toggleTemp = (field: 'authStatus' | 'walletStatus') => {
    setTempStates((prev: any) => ({ ...prev, [field]: !prev[field] }));
  };

  const copyEnvSet = (app: any) => {
    const secret = `agro-key-${app.secretTail}`;
    const envString = `MERLIN_HUB_CLIENT_ID=${app.id}\nMERLIN_HUB_CLIENT_SECRET=${secret}\nMERLIN_HUB_URL=http://localhost:3001`;
    
    navigator.clipboard.writeText(envString);
    alert(`[${app.name}] 연동용 환경변수 세트 복사 완료!`);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#131b2e] tracking-tight">생태계 앱 통합 관리</h1>
          <p className="text-sm text-slate-400 font-bold italic opacity-80 underline underline-offset-4 decoration-indigo-200">Merlin Core Instance Control Center</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all border border-slate-200">
            <Plus size={14} /> 새 인스턴스 할당
          </button>
          <button className="flex items-center gap-2 bg-[#2d5af0] hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-100 transition-all">
            <Zap size={14} /> 엔진 연동 동기화
          </button>
        </div>
      </section>

      {/* Main App Table */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#2d5af0] rounded-full" />
             <h3 className="text-[12px] font-black text-slate-600 uppercase tracking-[0.15em]">인스턴스 서비스 현황</h3>
           </div>
           <div className="relative">
             <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="서비스 필터링..." className="bg-white border border-slate-200 rounded-sm pl-9 pr-2 py-1.5 text-[11px] w-56 outline-none focus:ring-1 focus:ring-indigo-300 font-bold text-slate-600" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                <th className="pl-6 py-4 w-12 text-center">NO.</th>
                <th className="px-4 py-4 w-20 text-center">ID</th>
                <th className="px-4 py-4 w-16 text-center">로고</th>
                <th className="px-4 py-4 w-48 text-left border-r border-slate-100">서비스 명칭</th>
                <th className="px-6 py-4 w-32">현재상태</th>
                <th className="px-4 py-4 w-36 text-center">서비스시작일</th>
                <th className="px-4 py-4 w-48 text-left bg-slate-50/50">보안 (ENV SETUP)</th>
                <th className="pr-6 py-4 text-left bg-blue-50/10">권한 관리 (SAFE-LOCK)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {apps.map((app) => {
                const isEditing = editingId === app.id;
                const authVal = isEditing ? tempStates.authStatus : app.authStatus;
                const walletVal = isEditing ? tempStates.walletStatus : app.walletStatus;
                
                // 앱별 활성/비활성 실루엣 처리
                const isAppInactive = app.no > 1; 

                return (
                  <tr key={app.id} className={cn(
                    "transition-all group border-l-4 border-transparent", 
                    isEditing ? "bg-amber-50 border-l-amber-500" : "hover:bg-slate-50/50 hover:border-l-indigo-500",
                    isAppInactive && !isEditing && "opacity-60 saturate-50"
                  )}>
                    <td className="pl-6 py-4 text-[14px] font-black text-slate-300 text-center tabular-nums">{app.no}</td>
                    <td className="px-4 py-4 text-[12px] font-black text-indigo-400 font-mono tracking-tighter text-center">{app.id}</td>
                    <td className="px-4 py-4 text-center">
                      <div className={cn(
                        "w-10 h-10 border rounded-lg mx-auto flex items-center justify-center text-[8px] font-black tracking-widest transition-all",
                        isAppInactive ? "bg-slate-100 border-slate-200 text-slate-300" : "bg-white border-slate-100 text-[#2d5af0] shadow-sm shadow-indigo-100 outline outline-2 outline-indigo-50"
                      )}>
                        {isAppInactive ? 'PENDING' : 'LOGO'}
                      </div>
                    </td>
                    <td className="px-4 py-4 border-r border-slate-100">
                      <div className="flex flex-col">
                        <span className={cn("text-[17px] font-black tracking-tight", isAppInactive ? "text-slate-400" : "text-slate-800")}>{app.name}</span>
                        {isAppInactive && <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Under Preparation</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5 whitespace-nowrap">
                         <div className="relative flex h-2.5 w-2.5">
                            {app.no === 1 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>}
                            <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", isAppInactive ? "bg-slate-300" : "bg-amber-500")} />
                         </div>
                         <span className={cn("text-[14px] font-black", isAppInactive ? "text-slate-400" : "text-amber-600 uppercase italic")}>{app.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] font-bold text-slate-500 text-center tabular-nums tracking-tighter">{app.openDate}</td>
                    
                    {/* 보안 */}
                    <td className="px-4 py-4 bg-slate-50/20">
                      <div className="flex items-center justify-between gap-1 pr-4">
                        <div className="flex flex-col text-right leading-none select-none">
                          <span className="text-[9px] font-black text-slate-200 tracking-[0.2em] font-mono">APP-KEY-••••••••</span>
                          <span className="text-[10px] font-black text-slate-300 font-mono italic">{app.secretTail}</span>
                        </div>
                        <button 
                          onClick={() => copyEnvSet(app)} 
                          disabled={isAppInactive && !isEditing}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-black transition-all shadow-sm border",
                            isAppInactive && !isEditing 
                              ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                              : "bg-white border-amber-100 text-amber-500 hover:bg-amber-500 hover:text-white"
                          )}
                        >
                          <Lock size={12} />
                          연동복사
                        </button>
                      </div>
                    </td>

                    {/* 권한관리 */}
                    <td className="pr-6 py-4 bg-blue-50/5">
                      <div className="flex items-center justify-between gap-4 py-1">
                        <div className="flex items-center gap-1.5">
                           <button 
                             onClick={() => isEditing && toggleTemp('authStatus')}
                             disabled={!isEditing}
                             className={cn(
                               "px-3 py-1.5 rounded text-[10px] font-black tracking-tighter transition-all flex items-center gap-1.5 border-2",
                               authVal 
                                ? "bg-[#2d5af0] text-white border-[#2d5af0]" 
                                : "bg-slate-200 text-slate-400 border-slate-200",
                               isEditing ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default opacity-80"
                             )}
                           >
                             {authVal ? <CheckCircle2 size={10} strokeWidth={3} /> : <XCircle size={10} />}
                             AUTH:LOGIN
                           </button>
                           <button 
                             onClick={() => isEditing && toggleTemp('walletStatus')}
                             disabled={!isEditing}
                             className={cn(
                               "px-3 py-1.5 rounded text-[10px] font-black tracking-tighter transition-all flex items-center gap-1.5 border-2",
                               walletVal 
                                ? "bg-[#10b981] text-white border-[#10b981]" 
                                : "bg-slate-200 text-slate-400 border-slate-200",
                               isEditing ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default opacity-80"
                             )}
                           >
                             {walletVal ? <CheckCircle2 size={10} strokeWidth={3} /> : <XCircle size={10} />}
                             WALLET:USE
                           </button>
                        </div>

                        {/* 제어 버튼 */}
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(app.id)} className="px-3 py-1 bg-[#2d5af0] text-white text-[11px] font-black rounded shadow-md">저장</button>
                              <button onClick={cancelEdit} className="px-3 py-1 bg-slate-200 text-slate-500 text-[11px] font-black rounded">취소</button>
                            </>
                          ) : (
                            <button 
                              onClick={() => startEdit(app)} 
                              className="px-3 py-1 bg-white hover:bg-slate-50 text-indigo-500/40 hover:text-indigo-600 text-[11px] font-black rounded border border-slate-100 transition-all opacity-40 group-hover:opacity-100 flex items-center gap-1"
                            >
                              <Settings2 size={12} />
                              수정
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
