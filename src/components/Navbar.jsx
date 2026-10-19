import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, ChevronRight, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export const Navbar = ({ currentBoardTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const user = JSON.parse(localStorage.getItem('kanban_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('kanban_token');
    localStorage.removeItem('kanban_user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-bg-card/90 backdrop-blur-md border-b border-border-subtle transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Link
            to="/boards"
            className="flex items-center gap-2.5 text-text-main group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center text-white shadow-sm shadow-accent-cyan/20">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-lg tracking-tight text-text-main">
                KanbanFlow
              </span>
              <span className="bg-bg-surface text-accent-cyan font-bold text-[10px] px-2 py-0.5 rounded-full uppercase border border-border-subtle tracking-wider">
                SaaS
              </span>
            </div>
          </Link>

          {currentBoardTitle && (
            <div className="hidden sm:flex items-center gap-2 text-text-muted text-sm ml-2 pl-4 border-l border-border-subtle">
              <Link
                to="/boards"
                className="hover:text-accent-cyan transition-colors"
              >
                Tableros
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-text-main font-semibold truncate max-w-[200px]">
                {currentBoardTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right tools: Theme Switcher + Auth Info */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!isLoginPage && user && (
            <div className="flex items-center gap-3 pl-3 border-l border-border-subtle">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-text-main">
                  {user.name || user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Cerrar sesión"
                className="p-2 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
