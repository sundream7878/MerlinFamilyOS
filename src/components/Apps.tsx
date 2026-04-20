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
  { no: 2, id: 'APP-02', logo: '', name: '금고지기', status: '운영중', openDate: '24년 10월 오픈', authStatus: true, walletStatus: true, secretTail: '123-x5' },
  { no: 3, id: 'APP-03', logo: '', name: '뭐먹지', status: '운영중', openDate: '25년 1월 오픈', authStatus: true, walletStatus: false, secretTail: 'abc-00' },
  { no: 4, id: 'APP-04', logo: '', name: '사진앱', status: '중지됨', openDate: '24년 8월 오픈', authStatus: false, walletStatus: false, secretTail: 'err-99' },
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
    alert(`[${app.name}] 연동용 환경변수 3종이 복사되었습니다!\n\n.env 파일에 바로 붙여넣으세요.`);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#131b2e] tracking-tight">생태계 앱 통합 관리</h1>
          <p className="text-sm text-slate-400 font-bold">멀린 허브 생태계 연동 보안 및 권한 제어 센터 (ADMIN)</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-sm text-[11px] font-bold transition-all">
            <Plus size={14} /> 새 인스턴스 할당
          </button>
          <button className="flex items-center gap-2 bg-[#2d5af0] hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-[11px] font-bold shadow-lg shadow-indigo-100 transition-all">
            <Zap size={14} /> 엔진 최적화
          </button>
        </div>
      </section>

      {/* Main App Table */}
      <section className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest tracking-[0.2em]">Merlin Ecosystem Management</h3>
           <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="앱 검색..." className="bg-white border border-slate-200 rounded-sm pl-9 pr-2 py-1.5 text-xs w-48 outline-none focus:ring-1 focus:ring-indigo-300 font-medium" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-tight">
                <th className="pl-6 py-3 w-12 text-center">NO.</th>
                <th className="px-4 py-3 w-20 text-center">ID</th>
                <th className="px-4 py-3 w-16 text-center text-slate-300">LOGO</th>
                <th className="px-4 py-3 w-40 text-left border-r border-slate-100 italic">APP NAME</th>
                <th className="px-6 py-3 w-28">현재상태</th>
                <th className="px-4 py-3 w-32 text-center">서비스시작일</th>
                <th className="px-4 py-3 w-44 text-left bg-slate-50/50">보안 (ENV COPY)</th>
                <th className="pr-6 py-3 text-left bg-blue-50/10">권한 관리 (SAFE)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {apps.map((app) => {
                const isEditing = editingId === app.id;
                const authVal = isEditing ? tempStates.authStatus : app.authStatus;
                const walletVal = isEditing ? tempStates.walletStatus : app.walletStatus;

                return (
                  <tr key={app.id} className={cn("transition-colors group", isEditing ? "bg-amber-50" : "hover:bg-indigo-50/20")}>
                    <td className="pl-6 py-3 text-[14px] font-black text-slate-300 text-center tabular-nums">{app.no}</td>
                    <td className="px-4 py-3 text-[12px] font-black text-indigo-500 font-mono tracking-tighter text-center">{app.id}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded mx-auto flex items-center justify-center text-[8px] font-black text-slate-200">LOGO</div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <span className="text-[17px] font-black text-slate-800 whitespace-nowrap tracking-tight">{app.name}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                         <span className={cn("w-2 h-2 rounded-full", app.status === '운영중' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                         <span className={cn("text-[14px] font-bold uppercase", app.status === '운영중' ? "text-emerald-700" : "text-slate-400")}>{app.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-bold text-slate-500 text-center tabular-nums leading-none tracking-tight">{app.openDate}</td>
                    
                    {/* 보안 (Env-var Set Copy) */}
                    <td className="px-4 py-3 bg-slate-50/20 relative group/key">
                      <div className="flex items-center justify-between gap-1 pr-4">
                        <div className="flex flex-col text-right leading-none">
                          <span className="text-[9px] font-black text-slate-300 tracking-widest font-mono">agro-••••••••</span>
                          <span className="text-[10px] font-black text-slate-500 font-mono tracking-tighter">{app.secretTail}</span>
                        </div>
                        <button 
                          onClick={() => copyEnvSet(app)} 
                          className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-amber-100 text-amber-500 hover:bg-amber-500 hover:text-white rounded text-[10px] font-black transition-all shadow-sm"
                          title="환경변수 세트 복사"
                        >
                          <Lock size={12} />
                          복사
                        </button>
                      </div>
                    </td>

                    {/* 권한관리 */}
                    <td className="pr-6 py-3 bg-blue-50/5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                           <button 
                             onClick={() => isEditing && toggleTemp('authStatus')}
                             disabled={!isEditing}
                             className={cn(
                               "px-2.5 py-1 rounded text-[10px] font-black tracking-tighter transition-all flex items-center gap-1.5 border-2",
                               authVal 
                                ? "bg-[#2d5af0] text-white border-[#2d5af0]" 
                                : "bg-slate-200 text-slate-400 border-slate-200",
                               isEditing ? "cursor-pointer hover:scale-105 active:scale-95 shadow-sm" : "cursor-default opacity-80 shadow-none border-transparent"
                             )}
                           >
                             {authVal ? <CheckCircle2 size={10} strokeWidth={3} /> : <XCircle size={10} />}
                             AUTH:LOGIN
                           </button>
                           <button 
                             onClick={() => isEditing && toggleTemp('walletStatus')}
                             disabled={!isEditing}
                             className={cn(
                               "px-2.5 py-1 rounded text-[10px] font-black tracking-tighter transition-all flex items-center gap-1.5 border-2",
                               walletVal 
                                ? "bg-[#10b981] text-white border-[#10b981]" 
                                : "bg-slate-200 text-slate-400 border-slate-200",
                               isEditing ? "cursor-pointer hover:scale-105 active:scale-95 shadow-sm" : "cursor-default opacity-80 shadow-none border-transparent"
                             )}
                           >
                             {walletVal ? <CheckCircle2 size={10} strokeWidth={3} /> : <XCircle size={10} />}
                             WALLET:USE
                           </button>
                        </div>

                        {/* 제어 버튼 */}
                        <div className="flex items-center bg-white p-1 rounded border border-slate-100 shadow-inner">
                          {isEditing ? (
                            <div className="flex gap-1">
                              <button onClick={() => saveEdit(app.id)} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded shadow-sm">저장</button>
                              <button onClick={cancelEdit} className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-black rounded">취소</button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => startEdit(app)} 
                              className="px-2 py-1 bg-slate-50 hover:bg-indigo-50 text-indigo-500/50 hover:text-indigo-600 text-[10px] font-black rounded border border-slate-100 transition-all opacity-40 group-hover:opacity-100"
                            >
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
