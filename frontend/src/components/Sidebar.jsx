import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  BookOpen,
  TrendingUp,
  Code2,
  UserCircle,
  GraduationCap,
  ChevronRight,
  LogOut,
  Edit3
} from 'lucide-react';

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/attendance', icon: BookOpen,        label: 'Attendance' },
  { to: '/cgpa',       icon: TrendingUp,      label: 'CGPA Target' },
  { to: '/todo',       icon: CheckSquare,     label: 'To-Do List' },
  { to: '/coding',     icon: Code2,           label: 'Coding Stats' },
  { to: '/timer',      icon: Timer,           label: 'Study Timer' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-dark-800 border-r border-dark-700 flex flex-col shadow-2xl relative z-20">
      {/* Brand */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-blue-sm group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight tracking-tight">Student Diary</h1>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-dark">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-link group ${isActive ? 'active shadow-inner-blue' : ''}`}
            >
              <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-600/20 text-blue-400' : 'text-dim group-hover:text-blue-400'}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
              </div>
              <span className="flex-1 text-sm font-medium">{label}</span>
              {isActive && <div className="w-1 h-5 bg-blue-500 rounded-full mr-1 animate-pulse" />}
            </NavLink>
          );
        })}
      </nav>

      {/* User profile footer - matching Student Diary */}
      <div className="mt-auto p-4 border-t border-dark-700">
        <div className="bg-dark-700/40 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 overflow-hidden bg-dark-600 flex items-center justify-center">
               <span className="text-white font-bold">RS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Rahul Sharma</p>
              <p className="text-xs text-dim truncate">AI001</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <NavLink 
              to="/profile" 
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-dark-600 hover:bg-dark-500 text-dim hover:text-white text-xs font-semibold transition-all border border-dark-500"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </NavLink>
            <button className="p-2 rounded-lg bg-dark-600 hover:bg-red-500/10 text-dim hover:text-red-400 border border-dark-500 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
