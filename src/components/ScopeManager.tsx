import React from 'react';
import { Shield, Trash2, Save, X, Lock, Info, ChevronRight, Database, Globe, Wallet } from 'lucide-react';
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
    title: "Wallet 서비스 범위",
    icon: Wallet,
    scopes: [
      { id: 'S1', name: 'Family Wallet API', scope: 'family:wallet.balance.readonly', description: '사용자의 통합 크레딧 잔액 조회' },
      { id: 'S2', name: 'Family Wallet API', scope: 'family:wallet.transaction.write', description: '서비스 이용에 따른 크레딧 차감 및 적립' },
    ]
  },
  {
    title: "Gmail/Identity 범위",
    icon: Globe,
    scopes: [
      { id: 'S3', name: 'Family Auth API', scope: 'family:auth.profile.read', description: '사용자 기본 프로필 정보 및 닉네임 접근' },
      { id: 'S4', name: 'Family Auth API', scope: 'family:auth.email.read', description: '사용자 이메일 주소 확인 (민감 데이터)' },
    ]
  }
];

export const ScopeManager = ({ onCancel, onSave }: { onCancel: () => void, onSave: () => void }) => {
  const [categories, setCategories] = React.useState(MOCK_SCOPES);

  const removeScope = (categoryId: number, scopeId: string) => {
    setCategories(prev => prev.map((cat, idx) => {
      if (idx === categoryId) {
        return { ...cat, scopes: cat.scopes.filter(s => s.id !== scopeId) };
      }
      return cat;
    }));
  };

  return (
    <div className="flex flex-col gap-8 bg-white p-10 rounded-sm border border-slate-200 shadow-2xl max-w-4xl w-full animate-in fade-in zoom-in-95 duration-300">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center text-white">
              <Lock size={20} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">제한된 범위 (Restricted Scopes)</h2>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Family OS App Permission Management</p>
           </div>
        </div>
        <div className="p-4 bg-slate-50 border-l-4 border-slate-900 flex gap-3">
           <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
           <p className="text-xs font-bold text-slate-600 leading-relaxed">
              제한된 범위는 매우 민감한 사용자 데이터에 대한 액세스를 요청하는 범위입니다. 
              해당 앱이 아래의 권한을 사용하여 유저의 자산(크레딧)이나 신원 정보를 조작할 수 있도록 허용합니다.
           </p>
        </div>
      </header>

      <div className="space-y-10">
        {categories.map((category, catIdx) => (
          <section key={catIdx} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <category.icon size={18} className="text-slate-900" />
              <h3 className="text-sm font-black text-slate-900 tracking-tight">{category.title}</h3>
            </div>
            
            <div className="overflow-hidden border border-slate-200 rounded-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-3">API ↑</th>
                    <th className="px-6 py-3">범위</th>
                    <th className="px-6 py-3">사용자에게 표시되는 설명</th>
                    <th className="px-6 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {category.scopes.length > 0 ? category.scopes.map((scope) => (
                    <tr key={scope.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-[11px] font-bold text-slate-600">{scope.name}</td>
                      <td className="px-6 py-4 text-[11px] font-mono font-medium text-slate-400">.../{scope.scope.split('.').pop()}</td>
                      <td className="px-6 py-4 text-[11px] font-bold text-slate-900">{scope.description}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => removeScope(catIdx, scope.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-xs font-bold text-slate-400 italic bg-slate-50/30">
                         할당된 범위가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <footer className="pt-8 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-1 rounded border border-slate-100 uppercase tracking-widest">변경사항 없음</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="px-6 py-3 text-[11px] font-black text-slate-400 hover:bg-slate-50 rounded uppercase tracking-widest transition-all"
          >
            변경사항 취소
          </button>
          <button 
            onClick={onSave}
            className="px-8 py-3 bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest rounded shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 transition-all flex items-center gap-2"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </footer>
    </div>
  );
};
