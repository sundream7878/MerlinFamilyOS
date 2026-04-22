import React from 'react';
import { 
  Terminal, 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Share2, 
  Bell, 
  LayoutGrid,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }: SidebarProps) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <Users size={20} />, label: 'Users' },
    { icon: <Wallet size={20} />, label: 'Wallet' },
    { icon: <Share2 size={20} />, label: 'Referral' },
    { icon: <Bell size={20} />, label: 'Notifications' },
    { icon: <LayoutGrid size={20} />, label: 'Apps' },
  ];

  const sidebarContent = (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-52 bg-merlin-dark flex flex-col py-6 z-50 overflow-hidden shadow-2xl transition-transform duration-300 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="px-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-400 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Terminal size={14} className="text-merlin-dark" />
          </div>
          <div>
            <h1 className="text-base font-black text-white font-headline tracking-tighter leading-none">Merlin</h1>
            <p className="text-[9px] uppercase tracking-widest text-indigo-400/70 font-bold">OS Hub</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setActivePage(item.label);
              setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-300 rounded-lg font-headline text-sm tracking-tight text-left group",
              activePage === item.label 
                ? "bg-indigo-600/20 text-white font-bold border border-white/5 shadow-lg" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            <div className={cn(
              "transition-transform duration-300 group-hover:scale-110",
              activePage === item.label ? "text-indigo-400" : "text-slate-500"
            )}>
              {item.icon}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* System Core Status Box - REMOVED per User Request */}
    </aside>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      {sidebarContent}
    </>
  );
};
