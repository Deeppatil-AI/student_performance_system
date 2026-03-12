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
} from 'lucide-react';

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timer',      icon: Timer,           label: 'Study Timer' },
  { to: '/todo',       icon: CheckSquare,     label: 'To-Do List' },
  { to: '/attendance', icon: BookOpen,        label: 'Attendance' },
  { to: '/cgpa',       icon: TrendingUp,      label: 'CGPA Target' },
  { to: '/coding',     icon: Code2,           label: 'Coding Activity' },
  { to: '/profile',    icon: UserCircle,      label: 'Edit Profile' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-surface-200 flex flex-col shadow-sm">
      {/* Brand */}
      <div className="p-6 pb-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">StudyTrack</h1>
            <p className="text-xs text-slate-400 font-medium">Student Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-sm">{label}</span>
              {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-100">
        <NavLink to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer group">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">Student</p>
            <p className="text-xs text-slate-400 truncate">student@university.edu</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
