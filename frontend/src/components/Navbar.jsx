import { useLocation } from 'react-router-dom';
import { Bell, Search, Sun } from 'lucide-react';

const routeTitles = {
  '/':           'Dashboard',
  '/timer':      'Study Timer',
  '/todo':       'To-Do List',
  '/attendance': 'Attendance Tracker',
  '/cgpa':       'CGPA Target Calculator',
  '/coding':     'Coding Activity',
  '/profile':    'Edit Profile',
};

export default function Navbar() {
  const location = useLocation();
  const title = routeTitles[location.pathname] ?? 'StudyTrack';

  return (
    <header className="h-16 bg-white border-b border-surface-100 flex items-center px-6 gap-4 shadow-sm sticky top-0 z-30">
      {/* Page Title */}
      <div className="flex-1">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400 hidden sm:block">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search…"
          className="pl-9 pr-4 py-2 text-sm bg-surface-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 w-52 transition-all"
        />
      </div>

      {/* Icons */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-surface-100 hover:bg-primary-50 transition-colors">
        <Bell className="w-4.5 h-4.5 text-slate-500" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full border-2 border-white"></span>
      </button>
      <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-100 hover:bg-primary-50 transition-colors">
        <Sun className="w-4.5 h-4.5 text-slate-500" />
      </button>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer">
        S
      </div>
    </header>
  );
}
