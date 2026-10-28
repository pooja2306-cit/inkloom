import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FileCheck2, 
  UploadCloud, 
  BookMarked, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Building2,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { user, reviews } = useApp();

  const pendingApprovalsCount = reviews.filter(
    (r) => r.status === 'Pending Approval' || r.status === 'Changes Requested'
  ).length;

  const navItems = [
    { label: 'Overview', to: '/', icon: LayoutDashboard },
    { label: 'Content Reviews', to: '/reviews', icon: FileCheck2 },
    { label: 'Submit Content', to: '/submit', icon: UploadCloud },
    { label: 'Brand Knowledge Hub', to: '/knowledge', icon: BookMarked },
    { 
      label: 'Approval Queue', 
      to: '/approvals', 
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
    },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#17212B] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Brand Logo */}
        <div>
          <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7866E8] to-[#25A99A] flex items-center justify-center text-white shadow-sm shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm font-bold tracking-tight text-white leading-tight">
                  Inkloom AI
                </span>
                <span className="block text-[11px] font-medium text-[#25A99A] tracking-wider uppercase">
                  BrandGuard
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white md:hidden"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#7866E8] text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-500 text-white rounded-md tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Workspace & User Profile */}
        <div className="p-3 border-t border-white/10 space-y-3">
          {/* Workspace info */}
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-[#25A99A] shrink-0" />
              <div className="truncate">
                <div className="text-[11px] font-semibold text-white truncate">
                  {user.workspace}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  NexaWear Brand Space
                </div>
              </div>
            </div>
          </div>

          {/* User profile card */}
          <div className="flex items-center gap-3 px-2 py-1.5">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
