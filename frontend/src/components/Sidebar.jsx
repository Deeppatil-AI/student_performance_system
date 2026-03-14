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
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shadow-orange-sm group-hover:scale-110 transition-transform">
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
              className={`nav-link group ${isActive ? 'active shadow-inner-orange' : ''}`}
            >
              <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-orange-600/20 text-orange-400' : 'text-dim group-hover:text-orange-400'}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
              </div>
              <span className="flex-1 text-sm font-medium">{label}</span>
              {isActive && <div className="w-1 h-5 bg-orange-500 rounded-full mr-1 animate-pulse" />}
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}
