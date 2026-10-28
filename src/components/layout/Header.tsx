import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  FileText,
  ChevronRight,
  X
} from 'lucide-react';

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reviews, guidelines, facts, user } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs from path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'BrandGuard', to: '/' }, { label: 'Overview' }];
    if (path === '/reviews') return [{ label: 'BrandGuard', to: '/' }, { label: 'Content Reviews' }];
    if (path.startsWith('/reviews/')) {
      const id = path.split('/')[2];
      return [
        { label: 'BrandGuard', to: '/' },
        { label: 'Content Reviews', to: '/reviews' },
        { label: id }
      ];
    }
    if (path === '/submit') return [{ label: 'BrandGuard', to: '/' }, { label: 'Submit Content' }];
    if (path === '/knowledge') return [{ label: 'BrandGuard', to: '/' }, { label: 'Brand Knowledge Hub' }];
    if (path === '/approvals') return [{ label: 'BrandGuard', to: '/' }, { label: 'Approval Queue' }];
    if (path === '/analytics') return [{ label: 'BrandGuard', to: '/' }, { label: 'Analytics' }];
    if (path === '/settings') return [{ label: 'BrandGuard', to: '/' }, { label: 'Settings' }];
    return [{ label: 'BrandGuard', to: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  // Search matches
  const filteredReviews = searchQuery.trim()
    ? reviews.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredFacts = searchQuery.trim()
    ? facts.filter(
        (f) =>
          f.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.verifiedClaim.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  // Flagged reviews for notification panel
  const highRiskReviews = reviews.filter((r) => r.riskLevel === 'Critical' || r.riskLevel === 'High');

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#F8F8F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 -ml-1 text-stone-600 hover:text-stone-900 rounded-lg md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 truncate">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
                {crumb.to && !isLast ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-stone-900 font-medium transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`truncate ${isLast ? 'text-stone-900 font-semibold' : ''}`}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Search, Notifications, Quick Action */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Global Search Bar */}
        <div ref={searchRef} className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search content, claims, rules..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-36 sm:w-64 pl-9 pr-7 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7866E8]/30 focus:border-[#7866E8] placeholder:text-stone-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchOpen && searchQuery.trim() && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50 text-xs">
              <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2 px-1">
                Content Reviews ({filteredReviews.length})
              </div>
              {filteredReviews.length > 0 ? (
                <div className="space-y-1 mb-3">
                  {filteredReviews.map((rev) => (
                    <button
                      key={rev.id}
                      onClick={() => {
                        navigate(`/reviews/${rev.id}`);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-stone-50 transition-colors flex items-start gap-2.5 group"
                    >
                      <FileText className="w-4 h-4 text-stone-400 group-hover:text-[#7866E8] mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-stone-900 truncate">
                          {rev.title}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                          <span>{rev.id}</span>
                          <span>·</span>
                          <span>Score: {rev.complianceScore}%</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400 text-xs px-1 mb-2">No matching reviews found.</p>
              )}

              {filteredFacts.length > 0 && (
                <>
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2 px-1 border-t border-stone-100 pt-2">
                    Approved Claims ({filteredFacts.length})
                  </div>
                  <div className="space-y-1">
                    {filteredFacts.map((fact) => (
                      <div
                        key={fact.id}
                        onClick={() => {
                          navigate('/knowledge');
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="cursor-pointer p-2 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        <div className="font-medium text-stone-900 truncate">
                          {fact.productName}
                        </div>
                        <div className="text-[11px] text-emerald-700 truncate mt-0.5">
                          {fact.verifiedClaim}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-xl transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {highRiskReviews.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                <span className="font-semibold text-stone-900">Brand Alerts</span>
                <span className="text-[11px] text-stone-500 tabular-nums">
                  {highRiskReviews.length} critical items
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {highRiskReviews.length === 0 ? (
                  <div className="text-center py-4 text-stone-400 text-xs">
                    No critical violations detected.
                  </div>
                ) : (
                  highRiskReviews.map((rev) => (
                    <div
                      key={rev.id}
                      onClick={() => {
                        navigate(`/reviews/${rev.id}`);
                        setNotificationsOpen(false);
                      }}
                      className="cursor-pointer p-2 rounded-lg hover:bg-stone-50 border border-stone-100 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{rev.title}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                        {rev.findings.length} findings flagged · {rev.status}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-stone-100 mt-2 text-center">
                <Link
                  to="/approvals"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-semibold text-[#7866E8] hover:underline"
                >
                  View Approval Queue →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick CTA */}
        <Link
          to="/submit"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7866E8] hover:bg-[#6855d9] text-white text-xs font-medium rounded-xl shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Submit Content</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>
    </header>
  );
};
