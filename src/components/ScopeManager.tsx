import React from 'react';
import { Shield, Trash2, Save, X, Lock, Info, ChevronRight, Database, Globe, Wallet, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Scope {
  id: string;
  name: string;
  scope: string;
  description: string;
}

interface ScopeCategory {
  title: string;
  icon: React.ElementType;
  scopes: Scope[];
}

const MOCK_SCOPES: ScopeCategory[] = [
  {
    title: "인증 및 지갑 핵심 권한",
    icon: Shield,
    scopes: [
      { id: 'S1', name: 'Hub Auth API', scope: 'auth:login', description: '허브 계정을 통한 통합 로그인 권한 (승인됨)' },
      { id: 'S2', name: 'Hub Wallet API', scope: 'wallet:use', description: '유저 크레딧 조회 및 차감 결제 권한 (승인됨)' },
    ]
  },
  {
    title: "데이터 공유 범위",
    icon: Database,
    scopes: [
      { id: 'S3', name: 'Family Profile API', scope: 'user:profile.read', description: '기본 프로필 정보 및 닉네임 접근' },
    ]
  }
];

export const ScopeManager = ({ 
  appId, 
  appName, 
  onCancel, 
  onSave 
}: { 
  appId: string; 
  appName: string; 
  onCancel: () => void; 
  onSave: () => void; 
}) => {
  const [categories, setCategories] = React.useState(MOCK_SCOPES);
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       onSave();
    }, 800);
  };

  return (
    <div className="flex flex-col gap-8 bg-white p-10 rounded-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] max-w-4xl w-full border-4 border-[#2d5af0] animate-in fade-in zoom-in-95 duration-300">
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#2d5af0] rounded-full flex items-center justify-center text-white shadow-lg">
              <Shield size={24} strokeWidth={3} />
           </div>
           <div>
              <div className="flex items-center gap-2">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">서비스 권한(Scope) 관리</h2>
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-full uppercase border border-indigo-100">{appName}</span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Merlin Hub Permission Control Center</p>
           </div>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-900">
           <X size={24} />
        </button>
      </header>

      <div className="p-5 bg-blue-50/50 border-l-8 border-[#2d5af0] flex gap-4">
         <Info size={20} className="text-[#2d5af0] shrink-0 mt-0.5" />
         <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
            이 설정은 매우 민감한 사용자 데이터 액세스를 결정합니다. <br/>
            현재 <span className="text-[#2d5af0] font-black underline">어그로필터</span>는 허브 로그인과 지갑 결제 권한이 활성화되어 있습니다.
         </p>
      </div>

      <div className="space-y-12">
        {categories.map((category, catIdx) => (
          <section key={catIdx} className="space-y-5">
            <div className="flex items-center gap-3">
              <category.icon size={20} className="text-[#2d5af0]" />
              <h3 className="text-[17px] font-black text-slate-900 tracking-tight">{category.title}</h3>
            </div>
            
            <div className="overflow-hidden border-2 border-slate-100 rounded-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-6 py-4 w-1/4">연동 API</th>
                    <th className="px-6 py-4 w-1/4">권한 범위(Scope)</th>
                    <th className="px-6 py-4">허용 기능 설명</th>
                    <th className="px-6 py-4 text-center">상세</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {category.scopes.map((scope) => (
                    <tr key={scope.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 text-[14px] font-black text-slate-800">{scope.name}</td>
                      <td className="px-6 py-5">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded font-mono text-[12px] font-bold border border-slate-200">
                           {scope.scope}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[14px] font-bold text-slate-600">{scope.description}</td>
                      <td className="px-6 py-5 text-center">
                        <CheckCircle2 size={24} className="text-emerald-500 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <footer className="pt-8 border-t-2 border-slate-100 flex justify-end gap-4">
          <button 
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-4 text-[13px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest"
          >
            닫기
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-10 py-4 bg-[#2d5af0] hover:bg-blue-700 text-white text-[13px] font-black uppercase tracking-widest rounded-lg shadow-xl active:scale-95 transition-all flex items-center gap-2"
          >
            {loading ? '처리 중...' : '변경사항 저장 및 동기화'}
          </button>
      </footer>
    </div>
  );
};
