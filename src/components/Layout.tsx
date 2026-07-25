import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  BarChart3,
  Users,
  Trophy,
  LogOut,
  Menu,
  X,
  Sparkles,
  Flame,
  LogIn,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGE_INFO } from '../data/mockData';
import type { User } from '../types';

export function Layout({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!state.currentUser) {
      dispatch({ type: 'GUEST_LOGIN' });
    }
  }, []);

  const isGuest = state.currentUser?.id === 'guest_user';

  const navItems = [
    { path: '/dashboard', label: '学习中心', icon: BookOpen },
    { path: '/courses', label: '课程', icon: GraduationCap },
    { path: '/progress', label: '进度', icon: BarChart3 },
    { path: '/community', label: '社区', icon: Users },
    { path: '/achievements', label: '成就', icon: Trophy },
  ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const expProgress = state.currentUser ? (state.currentUser.exp / 500) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">LinguaLearn</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              {state.currentUser && (
                <div className="hidden sm:flex items-center gap-2">
                  <select
                    value={state.currentUser.currentLanguage}
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_USER',
                        payload: { currentLanguage: e.target.value as User['currentLanguage'] },
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 border-0 text-sm font-medium focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.entries(LANGUAGE_INFO).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.flag} {val.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {state.currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-orange-600">{state.currentUser.streak}</span>
                  </div>
                  <div className="hidden md:flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Lv.{state.currentUser.level}</span>
                      <span className="text-sm font-semibold text-gray-800">
                        {state.currentUser.username}
                      </span>
                      {isGuest && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">游客</span>
                      )}
                    </div>
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-0.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                        style={{ width: `${expProgress}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    title={isGuest ? '退出游客模式' : '退出登录'}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-sm py-1.5 px-4">
                  <LogIn className="w-4 h-4 inline mr-2" />
                  登录
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
